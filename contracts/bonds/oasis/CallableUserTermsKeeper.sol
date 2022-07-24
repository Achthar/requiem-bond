// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "../../libraries/types/FrontEndRewarder.sol";
import "./BandPriceConsumer.sol";
import "../../interfaces/ITreasury.sol";
import "../../interfaces/Callable/IUserTermsKeeper.sol";

// solhint-disable max-line-length

abstract contract CallableUserTermsKeeper is IUserTermsKeeper, FrontEndRewarder, BandPriceConsumer {
    mapping(address => UserTerms[]) public userTerms; // user deposit data
    mapping(address => mapping(uint256 => address)) private noteTransfers; // change note ownership

    ITreasury internal treasury;

    constructor(
        IERC20 _req,
        address _treasury,
        address _oracle
    ) FrontEndRewarder(IAuthority(_treasury), _req) BandPriceConsumer(IStdReference(_oracle)) {
        treasury = ITreasury(_treasury);
    }

    // if treasury address changes on authority, update it
    function updateTreasury() external {
        require(msg.sender == authority.governor() || msg.sender == authority.guardian() || msg.sender == authority.policy(), "Only authorized");
        treasury = ITreasury(authority.vault());
    }

    /* ========== ADD ========== */

    /**
     * @notice             adds a new Terms for a user, stores the front end & DAO rewards, and mints & stakes payout & rewards
     * @param _user        the user that owns the Terms
     * @param _payout      the amount of REQ due to the user
     * @param _expiry      the timestamp when the Terms is redeemable
     * @param _marketID    the ID of the market deposited into
     * @return index_      the index of the Terms in the user's array
     */
    function addTerms(
        address _user,
        string memory _underlying,
        string memory _quote,
        uint256 _payout,
        uint48 _expiry,
        uint48 _marketID,
        address _referral
    ) internal returns (uint256 index_, int256 _fetchedPrice) {
        // the index of the note is the next in the user's array
        index_ = userTerms[_user].length;

        _fetchedPrice = int256(getPrice(_underlying, _quote).rate);

        // the new note is pushed to the user's array
        userTerms[_user].push(
            UserTerms({
                payout: _payout,
                cryptoIntitialPrice: _fetchedPrice,
                cryptoClosingPrice: 0,
                created: uint48(block.timestamp),
                matured: _expiry,
                exercised: 0,
                marketID: _marketID
            })
        );

        // front end operators can earn rewards by referring users
        uint256 rewards = _giveRewards(_payout, _referral);

        // mint payout and rewards
        treasury.mint(address(this), _payout + rewards);
    }

    /* ========== TRANSFER ========== */

    /**
     * @notice             approve an address to transfer a note
     * @param _to          address to approve note transfer for
     * @param _index       index of note to approve transfer for
     */
    function pushTerms(address _to, uint256 _index) external override {
        require(userTerms[msg.sender][_index].created != 0, "Depository: note not found");
        noteTransfers[msg.sender][_index] = _to;
    }

    /**
     * @notice             transfer a note that has been approved by an address
     * @param _from        the address that approved the note transfer
     * @param _index       the index of the note to transfer (in the sender's array)
     */
    function pullTerms(address _from, uint256 _index) external override returns (uint256 newIndex_) {
        require(noteTransfers[_from][_index] == msg.sender, "Depository: transfer not found");
        require(userTerms[_from][_index].exercised == 0, "Depository: note exercised");

        newIndex_ = userTerms[msg.sender].length;
        userTerms[msg.sender].push(userTerms[_from][_index]);

        delete userTerms[_from][_index];
    }

    /* ========== VIEW ========== */

    // Terms info

    /**
     * @notice             all pending userTerms for user
     * @param _user        the user to query userTerms for
     * @return             the pending userTerms for the user
     */
    function indexesFor(address _user) public view override returns (uint256[] memory) {
        UserTerms[] memory info = userTerms[_user];

        uint256 length;
        for (uint256 i = 0; i < info.length; i++) {
            if (info[i].exercised == 0 && info[i].payout != 0) length++;
        }

        uint256[] memory indexes = new uint256[](length);
        uint256 position;

        for (uint256 i = 0; i < info.length; i++) {
            if (info[i].exercised == 0 && info[i].payout != 0) {
                indexes[position] = i;
                position++;
            }
        }

        return indexes;
    }
}
