// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IAssetPricer {
    function valuation(
        address _asset,
        address _quote,
        uint256 _amount
    ) external view returns (uint256);

    function slashedValuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view returns (uint256);
}
