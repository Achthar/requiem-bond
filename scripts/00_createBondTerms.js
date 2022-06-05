/* global ethers */
/* eslint prefer-const: "off" */

const { ethers } = require('hardhat')

const BondDepositoryABI = require('../artifacts/contracts/BondDepository.sol/BondDepository.json')
const { addresses } = require('../deployments/addresses')

const one18 = ethers.BigNumber.from(10).pow(18)

// script for creating a bond using the depository contract
// it is assumed that the treasury provided the depository with the respective rights
// pricers for the bonds should be added in the treasury already
async function main() {
    const [operator] = await ethers.getSigners();
    const chainId = await operator.getChainId()

    const assetAddress = addresses.assets.PAIR_AVAX_USDC[chainId]

    const bondDepositoryContract = new ethers.Contract(addresses.bondDepo[chainId], new ethers.utils.Interface(BondDepositoryABI.abi), operator)


    // parameters
    const capacity = ethers.BigNumber.from(1000000).mul(one18);
    const initialPrice = ethers.BigNumber.from(975).mul(one18).div(100);
    const buffer = 2e5;

    const vesting = 60 * 60 * 24 * 7;
    const timeToConclusion = 60 * 60 * 24 * 60;
    const block = await ethers.provider.getBlock("latest");
    const conclusion = block.timestamp + timeToConclusion;
    const capacityInQuote = false
    const fixedTerm = true
    const depositInterval = 60 * 60 * 24;
    const tuneInterval = 60 * 60 * 24;

    console.log("Create market for", assetAddress)

    // create Bond
    const tx = await bondDepositoryContract.create(
        assetAddress,
        [capacity, initialPrice, buffer],
        [capacityInQuote, fixedTerm],
        [vesting, conclusion],
        [depositInterval, tuneInterval]
    )

    receipt = await tx.wait()

    // throw error in case of a failure
    if (!receipt.status) {
        throw Error(`Creation of bond failed: ${tx.hash}`)
    } else {
        console.log("Creation succeeded")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });