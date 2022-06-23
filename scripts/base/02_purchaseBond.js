/* global ethers */
/* eslint prefer-const: "off" */

const { ethers } = require('hardhat')

const BondDepositoryArtifact = require('../../artifacts/contracts/BondDepository.sol/BondDepository.json')
const ERC20Artifact = require('../../artifacts/contracts/mocks/ERC20.sol/ERC20.json')
const { addresses } = require('../../deployments/addresses')

const one18 = ethers.BigNumber.from(10).pow(18)

// script for creating a bond using the depository contract
// it is assumed that the treasury provided the depository with the respective rights
// pricers for the bonds should be added in the treasury already
async function main() {
    const [operator] = await ethers.getSigners();
    const chainId = await operator.getChainId()

    // deposit parameters
    const amount = one18.mul(1).div(10000)
    const market = 4

    const bondDepositoryContract = new ethers.Contract(addresses.bondDepo[chainId], new ethers.utils.Interface(BondDepositoryArtifact.abi), operator)


    const selectedMarket = await bondDepositoryContract.markets(market)

    const asset = selectedMarket.asset
    console.log("Depositing amount", ethers.utils.formatEther(amount), "of asset", asset)

    const assetContract = new ethers.Contract(asset, new ethers.utils.Interface(ERC20Artifact.abi), operator)

    const bal = await assetContract.balanceOf(operator.address)
    console.log("Balance", ethers.utils.formatEther(bal))
    const allowance = await assetContract.allowance(operator.address, bondDepositoryContract.address)

    if (allowance.lt(amount)) {
        await assetContract.approve(bondDepositoryContract.address, ethers.constants.MaxUint256)
    }

    console.log("Allowance checked")

    setTimeout(() => { console.log("Waiting done"); }, 10000);

    // create Bond
    const tx = await bondDepositoryContract.deposit(
        market,
        amount,
        ethers.constants.MaxUint256,
        operator.address,
        ethers.constants.AddressZero
    )

    receipt = await tx.wait()

    // throw error in case of a failure
    if (!receipt.status) {
        throw Error(`Deposit of bond failed: ${tx.hash}`)
    } else {
        console.log("Deposit succeeded")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });