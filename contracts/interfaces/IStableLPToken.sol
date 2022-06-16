// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./ISwap.sol";

interface IStableLPToken {
  function swap() external view returns (ISwap);

  function totalSupply() external view returns (uint256);
}
