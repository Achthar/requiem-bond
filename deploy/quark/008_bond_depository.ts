import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers, waffle } from 'hardhat';

// const { solidity } = 'ethereum-waffle'
// const { expect } = 'chai'
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from 'ethers/lib/utils';
import { expandDecimals } from "../../test/ts/shared/utilities";
import { BigNumber } from "ethers";
import { toNormalizedWeights } from "../resources/normalizedWeights"
import { MONTH } from '../resources/time';
import { fp } from "../resources/numbers"
import { constants } from 'ethers';
import { Console } from 'console';
// import { deploy, deployedAt } from "./contract";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, execute, get } = deployments;
	const { deployer, user } = await getNamedAccounts();

	// console.log('network', network);
	console.log('deployer', deployer);
	console.log('2ndParty', user);
	const provider = waffle.provider;
	const balance0ETH = await provider.getBalance(deployer);
	console.log('deployer balante', balance0ETH);


	const deadline = Math.floor(Date.now() / 1000 + 7200);

	const pairreqtT_DAI = '0xcde9f3be9786e91b3b309bcf5f6de69c9ea8739c'

	console.log("get stables contracts")
	console.log("usdc")
	const usdc = await ethers.getContractAt('MockERC20', '0xca9ec7085ed564154a9233e1e7d8fef460438eea');
	console.log("usdt")
	const usdt = await ethers.getContractAt('MockERC20', '0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e');
	console.log("dai")
	const dai = await ethers.getContractAt('MockERC20', '0xaea51e4fee50a980928b4353e852797b54deacd8');
	console.log("tusd")
	const tusd = await ethers.getContractAt('MockERC20', '0xccf7ed44c5a0f3cb5c9a9b9f765f8d836fb93ba1');


	const reqtAddress = '0x2d90e6d9368b2838a9558B0a609750243C5C4679'

	const reqtContract = await ethers.getContractAt('RequiemERC20Token', reqtAddress);

	const bondingCalculatorAddress = '0x2A03A0B4e33B922d381B9f7DF16111cd2C77b4b3'


	const treasuryFactory = await ethers.getContractFactory('RequiemTreasury');
	console.log("deploy treasury")
	const treasury = await deploy('RequiemTreasury', {
		contract: 'RequiemTreasury',
		from: deployer,
		log: true,
		args: [
			reqtAddress,	// address _reqtT,
			dai.address, // address _DAI,
			tusd.address,// address _Frax,
			pairreqtT_DAI,// address _reqtTDAI,
			0,// uint256 _blocksNeededForQueue
		]
	});

	const bondingDepository = await deploy('RequiemQBondDepository', {
		contract: 'RequiemQBondDepository',
		from: deployer,
		log: true,
		args: [
			reqtAddress, // address _reqtT,
			pairreqtT_DAI, // address _principle,
			treasury.address, // address _treasury,
			deployer, // address _DAO,
			bondingCalculatorAddress// address _bondCalculator
		],
	});

	console.log('set treasury as minter, allow am as limit')
	await reqtContract.setMinter(treasury.address, '1000000000000000000000000')

	const depositoryContract = await ethers.getContractAt('RequiemQBondDepository', bondingDepository.address);
	const treasuryContract = await ethers.getContractAt('RequiemTreasury', treasury.address);

	// const lpTokens = await treasuryContract.liquidityTokens(0)
	// console.log("LIQ", lpTokens)

	console.log("get pair data")
	const pairContract = await ethers.getContractAt('RequiemPairERC20', pairreqtT_DAI);
	const lpBalante = await pairContract.balanceOf(deployer)
	const ts = await pairContract.totalSupply()
	console.log("balante", lpBalante.toString(), "total supply ", ts.toString())

	console.log("approve spending of treasury")

	console.log("set manager")
	await treasuryContract.pushManagement(deployer)

	await pairContract.connect(deployer)

	await pairContract.approve(treasuryContract.address, ethers.constants.MaxInt256)
	console.log("approve spending of Depository")
	await pairContract.approve(bondingDepository.address, ethers.constants.MaxInt256)

	const isLiquidityToken = await treasuryContract.isLiquidityToken(pairContract.address)
	console.log("isLP", isLiquidityToken)


	enum PARAMETER {
		VESTING,
		PAYOUT,
		FEE,
		DEBT
	}

	const param = "VESTING"
	await depositoryContract.setBondTerms(
		PARAMETER.VESTING,//   PARAMETER _parameter, 
		10000,//   uint256 _input
	)

	// enum according to the contract
	enum MANAGING {
		RESERVEDEPOSITOR,
		RESERVESPENDER,
		RESERVETOKEN,
		RESERVEMANAGER,
		LIQUIDITYDEPOSITOR,
		LIQUIDITYTOKEN,
		LIQUIDITYMANAGER,
		DEBTOR,
		REWARDMANAGER,
		SreqtT
	}

	console.log("depositor queue")

	await treasuryContract.queue(MANAGING.LIQUIDITYDEPOSITOR, deployer)

	console.log("toggle depositor")

	const dep = await treasuryContract.toggle(
		MANAGING.LIQUIDITYDEPOSITOR, // MANAGING _managing,
		deployer, // address _address,
		bondingCalculatorAddress// address _calculator
	)


	console.log("toggle token")
	const togToken = await treasuryContract.toggle(
		MANAGING.LIQUIDITYTOKEN, // MANAGING _managing,
		pairreqtT_DAI, // address _address,
		bondingCalculatorAddress// address _calculator
	)

	const queue = await treasuryContract.LiquidityTokenQueue(pairreqtT_DAI)
	console.log("token queue", queue.toString())

	console.log("queue token pairreqtT_DAI")
	await treasuryContract.queue(MANAGING.LIQUIDITYTOKEN, pairreqtT_DAI)

	console.log("toggle token2")
	const togToken1 = await treasuryContract.toggle(
		MANAGING.LIQUIDITYTOKEN, // MANAGING _managing,
		pairreqtT_DAI, // address _address,
		bondingCalculatorAddress// address _calculator
	)


	const bc2 = await treasuryContract.bondCalculator(pairreqtT_DAI)
	console.log("is bc after toggle", bc2)

	const inp1 = lpBalante.div(10000) // is reqt in lp / 10000

	// console.log("params", valparams)
	console.log("calculate valueOf LP", inp1)
	let val = await treasuryContract['valueOf(address,uint256)'](
		pairreqtT_DAI,// address _token, 
		inp1// uint256 _amount
	)

	console.log("value of dai as LP trasury Liq", inp1, val.toString())

	const bn2 = await ethers.provider.getBlockNumber()
	console.log("block number", bn2)



	console.log("calculate valueOf dai", inp1)

	let val2 = await treasuryContract['valueOf(address,uint256)'](
		dai.address,// address _token, 
		inp1// uint256 _amount
	)

	console.log("value of dai as dai trasury Liq", inp1, val2.toString())

	console.log("start intializing bond terms")

	await depositoryContract.initializeBondTerms(
		0,// uint256 _controlVariable,
		1000,// uint256 _vestingTerm,
		1000,// uint256 _minimumPrice,
		'1000000000000000000000000',// uint256 _maxPayout,
		25,// uint256 _fee,
		'200000000000',// uint256 _maxDebt,
		0,// uint256 _initialDebt
	)

	const payoutInp = lpBalante.div(10) // deposit 10% of lp


	let valForPayout = await treasuryContract['valueOf(address,uint256)'](
		pairreqtT_DAI,// address _token, 
		payoutInp// uint256 _amount
	)

	console.log("inp", payoutInp, "valued at", valForPayout.toString())


	const x = await depositoryContract.payoutFor(
		valForPayout// uint256 _value
	)
	console.log("payoutFor", x.toString())


	const bp = await depositoryContract.bondPrice(

	)
	console.log("bond price", bp.toString())


	console.log("-- depositor queue add depository")

	await treasuryContract.queue(MANAGING.LIQUIDITYDEPOSITOR, bondingDepository.address)

	console.log("toggle depository")

	const depDepository = await treasuryContract.toggle(
		MANAGING.LIQUIDITYDEPOSITOR, // MANAGING _managing,
		bondingDepository.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)

	const maxPrice = '10000'
	console.log("deposit LP amount", payoutInp.toSting(), "at max price ", maxPrice)
	await depositoryContract.deposit(
		payoutInp,// uint256 _amount,
		maxPrice,// uint256 _maxPrice,
		deployer// address _depositor
	)

	console.log("deposit done")


};
export default func;
func.tags = ['treasury-fuji'];
