const { ethers } = require('hardhat')

// deployment script for pricers
async function main() {

    // addresses for inputs
    const reqAddress = '0xD27388BA6b3A44003A85E336e2Fd76d6e331EF87'
    const daiAddress = '0xaea51e4fee50a980928b4353e852797b54deacd8'
    const usdcAddress = '0xca9ec7085ed564154a9233e1e7d8fef460438eea'
    const usdtAddress = '0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e'

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()).toString());

    // We get the contract to deploy
    const RequiemPricer = await ethers.getContractFactory('RequiemPricer')
    const StablePoolPricer = await ethers.getContractFactory('StablePoolPricer')
    const TrivialPricer = await ethers.getContractFactory('TrivialPricer')
    const WeightedPairPricer = await ethers.getContractFactory('WeightedPairPricer')
    const WeightedPoolPricer = await ethers.getContractFactory('WeightedPoolPricer')

    const requiemPricer = await RequiemPricer.deploy(reqAddress)
    const stablePoolPricer = await StablePoolPricer.deploy(daiAddress)
    const trivialPricer = await TrivialPricer.deploy()
    const weightedPairPricer_usdc = await WeightedPairPricer.deploy(usdcAddress)
    const weightedPairPricer_dai = await WeightedPairPricer.deploy(daiAddress)
    const weightedPoolPricer = await WeightedPoolPricer.deploy(usdtAddress)

    console.log('requiemPricer:', requiemPricer.address)
    console.log('stablePoolPricer:', stablePoolPricer.address)
    console.log('trivialPricer:', trivialPricer.address)
    console.log('weightedPairPricer_usdc:', weightedPairPricer_usdc.address)
    console.log('weightedPairPricer_dai:', weightedPairPricer_dai.address)
    console.log('weightedPoolPricer:', weightedPoolPricer.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });