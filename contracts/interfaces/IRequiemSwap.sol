// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

interface IRequiemSwap {
  function calculateSwapGivenIn(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view returns (uint256);

  function calculateSwapGivenOut(
    address tokenIn,
    address tokenOut,
    uint256 amountOut
  ) external view returns (uint256);
}
