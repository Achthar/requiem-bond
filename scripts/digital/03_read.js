/* global ethers */
/* eslint prefer-const: "off" */

const { ethers } = require('hardhat')

const BondDepositoryABI = require('../../artifacts/contracts/DigitalCallBondDepository.sol/DigitalCallBondDepository.json')
const { addresses } = require('../../deployments/addresses')

const one18 = ethers.BigNumber.from(10).pow(18)

// script for creating a bond using the depository contract
// it is assumed that the treasury provided the depository with the respective rights
// pricers for the bonds should be added in the treasury already
async function main() {
    const [operator] = await ethers.getSigners();
    const chainId = await operator.getChainId()

    const assetAddress = addresses.assets.STABLELP[chainId]

    const bondDepositoryContract = new ethers.Contract(addresses.digitalCallBondDepo[chainId], new ethers.utils.Interface(BondDepositoryABI.abi), operator)
    console.log("============= Data ===============")
    const markets = await bondDepositoryContract.liveMarkets()
    console.log("liveMarkets: ", markets)
    for (let i = 0; i < markets.length; i++) {
        const price = await bondDepositoryContract.marketPrice(markets[i])
        console.log("marketPrice", i, ":", ethers.utils.formatEther(price))

    }

    console.log("============= Data ===============")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });