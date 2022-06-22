// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

import "./libraries/types/FrontEndRewarder.sol";
import "./libraries/SafeERC20.sol";
import "./interfaces/CryptoLinker//ICryptoLinkerDepository.sol";
import "./interfaces/CryptoLinker/ICryptoLinkerUserTermsKeeper.sol";
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
     * @param _market      [capacity in REQ, initial price / REQ (18 decimals), debt buffer (3 decimals), floor, strike, digitalPayout, init leverage, target leverage], last 3 in as 18 dec fraction (100%=1.0)
     * @param _terms       [vesting length (if fixed term) or vested timestamp, conclusion timestamp, exercise duration]
     * @param _intervals   [deposit interval (seconds), tune interval (seconds)]
     * @return id_         ID of new bond market
     */
    function create(
        address _asset,
        address _underlyingOracle,
        uint256[8] memory _market,
        uint256[3] memory _terms,
        uint32[2] memory _intervals
    ) external onlyPolicy returns (uint256 id_) {
        // the length of the program, in seconds
        uint256 secondsToConclusion = _terms[1] - block.timestamp;

        (, int256 _fetchedPrice, , , ) = getLatestPriceData(_underlyingOracle);

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
                strike: int256(_market[4]),
                digitalPayout: _market[5],
                purchased: 0,
                sold: 0,
                vesting: uint48(_terms[0]),
                conclusion: uint48(_terms[1]),
                maxDebt: maxDebt
            })
        );

        terms.push(
            Terms({
                vesting: uint48(_terms[0]),
                conclusion: uint48(_terms[1]),
                currentLeverage: int256(_market[6]),
                initialLeverage: int256(_market[6]),
                targetLeverage: int256(_market[7]),
                maxDebt: maxDebt,
                exerciseDuration: uint48(_terms[2]),
                lastUpdate: uint48(block.timestamp)
            })
        );

        metadata.push(
            Metadata({
                lastReferencePrice: uint256(_fetchedPrice),
                lastReferenceBondPrice: _market[1],
                lastTune: uint48(block.timestamp),
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

        // Markets end at a defined timestamp
        // |-------------------------------------| t
        require(block.timestamp < term.conclusion, "Depository: market concluded");

        // Increase leverage over time
        _leverageTimeIncrement(_id, block.timestamp);

        int256 _fetchedPrice = _fetchAndValidate(market.index, block.timestamp, _timeSlippage);

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
    function _leverageTimeIncrement(uint256 _id, uint256 _time) internal {
        // leverage increment
        /*
         * Leverge increases over time causing higher reference
         * price volatility
         * |------------------------------------| t
         */
        terms[_id].currentLeverage += leverageIncrement(_id, _time);
        terms[_id].lastUpdate = uint48(_time);
    }

    function _leverageTradeIncrement(uint256 _id, uint256 _time) internal {
        
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

            metadata[_id].lastReferenceBondPrice = _bondRefPrice;
            metadata[_id].lastReferencePrice = _referencePrice;

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
     * @notice calcualtes the current market price
     * @param _id marketId
     */
    function marketPrice(uint256 _id) public view returns (uint256 _refPrice) {
        Market memory _market = markets[_id];
        Metadata memory _meta = metadata[_id];

        (, int256 _fetchedPrice, , , ) = getLatestPriceData(_market.index);

        int256 lastReference = int256(_meta.lastReferencePrice);

        int256 adjustmentToPrice = 1e18 + (currentLeverage(_id) * calculatePerformance(_fetchedPrice, lastReference)) / 1e18;
        // return floor if adjustment would lead to negative notional
        if (adjustmentToPrice < 0) {
            return _market.floor;
        }

        // adjust price by multiplier
        _refPrice = (_meta.lastReferenceBondPrice * uint256(adjustmentToPrice)) / 1e18;

        _refPrice = _refPrice > _market.floor ? _refPrice : _market.floor;
    }

    /**
     * @notice             up to date control variable
     * @dev                accounts for control variable adjustment
     * @param _id          ID of market
     * @return             control variable for market in REQ decimals
     */
    function currentLeverage(uint256 _id) public view returns (int256) {
        return terms[_id].currentLeverage + leverageIncrement(_id, block.timestamp);
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
        Market memory _market = markets[_id];
        return (treasury.assetValue(_market.asset, _amount) * 1e18) / marketPrice(_id);
    }

    function leverageIncrement(uint256 _id, uint256 _time) public view returns (int256) {
        Metadata memory meta = metadata[_id];

        uint256 secondsSince = _time - uint256(terms[_id].lastUpdate);
        uint256 leverageDist = uint256(terms[_id].targetLeverage - terms[_id].initialLeverage);
        return int256((leverageDist * secondsSince) / meta.marketLength);
    }

    function currentLeverageIncrement(uint256 _id) public view returns (int256) {
        Metadata memory meta = metadata[_id];

        uint256 secondsSince = block.timestamp - uint256(terms[_id].lastUpdate);
        uint256 leverageDist = uint256(terms[_id].targetLeverage - terms[_id].initialLeverage);
        return int256((leverageDist * secondsSince) / meta.marketLength);
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
     * @notice calcualtes the current market price for a given price
     * @param _id marketId
     * @param _fetchedPrice underlying price provided from oracle
     */
    function _marketPrice(uint256 _id, int256 _fetchedPrice) internal view returns (uint256 _refPrice) {
        Market memory _market = markets[_id];
        Metadata memory _meta = metadata[_id];

        int256 lastReference = int256(_meta.lastReferencePrice);

        int256 adjustmentToPrice = 1e18 + (terms[_id].currentLeverage * calculatePerformance(_fetchedPrice, lastReference)) / 1e18;

        // return floor if adjustment would lead to negative notional
        if (adjustmentToPrice < 0) {
            return _market.floor;
        }

        // adjust price by multiplier
        _refPrice = (_meta.lastReferenceBondPrice * uint256(adjustmentToPrice)) / 1e18;

        _refPrice = _refPrice > _market.floor ? _refPrice : _market.floor;
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
        _price = _marketPrice(_marketId, _fetchedPrice);
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
                cryptoIntitialPrice: _fetchedPrice,
                cryptoClosingPrice: 0,
                baseNotional: _baseNotional,
                created: uint48(block.timestamp),
                matured: uint48(block.timestamp + _market.vesting),
                redeemed: 0,
                exercised: 0,
                notionalClaimed: 0,
                marketId: uint48(_marketId),
                bondPrice: 0
            })
        );

        // mint payout and rewards
        treasury.mint(address(this), _baseNotional);
    }

    /* ========== REDEEM ========== */

    /**
     * @notice             exercise option for user (if possible)
     * @param _user        the user to exercise for
     * @param _indexes     the note indexes to exercise
     * @return payout_     sum of payout sent, in REQ
     */
    function exercise(address _user, uint256[] memory _indexes) public override returns (uint256 payout_) {
        uint48 time = uint48(block.timestamp);

        for (uint256 i = 0; i < _indexes.length; i++) {
            uint256 _index = _indexes[i];
            (, , bool payoffClaimable) = pendingFor(_user, _index);
            uint256 marketId = userTerms[_user][_index].marketId;

            (, int256 _fetchedPrice, , , ) = getLatestPriceData(markets[marketId].index);
            if (payoffClaimable && calculatePayoff(userTerms[_user][_index].cryptoIntitialPrice, _fetchedPrice, markets[marketId].strike) > 0) {
                userTerms[_user][_index].exercised = time; // mark as exerciseed
                // add digital payoff
                payout_ += (payout_ * uint256(markets[_index].strike)) / 1e18;
            }

            // transfer digital payoffs
            req.transfer(_user, payout_);
        }
    }

    /**
     * @notice             claim notional and exercise Option for user if possible
     * @param _user        the user to exercise for
     * @param _indexes     the note indexes to exercise
     * @return payout_     sum of payout sent, in REQ
     */
    function claimAndExercise(address _user, uint256[] memory _indexes) public returns (uint256 payout_) {
        uint48 time = uint48(block.timestamp);

        for (uint256 i = 0; i < _indexes.length; i++) {
            uint256 _index = _indexes[i];
            (uint256 pay, bool matured, bool payoffClaimable) = pendingFor(_user, _index);
            uint256 marketId = userTerms[_user][_index].marketId;

            // check whether notional can be claimed
            if (matured) {
                userTerms[_user][_index].notionalClaimed = time; // mark as claimed
                payout_ += pay;
            }

            // check whether option can be exercised
            (, int256 _fetchedPrice, , , ) = getLatestPriceData(markets[marketId].index);
            if (payoffClaimable && calculatePayoff(userTerms[_user][_index].cryptoIntitialPrice, _fetchedPrice, markets[marketId].strike) > 0) {
                userTerms[_user][_index].exercised = time; // mark as exerciseed
                // add digital payoff
                payout_ += (userTerms[_user][_index].baseNotional * uint256(markets[_index].strike)) / 1e18;
            }
        }

        // transfer notionals and digital payoffs
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

    /**
     * @notice             exercise all exerciseable markets for user
     * @dev                if possible, query indexesFor() off-chain and input in exercise() to save gas
     * @param _user        user to exercise all userTerms for
     * @return             sum of payout sent, in REQ
     */
    function claimAndExerciseAll(address _user) external returns (uint256) {
        return claimAndExercise(_user, indexesFor(_user));
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

    function calculatePayoff(
        int256 _initialPrice,
        int256 _priceNow,
        int256 _strike
    ) public pure returns (uint256) {
        int256 _kMinusS = _priceNow * 1e18 - (1e18 + _strike) * _initialPrice;
        return _kMinusS > 0 ? uint256(_kMinusS / 1e18) : 0;
    }

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
    function pendingFor(address _user, uint256 _index)
        public
        view
        returns (
            uint256 payout_,
            bool matured_,
            bool payoffClaimable_
        )
    {
        UserTerms memory note = userTerms[_user][_index];

        payout_ = note.baseNotional;
        matured_ = note.notionalClaimed == 0 && note.matured <= block.timestamp && note.baseNotional != 0;
        // notional can already have been claimed
        payoffClaimable_ = note.exercised == 0 && note.matured <= block.timestamp && note.matured + terms[_index].exerciseDuration >= block.timestamp;
    }

    function _fetchAndValidate(
        address _index,
        uint256 _now,
        uint256 _timeSlippage
    ) internal view returns (int256) {
        (, int256 _fetchedPrice, , uint256 _time, ) = getLatestPriceData(_index);

        require(_now - _time <= _timeSlippage, "Depository: Undelying Price too delayed");
        return _fetchedPrice;
    }
}
