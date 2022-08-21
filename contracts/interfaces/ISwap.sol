// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "./ERC20/IERC20.sol";

interface ISwap {
  function calculateSwapGivenIn(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view returns (uint256);

  function getTokenBalances() external view returns (uint256[] memory);

  function getPooledTokens() external view returns (IERC20[] memory);

  function getTokenMultipliers() external view returns (uint256[] memory);
}
