// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./interfaces/IBondingCalculator.sol";
import "./interfaces/ERC20/IERC20.sol";
import "./interfaces/IRequiemWeightedPair.sol";
import "./interfaces/IRequiemSwap.sol";
import "./libraries/math/FixedPoint.sol";
import "./libraries/math/SqrtMath.sol";
import "./libraries/math/FullMath.sol";

/**
 * Bonding calculator for weighted pairs
 */
contract RequiemQBondingCalculator is IBondingCalculator {
  using FixedPoint for *;

  // 20 decimal sqrt 2
  uint256 private immutable SQRT2x100 = 141421356237309504880;
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
   * @param _pair general pair that has the RequiemSwap interface implemented
   *  - the value is calculated as the geometric average of input and output
   *  - is consistent with the uniswapV2-type case
   */
  function getTotalValue(address _pair) public view returns (uint256 _value) {
    (uint256 reserve0, uint256 reserve1, ) = IRequiemWeightedPair(_pair)
      .getReserves();
    (uint32 weight0, uint32 weight1) = IRequiemWeightedPair(_pair)
      .getTokenWeights();

    (uint256 reservesOther, , uint32 weightOther, uint32 weightReqt) = REQ ==
      IRequiemWeightedPair(_pair).token0()
      ? (reserve1, reserve0, weight1, weight0)
      : (reserve0, reserve1, weight0, weight1);

    // In case of both weights being 50, it is equivalent to
    // the UniswapV2 variant. If the weights are different, we define the valuation by
    // scaling the reqt reserve up or down dependent on the weights and the use the product as
    // adjusted constant product. We will use the conservative estimation of the price - we upscale
    // such that the reflected equivalent pool is a uniswapV2 with the higher liquidity that pruduces
    // the same price of the Requiem token as the weighted pool.
    _value =
      (SQRT2x100 * reservesOther) /
      SqrtMath.sqrrt(weightOther * weightOther + weightReqt * weightReqt) /
      1e18;
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
    uint256 totalSupply = IRequiemWeightedPair(_pair).totalSupply();

    _value = FullMath.mulDivRoundingUp(totalValue, amount_, totalSupply);
  }

  // markdown function for bond valuation
  function markdown(address _pair) external view returns (uint256) {
    (uint256 reserve0, uint256 reserve1, ) = IRequiemWeightedPair(_pair)
      .getReserves();
    (uint32 weight0, uint32 weight1) = IRequiemWeightedPair(_pair)
      .getTokenWeights();

    (uint256 reservesOther, uint32 weightOther, uint32 weightReqt) = REQ ==
      IRequiemWeightedPair(_pair).token0()
      ? (reserve1, weight1, weight0)
      : (reserve0, weight0, weight1);

    // adjusted markdown scaling up the reserve as the trading mechnism allows
    // higher or lower valuation for reqt reserve
    return
      ((reservesOther + (weightOther * reservesOther) / weightReqt) *
        (10**IERC20(REQ).decimals())) / getTotalValue(_pair);
  }
}
