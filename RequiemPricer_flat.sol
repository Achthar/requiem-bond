
// File: contracts/interfaces/IWeightedPair.sol



pragma solidity ^0.8.14;

// solhint-disable func-name-mixedcase

interface IWeightedPair {
  struct ReserveData {
    uint256 reserve0;
    uint256 reserve1;
    uint256 vReserve0;
    uint256 vReserve1;
  }

  function totalSupply() external view returns (uint256);

  function token0() external view returns (address);

  function token1() external view returns (address);

  function getReserves()
    external
    view
    returns (ReserveData calldata reserveData);

  function getParameters()
    external
    view
    returns (
      uint32 _tokenWeight0,
      uint32 _tokenWeight1,
      uint32 _swapFee,
      uint32 _amp
    );
}

// File: contracts/interfaces/ERC20/IERC20.sol


pragma solidity 0.8.14;

interface IERC20 {
    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}
// File: contracts/interfaces/ISwap.sol



pragma solidity ^0.8.14;


interface ISwap {
  function calculateSwapGivenIn(
    address tokenIn,
    address tokenOut,
    uint256 amountIn
  ) external view returns (uint256);

  function getTokenBalances() external view returns (uint256[] memory);

  function getPooledTokens() external view returns (IERC20[] memory);

  function getTokenMultipliers() external view returns (uint256[] memory);
}

// File: contracts/interfaces/IAssetPricer.sol


pragma solidity ^0.8.14;

interface IAssetPricer {
    function valuation(
        address _asset,
        address _quote,
        uint256 _amount
    ) external view returns (uint256);

    function slashedValuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view returns (uint256);
}

// File: contracts/pricers/RequiemPricer.sol



pragma solidity 0.8.14;





// solhint-disable  max-line-length

/**
 * Bonding calculator for weighted pairs where one token is REQ
 * and the other a stable asset
 */
contract RequiemPricer is IAssetPricer {
    address public immutable REQ;

    constructor(address _REQ) {
        require(_REQ != address(0));
        REQ = _REQ;
    }

    /**
     * @notice regular fair value pricer - calculates value denominated in quote for pair
     * @param _pair pair that includes requiem token
     */
    function getTotalValue(address _pair, address _quote) public view returns (uint256 _value) {
        IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair).getReserves();
        (uint32 weight0, uint32 weight1, , ) = IWeightedPair(_pair).getParameters();
        if (_quote == IWeightedPair(_pair).token0()) {
            _value = pairData.reserve0 + (pairData.vReserve0 * weight1 * pairData.reserve1) / (weight0 * pairData.vReserve1);
        } else {
            _value = pairData.reserve1 + (pairData.vReserve1 * weight0 * pairData.reserve0) / (weight1 * pairData.vReserve0);
        }
        // standardize to 18 decimals
        _value *= 10**(18 - IERC20(_quote).decimals());
    }

    /**
     * - calculates the value in reqt of the input LP amount provided
     * @param _pair general pair that has the RequiemSwap interface implemented
     * @param _amount the amount of LP to price in REQ
     *  - is consistent with the uniswapV2-type case
     */
    function valuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256 _value) {
        uint256 totalValue = getTotalValue(_pair, _quote);
        uint256 totalSupply = IWeightedPair(_pair).totalSupply();
        _value = (totalValue * _amount) / totalSupply;
    }

    /**
     * @notice Marks down valuation of REQ pair - totalValue > totalDoiscountedValue
     * @dev Pairs or pools that contain REQ need to be marketd down when priced by the issuer of REQ
     * @param _pair pair that includes requiem token
     */
    function getTotalSlashedValue(address _pair, address) public view returns (uint256 _value) {
        IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair).getReserves();

        uint256 quoteMultiplier = 10**(18 - IERC20(IWeightedPair(_pair).token1()).decimals());

        if (REQ == IWeightedPair(_pair).token1()) {
            _value = pairData.reserve0 * quoteMultiplier + pairData.reserve1;
        } else {
            _value = pairData.reserve1 * quoteMultiplier + pairData.reserve0;
        }
    }

    /**
     * @notice Calculates a risk adjusted value of the asset for treasury audits
     */
    function slashedValuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256 _value) {
        uint256 totalValue = getTotalSlashedValue(_pair, _quote);
        uint256 totalSupply = IWeightedPair(_pair).totalSupply();

        _value = (totalValue * _amount) / totalSupply;
    }
}
