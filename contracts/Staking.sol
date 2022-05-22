// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.14;

import "./libraries/SafeERC20.sol";

import "./interfaces/ERC20/IERC20.sol";
import "./interfaces/IsREQ.sol";
import "./interfaces/IgREQ.sol";
import "./interfaces/IDistributor.sol";

import "./libraries/types/AccessControlled.sol";

contract Staking is AccessControlled {
  /* ========== DEPENDENCIES ========== */

  using SafeERC20 for IERC20;
  using SafeERC20 for IsREQ;
  using SafeERC20 for IgREQ;

  /* ========== EVENTS ========== */

  event DistributorSet(address distributor);
  event WarmupSet(uint256 warmup);

  /* ========== DATA STRUCTURES ========== */

  struct Epoch {
    uint256 length; // in seconds
    uint256 number; // since inception
    uint256 end; // timestamp
    uint256 distribute; // amount
  }

  struct Claim {
    uint256 deposit; // if forfeiting
    uint256 gons; // staked balance
    uint256 expiry; // end of warmup period
    bool lock; // prevents malicious delays for claim
  }

  /* ========== STATE VARIABLES ========== */

  IERC20 public immutable REQ;
  IsREQ public immutable sREQ;
  IgREQ public immutable gREQ;

  Epoch public epoch;

  IDistributor public distributor;

  mapping(address => Claim) public warmupInfo;
  uint256 public warmupPeriod;
  uint256 private gonsInWarmup;

  /* ========== CONSTRUCTOR ========== */

  constructor(
    address _req,
    address _sREQ,
    address _gREQ,
    uint256 _epochLength,
    uint256 _firstEpochNumber,
    uint256 _firstEpochTime,
    address _authority
  ) {
    intitalizeAuthority(IAuthority(_authority));
    require(_req != address(0), "Zero address: REQ");
    REQ = IERC20(_req);
    require(_sREQ != address(0), "Zero address: sREQ");
    sREQ = IsREQ(_sREQ);
    require(_gREQ != address(0), "Zero address: gREQ");
    gREQ = IgREQ(_gREQ);

    epoch = Epoch({
      length: _epochLength,
      number: _firstEpochNumber,
      end: _firstEpochTime,
      distribute: 0
    });
  }

  /* ========== MUTATIVE FUNCTIONS ========== */

  /**
   * @notice stake REQ to enter warmup
   * @param _to address
   * @param _amount uint
   * @param _claim bool
   * @param _rebasing bool
   * @return uint
   */
  function stake(
    address _to,
    uint256 _amount,
    bool _rebasing,
    bool _claim
  ) external returns (uint256) {
    REQ.safeTransferFrom(msg.sender, address(this), _amount);
    _amount += rebase(); // add bounty if rebase occurred
    if (_claim && warmupPeriod == 0) {
      return _send(_to, _amount, _rebasing);
    } else {
      Claim memory info = warmupInfo[_to];
      if (!info.lock) {
        require(_to == msg.sender, "External deposits for account are locked");
      }

      warmupInfo[_to] = Claim({
        deposit: info.deposit + _amount,
        gons: info.gons + sREQ.gonsForBalance(_amount),
        expiry: epoch.number + warmupPeriod,
        lock: info.lock
      });

      gonsInWarmup += sREQ.gonsForBalance(_amount);

      return _amount;
    }
  }

  /**
   * @notice retrieve stake from warmup
   * @param _to address
   * @param _rebasing bool
   * @return uint
   */
  function claim(address _to, bool _rebasing) public returns (uint256) {
    Claim memory info = warmupInfo[_to];

    if (!info.lock) {
      require(_to == msg.sender, "External claims for account are locked");
    }

    if (epoch.number >= info.expiry && info.expiry != 0) {
      delete warmupInfo[_to];

      gonsInWarmup -= info.gons;

      return _send(_to, sREQ.balanceForGons(info.gons), _rebasing);
    }
    return 0;
  }

  /**
   * @notice forfeit stake and retrieve REQ
   * @return uint
   */
  function forfeit() external returns (uint256) {
    Claim memory info = warmupInfo[msg.sender];
    delete warmupInfo[msg.sender];

    gonsInWarmup -= info.gons;

    REQ.safeTransfer(msg.sender, info.deposit);

    return info.deposit;
  }

  /**
   * @notice prevent new deposits or claims from ext. address (protection from malicious activity)
   */
  function toggleLock() external {
    warmupInfo[msg.sender].lock = !warmupInfo[msg.sender].lock;
  }

  /**
   * @notice redeem sREQ for REQs
   * @param _to address
   * @param _amount uint
   * @param _trigger bool
   * @param _rebasing bool
   * @return amount_ uint
   */
  function unstake(
    address _to,
    uint256 _amount,
    bool _trigger,
    bool _rebasing
  ) external returns (uint256 amount_) {
    amount_ = _amount;
    uint256 bounty;
    if (_trigger) {
      bounty = rebase();
    }
    if (_rebasing) {
      sREQ.safeTransferFrom(msg.sender, address(this), _amount);
      amount_ += bounty;
    } else {
      gREQ.burn(msg.sender, _amount); // amount was given in gREQ terms
      amount_ = gREQ.balanceFrom(amount_) + bounty; // convert amount to REQ terms & add bounty
    }

    require(
      amount_ <= REQ.balanceOf(address(this)),
      "Insufficient REQ balance in contract"
    );
    REQ.safeTransfer(_to, amount_);
  }

  /**
   * @notice convert _amount sREQ into gBalance_ gREQ
   * @param _to address
   * @param _amount uint
   * @return gBalance_ uint
   */
  function wrap(address _to, uint256 _amount)
    external
    returns (uint256 gBalance_)
  {
    sREQ.safeTransferFrom(msg.sender, address(this), _amount);
    gBalance_ = gREQ.balanceTo(_amount);
    gREQ.mint(_to, gBalance_);
  }

  /**
   * @notice convert _amount gREQ into sBalance_ sREQ
   * @param _to address
   * @param _amount uint
   * @return sBalance_ uint
   */
  function unwrap(address _to, uint256 _amount)
    external
    returns (uint256 sBalance_)
  {
    gREQ.burn(msg.sender, _amount);
    sBalance_ = gREQ.balanceFrom(_amount);
    sREQ.safeTransfer(_to, sBalance_);
  }

  /**
   * @notice trigger rebase if epoch over
   * @return uint256
   */
  function rebase() public returns (uint256) {
    uint256 bounty;
    if (epoch.end <= block.timestamp) {
      sREQ.rebase(epoch.distribute, epoch.number);

      epoch.end += epoch.length;
      epoch.number++;

      if (address(distributor) != address(0)) {
        distributor.distribute();
        bounty = distributor.retrieveBounty(); // Will mint req for this contract if there exists a bounty
      }
      uint256 balance = REQ.balanceOf(address(this));
      uint256 staked = sREQ.circulatingSupply();
      if (balance <= staked + bounty) {
        epoch.distribute = 0;
      } else {
        epoch.distribute = balance - staked - bounty;
      }
    }
    return bounty;
  }

  /* ========== INTERNAL FUNCTIONS ========== */

  /**
   * @notice send staker their amount as sREQ or gREQ
   * @param _to address
   * @param _amount uint
   * @param _rebasing bool
   */
  function _send(
    address _to,
    uint256 _amount,
    bool _rebasing
  ) internal returns (uint256) {
    if (_rebasing) {
      sREQ.safeTransfer(_to, _amount); // send as sREQ (equal unit as REQ)
      return _amount;
    } else {
      gREQ.mint(_to, gREQ.balanceTo(_amount)); // send as gREQ (convert units from REQ)
      return gREQ.balanceTo(_amount);
    }
  }

  /* ========== VIEW FUNCTIONS ========== */

  /**
   * @notice returns the sREQ index, which tracks rebase growth
   * @return uint
   */
  function index() public view returns (uint256) {
    return sREQ.index();
  }

  /**
   * @notice total supply in warmup
   */
  function supplyInWarmup() public view returns (uint256) {
    return sREQ.balanceForGons(gonsInWarmup);
  }

  /**
   * @notice seconds until the next epoch begins
   */
  function secondsToNextEpoch() external view returns (uint256) {
    return epoch.end - block.timestamp;
  }

  /* ========== MANAGERIAL FUNCTIONS ========== */

  /**
   * @notice sets the contract address for LP staking
   * @param _distributor address
   */
  function setDistributor(address _distributor) external onlyGovernor {
    distributor = IDistributor(_distributor);
    emit DistributorSet(_distributor);
  }

  /**
   * @notice set warmup period for new stakers
   * @param _warmupPeriod uint
   */
  function setWarmupLength(uint256 _warmupPeriod) external onlyGovernor {
    warmupPeriod = _warmupPeriod;
    emit WarmupSet(_warmupPeriod);
  }
}
