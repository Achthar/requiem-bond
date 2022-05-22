// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./libraries/Initializable.sol";
import "./libraries/ERC20Burnable.sol";
import "./libraries/ERC20Permit.sol";
import "./libraries/Ownable.sol";

/**
 *  Governance token for requiem.finance
 *  - Flexible minting allowed for flexibility
 *  - Total supply cap for better control
 *  - Controllable minters with indivitual caps
 */
contract RequiemERC20Token is ERC20Permit, Ownable, ERC20Burnable {
  uint256 public MAX_TOTAL_SUPPLY = 10_000_000 ether; // 10mn

  mapping(address => uint256) public minters; // minter's address => minter's max cap
  mapping(address => uint256) public minters_minted;

  /* ========== EVENTS ========== */
  event MinterUpdate(address indexed account, uint256 cap);
  event MaxTotalSupplyUpdated(uint256 _newCap);

  /* ========== Modifiers =============== */

  modifier onlyMinter() {
    require(minters[msg.sender] > 0, "Only minter can interact");
    _;
  }

  constructor() ERC20("Asset Backed Requiem Token", "abREQ", 18) ERC20Permit("abREQ") {}

  /* ========== MUTATIVE FUNCTIONS ========== */

  function mint(address _recipient, uint256 _amount) public onlyMinter {
    minters_minted[_msgSender()] += _amount;
    require(
      minters[_msgSender()] >= minters_minted[_msgSender()],
      "Minting amount exceeds minter cap"
    );
    _mint(_recipient, _amount);
  }

  function _beforeTokenTransfer(
    address _from,
    address _to,
    uint256 _amount
  ) internal override {
    super._beforeTokenTransfer(_from, _to, _amount);
    if (_from == address(0)) {
      // When minting tokens
      require(
        totalSupply() + _amount <= MAX_TOTAL_SUPPLY,
        "Max total supply exceeded"
      );
    }
    if (_to == address(0)) {
      // When burning tokens
      require(
        MAX_TOTAL_SUPPLY >= _amount,
        "Burn amount exceeds max total supply"
      );
      MAX_TOTAL_SUPPLY -= _amount;
    }
  }

  /* ========== OWNER FUNCTIONS ========== */

  function setMinter(address _account, uint256 _minterCap) external onlyOwner {
    require(_account != address(0), "invalid address");
    require(
      minters_minted[_account] <= _minterCap,
      "Minter already minted a larger amount than new cap"
    );
    minters[_account] = _minterCap;
    emit MinterUpdate(_account, _minterCap);
  }

  function resetMaxTotalSupply(uint256 _newCap) external onlyOwner {
    require(_newCap >= totalSupply(), "_newCap is below current total supply");
    MAX_TOTAL_SUPPLY = _newCap;
    emit MaxTotalSupplyUpdated(_newCap);
  }
}
