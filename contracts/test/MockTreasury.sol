// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.14;

import "../libraries/Initializable.sol";
import "../libraries/Ownable.sol";

import "../libraries/SafeERC20.sol";
import "../interfaces/IOwnable.sol";
import "../interfaces/ERC20/IERC20.sol";
import "../interfaces/ERC20/IERC20Metadata.sol";
import "../interfaces/IREQ.sol";
import "../interfaces/ICreditREQ.sol";
import "../interfaces/IAssetPricer.sol";
import "../interfaces/ITreasury.sol";
import "../libraries/types/AccessControlled.sol";

contract MockTreasury is Initializable, Ownable, AccessControlled, ITreasury {
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
  event PermissionQueued(uint256 indexed status, address queued);
  event Permissioned(address addr, uint256 indexed status, bool result);

  /* ========== DATA STRUCTURES ========== */

  // enum STATUS {
  //     ASSETDEPOSITOR, =0
  //     ASSET, = 1
  //     ASSETMANAGER, = 2
  //     REWARDMANAGER, = 3
  //     DEBTMANAGER, = 4
  //     DEBTOR, = 5
  //     COLLATERAL, = 6
  //     CREQ = 7
  // }

  struct Queue {
    uint256 managing;
    address toPermit;
    address calculator;
    uint256 timelockEnd;
    bool nullify;
    bool executed;
  }

  /* ========== STATE VARIABLES ========== */

  IREQ public REQ;
  ICreditREQ public CREQ;

  mapping(uint256 => address[]) public registry;
  mapping(uint256 => mapping(address => bool)) public permissions;
  mapping(address => address) public assetPricer;
  mapping(address => uint256) debtLimits;

  // asset data
  mapping(address => uint256) assetReserves;
  mapping(address => uint256) assetDebt;

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

  /**
   * @notice allow approved address to deposit an asset for REQ
   * @param _amount uint256
   * @param _asset address
   * @param _profit uint256
   * @return send_ uint256
   */
  function deposit(
    uint256 _amount,
    address _asset,
    uint256 _profit
  ) external override returns (uint256 send_) {
    if (permissions[1][_asset]) {
      require(permissions[0][msg.sender], "Treasury: not approved");
    } else {
      revert("Treasury: invalid asset");
    }

    IERC20(_asset).safeTransferFrom(msg.sender, address(this), _amount);

    uint256 value = assetValue(_asset, _amount);
    // mint needed and store amount of rewards for distribution
    send_ = value - _profit;
    REQ.mint(msg.sender, send_);

    totalReserves += value;

    emit Deposit(_asset, _amount, value);
  }

  /**
   * @notice allow approved address to burn REQ for reserves
   * @param _amount uint256
   * @param _asset address
   */
  function withdraw(uint256 _amount, address _asset) external override {
    require(permissions[1][_asset], "Treasury: not accepted");
    require(permissions[2][msg.sender], "Treasury: not approved");

    uint256 value = assetValue(_asset, _amount);
    REQ.burnFrom(msg.sender, value);

    totalReserves -= value;

    IERC20(_asset).safeTransfer(msg.sender, _amount);

    emit Withdrawal(_asset, _amount, value);
  }

  /**
   * @notice allow approved address to withdraw assets
   * @param _asset address
   * @param _amount uint256
   */
  function manage(address _asset, uint256 _amount) external override {
    require(permissions[2][msg.sender], "Treasury: not approved");

    if (permissions[1][_asset]) {
      uint256 value = assetValue(_asset, _amount);
      if (useExcessReserves)
        require(
          int256(value) <= excessReserves(),
          "Treasury: insufficient reserves"
        );

      totalReserves -= value;
    }
    IERC20(_asset).safeTransfer(msg.sender, _amount);
    emit Managed(_asset, _amount);
  }

  /**
   * @notice mint new REQ using excess reserves
   * @param _recipient address
   * @param _amount uint256
   */
  function mint(address _recipient, uint256 _amount) external override {
    require(permissions[3][msg.sender], "Treasury: not approved");
    if (useExcessReserves)
      require(
        int256(_amount) <= excessReserves(),
        "Treasury: insufficient reserves"
      );

    REQ.mint(_recipient, _amount);
    emit Minted(msg.sender, _recipient, _amount);
  }

  /**
   * DEBT: The debt functions allow approved addresses to borrow treasury assets
   * or REQ from the treasury, using sREQ as collateral. This might allow an
   * sREQ holder to provide REQ liquidity without taking on the opportunity cost
   * of unstaking, or alter their backing without imposing risk onto the treasury.
   * Many of these use cases are yet to be defined, but they appear promising.
   * However, we urge the community to think critically and move slowly upon
   * proposals to acquire these permissions.
   */

  /**
   * @notice allow approved address to borrow reserves
   * @param _amount uint256
   * @param _asset address
   */
  function incurDebt(uint256 _amount, address _asset) external override {
    uint256 value;
    require(permissions[5][msg.sender], "Treasury: not approved");

    if (_asset == address(REQ)) {
      value = _amount;
    } else {
      value = assetValue(_asset, _amount);
    }
    require(value != 0, "Treasury: invalid asset");

    CREQ.changeDebt(value, msg.sender, true);
    require(
      CREQ.debtBalances(msg.sender) <= debtLimits[msg.sender],
      "Treasury: exceeds limit"
    );
    totalDebt += value;

    if (_asset == address(REQ)) {
      REQ.mint(msg.sender, value);
      reqDebt += value;
    } else {
      totalReserves -= value;
      IERC20(_asset).safeTransfer(msg.sender, _amount);
    }
    emit CreateDebt(msg.sender, _asset, _amount, value);
  }

  /**
   * @notice allow approved address to repay borrowed reserves with reserves
   * @param _amount uint256
   * @param _asset address
   */
  function repayDebtWithReserve(uint256 _amount, address _asset)
    external
    override
  {
    require(permissions[5][msg.sender], "Treasury: not approved");
    require(permissions[1][_asset], "Treasury: not accepted");
    IERC20(_asset).safeTransferFrom(msg.sender, address(this), _amount);
    uint256 value = assetValue(_asset, _amount);
    CREQ.changeDebt(value, msg.sender, false);
    totalDebt -= value;
    totalReserves += value;
    emit RepayDebt(msg.sender, _asset, _amount, value);
  }

  /**
   * @notice allow approved address to repay borrowed reserves with REQ
   * @param _amount uint256
   */
  function repayDebtWithREQ(uint256 _amount) external {
    require(permissions[5][msg.sender], "Treasury: not approved");
    REQ.burnFrom(msg.sender, _amount);
    CREQ.changeDebt(_amount, msg.sender, false);
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
    address[] memory assets = registry[1];
    for (uint256 i = 0; i < assets.length; i++) {
      if (permissions[1][assets[i]]) {
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
    debtLimits[_address] = _limit;
  }

  /**
   * @notice enable permission from queue
   * @param _status uint256
   * @param _address address
   * @param _calculator address
   */
  function enable(
    uint256 _status,
    address _address,
    address _calculator
  ) external {
    require(!timelockEnabled, "Use queueTimelock");
    if (_status == 7) {
      CREQ = ICreditREQ(_address);
    } else {
      permissions[_status][_address] = true;

      if (_status == 1) {
        assetPricer[_address] = _calculator;
      }

      (bool registered, ) = indexInRegistry(_address, _status);
      if (!registered) {
        registry[_status].push(_address);

        if (_status == 1) {
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
  function disable(uint256 _status, address _toDisable) external {
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
  function indexInRegistry(address _address, uint256 _status)
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
  function setUseExcessReserves() external {
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
    uint256 _status,
    address _address,
    address _calculator
  ) external onlyGovernor {
    require(_address != address(0));
    require(timelockEnabled, "Timelock is disabled, use enable");
    uint256 timelock = block.number + blocksNeededForQueue;
    if (_status == 2) {
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

    if (info.managing == 7) {
      CREQ = ICreditREQ(info.toPermit);
    } else {
      permissions[info.managing][info.toPermit] = true;

      if (info.managing == 1) {
        assetPricer[info.toPermit] = info.calculator;
      }
      (bool registered, ) = indexInRegistry(info.toPermit, info.managing);
      if (!registered) {
        registry[info.managing].push(info.toPermit);

        if (info.managing == 1) {
          (bool reg, uint256 index) = indexInRegistry(info.toPermit, 1);
          if (reg) {
            delete registry[1][index];
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
    require(timelockEnabled, "timelock already disabled");
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
  function enableTimelock(uint256 _blocksNeededForQueue) external onlyGovernor {
    require(!timelockEnabled, "timelock already enabled");
    timelockEnabled = true;
    blocksNeededForQueue = _blocksNeededForQueue;
  }

  /* ========== VIEW FUNCTIONS ========== */

  /**
   * @notice returns excess reserves not backing assets
   * @return int
   */
  function excessReserves() public view returns (int256) {
    return int256(totalReserves) - int256(REQ.totalSupply() - totalDebt);
  }

  /**
   * @notice returns REQ valuation of asset
   * @param _asset address
   * @param _amount uint256
   * @return value_ uint256
   */
  function assetValue(address _asset, uint256 _amount)
    public
    view
    override
    returns (uint256 value_)
  {
    if (permissions[1][_asset]) {
      value_ = IAssetPricer(assetPricer[_asset]).valuation(_asset, _amount);
    } else {
      revert("Treasury: invalid asset");
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
