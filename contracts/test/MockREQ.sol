// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "./ERC20.sol";
import "../interfaces/IREQ.sol";

contract MockREQ is ERC20, IREQ {
    constructor() ERC20("Requiem", "REQ", 18) {}

    function mint(address to, uint256 value) external override {
        _mint(to, value);
    }

    function burn(uint256 value) external override {
        _burn(_msgSender(), value);
    }

    function burnFrom(address account, uint256 amount) external override {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }
}
