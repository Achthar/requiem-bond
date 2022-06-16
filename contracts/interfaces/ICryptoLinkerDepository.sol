// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.15;

import "./ERC20/IERC20.sol";

// solhint-disable max-line-length

interface ICryptoLinkerDepository {
    // Info about each type of market
    struct Market {
        uint256 capacity; // capacity remaining
        address asset; // token to accept as payment
        address index;
        uint256 strike;
        uint256 totalDebt; // total debt from market
        uint256 maxPayout; // max tokens in/out (determined by capacityInQuote false/true, respectively)
        uint256 sold; // base tokens out
        uint256 purchased; // quote tokens in
        uint256 floor; // bond price minimum / floor
        uint256 maxDebt; // 18 decimal debt maximum in REQ
        uint48 vesting; // length of time from deposit to maturity if fixed-term
        uint48 conclusion; // timestamp when market no longer offered (doubles as time when market matures if fixed-expiry)
    }

    // Info for creating new markets
    struct Terms {
        uint256 leverage;
        uint256 controlVariable; // scaling variable for price
        uint48 vesting; // length of time from deposit to maturity if fixed-term
        uint48 conclusion; // timestamp when market no longer offered (doubles as time when market matures if fixed-expiry)
        uint256 maxDebt; // 18 decimal debt maximum in REQ
    }

    // Additional info about market.
    struct Metadata {
        uint256 lastReferencePrice; // underlying 
        uint256 lastReferenceBondPrice; // reference Bond price to accrue on
        uint48 lastTune; // last timestamp when control variable was tuned
        uint48 lastDecay; // last timestamp when market was created and debt was decayed
        uint48 marketLength; // time from creation to conclusion. used as speed to decay debt.
        uint48 depositInterval; // target frequency of deposits
        uint48 tuneInterval; // frequency of tuning
        uint8 assetDecimals; // decimals of quote token
    }

    // Control variable adjustment data
    struct Adjustment {
        uint256 referencePrice;
        uint256 change;
        uint48 lastAdjustment;
        uint48 timeToAdjusted;
        bool active;
    }

    struct IndexData {
        address index; // underlying
        uint256 referencePrice;
        uint48 lastUpdate;
    }

    // /**
    //  * @notice deposit market
    //  * @param _bid uint256
    //  * @param _amount uint256
    //  * @param _maxPrice uint256
    //  * @param _user address
    //  */
    // function deposit(
    //     uint256 _bid,
    //     uint256 _amount,
    //     uint256 _strike,
    //     uint256 _maxPrice,
    //     address _user
    // ) external returns (uint256 payout_, uint256 index_);

    // function create(
    //     address _asset, // token used to deposit
    //     address _underlying,
    //     uint256[4] memory _market, // [capacity, initial price, buffer, floor price]
    //     uint256[2] memory _terms, // [vesting, conclusion]
    //     uint32[2] memory _intervals // [deposit interval, tune interval]
    // ) external returns (uint256 id_);

    function close(uint256 _id) external;

    function isLive(uint256 _bid) external view returns (bool);

    function liveMarkets() external view returns (uint256[] memory);

    function liveMarketsFor(address _asset) external view returns (uint256[] memory);

    function payoutFor(uint256 _amount, uint256 _bid) external view returns (uint256);

    function marketPrice(uint256 _bid) external view returns (uint256);

    function currentDebt(uint256 _bid) external view returns (uint256);

    function debtRatio(uint256 _bid) external view returns (uint256);

    function debtDecay(uint256 _bid) external view returns (uint256);
}
