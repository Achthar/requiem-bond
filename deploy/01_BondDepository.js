const { ethers } = require('hardhat')

// deployment script for bond depository
async function main() {

    // input addresses
    const reqAddress = '0xD27388BA6b3A44003A85E336e2Fd76d6e331EF87'
    const diamondAddress = '0xb3f4bCb8f30E70763c0Cf100a01252b81D23D9ec'

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()).toString());

    // We get the contract to deploy
    const BondDepository = await ethers.getContractFactory('BondDepository')

    // deploy the depo
    const depository = await BondDepository.deploy(reqAddress, diamondAddress)

    console.log("Depos", depository.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });