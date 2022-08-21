// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../interfaces/IAssetPricer.sol";
import "../interfaces/ERC20/IERC20.sol";

/**
 * Pricer for normalization
 */
contract TrivialPricer is IAssetPricer {
    constructor() {}

    /**
     * note Normalizes total asset value to 18 decimals
     * @param _asset asset to normalize
     */
    function getTotalValue(address _asset) public view returns (uint256 _value) {
        _value = IERC20(_asset).totalSupply() * 10**(18 - IERC20(_asset).decimals());
    }

    /**
     * @notice Normalizes the input - designed for stablecoin assets
     * @param _asset assumed to be the quote
     * @param _amount the amount
     * @return _value normalzed value
     */
    function valuation(
        address _asset,
        address,
        uint256 _amount
    ) external view override returns (uint256 _value) {
        _value = _amount * 10**(18 - IERC20(_asset).decimals());
    }

    /**
     * @notice Normalizes the input - designed for stablecoin assets
     * @param _asset assumed to be the quote
     * @param _amount the amount
     * @return _value normalzed value
     */
    function slashedValuation(
        address _asset,
        address,
        uint256 _amount
    ) external view override returns (uint256 _value) {
        _value = _amount * 10**(18 - IERC20(_asset).decimals());
    }
}
