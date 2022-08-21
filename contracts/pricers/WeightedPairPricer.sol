// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../interfaces/IAssetPricer.sol";
import "../interfaces/ERC20/IERC20.sol";
import "../interfaces/IWeightedPair.sol";

// solhint-disable  max-line-length

/**
 * Bonding calculator for weighted pairs
 */
contract WeightedPairPricer is IAssetPricer {
    constructor() {}

    /**
     * @notice standard pair valuation tusing the pool price
     * @param _pair general pair that has the RequiemSwap interface implemented
     */
    function getTotalValue(address _pair, address _quote) public view returns (uint256 _value) {
        IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair).getReserves();
        (uint32 weight0, uint32 weight1, , ) = IWeightedPair(_pair).getParameters();
        if (_quote == IWeightedPair(_pair).token0()) {
            _value = pairData.reserve0 + (pairData.vReserve0 * weight1 * pairData.reserve1) / (weight0 * pairData.vReserve1);
        } else {
            _value = pairData.reserve1 + (pairData.vReserve1 * weight0 * pairData.reserve0) / (weight1 * pairData.vReserve0);
        }
        // standardize to 18 decimals
        _value *= 10**(18 - IERC20(_quote).decimals());
    }

    /**
     * @notice Calculates the value in QUOTE 
     * @param _pair general pair that has the RequiemSwap interface implemented
     * @param _amount the amount of LP to price for the backing
     */
    function valuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_pair, _quote, _amount);
    }

    /**
     * @notice same as valuation as REQ is not expected to be in the pair 
     * @param _pair general pair that has the RequiemSwap interface implemented
     * @param _amount the amount of LP to price for the backing
     */
    function slashedValuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_pair, _quote, _amount);
    }

    function _valuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) internal view returns (uint256 _value) {
        uint256 totalValue = getTotalValue(_pair, _quote);
        uint256 totalSupply = IWeightedPair(_pair).totalSupply();

        _value = (totalValue * _amount) / totalSupply;
    }
}
