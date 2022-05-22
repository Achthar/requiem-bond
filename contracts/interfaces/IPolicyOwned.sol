// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

interface IPolicyOwned {
  function policy() external view returns (address);

  function renounceManagement() external;
  
  function pushManagement( address newOwner_ ) external;
  
  function pullManagement() external;
}