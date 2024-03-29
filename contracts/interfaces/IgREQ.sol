// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.16;

import "./ERC20/IERC20.sol";

interface IgREQ is IERC20 {
    function mint(address _to, uint256 _amount) external;

    function burn(address _from, uint256 _amount) external;

    function index() external view returns (uint256);

    function balanceFrom(uint256 _amount) external view returns (uint256);

    function balanceTo(uint256 _amount) external view returns (uint256);

    function migrate(address _staking, address _sREQ) external;
}
