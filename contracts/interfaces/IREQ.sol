// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.8.14;

import "./ERC20/IERC20.sol";

interface IREQ is IERC20 {
    function mint(address account_, uint256 amount_) external;

    function burn(uint256 amount) external;

    function burnFrom(address account_, uint256 amount_) external;
}
