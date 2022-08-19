// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "../interfaces/IAssetPricer.sol";
import "../interfaces/ERC20/IERC20.sol";
import "../interfaces/ISwap.sol";
import "../libraries/math/FixedPoint.sol";
import "../interfaces/IStableLPToken.sol";

/**
 * Bonding calculator for stable pool
 */
contract StablePoolPricer is IAssetPricer {
    using FixedPoint for *;

    constructor() {}

    // calculates the liquidity value denominated in the provided token
    // uses the 0.01% inputAmount for that calculation
    // note that we never use the actual LP as input as the swap contains the LP address
    // and is also used to extract the balances
    function getTotalValue(address _lpAddress, address _quote) public view returns (uint256 _value) {
        ISwap swap = IStableLPToken(_lpAddress).swap();
        IERC20[] memory tokens = swap.getPooledTokens();
        uint256[] memory reserves = swap.getTokenBalances();
        for (uint8 i = 0; i < reserves.length; i++) {
            address tokenAddr = address(tokens[i]);
            if (tokenAddr != _quote) {
                _value += swap.calculateSwapGivenIn(tokenAddr, _quote, reserves[i] / 10000) * 10000;
            } else {
                _value += reserves[i];
            }

            _value *= 10**(18 - IERC20(_quote).decimals());
        }
    }

    function valuation(
        address _lpAddress,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_lpAddress, _quote, _amount);
    }

    function slashedValuation(
        address _lpAddress,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_lpAddress, _quote, _amount);
    }

    function _valuation(
        address _lpAddress,
        address _quote,
        uint256 _amount
    ) internal view returns (uint256 _value) {
        uint256 totalValue = getTotalValue(_lpAddress, _quote);
        uint256 totalSupply = IStableLPToken(_lpAddress).totalSupply();

        _value = (totalValue * FixedPoint.fraction(_amount, totalSupply).decode112with18()) / 1e18;
    }
}
