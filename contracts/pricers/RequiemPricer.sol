// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "../interfaces/IAssetPricer.sol";
import "../interfaces/ERC20/IERC20.sol";
import "../interfaces/IWeightedPair.sol";
import "../interfaces/ISwap.sol";

// solhint-disable  max-line-length

/**
 * Bonding calculator for weighted pairs where one token is REQ
 * and the other a stable asset
 */
contract RequiemPricer is IAssetPricer {
    address public immutable REQ;

    constructor(address _REQ) {
        require(_REQ != address(0));
        REQ = _REQ;
    }

    /**
     * @notice regular fair value pricer - calculates value denominated in quote for pair
     * @param _pair pair that includes requiem token
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
     * - calculates the value in reqt of the input LP amount provided
     * @param _pair general pair that has the RequiemSwap interface implemented
     * @param _amount the amount of LP to price in REQ
     *  - is consistent with the uniswapV2-type case
     */
    function valuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256 _value) {
        uint256 totalValue = getTotalValue(_pair, _quote);
        uint256 totalSupply = IWeightedPair(_pair).totalSupply();
        _value = (totalValue * _amount) / totalSupply;
    }

    /**
     * @notice Marks down valuation of REQ pair - totalValue > totalDoiscountedValue
     * @dev Pairs or pools that contain REQ need to be marketd down when priced by the issuer of REQ
     * @param _pair pair that includes requiem token
     */
    function getTotalSlashedValue(address _pair, address) public view returns (uint256 _value) {
        IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair).getReserves();

        uint256 quoteMultiplier = 10**(18 - IERC20(IWeightedPair(_pair).token1()).decimals());

        if (REQ == IWeightedPair(_pair).token1()) {
            _value = pairData.reserve0 * quoteMultiplier + pairData.reserve1;
        } else {
            _value = pairData.reserve1 * quoteMultiplier + pairData.reserve0;
        }
    }

    /**
     * @notice Calculates a risk adjusted value of the asset for treasury audits
     */
    function slashedValuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256 _value) {
        uint256 totalValue = getTotalSlashedValue(_pair, _quote);
        uint256 totalSupply = IWeightedPair(_pair).totalSupply();

        _value = (totalValue * _amount) / totalSupply;
    }
}
