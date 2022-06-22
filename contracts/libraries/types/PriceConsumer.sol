// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../../interfaces/IAggragatorV3.sol";

contract PriceConsumer {
    /**
     * Returns the latest price
     */
    function getLatestPriceData(address _feed)
        public
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt, // relevant timestamp
            uint80 answeredInRound
        )
    {
        return IAggregatorV3(_feed).latestRoundData();
    }

    function calculatePerformance(int256 _newPrice, int256 _oldPrice) internal pure returns (int256 _pricePerformance) {
        _pricePerformance = ((_newPrice - _oldPrice) * 1e18) / _oldPrice;
    }
}
