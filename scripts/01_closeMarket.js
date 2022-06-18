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

    // address of Diamon to upgrade
    const depoAddress = addresses.bondDepo[chainId]

    const bondDepositoryContract = new ethers.Contract(depoAddress, new ethers.utils.Interface(BondDepositoryABI.abi), operator)
    const markets = [5]

    for (let i = 0; i < markets.length; i++) {
        const market = markets[i]
        // create Bond
        const tx = await bondDepositoryContract.close(market)

        receipt = await tx.wait()

        // throw error in case of a failure
        if (!receipt.status) {
            throw Error(`Close of bond ${market} failed: ${tx.hash}`)
        } else {
            console.log(`Close of ${market} succeeded`)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });