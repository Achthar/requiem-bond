// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "../interfaces/IAssetPricer.sol";
import "../interfaces/ERC20/IERC20.sol";

/**
 * Pricer returning
 */
contract TrivialPricer is IAssetPricer {
  constructor() {}

  /**
   * note normalizes asset value to 18 decimals
   * @param _asset pair that includes requiem token
   *  - the value of the requiem reserve is assumed at 1 unit of quote
   *  - is consistent with the uniswapV2-type case
   */
  function getTotalValue(address _asset) public view returns (uint256 _value) {
    _value =
      IERC20(_asset).totalSupply() *
      10**(18 - IERC20(_asset).decimals());
  }

  /**
   * - calculates the value in reqt of the input LP amount provided
   * @param _asset general pair that has the RequiemSwap interface implemented
   * @param _amount the amount of LP to price in REQ
   *  - is consistent with the uniswapV2-type case
   */
  function valuation(address _asset, uint256 _amount)
    external
    view
    override
    returns (uint256 _value)
  {
    _value = _amount * 10**(18 - IERC20(_asset).decimals());
  }

  // markdown function for bond valuation
  function markdown(address _asset) external view returns (uint256) {
    return getTotalValue(_asset);
  }
}
