// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./libraries/Ownable.sol";
import "./libraries/Initializable.sol";
import "./interfaces/ERC20/IERC20.sol";
import "./libraries/ERC20.sol";
import "./libraries/Context.sol";
import "./libraries/SafeERC20.sol";
import "./interfaces/ERC20/IRewardToken.sol";

contract FundDistributor is Ownable, Initializable, Context {
  using SafeERC20 for IRewardToken;

  IRewardToken public reward;
  uint256 public missingDecimals;

  // CONTRACTS
  mapping(address => bool) public requesters;

  /* ========== MODIFIER ========== */

  modifier onlyRequester() {
    require(requesters[_msgSender()], "Only pool can request transfer");
    _;
  }

  function initialize(address _reward) external initializer {
    reward = IRewardToken(_reward);
    missingDecimals = 18 - ERC20(_reward).decimals();
  }

  /* ========== MUTATIVE ====================== */

  function distributeTo(address _receiver, uint256 _amount)
    public
    onlyRequester
  {
    require(_receiver != address(0), "Invalid address");
    if (_amount > 0) {
      reward.mint(_receiver, _amount / (10**missingDecimals));
    }
  }

  /* ========== RESTRICTED FUNCTIONS ========== */

  function addRequester(address _requester) external onlyOwner {
    require(!requesters[_requester], "requester existed");
    requesters[_requester] = true;
    emit RequesterAdded(_requester);
  }

  function removeRequester(address _requester) external onlyOwner {
    require(requesters[_requester], "requester not found");
    delete requesters[_requester];
    emit RequesterRemoved(_requester);
  }

  /* ========== EVENTS ========================= */

  event RequesterAdded(address indexed requester);
  event RequesterRemoved(address indexed requester);
  event FundRequested(uint256 indexed amount);
}
