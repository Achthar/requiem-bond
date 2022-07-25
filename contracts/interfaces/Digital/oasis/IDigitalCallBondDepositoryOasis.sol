// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.15;

import "../../ERC20/IERC20.sol";

// solhint-disable max-line-length

interface IDigitalCallBondDepositoryOasis {
    // Info about each type of market
    struct Market {
        uint256 capacity; // capacity remaining
        IERC20 asset; // token to accept as payment
        string underlying;
        string quote;
        bool capacityInQuote; // capacity limit is in payment token (true) or in REQ (false, default)
        uint256 totalDebt; // total debt from market
        uint256 maxPayout; // max tokens in/out (determined by capacityInQuote false/true, respectively)
        uint256 sold; // base tokens out
        uint256 purchased; // quote tokens in
    }

    // Info for creating new markets
    struct Terms {
        bool fixedTerm; // fixed term or fixed expiration
        int256 thresholdPercentage;
        uint256 payoffPercentage; // percentage that is paid on top of the notional if exercised
        uint256 controlVariable; // scaling variable for price
        uint48 vesting; // length of time from deposit to maturity if fixed-term
        uint48 exerciseDuration;
        uint48 conclusion; // timestamp when market no longer offered (doubles as time when market matures if fixed-expiry)
        uint256 maxDebt; // 18 decimal debt maximum in REQ
    }

    // Additional info about market.
    struct Metadata {
        uint48 lastTune; // last timestamp when control variable was tuned
        uint48 lastDecay; // last timestamp when market was created and debt was decayed
        uint48 length; // time from creation to conclusion. used as speed to decay debt.
        uint48 depositInterval; // target frequency of deposits
        uint48 tuneInterval; // frequency of tuning
    }

    // Control variable adjustment data
    struct Adjustment {
        uint256 change;
        uint48 lastAdjustment;
        uint48 timeToAdjusted;
        bool active;
    }

    /**
     * @notice deposit market
     * @param _bid uint256
     * @param _amount uint256
     * @param _maxPrice uint256
     * @param _user address
     * @param _referral address
     * @return payout_ uint256
     * @return expiry_ uint256
     * @return index_ uint256
     */
    function deposit(
        uint256 _bid,
        uint256 _amount,
        uint256 _maxPrice,
        address _user,
        address _referral
    )
        external
        returns (
            uint256 payout_,
            uint256 expiry_,
            uint256 index_
        );

    function create(
        IERC20 _asset, // token used to deposit
        string[2] memory _underlying,
        uint256[5] memory _market, // [capacity, initial price, buffer, threshold percentage, digital payoff]
        bool[2] memory _booleans, // [capacity in quote, fixed term]
        uint256[3] memory _terms, // [vesting, conclusion]
        uint32[2] memory _intervals // [deposit interval, tune interval]
    ) external returns (uint256 id_);

    function close(uint256 _id) external;

    function isLive(uint256 _bid) external view returns (bool);

    function liveMarkets() external view returns (uint256[] memory);

    function liveMarketsFor(address _asset) external view returns (uint256[] memory);

    // notional payout
    function payoutFor(uint256 _amount, uint256 _bid) external view returns (uint256);

    // option payout
    function optionPayoutFor(address _user, uint256 _index) external view returns (uint256);

    function marketPrice(uint256 _bid) external view returns (uint256);

    function currentDebt(uint256 _bid) external view returns (uint256);

    function debtRatio(uint256 _bid) external view returns (uint256);

    function debtDecay(uint256 _bid) external view returns (uint256);

    // redemtion and exercise
    function redeem(address _user, uint256[] memory _indexes) external returns (uint256);

    function redeemAll(address _user) external returns (uint256);
}
