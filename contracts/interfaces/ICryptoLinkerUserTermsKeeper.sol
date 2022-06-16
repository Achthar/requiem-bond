// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.15;

interface ICryptoLinkerUserTermsKeeper {
    // Info for market note
    struct UserTerms {
        uint256 cryptoIntitialPrice; // reference price at opening
        uint256 cryptoClosingPrice; // closing price of position
        uint256 baseNotional; // notional base in REQ
        uint256 bondPrice;
        uint48 created; // time market was created
        uint48 matured; // timestamp when market is matured
        uint48 redeemed; // time market was redeemed
        uint48 exercised; // time instrument was exercised
        uint48 marketId; // market ID of deposit. uint48 to avoid adding a slot.
    }

    function exercise(
        address _user,
        uint256[] memory _indexes
    ) external returns (uint256);

    function exerciseAll(address _user) external returns (uint256);
 
    function pushTerms(address to, uint256 index) external;

    function pullTerms(address from, uint256 index) external returns (uint256 newIndex_);

    function indexesFor(address _user) external view returns (uint256[] memory);

    function pendingFor(address _user, uint256 _index) external view returns (uint256 payout_, bool matured_);
}
