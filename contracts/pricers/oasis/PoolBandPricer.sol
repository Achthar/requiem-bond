// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../../interfaces/oracles/IStdReference.sol";
import "../../libraries/Ownable.sol";
import "../../interfaces/IAssetPricer.sol";
import "../../interfaces/ERC20/IERC20.sol";
import "../../libraries/math/FixedPoint.sol";
import "../../interfaces/ISwap.sol";

// solhint-disable  max-line-length

/**
 * Bonding calculator for general pools using band oracles
 */
contract PoolBandPricer is IAssetPricer, Ownable {
    using FixedPoint for *;

    mapping(address => string) public bases;
    mapping(address => string) public quotes;
    uint256 public constant MULTIPLIER = 1e18;
    IStdReference public ref;

    constructor(address _ref) Ownable() {
        ref = IStdReference(_ref);
    }

    /**
     * @notice standard pair valuation tusing the pool price
     * @param _baseAddress address of base token / coin
     * @param _quoteAddress address of quote token/ coin
     * @param _baseString string key for base
     * @param _quoteString string key for quote
     */
    function pushPair(
        address _baseAddress,
        address _quoteAddress,
        string memory _baseString,
        string memory _quoteString
    ) public onlyOwner {
        bases[_baseAddress] = _baseString;
        quotes[_quoteAddress] = _quoteString;
    }

    /**
     * @notice calculates the liquidity value denominated in the provided quote token using the band oracle
     * note that we never use the actual LP as input as the swap contains the LP address
     * and is also used to extract the balances
     */
    function getTotalValue(address _lpAddress, address _quote) public view returns (uint256 _value) {
        ISwap swap = ISwap(_lpAddress);
        IERC20[] memory tokens = swap.getPooledTokens();
        uint256[] memory reserves = swap.getTokenBalances();
        for (uint8 i = 0; i < reserves.length; i++) {
            address tokenAddr = address(tokens[i]);
            if (tokenAddr != _quote) {
                uint256 oraclePrice = ref.getReferenceData(bases[tokenAddr], quotes[_quote]).rate;
                _value += (reserves[i] * 10**(18 - IERC20(tokenAddr).decimals()) * oraclePrice) / MULTIPLIER;
            } else {
                _value += reserves[i] * 10**(18 - IERC20(_quote).decimals());
            }
        }
    }

    function valuation(
        address _lpAddress,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_lpAddress, _quote, _amount);
    }

    function slashedValuation(
        address _lpAddress,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_lpAddress, _quote, _amount);
    }

    function _valuation(
        address _lpAddress,
        address _quote,
        uint256 _amount
    ) internal view returns (uint256 _value) {
        uint256 totalValue = getTotalValue(_lpAddress, _quote);
        uint256 totalSupply = IERC20(_lpAddress).totalSupply();
        _value = (totalValue * FixedPoint.fraction(_amount, totalSupply).decode112with18()) / MULTIPLIER;
    }
}
