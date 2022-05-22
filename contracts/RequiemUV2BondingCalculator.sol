// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./interfaces/IBondingCalculator.sol";
import "./interfaces/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2TypePair.sol";
import "./libraries/math/FixedPoint.sol";
import "./libraries/math/SqrtMath.sol";

/**
 * Bonding calculator for weighted pairs
 */
contract RequiemUV2BondingCalculator is IBondingCalculator {
  using FixedPoint for *;
  using SqrtMath for uint256;

  address public immutable REQT;

  constructor(address _REQT) {
    require(_REQT != address(0));
    REQT = _REQT;
  }

  function getKValue(address _pair) public view returns (uint256 k_) {
    uint256 token0 = IERC20(IUniswapV2TypePair(_pair).token0()).decimals();
    uint256 token1 = IERC20(IUniswapV2TypePair(_pair).token1()).decimals();
    uint256 decimals = token0 + token1 - IERC20(_pair).decimals();

    (uint256 reserve0, uint256 reserve1, ) = IUniswapV2TypePair(_pair)
      .getReserves();
    k_ = (reserve0 * reserve1) / (10**decimals);
  }

  function getTotalValue(address _pair) public view returns (uint256 _value) {
    _value = getKValue(_pair).sqrrt() * 2;
  }

  function valuation(address _pair, uint256 amount_)
    external
    view
    override
    returns (uint256 _value)
  {
    uint256 totalValue = getTotalValue(_pair);
    uint256 totalSupply = IUniswapV2TypePair(_pair).totalSupply();

    _value = totalValue
       * FixedPoint.fraction(amount_, totalSupply).decode112with18()
      /1e18;
  }

  function markdown(address _pair) external view returns (uint256) {
    (uint256 reserve0, uint256 reserve1, ) = IUniswapV2TypePair(_pair)
      .getReserves();

    uint256 reserve;
    if (IUniswapV2TypePair(_pair).token0() == REQT) {
      reserve = reserve1;
    } else {
      reserve = reserve0;
    }
    return
      reserve * (2 * (10**IERC20(REQT).decimals())) / getTotalValue(_pair);
  }
}
