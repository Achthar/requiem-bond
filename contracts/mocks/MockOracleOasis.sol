// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/oracles/IStdReference.sol";

// solhint-disable  max-line-length

contract MockOracleOasis is IStdReference {
    uint256 public refPrice;

    constructor() {
        refPrice = 1e18;
    }

    function getPrice(string[2] memory) public view returns (ReferenceData memory _data) {
        _data.rate = refPrice;
        _data.lastUpdatedBase = block.timestamp;
        _data.lastUpdatedQuote = block.timestamp;
    }

    function setPrice(uint256 _price) public {
        refPrice = _price;
    }

    /// Returns the price data for the given base/quote pair. Revert if not available.
    function getReferenceData(string memory, string memory) external view returns (ReferenceData memory _data) {
        _data.rate = refPrice;
        _data.lastUpdatedBase = block.timestamp;
        _data.lastUpdatedQuote = block.timestamp;
    }

    /// Similar to getReferenceData, but with multiple base/quote pairs at once.
    function getReferenceDataBulk(string[] memory, string[] memory) external pure returns (ReferenceData[] memory _datas) {
        return _datas;
    }
}
