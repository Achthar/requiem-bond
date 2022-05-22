// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.14;

/*
    Bancor Formula interface
*/
interface IRequiemFormula {
  function getReserveAndWeights(address pair, address tokenA)
    external
    view
    returns (
      address tokenB,
      uint256 reserveA,
      uint256 reserveB,
      uint32 tokenWeightA,
      uint32 tokenWeightB,
      uint32 swapFee
    );

  function getFactoryReserveAndWeights(
    address factory,
    address pair,
    address tokenA
  )
    external
    view
    returns (
      address tokenB,
      uint256 reserveA,
      uint256 reserveB,
      uint32 tokenWeightA,
      uint32 tokenWeightB,
      uint32 swapFee
    );

  function getAmountIn(
    uint256 amountOut,
    uint256 reserveIn,
    uint256 reserveOut,
    uint32 tokenWeightIn,
    uint32 tokenWeightOut,
    uint32 swapFee
  ) external view returns (uint256 amountIn);

  function getPairAmountIn(
    address pair,
    address tokenIn,
    uint256 amountOut
  ) external view returns (uint256 amountIn);

  function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut,
    uint32 tokenWeightIn,
    uint32 tokenWeightOut,
    uint32 swapFee
  ) external view returns (uint256 amountOut);

  function getPairAmountOut(
    address pair,
    address tokenIn,
    uint256 amountIn
  ) external view returns (uint256 amountOut);

  function getAmountsIn(
    address tokenIn,
    address tokenOut,
    uint256 amountOut,
    address[] calldata path
  ) external view returns (uint256[] memory amounts);

  function getFactoryAmountsIn(
    address factory,
    address tokenIn,
    address tokenOut,
    uint256 amountOut,
    address[] calldata path
  ) external view returns (uint256[] memory amounts);

  function getAmountsOut(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    address[] calldata path
  ) external view returns (uint256[] memory amounts);

  function getFactoryAmountsOut(
    address factory,
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    address[] calldata path
  ) external view returns (uint256[] memory amounts);

  function ensureConstantValue(
    uint256 reserve0,
    uint256 reserve1,
    uint256 balance0Adjusted,
    uint256 balance1Adjusted,
    uint32 tokenWeight0
  ) external view returns (bool);

  function getReserves(
    address pair,
    address tokenA,
    address tokenB
  ) external view returns (uint256 reserveA, uint256 reserveB);

  function getOtherToken(address pair, address tokenA)
    external
    view
    returns (address tokenB);

  function quote(
    uint256 amountA,
    uint256 reserveA,
    uint256 reserveB
  ) external pure returns (uint256 amountB);

  function sortTokens(address tokenA, address tokenB)
    external
    pure
    returns (address token0, address token1);

  function mintLiquidityFee(
    uint256 totalLiquidity,
    uint112 reserve0,
    uint112 reserve1,
    uint32 tokenWeight0,
    uint32 tokenWeight1,
    uint112 collectedFee0,
    uint112 collectedFee1
  ) external view returns (uint256 amount);

}
