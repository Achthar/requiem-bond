// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.14;

import "../libraries/Initializable.sol";
import "../libraries/Ownable.sol";

import "../libraries/SafeERC20.sol";
import "../interfaces/IOwnable.sol";
import "../interfaces/ERC20/IERC20.sol";
import "../interfaces/ERC20/IERC20Metadata.sol";
import "../interfaces/IREQ.sol";
import "../interfaces/IREQDebt.sol";
import "../interfaces/IAssetPricer.sol";
import "../interfaces/ITreasury.sol";
import "../libraries/types/AccessControlled.sol";

contract Treasury is
  Initializable,
  Ownable,
  AccessControlled,
  ITreasury
{
  /* ========== DEPENDENCIES ========== */

  using SafeERC20 for IERC20;

  /* ========== EVENTS ========== */

  event Deposit(address indexed token, uint256 amount, uint256 value);
  event Withdrawal(address indexed token, uint256 amount, uint256 value);
  event CreateDebt(
    address indexed debtor,
    address indexed token,
    uint256 amount,
    uint256 value
  );
  event RepayDebt(
    address indexed debtor,
    address indexed token,
    uint256 amount,
    uint256 value
  );
  event Managed(address indexed token, uint256 amount);
  event ReservesAudited(uint256 indexed totalReserves);
  event Minted(
    address indexed caller,
    address indexed recipient,
    uint256 amount
  );
  event PermissionQueued(STATUS indexed status, address queued);
  event Permissioned(address addr, STATUS indexed status, bool result);

  /* ========== DATA STRUCTURES ========== */

  enum STATUS {
    RESERVEDEPOSITOR,
    RESERVESPENDER,
    RESERVETOKEN,
    RESERVEMANAGER,
    ASSETDEPOSITOR,
    ASSET,
    LIABILITY,
    ASSETMANAGER,
    RESERVEDEBTOR,
    REWARDMANAGER,
    SREQ,
    DEBTOR
  }

  struct Queue {
    STATUS managing;
    address toPermit;
    address calculator;
    uint256 timelockEnd;
    bool nullify;
    bool executed;
  }

  /* ========== STATE VARIABLES ========== */

  IREQ public REQ;
  IREQDebt public REQD;

  mapping(STATUS => address[]) public registry;
  mapping(STATUS => mapping(address => bool)) public permissions;
  mapping(address => address) public assetPricer;

  mapping(address => uint256) public debtLimit;

  uint256 public totalReserves;
  uint256 public totalDebt;
  uint256 public reqDebt;

  Queue[] public permissionQueue;
  uint256 public blocksNeededForQueue;

  bool public timelockEnabled;
  bool public initialized;
  bool public useExcessReserves;

  uint256 public onChainGovernanceTimelock;

  string internal notAccepted = "Treasury: not accepted";
  string internal notApproved = "Treasury: not approved";
  string internal invalidAsset = "Treasury: invalid asset";
  string internal insufficientReserves = "Treasury: insufficient reserves";

  ///@dev constructor for test
  constructor(address _req, address _authority) {
    require(_req != address(0), "Zero address: REQ");
    REQ = IREQ(_req);
    timelockEnabled = false;
    initialized = false;
    blocksNeededForQueue = 0;
    useExcessReserves = false;
    intitalizeAuthority(IAuthority(_authority));
  }

  /* ========== MUTATIVE FUNCTIONS ========== */

  function setBlocksNeededForQueue(uint256 _timelock) public {
    blocksNeededForQueue = _timelock;
  }

  /**
   * @notice allow approved address to deposit an asset for REQ
   * @param _amount uint256
   * @param _token address
   * @param _profit uint256
   * @return send_ uint256
   */
  function deposit(
    uint256 _amount,
    address _token,
    uint256 _profit
  ) external override returns (uint256 send_) {
    if (permissions[STATUS.RESERVETOKEN][_token]) {
      require(permissions[STATUS.RESERVEDEPOSITOR][msg.sender], notApproved);
    } else if (permissions[STATUS.ASSET][_token]) {
      require(permissions[STATUS.ASSETDEPOSITOR][msg.sender], notApproved);
    } else {
      revert(invalidAsset);
    }

    IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

    uint256 value = assetValue(_token, _amount);
    // mint REQ needed and store amount of rewards for distribution
    send_ = value - _profit;
    REQ.mint(msg.sender, send_);

    totalReserves += value;

    emit Deposit(_token, _amount, value);
  }

  /**
   * @notice allow approved address to burn REQ for reserves
   * @param _amount uint256
   * @param _token address
   */
  function withdraw(uint256 _amount, address _token) external override {
    require(permissions[STATUS.RESERVETOKEN][_token], notAccepted); // Only reserves can be used for redemptions
    require(permissions[STATUS.RESERVESPENDER][msg.sender], notApproved);

    uint256 value = assetValue(_token, _amount);
    REQ.burnFrom(msg.sender, value);

    totalReserves -= value;

    IERC20(_token).safeTransfer(msg.sender, _amount);

    emit Withdrawal(_token, _amount, value);
  }

  /**
   * @notice allow approved address to withdraw assets
   * @param _token address
   * @param _amount uint256
   */
  function manage(address _token, uint256 _amount) external override {
    if (permissions[STATUS.ASSET][_token]) {
      require(permissions[STATUS.ASSETMANAGER][msg.sender], notApproved);
    } else {
      require(permissions[STATUS.RESERVEMANAGER][msg.sender], notApproved);
    }
    if (
      permissions[STATUS.RESERVETOKEN][_token] ||
      permissions[STATUS.ASSET][_token]
    ) {
      uint256 value = assetValue(_token, _amount);
      if (useExcessReserves)
        require(int256(value) <= excessReserves(), insufficientReserves);

      totalReserves -= value;
    }
    IERC20(_token).safeTransfer(msg.sender, _amount);
    emit Managed(_token, _amount);
  }

  /**
   * @notice mint new REQ using excess reserves
   * @param _recipient address
   * @param _amount uint256
   */
  function mint(address _recipient, uint256 _amount) external override {
    require(permissions[STATUS.REWARDMANAGER][msg.sender], notApproved);
    if (useExcessReserves)
      require(int256(_amount) <= excessReserves(), insufficientReserves);

    REQ.mint(_recipient, _amount);
    emit Minted(msg.sender, _recipient, _amount);
  }

  /**
   * DEBT: The debt functions allow approved addresses to borrow treasury assets
   * or REQ from the treasury, using REQD as collateral. This might allow an
   * REQD holder to provide REQ liquidity without taking on the opportunity cost
   * of unstaking, or alter their backing without imposing risk onto the treasury.
   * Many of these use cases are yet to be defined, but they appear promising.
   * However, we urge the community to think critically and move slowly upon
   * proposals to acquire these permissions.
   */

  /**
   * @notice allow approved address to borrow reserves
   * @param _amount uint256
   * @param _token address
   */
  function incurDebt(uint256 _amount, address _token) external override {
    uint256 value;
    if (_token == address(REQ)) {
      require(permissions[STATUS.DEBTOR][msg.sender], notApproved);
      value = _amount;
    } else {
      require(permissions[STATUS.RESERVEDEBTOR][msg.sender], notApproved);
      require(permissions[STATUS.RESERVETOKEN][_token], notAccepted);
      value = assetValue(_token, _amount);
    }
    require(value != 0, invalidAsset);

    REQD.changeDebt(value, msg.sender, true);
    require(
      REQD.debtBalances(msg.sender) <= debtLimit[msg.sender],
      "Treasury: exceeds limit"
    );
    totalDebt += value;

    if (_token == address(REQ)) {
      REQ.mint(msg.sender, value);
      reqDebt += value;
    } else {
      totalReserves -= value;
      IERC20(_token).safeTransfer(msg.sender, _amount);
    }
    emit CreateDebt(msg.sender, _token, _amount, value);
  }

  /**
   * @notice allow approved address to repay borrowed reserves with reserves
   * @param _amount uint256
   * @param _token address
   */
  function repayDebtWithReserve(uint256 _amount, address _token)
    external
    override
  {
    require(permissions[STATUS.RESERVEDEBTOR][msg.sender], notApproved);
    require(permissions[STATUS.RESERVETOKEN][_token], notAccepted);
    IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
    uint256 value = assetValue(_token, _amount);
    REQD.changeDebt(value, msg.sender, false);
    totalDebt -= value;
    totalReserves += value;
    emit RepayDebt(msg.sender, _token, _amount, value);
  }

  /**
   * @notice allow approved address to repay borrowed reserves with REQ
   * @param _amount uint256
   */
  function repayDebtWithREQ(uint256 _amount) external {
    require(
      permissions[STATUS.RESERVEDEBTOR][msg.sender] ||
        permissions[STATUS.DEBTOR][msg.sender],
      notApproved
    );
    REQ.burnFrom(msg.sender, _amount);
    REQD.changeDebt(_amount, msg.sender, false);
    totalDebt -= _amount;
    reqDebt -= _amount;
    emit RepayDebt(msg.sender, address(REQ), _amount, _amount);
  }

  /* ========== MANAGERIAL FUNCTIONS ========== */

  /**
   * @notice takes inventory of all tracked assets
   * @notice always consolidate to recognized reserves before audit
   */
  function auditReserves() external onlyGovernor {
    uint256 reserves;
    address[] memory reserveToken = registry[STATUS.RESERVETOKEN];
    for (uint256 i = 0; i < reserveToken.length; i++) {
      if (permissions[STATUS.RESERVETOKEN][reserveToken[i]]) {
        reserves += assetValue(
          reserveToken[i],
          IERC20(reserveToken[i]).balanceOf(address(this))
        );
      }
    }
    address[] memory assets = registry[STATUS.ASSET];
    for (uint256 i = 0; i < assets.length; i++) {
      if (permissions[STATUS.ASSET][assets[i]]) {
        reserves += assetValue(
          assets[i],
          IERC20(assets[i]).balanceOf(address(this))
        );
      }
    }
    totalReserves = reserves;
    emit ReservesAudited(reserves);
  }

  /**
   * @notice set max debt for address
   * @param _address address
   * @param _limit uint256
   */
  function setDebtLimit(address _address, uint256 _limit)
    external
    onlyGovernor
  {
    debtLimit[_address] = _limit;
  }

  /**
   * @notice enable permission from queue
   * @param _status STATUS
   * @param _address address
   * @param _calculator address
   */
  function enable(
    STATUS _status,
    address _address,
    address _calculator
  ) external onlyGovernor {
    require(timelockEnabled == false, "Use queueTimelock");
    if (_status == STATUS.SREQ) {
      REQD = IREQDebt(_address);
    } else {
      permissions[_status][_address] = true;

      if (_status == STATUS.ASSET) {
        assetPricer[_address] = _calculator;
      }

      (bool registered, ) = indexInRegistry(_address, _status);
      if (!registered) {
        registry[_status].push(_address);

        if (_status == STATUS.ASSET || _status == STATUS.RESERVETOKEN) {
          (bool reg, uint256 index) = indexInRegistry(_address, _status);
          if (reg) {
            delete registry[_status][index];
          }
        }
      }
    }
    emit Permissioned(_address, _status, true);
  }

  /**
   *  @notice disable permission from address
   *  @param _status STATUS
   *  @param _toDisable address
   */
  function disable(STATUS _status, address _toDisable) external {
    require(
      msg.sender == authority.governor() || msg.sender == authority.guardian(),
      "Only governor or guardian"
    );
    permissions[_status][_toDisable] = false;
    emit Permissioned(_toDisable, _status, false);
  }

  /**
   * @notice check if registry contains address
   * @return (bool, uint256)
   */
  function indexInRegistry(address _address, STATUS _status)
    public
    view
    returns (bool, uint256)
  {
    address[] memory entries = registry[_status];
    for (uint256 i = 0; i < entries.length; i++) {
      if (_address == entries[i]) {
        return (true, i);
      }
    }
    return (false, 0);
  }

  /**
   * @notice changes the use of excess reserves for minting
   */
  function setUseExcessReserves() external onlyGovernor {
    useExcessReserves = !useExcessReserves;
  }

  /* ========== TIMELOCKED FUNCTIONS ========== */

  // functions are used prior to enabling on-chain governance

  /**
   * @notice queue address to receive permission
   * @param _status STATUS
   * @param _address address
   * @param _calculator address
   */
  function queueTimelock(
    STATUS _status,
    address _address,
    address _calculator
  ) external onlyGovernor {
    require(_address != address(0));
    require(timelockEnabled == true, "Timelock is disabled, use enable");

    uint256 timelock = block.number + blocksNeededForQueue;
    if (_status == STATUS.RESERVEMANAGER || _status == STATUS.ASSETMANAGER) {
      timelock = block.number + blocksNeededForQueue * 2;
    }
    permissionQueue.push(
      Queue({
        managing: _status,
        toPermit: _address,
        calculator: _calculator,
        timelockEnd: timelock,
        nullify: false,
        executed: false
      })
    );
    emit PermissionQueued(_status, _address);
  }

  /**
   *  @notice enable queued permission
   *  @param _index uint256
   */
  function execute(uint256 _index) external {
    require(timelockEnabled == true, "Timelock is disabled, use enable");

    Queue memory info = permissionQueue[_index];

    require(!info.nullify, "Action has been nullified");
    require(!info.executed, "Action has already been executed");
    require(block.number >= info.timelockEnd, "Timelock not complete");

    if (info.managing == STATUS.SREQ) {
      // 9
      REQD = IREQDebt(info.toPermit);
    } else {
      permissions[info.managing][info.toPermit] = true;

      if (info.managing == STATUS.ASSET) {
        assetPricer[info.toPermit] = info.calculator;
      }
      (bool registered, ) = indexInRegistry(info.toPermit, info.managing);
      if (!registered) {
        registry[info.managing].push(info.toPermit);

        if (info.managing == STATUS.ASSET) {
          (bool reg, uint256 index) = indexInRegistry(
            info.toPermit,
            STATUS.RESERVETOKEN
          );
          if (reg) {
            delete registry[STATUS.RESERVETOKEN][index];
          }
        } else if (info.managing == STATUS.RESERVETOKEN) {
          (bool reg, uint256 index) = indexInRegistry(
            info.toPermit,
            STATUS.ASSET
          );
          if (reg) {
            delete registry[STATUS.ASSET][index];
          }
        }
      }
    }
    permissionQueue[_index].executed = true;
    emit Permissioned(info.toPermit, info.managing, true);
  }

  /**
   * @notice cancel timelocked action
   * @param _index uint256
   */
  function nullify(uint256 _index) external onlyGovernor {
    permissionQueue[_index].nullify = true;
  }

  /**
   * @notice disables timelocked functions
   */
  function disableTimelock() external onlyGovernor {
    require(timelockEnabled == true, "timelock already disabled");
    if (
      onChainGovernanceTimelock != 0 &&
      onChainGovernanceTimelock <= block.number
    ) {
      timelockEnabled = false;
    } else {
      onChainGovernanceTimelock = block.number + blocksNeededForQueue * 7; // 7-day timelock
    }
  }

  /**
   * @notice enables timelocks after initilization
   */
  function initialize() external onlyGovernor {
    require(initialized == false, "Already initialized");
    timelockEnabled = true;
    initialized = true;
  }

  /* ========== VIEW FUNCTIONS ========== */

  /**
   * @notice returns excess reserves not backing tokens
   * @return uint
   */
  function excessReserves() public view returns (int256) {
    return int256(totalReserves) - int256(REQ.totalSupply() - totalDebt);
  }

  /**
   * @notice returns REQ valuation of asset
   * @param _token address
   * @param _amount uint256
   * @return value_ uint256
   */
  function assetValue(address _token, uint256 _amount)
    public
    view
    override
    returns (uint256 value_)
  {
    if (permissions[STATUS.ASSET][_token]) {
      value_ = IAssetPricer(assetPricer[_token]).valuation(_token, _amount);
    } else if (permissions[STATUS.RESERVETOKEN][_token]) {
      value_ =
        (_amount * (10**REQ.decimals())) /
        (10**IERC20Metadata(_token).decimals());
    } else {
      revert(invalidAsset);
    }
  }

  /**
   * @notice returns supply metric that cannot be manipulated by debt
   * @dev use this any time you need to query supply
   * @return uint256
   */
  function baseSupply() external view override returns (uint256) {
    return REQ.totalSupply() - reqDebt;
  }
}
