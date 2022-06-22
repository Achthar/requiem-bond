// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.15;

interface IUserTermsKeeper {
    // Info for market note
    struct UserTerms {
        int256 cryptoIntitialPrice; // reference price at opening
        int256 cryptoClosingPrice; // closing price of position
        uint256 payout; // REQ remaining to be paid
        uint48 created; // time market was created
        uint48 matured; // time of instrument maturity
        uint48 redeemed; // time notional was redeemed
        uint48 exercised; // time instrument was exercised
        uint48 marketID; // market ID of deposit. uint48 to avoid adding a slot.
    }

    function pushTerms(address to, uint256 index) external;

    function pullTerms(address from, uint256 index) external returns (uint256 newIndex_);

    function indexesFor(address _user) external view returns (uint256[] memory);

    function pendingFor(address _user, uint256 _index)
        external
        view
        returns (
            uint256 payout_,
            bool matured_,
            bool payoffClaimable_
        );
}
