// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./interfaces/IAssetPricer.sol";
import "./interfaces/ERC20/IERC20.sol";
import "./interfaces/IWeightedPair.sol";
import "./interfaces/IRequiemSwap.sol";
import "./libraries/math/FixedPoint.sol";
import "./libraries/math/SqrtMath.sol";
import "./libraries/math/FullMath.sol";

/**
 * Bonding calculator for weighted pairs
 */
contract WeightedRequiemCalculator is IAssetPricer {
  using FixedPoint for *;

  address public immutable REQ;

  constructor(address _REQ) {
    require(_REQ != address(0));
    REQ = _REQ;
  }

  /**
   * note for general pairs the price does not necessarily satisfy the conditon
   * that the lp value consists 50% of the one and the other token since the mid
   * price is the quotient of the reserves. That is not necessarily the case for
   * general pairs, therefore, we have to calculate the price separately and apply it
   * to the reserve amount for conversion
   * - calculates the total liquidity value denominated in the provided token
   * - uses the 1bps ouytput reserves for that calculation to avoid slippage to
   *   have a too large impact
   * - the sencond token input argument is ignored when using pools with only 2 tokens
   * @param _pair pair that includes requiem token
   *  - the value of the requiem reserve is assumed at 1 unit of quote
   *  - is consistent with the uniswapV2-type case
   */
  function getTotalValue(address _pair) public view returns (uint256 _value) {
    IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair)
      .getReserves();

    uint256 quoteMultiplier = 10 **
      (18 - IERC20(IWeightedPair(_pair).token1()).decimals());

    if (REQ == IWeightedPair(_pair).token1()) {
      _value = pairData.reserve0 * quoteMultiplier + pairData.reserve1;
    } else {
      _value = pairData.reserve1 * quoteMultiplier + pairData.reserve0;
    }
  }

  /**
   * - calculates the value in reqt of the input LP amount provided
   * @param _pair general pair that has the RequiemSwap interface implemented
   * @param amount_ the amount of LP to price in REQ
   *  - is consistent with the uniswapV2-type case
   */
  function valuation(address _pair, uint256 amount_)
    external
    view
    override
    returns (uint256 _value)
  {
    uint256 totalValue = getTotalValue(_pair);
    uint256 totalSupply = IWeightedPair(_pair).totalSupply();

    _value = (totalValue * amount_) / totalSupply;
  }

  // markdown function for bond valuation
  function markdown(address _pair) external view returns (uint256) {
    IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair)
      .getReserves();

    uint256 reservesOther = REQ ==
      IWeightedPair(_pair).token0()
      ? pairData.reserve1
      : pairData.reserve0;

    // adjusted markdown scaling up the reserve as the trading mechanism allows
    // for lower valuation for reqt reserve
    return
      (2 * reservesOther * (10**IERC20(REQ).decimals())) / getTotalValue(_pair);
  }
}
