// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

// solhint-disable func-name-mixedcase

interface IWeightedPair {
  struct ReserveData {
    uint256 reserve0;
    uint256 reserve1;
    uint256 vReserve0;
    uint256 vReserve1;
  }

  function totalSupply() external view returns (uint256);

  function token0() external view returns (address);

  function token1() external view returns (address);

  function getReserves()
    external
    view
    returns (ReserveData calldata reserveData);

  function getParameters()
    external
    view
    returns (
      uint32 _tokenWeight0,
      uint32 _tokenWeight1,
      uint32 _swapFee,
      uint32 _amp
    );
}
