// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.14;

import "./libraries/types/FrontEndRewarder.sol";
import "./libraries/SafeERC20.sol";
import "./interfaces/ICryptoLinkerDepository.sol";
import "./interfaces/ICryptoLinkerUserTermsKeeper.sol";
import "./interfaces/IAggragatorV3.sol";
import "./interfaces/ITreasury.sol";
import "./libraries/types/PriceConsumer.sol";

// solhint-disable  max-line-length

/// @title Requiem  Bond Depository
/// @author Achthar

contract CryptoLinkerDepository is ICryptoLinkerDepository, ICryptoLinkerUserTermsKeeper, FrontEndRewarder, PriceConsumer {
    /* ======== DEPENDENCIES ======== */

    using SafeERC20 for IERC20;

    /* ======== EVENTS ======== */

    event CreateMarket(uint256 indexed id, address indexed baseToken, address indexed asset, uint256 initialPrice);
    event CloseMarket(uint256 indexed id);
    event CryptoLinker(uint256 indexed id, uint256 amount, uint256 notional);
    event ReferencePriceUpdated(uint256 indexed id, uint256 oldPrice, uint256 newPrice);

    /* ======== STATE VARIABLES ======== */

    // User Terms data
    mapping(address => UserTerms[]) public userTerms; // user deposit data
    mapping(address => mapping(uint256 => address)) private noteTransfers; // change note ownership

    ITreasury internal treasury;

    // Storage
    Market[] public markets; // persistent market data
    Terms[] public terms; // deposit construction data
    Metadata[] public metadata; // extraneous market data
    mapping(uint256 => Adjustment) public adjustments; // control variable changes
    // Queries
    mapping(address => uint256[]) public marketsForQuote; // market IDs for quote token

    /* ======== CONSTRUCTOR ======== */

    constructor(IERC20 _req, address _treasury) FrontEndRewarder(IAuthority(_treasury), _req) {
        treasury = ITreasury(_treasury);
    }

    /* ======== CREATE ======== */

    /**
     * @notice             creates a new market type
     * @dev                current price should be in 9 decimals.
     * @param _asset  token used to deposit
     * @param _market      [capacity (in REQ or quote), initial price / REQ (18 decimals), debt buffer (3 decimals), floor, strike]
     * @param _terms       [vesting length (if fixed term) or vested timestamp, conclusion timestamp]
     * @param _intervals   [deposit interval (seconds), tune interval (seconds)]
     * @return id_         ID of new bond market
     */
    function create(
        address _asset,
        address _underlyingOracle,
        uint256[5] memory _market,
        uint256[2] memory _terms,
        uint32[2] memory _intervals
    ) external onlyPolicy returns (uint256 id_) {
        // the length of the program, in seconds
        uint256 secondsToConclusion = _terms[1] - block.timestamp;

        (, int256 _fetchedPrice, , uint256 _timestamp, ) = getLatestPriceData(_underlyingOracle);

        /*
         * initial target debt is equal to capacity (this is the amount of debt
         * that will decay over in the length of the program if price remains the same).
         * it is converted into base token terms if passed in in quote token terms.
         */
        uint256 targetDebt = _market[0];

        /*
         * max payout is the amount of capacity that should be utilized in a deposit
         * interval. for example, if capacity is 1,000 REQ, there are 10 days to conclusion,
         * and the preferred deposit interval is 1 day, max payout would be 100 REQ.
         */
        uint256 maxPayout = uint256((targetDebt * _intervals[0]) / secondsToConclusion);

        /*
         * max debt serves as a circuit breaker for the market. let's say the quote
         * token is a stablecoin, and that stablecoin depegs. without max debt, the
         * market would continue to buy until it runs out of capacity. this is
         * configurable with a 3 decimal buffer (1000 = 1% above initial price).
         * note that its likely advisable to keep this buffer wide.
         * note that the buffer is above 100%. i.e. 10% buffer = initial debt * 1.1
         */
        uint256 maxDebt = targetDebt + ((targetDebt * _market[2]) / 1e5); // 1e5 = 100,000. 10,000 / 100,000 = 10%.

        /*
         * the control variable is set so that initial price equals the desired
         * initial price. the control variable is the ultimate determinant of price,
         * so we compute this last.
         *
         * price = control variable * debt ratio
         * debt ratio = total debt / supply
         * therefore, control variable = price / debt ratio
         */
        uint256 controlVariable = (_market[1] * treasury.baseSupply()) / targetDebt;

        // depositing into, or getting info for, the created market uses this ID
        id_ = markets.length;

        markets.push(
            Market({
                asset: _asset,
                index: _underlyingOracle,
                capacity: _market[0],
                totalDebt: targetDebt,
                maxPayout: maxPayout,
                floor: _market[3],
                strike: _market[4],
                purchased: 0,
                sold: 0,
                vesting: uint48(_terms[0]),
                conclusion: uint48(_terms[1]),
                maxDebt: maxDebt
            })
        );

        terms.push(
            Terms({vesting: uint48(_terms[0]), conclusion: uint48(_terms[1]), controlVariable: controlVariable, leverage: 1, maxDebt: maxDebt})
        );

        metadata.push(
            Metadata({
                lastReferencePrice: uint256(_fetchedPrice),
                lastReferenceBondPrice: _market[1],
                lastTune: uint48(_timestamp),
                lastDecay: uint48(block.timestamp),
                marketLength: uint48(secondsToConclusion),
                depositInterval: _intervals[0],
                tuneInterval: _intervals[1],
                assetDecimals: uint8(IERC20(_asset).decimals())
            })
        );

        marketsForQuote[address(_asset)].push(id_);

        emit CreateMarket(id_, address(req), address(_asset), _market[1]);
    }

    /* ======== DEPOSIT ======== */

    /**
     * @notice             deposit quote tokens in exchange for a bond from a specified market
     * @param _id          the ID of the market
     * @param _amount      the amount of quote token to spend
     * @param _maxPrice    the maximum price at which to buy
     * @param _user        the recipient of the payout
     */
    function deposit(
        uint256 _id,
        uint256 _amount,
        uint256 _maxPrice,
        uint256 _timeSlippage,
        address _user
    ) external returns (uint256) {
        Market storage market = markets[_id];
        Terms memory term = terms[_id];
        // uint48 currentTime = uint48(block.timestamp);

        // Markets end at a defined timestamp
        // |-------------------------------------| t
        require(block.timestamp < term.conclusion, "Depository: market concluded");

        // Debt and the control variable decay over time
        _decay(_id, uint48(block.timestamp));

        int256 _fetchedPrice = _fetchAndValidate(market.index, _timeSlippage);

        /**
         * user data is stored as Terms and relevant parameters are returned
         */
        (uint256 _index, uint256 _baseNotional, uint256 _price) = bondAsset(_user, _maxPrice, market, _id, _amount, _fetchedPrice);

        /*
         * each market is initialized with a capacity
         * this is either the number of REQ that the market can sell
         */
        market.capacity -= _baseNotional;

        // markets keep track of how many quote tokens have been
        // purchased, and how much REQ has been sold
        market.purchased += _amount;
        market.sold += _baseNotional;

        // incrementing total debt raises the price of the next bond
        market.totalDebt += _baseNotional;

        emit CryptoLinker(_id, _amount, _baseNotional);

        // transfer payment to treasury
        IERC20(market.asset).safeTransferFrom(msg.sender, address(treasury), _amount);

        // if max debt is breached, the market is closed
        // this a circuit breaker
        if (term.maxDebt < market.totalDebt) {
            market.capacity = 0;
            emit CloseMarket(_id);
        } else {
            // if market will continue, the market is updated
            _updateMarket(_id, uint256(_fetchedPrice), _price, uint48(block.timestamp));
        }

        return _index;
    }

    /**
     * @notice             decay debt, and adjust control variable if there is an active change
     * @param _id          ID of market
     * @param _time        uint48 timestamp (saves gas when passed in)
     */
    function _decay(uint256 _id, uint48 _time) internal {
        // Debt decay

        /*
         * Debt is a time-decayed sum of tokens spent in a market
         * Debt is added when deposits occur and removed over time
         * |
         * |    debt falls with
         * |   / \  inactivity       / \
         * | /     \              /\/    \
         * |         \           /         \
         * |           \      /\/            \
         * |             \  /  and rises       \
         * |                with deposits
         * |
         * |------------------------------------| t
         */
        markets[_id].totalDebt -= debtDecay(_id);
        metadata[_id].lastDecay = _time;
    }

    /**
     * @notice             auto-adjust control variable to hit capacity/spend target
     * @param _id          ID of market
     * @param _time        uint48 timestamp (saves gas when passed in)
     */
    function _updateMarket(
        uint256 _id,
        uint256 _referencePrice,
        uint256 _bondRefPrice,
        uint48 _time
    ) internal {
        Metadata memory meta = metadata[_id];

        if (_time >= meta.lastTune + meta.tuneInterval) {
            Market memory market = markets[_id];

            // compute seconds remaining until market will conclude
            uint256 timeRemaining = terms[_id].conclusion - _time;

            /**
             * calculate the correct payout to complete on time assuming each bond
             * will be max size in the desired deposit interval for the remaining time
             *
             * i.e. market has 10 days remaining. deposit interval is 1 day. capacity
             * is 10,000 REQ. max payout would be 1,000 REQ (10,000 * 1 / 10).
             */
            markets[_id].maxPayout = uint256((market.capacity * meta.depositInterval) / timeRemaining);

            meta.lastReferenceBondPrice = _bondRefPrice;
            meta.lastReferencePrice = _referencePrice;

            emit ReferencePriceUpdated(_id, meta.lastReferencePrice, _referencePrice);

            metadata[_id].lastTune = _time;
        }
    }

    /**
     * @notice             disable existing market
     * @param _id          ID of market to close
     */
    function close(uint256 _id) external override onlyPolicy {
        terms[_id].conclusion = uint48(block.timestamp);
        markets[_id].capacity = 0;
        emit CloseMarket(_id);
    }

    /* ======== EXTERNAL VIEW ======== */

    /**
     * @notice             calculate current market price of quote token in base token
     * @dev                accounts for debt and control variable decay since last deposit (vs _marketPrice())
     * @param _id          ID of market
     * @return             price for market in REQ decimals
     *
     * price is derived from the equation
     *
     * p = cv * dr
     *
     * where
     * p = price
     * cv = control variable
     * dr = debt ratio
     *
     * dr = d / s
     *
     * where
     * d = debt
     * s = supply of token at market creation
     *
     * d -= ( d * (dt / l) )
     *
     * where
     * dt = change in time
     * l = length of program
     */
    function marketPrice(uint256 _id) public view override returns (uint256) {
        return (currentControlVariable(_id) * debtRatio(_id)) / (10**metadata[_id].assetDecimals);
    }

    function _bondPrice(uint256 _id, int256 _fetchedPrice) internal view returns (uint256 _refPrice) {
        Market memory _market = markets[_id];
        Metadata memory _meta = metadata[_id];

        int256 lastReference = int256(_meta.lastReferencePrice);
        int256 adjustmentToPrice = 1e18 +
            int256(_multiplier(terms[_id].maxDebt, _market.capacity)) *
            (((lastReference - _fetchedPrice) * 1e18) / lastReference);
        _refPrice = (_meta.lastReferenceBondPrice * uint256(adjustmentToPrice)) / 1e18;

        _refPrice = _refPrice > _market.floor ? _refPrice : _market.floor;
    }

    function _multiplier(uint256 _remainingCapacity, uint256 _maxCapacity) internal pure returns (uint256) {
        return 1e18 + (_remainingCapacity * 1e18) / _maxCapacity;
    }

    /**
     * @notice             payout due for amount of quote tokens
     * @dev                accounts for debt and control variable decay so it is up to date
     * @param _amount      amount of quote tokens to spend
     * @param _id          ID of market
     * @return             amount of REQ to be paid in REQ decimals
     *
     * @dev we assume that the market price decimals and req decimals match (that is why we use 2 * req decimals)
     */
    function payoutFor(uint256 _amount, uint256 _id) external view override returns (uint256) {
        Metadata memory meta = metadata[_id];
        return (_amount * 10**(2 * req.decimals())) / marketPrice(_id) / 10**meta.assetDecimals;
    }

    /**
     * @notice             calculate current ratio of debt to supply
     * @dev                uses current debt, which accounts for debt decay since last deposit (vs _debtRatio())
     * @param _id          ID of market
     * @return             debt ratio for market in quote decimals
     */
    function debtRatio(uint256 _id) public view override returns (uint256) {
        return (currentDebt(_id) * (10**metadata[_id].assetDecimals)) / treasury.baseSupply();
    }

    /**
     * @notice             calculate debt factoring in decay
     * @dev                accounts for debt decay since last deposit
     * @param _id          ID of market
     * @return             current debt for market in REQ decimals
     */
    function currentDebt(uint256 _id) public view override returns (uint256) {
        return markets[_id].totalDebt - debtDecay(_id);
    }

    /**
     * @notice             amount of debt to decay from total debt for market ID
     * @param _id          ID of market
     * @return             amount of debt to decay
     */
    function debtDecay(uint256 _id) public view override returns (uint256) {
        Metadata memory meta = metadata[_id];

        uint256 secondsSince = block.timestamp - meta.lastDecay;

        return (markets[_id].totalDebt * secondsSince) / meta.marketLength;
    }

    /**
     * @notice             up to date control variable
     * @dev                accounts for control variable adjustment
     * @param _id          ID of market
     * @return             control variable for market in REQ decimals
     */
    function currentControlVariable(uint256 _id) public view returns (uint256) {
        (uint256 decay, , ) = _controlDecay(_id);
        return terms[_id].controlVariable - decay;
    }

    /**
     * @notice             is a given market accepting deposits
     * @param _id          ID of market
     */
    function isLive(uint256 _id) public view override returns (bool) {
        return (markets[_id].capacity != 0 && terms[_id].conclusion > block.timestamp);
    }

    /**
     * @notice returns an array of all active market IDs
     */
    function liveMarkets() external view override returns (uint256[] memory) {
        uint256 num;
        for (uint256 i = 0; i < markets.length; i++) {
            if (isLive(i)) num++;
        }

        uint256[] memory ids = new uint256[](num);
        uint256 nonce;
        for (uint256 i = 0; i < markets.length; i++) {
            if (isLive(i)) {
                ids[nonce] = i;
                nonce++;
            }
        }
        return ids;
    }

    /**
     * @notice             returns an array of all active market IDs for a given quote token
     * @param _token       quote token to check for
     */
    function liveMarketsFor(address _token) external view override returns (uint256[] memory) {
        uint256[] memory mkts = marketsForQuote[_token];
        uint256 num;

        for (uint256 i = 0; i < mkts.length; i++) {
            if (isLive(mkts[i])) num++;
        }

        uint256[] memory ids = new uint256[](num);
        uint256 nonce;

        for (uint256 i = 0; i < mkts.length; i++) {
            if (isLive(mkts[i])) {
                ids[nonce] = mkts[i];
                nonce++;
            }
        }
        return ids;
    }

    /* ======== INTERNAL VIEW ======== */

    /**
     * @notice                  calculate current market price of quote token in base token
     * @dev                     see marketPrice() for explanation of price computation
     * @dev                     uses info from storage because data has been updated before call (vs marketPrice())
     * @param _id               market ID
     * @return                  price for market in REQ decimals
     */
    function _marketPrice(uint256 _id) internal view returns (uint256) {
        return (terms[_id].controlVariable * _debtRatio(_id)) / (10**metadata[_id].assetDecimals);
    }

    /**
     * @notice                  calculate debt factoring in decay
     * @dev                     uses info from storage because data has been updated before call (vs debtRatio())
     * @param _id               market ID
     * @return                  current debt for market in quote decimals
     */
    function _debtRatio(uint256 _id) internal view returns (uint256) {
        return (markets[_id].totalDebt * (10**metadata[_id].assetDecimals)) / treasury.baseSupply();
    }

    /**
     * @notice                  amount to decay control variable by
     * @param _id               ID of market
     * @return decay_           change in control variable
     * @return secondsSince_    seconds since last change in control variable
     * @return active_          whether or not change remains active
     */
    function _controlDecay(uint256 _id)
        internal
        view
        returns (
            uint256 decay_,
            uint48 secondsSince_,
            bool active_
        )
    {
        Adjustment memory info = adjustments[_id];
        if (!info.active) return (0, 0, false);

        secondsSince_ = uint48(block.timestamp) - info.lastAdjustment;

        active_ = secondsSince_ < info.timeToAdjusted;
        decay_ = active_ ? (info.change * secondsSince_) / info.timeToAdjusted : info.change;
    }

    /* ========== USER TERMS MANAGEMENT ========== */

    // if treasury address changes on authority, update it
    function updateTreasury() external {
        require(msg.sender == authority.governor() || msg.sender == authority.guardian() || msg.sender == authority.policy(), "Only authorized");
        treasury = ITreasury(authority.vault());
    }

    /* ========== ADD ========== */

    /**
     * @notice             adds a new Terms for a user, stores the front end & DAO rewards, and mints & stakes payout & rewards
     * @param _user        the user that owns the Terms
     */
    function bondAsset(
        address _user,
        uint256 _maxPrice,
        Market memory _market,
        uint256 _marketId,
        uint256 _amount,
        int256 _fetchedPrice
    )
        internal
        returns (
            uint256 _index,
            uint256 _baseNotional,
            uint256 _price
        )
    {
        // entering the mempool. max price is a slippage mitigation measure
        _price = _bondPrice(_marketId, _fetchedPrice);
        require(_price <= _maxPrice, "Depository: more than max price");

        /**
         * payout for the deposit = value / price
         */
        _baseNotional = (treasury.assetValue(_market.asset, _amount) * 1e18) / _price;

        // the index of the note is the next in the user's array
        _index = userTerms[_user].length;

        // the new note is pushed to the user's array
        userTerms[_user].push(
            UserTerms({
                cryptoIntitialPrice: uint256(_fetchedPrice),
                cryptoClosingPrice: 0,
                baseNotional: _baseNotional,
                created: uint48(block.timestamp),
                matured: uint48(block.timestamp + _market.vesting),
                redeemed: 0,
                exercised: 0,
                marketId: uint48(_marketId),
                bondPrice: 0
            })
        );

        // mint payout and rewards
        treasury.mint(address(this), _baseNotional);
    }

    /* ========== REDEEM ========== */

    /**
     * @notice             exercise userTerms for user
     * @param _user        the user to exercise for
     * @param _indexes     the note indexes to exercise
     * @return payout_     sum of payout sent, in REQ
     */
    function exercise(address _user, uint256[] memory _indexes) public override returns (uint256 payout_) {
        uint48 time = uint48(block.timestamp);

        for (uint256 i = 0; i < _indexes.length; i++) {
            (uint256 pay, bool matured) = pendingFor(_user, _indexes[i]);

            if (matured) {
                userTerms[_user][_indexes[i]].exercised = time; // mark as exerciseed
                payout_ += pay;
                uint256 marketId = userTerms[_user][_indexes[i]].marketId;
                (, int256 _fetchedPrice, , , ) = getLatestPriceData(markets[marketId].index);
                if ((uint256(_fetchedPrice) * 1e18) / userTerms[_user][_indexes[i]].cryptoIntitialPrice > markets[marketId].strike) {}
            }
        }

        req.transfer(_user, payout_);
    }

    /**
     * @notice             exercise all exerciseable markets for user
     * @dev                if possible, query indexesFor() off-chain and input in exercise() to save gas
     * @param _user        user to exercise all userTerms for
     * @return             sum of payout sent, in REQ
     */
    function exerciseAll(address _user) external override returns (uint256) {
        return exercise(_user, indexesFor(_user));
    }

    /* ========== TRANSFER ========== */

    /**
     * @notice             approve an address to transfer a note
     * @param _to          address to approve note transfer for
     * @param _index       index of note to approve transfer for
     */
    function pushTerms(address _to, uint256 _index) external override {
        require(userTerms[msg.sender][_index].created != 0, "Depository: note not found");
        noteTransfers[msg.sender][_index] = _to;
    }

    /**
     * @notice             transfer a note that has been approved by an address
     * @param _from        the address that approved the note transfer
     * @param _index       the index of the note to transfer (in the sender's array)
     */
    function pullTerms(address _from, uint256 _index) external override returns (uint256 newIndex_) {
        require(noteTransfers[_from][_index] == msg.sender, "Depository: transfer not found");
        require(userTerms[_from][_index].redeemed == 0, "Depository: note redeemed");

        newIndex_ = userTerms[msg.sender].length;
        userTerms[msg.sender].push(userTerms[_from][_index]);

        delete userTerms[_from][_index];
    }

    /* ========== VIEW ========== */

    // Terms info

    /**
     * @notice             all pending userTerms for user
     * @param _user        the user to query userTerms for
     * @return             the pending userTerms for the user
     */
    function indexesFor(address _user) public view override returns (uint256[] memory) {
        UserTerms[] memory info = userTerms[_user];

        uint256 length;
        for (uint256 i = 0; i < info.length; i++) {
            if (info[i].redeemed == 0 && info[i].baseNotional != 0) length++;
        }

        uint256[] memory indexes = new uint256[](length);
        uint256 position;

        for (uint256 i = 0; i < info.length; i++) {
            if (info[i].redeemed == 0 && info[i].baseNotional != 0) {
                indexes[position] = i;
                position++;
            }
        }

        return indexes;
    }

    /**
     * @notice             calculate amount available for claim for a single note
     * @param _user        the user that the note belongs to
     * @param _index       the index of the note in the user's array
     * @return payout_     the payout due, in gREQ
     * @return matured_    if the payout can be redeemed
     */
    function pendingFor(address _user, uint256 _index) public view override returns (uint256 payout_, bool matured_) {
        UserTerms memory note = userTerms[_user][_index];

        payout_ = note.baseNotional;
        matured_ = note.redeemed == 0 && note.matured <= block.timestamp && note.baseNotional != 0;
    }

    function _fetchAndValidate(address _index, uint256 _timeSlippage) internal view returns (int256) {
        (, int256 _fetchedPrice, , uint256 _time, ) = getLatestPriceData(_index);

        require(block.timestamp - _time <= _timeSlippage, "Depository: Undelying Price too delayed");
        return _fetchedPrice;
    }
}
