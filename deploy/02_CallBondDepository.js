const { ethers } = require('hardhat')
const { addresses } = require('../deployments/addresses')

// deployment script for bond depository
async function main() {
    const [operator] = await ethers.getSigners();
    const chainId = await operator.getChainId()

    console.log("Deploying contracts with the account:", operator.address);

    console.log("Account balance:", ethers.utils.formatEther(await operator.getBalance()).toString());

    // We get the contract to deploy
    const BondDepository = await ethers.getContractFactory('CallBondDepository')

    // deploy the depo
    const depository = await BondDepository.deploy(addresses.reqAddress[chainId], addresses.diamondAddress[chainId])

    console.log("Depos", depository.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });