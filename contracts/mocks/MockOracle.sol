// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/oracles/IAggragatorV3.sol";

contract MockOracle is IAggregatorV3 {
    int256 public refPice;
    uint80 public lastRoundId;

    constructor() {
        refPice = 1e18;
        lastRoundId = 0;
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function description() external pure returns (string memory) {
        return "MOCK";
    }

    function version() external pure returns (uint256) {
        return 0;
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        answer = refPice;
        startedAt = block.timestamp;
        updatedAt = block.timestamp;
        answeredInRound = 0;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = lastRoundId;
        answer = refPice;
        startedAt = block.timestamp;
        updatedAt = block.timestamp;
        answeredInRound = 0;
    }

    function setPrice(int256 _price) public {
        refPice = _price;
        lastRoundId += 1;
    }
}
