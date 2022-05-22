// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
import "./ERC20/IERC20.sol";

interface IMiniChefV2 {
  function lpToken(uint256 _pid) external view returns (IERC20);
}
