// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../../interfaces/oracles/IStdReference.sol";
import "../../libraries/Ownable.sol";
import "../../interfaces/IAssetPricer.sol";
import "../../interfaces/ERC20/IERC20.sol";
import "../../interfaces/IWeightedPair.sol";

// solhint-disable  max-line-length

/**
 * Bonding calculator for weighted pairs
 */
contract WeightedPairBandPricer is IAssetPricer, Ownable {
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
     * @notice standard pair valuation tusing the pool price
     * @param _pair general pair that has the RequiemSwap interface implemented
     */
    function getTotalValue(address _pair, address _quote) public view returns (uint256 _value) {
        IWeightedPair.ReserveData memory pairData = IWeightedPair(_pair).getReserves();
        address _token0 = IWeightedPair(_pair).token0();
        address _token1 = IWeightedPair(_pair).token1();

        if (_quote == _token0) {
            uint256 oraclePrice = ref.getReferenceData(bases[_token1], quotes[_token0]).rate;
            _value =
                (pairData.reserve1 * 10**(18 - IERC20(_token1).decimals()) * oraclePrice) /
                MULTIPLIER +
                pairData.reserve0 *
                10**(18 - IERC20(_quote).decimals());
        } else {
            uint256 oraclePrice = ref.getReferenceData(bases[_token0], quotes[_token1]).rate;
            _value =
                (pairData.reserve0 * 10**(18 - IERC20(_token0).decimals()) * oraclePrice) /
                MULTIPLIER +
                pairData.reserve1 *
                10**(18 - IERC20(_quote).decimals());
        }
    }

    /**
     * @notice Calculates the value in QUOTE
     * @param _pair general pair that has the RequiemSwap interface implemented
     * @param _amount the amount of LP to price for the backing
     */
    function valuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_pair, _quote, _amount);
    }

    /**
     * @notice same as valuation as REQ is not expected to be in the pair
     * @param _pair general pair that has the RequiemSwap interface implemented
     * @param _amount the amount of LP to price for the backing
     */
    function slashedValuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) external view override returns (uint256) {
        return _valuation(_pair, _quote, _amount);
    }

    function _valuation(
        address _pair,
        address _quote,
        uint256 _amount
    ) internal view returns (uint256 _value) {
        uint256 totalValue = getTotalValue(_pair, _quote);
        uint256 totalSupply = IWeightedPair(_pair).totalSupply();

        _value = (totalValue * _amount) / totalSupply;
    }
}
