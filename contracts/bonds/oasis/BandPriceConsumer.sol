// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "../../interfaces/oracles/IStdReference.sol";

// solhint-disable  max-line-length

contract BandPriceConsumer {
    IStdReference ref;

    constructor(IStdReference _ref) {
        ref = _ref;
    }

    function getPrice(string memory _asset, string memory _quote) public view returns (IStdReference.ReferenceData memory _data) {
        _data = ref.getReferenceData(_asset, _quote);
    }

}
