// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

import "./libraries/types/CallUserTermsKeeper.sol";
import "./libraries/SafeERC20.sol";
import "./interfaces/Call/ICallBondDepository.sol";

// solhint-disable  max-line-length

/// @title Call Bond Depository
/// @author Achthar

contract CallBondDepository is ICallBondDepository, CallUserTermsKeeper {
    /* ======== DEPENDENCIES ======== */

    using SafeERC20 for IERC20;

    /* ======== EVENTS ======== */

    event CreateMarket(uint256 indexed id, address indexed baseToken, address indexed asset, uint256 initialPrice);
    event CloseMarket(uint256 indexed id);
    event Bond(uint256 indexed id, uint256 amount, uint256 price, int256 underlyingReference);
    event OptionExercise(uint256 indexed id, uint256 payout);
    event Tuned(uint256 indexed id, uint256 oldControlVariable, uint256 newControlVariable);

    /* ======== STATE VARIABLES ======== */

    // Storage
    Market[] public markets; // persistent market data
    Terms[] public terms; // deposit construction data
    Metadata[] public metadata; // extraneous market data
    mapping(uint256 => Adjustment) public adjustments; // control variable changes

    // Queries
    mapping(address => uint256[]) public marketsForQuote; // market IDs for quote token

    /* ======== CONSTRUCTOR ======== */

    constructor(IERC20 _req, address _treasury) CallUserTermsKeeper(_req, _treasury) {}

    /* ======== CREATE ======== */

    /**
     * @notice             creates a new market type
     * @dev                current price should be in 9 decimals.
     * @param _asset       token used to deposit
     * @param _underlying  oracle to povede price data for option component
     * @param _market      [capacity (in REQ or quote), initial price / REQ (18 decimals), debt buffer (3 decimals), threshold (percent), option cap (percent)]
     * @param _booleans    [capacity in quote, fixed term]
     * @param _terms       [vesting length (if fixed term) or vested timestamp, conclusion timestamp, exercise duration]
     * @param _intervals   [deposit interval (seconds), tune interval (seconds)]
     * @return id_         ID of new bond market
     */
    function create(
        IERC20 _asset,
        address _underlying,
        uint256[5] memory _market,
        bool[2] memory _booleans,
        uint256[3] memory _terms,
        uint32[2] memory _intervals
    ) external override onlyPolicy returns (uint256 id_) {
        // the length of the program, in seconds
        uint256 secondsToConclusion = _terms[1] - block.timestamp;

        // the decimal count of the quote token
        uint256 decimals = _asset.decimals();

        /*
         * initial target debt is equal to capacity (this is the amount of debt
         * that will decay over in the length of the program if price remains the same).
         * it is converted into base token terms if passed in in quote token terms.
         *
         * -> prices the capacity in quote token if desired
         */
        uint256 targetDebt = uint256(_booleans[0] ? ((treasury.assetValue(address(_asset), _market[0]) * 1e18) / _market[1]) : _market[0]);

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
                underlying: _underlying,
                capacityInQuote: _booleans[0],
                capacity: _market[0],
                totalDebt: targetDebt,
                maxPayout: maxPayout,
                purchased: 0,
                sold: 0
            })
        );

        terms.push(
            Terms({
                fixedTerm: _booleans[1],
                thresholdPercentage: int256(_market[3]),
                maxPayoffPercentage: _market[4],
                vesting: uint48(_terms[0]),
                conclusion: uint48(_terms[1]),
                exerciseDuration: uint48(_terms[2]),
                controlVariable: controlVariable,
                maxDebt: maxDebt
            })
        );

        metadata.push(
            Metadata({
                lastTune: uint48(block.timestamp),
                lastDecay: uint48(block.timestamp),
                length: uint48(secondsToConclusion),
                depositInterval: _intervals[0],
                tuneInterval: _intervals[1],
                assetDecimals: uint8(decimals)
            })
        );

        marketsForQuote[address(_asset)].push(id_);

        emit CreateMarket(id_, address(req), address(_asset), _market[1]);
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

    /* ======== DEPOSIT ======== */

    /**
     * @notice             deposit quote tokens in exchange for a bond from a specified market
     * @param _id          the ID of the market
     * @param _amount      the amount of quote token to spend
     * @param _maxPrice    the maximum price at which to buy
     * @param _user        the recipient of the payout
     * @param _referral    the front end operator address
     * @return payout_     the amount of REQ due
     * @return expiry_     the timestamp at which payout is redeemable
     * @return index_      the user index of the Terms (used to redeem or query information)
     */
    function deposit(
        uint256 _id,
        uint256 _amount,
        uint256 _maxPrice,
        address _user,
        address _referral
    )
        external
        override
        returns (
            uint256 payout_,
            uint256 expiry_,
            uint256 index_
        )
    {
        Market storage market = markets[_id];
        Terms memory term = terms[_id];
        uint48 currentTime = uint48(block.timestamp);

        // Markets end at a defined timestamp
        // |-------------------------------------| t
        require(currentTime < term.conclusion, "Depository: market concluded");

        // Debt and the control variable decay over time
        _decay(_id, currentTime);

        expiry_ = term.fixedTerm ? term.vesting + currentTime : term.vesting;

        // use one function for multiple checks to avoid stack-to-deep issues
        (index_, payout_) = _bondAsset(_user, _maxPrice, market, _id, _amount, uint48(expiry_), _referral);

        /*
         * each market is initialized with a capacity
         *
         * this is either the number of REQ that the market can sell
         * (if capacity in quote is false),
         *
         * or the number of quote tokens that the market can buy
         * (if capacity in quote is true)
         */
        market.capacity -= market.capacityInQuote ? _amount : payout_;

        /**
         * bonds mature with a cliff at a set timestamp
         * prior to the expiry timestamp, no payout tokens are accessible to the user
         * after the expiry timestamp, the entire payout can be redeemed
         *
         * there are two types of bonds: fixed-term and fixed-expiration
         *
         * fixed-term bonds mature in a set amount of time from deposit
         * i.e. term = 1 week. when alice deposits on day 1, her bond
         * expires on day 8. when bob deposits on day 2, his bond expires day 9.
         *
         * fixed-expiration bonds mature at a set timestamp
         * i.e. expiration = day 10. when alice deposits on day 1, her term
         * is 9 days. when bob deposits on day 2, his term is 8 days.
         */

        // markets keep track of how many quote tokens have been
        // purchased, and how much REQ has been sold
        market.purchased += _amount;
        market.sold += payout_;

        // incrementing total debt raises the price of the next bond
        market.totalDebt += payout_;

        // transfer payment to treasury
        market.asset.safeTransferFrom(msg.sender, address(treasury), _amount);

        // if max debt is breached, the market is closed
        // this a circuit breaker
        if (term.maxDebt < market.totalDebt) {
            market.capacity = 0;
            emit CloseMarket(_id);
        } else {
            // if market will continue, the control variable is tuned to hit targets on time
            _tune(_id, currentTime);
        }
    }

    /* ========== REDEEM ========== */

    /**
     * @notice             redeem userTerms for user
     * @param _user        the user to redeem for
     * @param _indexes     the note indexes to redeem
     * @return payout_     sum of payout sent, in REQ
     */
    function redeem(address _user, uint256[] memory _indexes) public override returns (uint256 payout_) {
        uint48 time = uint48(block.timestamp);

        for (uint256 i = 0; i < _indexes.length; i++) {
            (uint256 pay, bool matured, bool payoffClaimable) = pendingFor(_user, _indexes[i]);
            uint256 marketId = userTerms[_user][_indexes[i]].marketID;

            // check whether notional can be claimed
            if (matured) {
                userTerms[_user][_indexes[i]].redeemed = time; // mark as claimed
                payout_ += pay;
            }

            // check whether option can be exercised
            (, int256 _fetchedPrice, , , ) = getLatestPriceData(markets[marketId].underlying);
            if (payoffClaimable) {
                uint256 payoff = _calculatePayoff(
                    userTerms[_user][_indexes[i]].cryptoIntitialPrice,
                    _fetchedPrice,
                    terms[marketId].thresholdPercentage
                );
                userTerms[_user][_indexes[i]].cryptoClosingPrice = _fetchedPrice;
                if (payoff > 0) {
                    userTerms[_user][_indexes[i]].exercised = time; // mark as exercised
                    uint256 cappedPayoff = ((payoff > terms[marketId].maxPayoffPercentage ? terms[marketId].maxPayoffPercentage : payoff) *
                        pay) / 1e18;
                    // add digital payoff
                    payout_ += cappedPayoff;
                    // mint option payoff
                    treasury.mint(address(this), cappedPayoff);
                    emit OptionExercise(marketId, cappedPayoff);
                }
            }
        }

        // transfer notionals and digital payoffs
        req.transfer(_user, payout_);
    }

    /**
     * @notice             redeem all redeemable markets for user
     * @dev                if possible, query indexesFor() off-chain and input in redeem() to save gas
     * @param _user        user to redeem all userTerms for
     * @return             sum of payout sent, in REQ
     */
    function redeemAll(address _user) external override returns (uint256) {
        return redeem(_user, indexesFor(_user));
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

        // Control variable decay

        // The bond control variable is continually tuned. When it is lowered (which
        // lowers the market price), the change is carried out smoothly over time.
        if (adjustments[_id].active) {
            Adjustment storage adjustment = adjustments[_id];

            (uint256 adjustBy, uint48 secondsSince, bool stillActive) = _controlDecay(_id);
            terms[_id].controlVariable -= adjustBy;

            if (stillActive) {
                adjustment.change -= adjustBy;
                adjustment.timeToAdjusted -= secondsSince;
                adjustment.lastAdjustment = _time;
            } else {
                adjustment.active = false;
            }
        }
    }

    /**
     * @notice             auto-adjust control variable to hit capacity/spend target
     * @param _id          ID of market
     * @param _time        uint48 timestamp (saves gas when passed in)
     */
    function _tune(uint256 _id, uint48 _time) internal {
        Metadata memory meta = metadata[_id];

        if (_time >= meta.lastTune + meta.tuneInterval) {
            Market memory market = markets[_id];

            // compute seconds remaining until market will conclude
            uint256 timeRemaining = terms[_id].conclusion - _time;
            uint256 price = _marketPrice(_id);

            // standardize capacity into an base token amount
            uint256 capacity = market.capacityInQuote
                ? (treasury.assetValue(address(market.asset), market.capacity) * 1e18) / price
                : market.capacity;

            /**
             * calculate the correct payout to complete on time assuming each bond
             * will be max size in the desired deposit interval for the remaining time
             *
             * i.e. market has 10 days remaining. deposit interval is 1 day. capacity
             * is 10,000 REQ. max payout would be 1,000 REQ (10,000 * 1 / 10).
             */
            markets[_id].maxPayout = uint256((capacity * meta.depositInterval) / timeRemaining);

            // calculate the ideal total debt to satisfy capacity in the remaining time
            uint256 targetDebt = (capacity * meta.length) / timeRemaining;

            // derive a new control variable from the target debt and current supply
            uint256 newControlVariable = uint256((price * treasury.baseSupply()) / targetDebt);

            emit Tuned(_id, terms[_id].controlVariable, newControlVariable);

            if (newControlVariable >= terms[_id].controlVariable) {
                terms[_id].controlVariable = newControlVariable;
            } else {
                // if decrease, control variable change will be carried out over the tune interval
                // this is because price will be lowered
                uint256 change = terms[_id].controlVariable - newControlVariable;
                adjustments[_id] = Adjustment(change, _time, meta.tuneInterval, true);
            }
            metadata[_id].lastTune = _time;
        }
    }

    /**
     * @notice  fetches prices from oracle and adds a new Terms for a user
     */
    function _bondAsset(
        address _user,
        uint256 _maxPrice,
        Market memory _market,
        uint256 _marketId,
        uint256 _amount,
        uint48 _expiry,
        address _referral
    ) internal returns (uint256, uint256) {
        // entering the mempool. max price is a slippage mitigation measure
        uint256 _price = _marketPrice(_marketId);
        require(_price <= _maxPrice, "Depository: more than max price");

        /**
         * payout for the deposit = value / price
         */
        uint256 _payout = (treasury.assetValue(address(_market.asset), _amount) * 1e18) / _price;

        require(_payout <= _market.maxPayout, "Depository: max size exceeded");

        // the new note is pushed to the user's array
        (uint256 _index, int256 _fetchedPrice) = addTerms(_user, _market.underlying, _payout, _expiry, uint48(_marketId), _referral);
        // mint payout and rewards
        treasury.mint(address(this), _payout);

        emit Bond(_marketId, _amount, _price, _fetchedPrice);

        return (_index, _payout);
    }

    /* ======== EXTERNAL VIEW ======== */

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

        payout_ = note.payout;
        matured_ = note.redeemed == 0 && note.matured <= block.timestamp && payout_ != 0;
        // notional can already have been claimed
        payoffClaimable_ = note.exercised == 0 && note.matured <= block.timestamp && note.matured + terms[note.marketID].exerciseDuration >= block.timestamp;
    }

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
        Market memory market = markets[_id];
        return (treasury.assetValue(address(market.asset), _amount) * 1e18) / marketPrice(_id);
    }

    /**
     * @notice             calculates the intrinsic option value for a specific userTerm
     * @param _user        user to fetch data for
     * @param _index       index of userTerm
     * @return payoff_     amount of REQ to be paid in REQ decimals if option could be exercised now
     *
     * @dev we assume that the market price decimals and req decimals match (that is why we use 2 * req decimals)
     */
    function optionPayoutFor(address _user, uint256 _index) external view override returns (uint256 payoff_) {
        UserTerms memory userTerm = userTerms[_user][_index];
        uint256 _id = userTerms[_user][_index].marketID;

        (, int256 _fetchedPrice, , , ) = getLatestPriceData(markets[_id].underlying);

        uint256 rawPayoff = _calculatePayoff(userTerm.cryptoIntitialPrice, _fetchedPrice, terms[_id].thresholdPercentage);
        if (rawPayoff > 0) {
            uint256 maxPercentage = terms[_id].maxPayoffPercentage;
            payoff_ = ((rawPayoff > maxPercentage ? maxPercentage : rawPayoff) * userTerm.payout) / 1e18;
        }
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

        return (markets[_id].totalDebt * secondsSince) / meta.length;
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

    function _calculatePayoff(
        int256 _initialPrice,
        int256 _priceNow,
        int256 _strike
    ) internal pure returns (uint256) {
        int256 _kMinusS = _priceNow * 1e18 - (1e18 + _strike) * _initialPrice;
        return _kMinusS > 0 ? uint256(_kMinusS / _initialPrice) : 0;
    }

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
}
