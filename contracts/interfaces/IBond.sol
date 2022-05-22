// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

interface IBond {
    function redeem( address _recipient, bool _stake ) external returns ( uint );
    function pendingPayoutFor( address _depositor ) external view returns ( uint pendingPayout_ );
}
