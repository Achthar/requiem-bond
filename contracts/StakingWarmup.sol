// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./interfaces/ERC20/IERC20.sol";

contract StakingWarmup {
  address public immutable staking;
  address public immutable sREQT;

  constructor(address _staking, address _sREQT) {
    require(_staking != address(0));
    staking = _staking;
    require(_sREQT != address(0));
    sREQT = _sREQT;
  }

  function retrieve(address _staker, uint256 _amount) external {
    require(msg.sender == staking);
    IERC20(sREQT).transfer(_staker, _amount);
  }
}
