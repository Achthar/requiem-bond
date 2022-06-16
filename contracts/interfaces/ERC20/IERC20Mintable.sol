// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

interface IERC20Mintable {

  function mint(address account_, uint256 amount_) external;
}
