import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers, waffle } from 'hardhat';

// const { solidity } = 'ethereum-waffle'
// const { expect } = 'chai'
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from 'ethers/lib/utils';
import { expandDecimals } from "../test/ts/shared/utilities";
import { BigNumber } from "ethers";
import { toNormalizedWeights } from "./resources/normalizedWeights"
import { MONTH } from './resources/time';
import { fp } from "./resources/numbers"
import { constants } from 'ethers';
import { Console } from 'console';
// import { deploy, deployedAt } from "./contract";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, execute, get } = deployments;
	const { localhost, user } = await getNamedAccounts();

	// console.log('network', network);
	console.log('localhost', localhost);
	console.log('2ndParty', user);
	const provider = waffle.provider;
	const balance0ETH = await provider.getBalance(localhost);
	console.log('localhost balante', balance0ETH);


	const weth = await deploy('TestWETH', {
		contract: 'TestWETH',
		from: localhost,
		log: true,
		args: [localhost],
	});

	console.log("--- deploy formulas ---")
	const formula = await deploy("RequiemFormula", {
		contract: "RequiemFormula",
		skipIfAlreadyDeployed: true,
		from: localhost,
		args: [],
		log: true,
	});

	const factory = await deploy("RequiemWeightedPairFactory", {
		contract: "RequiemWeightedPairFactory",
		skipIfAlreadyDeployed: true,
		from: localhost,
		args: [localhost, formula.address],
		log: true,
	});

	const pairManager = await deploy("RequiemQPairManager", {
		contract: "RequiemQPairManager",
		skipIfAlreadyDeployed: true,
		from: localhost,
		args: [factory.address, weth.address],
		log: true,
	});

	const router = await deploy("RequiemQRouter", {
		contract: "RequiemQRouter",
		skipIfAlreadyDeployed: true,
		from: localhost,
		args: [factory.address, weth.address],
		log: true,
	});



	await execute('TestWETH', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);



	console.log("--- deploy stables --- ")

	const dai = await deploy('DAI', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['DAI Stablecoin', 'DAI', 18],
	});


	await execute('DAI', { from: localhost, log: true }, 'mint', localhost, parseUnits('100000000000', 18));
	await execute('DAI', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);


	const deadline = Math.floor(Date.now() / 1000 + 7200);

	await execute('DAI', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);


	const factoryContract = await ethers.getContractAt('RequiemWeightedPairFactory', factory.address);

	const REQ = await deploy('RequiemERC20Token', {
		contract: 'RequiemERC20Token',
		from: localhost,
		log: true,
		args: [],
	});

	await factoryContract.createPair(weth.address, REQ.address, ethers.BigNumber.from(20), ethers.BigNumber.from(25))


	await execute('RequiemERC20Token', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);


	await execute('TestWETH', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);

	const wethContract = await ethers.getContractAt('TestWETH', weth.address);
	const reqtContract = await ethers.getContractAt('RequiemERC20Token', REQ.address);

	await wethContract.approve(pairManager.address, ethers.constants.MaxInt256)
	await reqtContract.approve(pairManager.address, ethers.constants.MaxInt256)

	await reqtContract.approve(router.address, ethers.constants.MaxInt256)

	await reqtContract.setMinter(localhost, ethers.constants.MaxInt256)
	await reqtContract.mint(localhost, '9047079598785494310822610000')

	const allow = await reqtContract.allowance(localhost, pairManager.address)
	const allow1 = await wethContract.allowance(localhost, pairManager.address)
	console.log("approved", allow.toString(), allow1.toString())


	const bondingCalculator = await deploy('RequiemQBondingCalculator', {
		contract: 'RequiemQBondingCalculator',
		from: localhost,
		log: true,
		args: [REQ.address],
	});

	const bondingCalculatorContract = await ethers.getContractAt('RequiemQBondingCalculator', bondingCalculator.address);


	const sREQ = await deploy('sRequiem', {
		contract: 'sRequiem',
		from: localhost,
		log: true,
		args: [],
	});

	const staking = await deploy('Staking', {
		contract: 'Staking',
		from: localhost,
		log: true,
		args: [
			REQ.address, //address _REQT,
			sREQ.address, // address _sREQT,
			10000,// uint256 _epochLength,
			0,// uint256 _firstEpochNumber,
			0// uint256 _firstEpochBlock
		],
	});

	// ---- create actual weighted pair

	await factoryContract.createPair(REQ.address, dai.address, ethers.BigNumber.from(80), ethers.BigNumber.from(25))
	const pairREQT_DAI = await factoryContract.getPair(REQ.address, dai.address, ethers.BigNumber.from(80), ethers.BigNumber.from(25))
	console.log("deposit dai reqt", pairREQT_DAI)
	// await execute('TestWETH', { from: localhost, value: BigNumber.from('10000000000000') }, 'deposit')
	// console.log("addWETH Liquidity")

	// _reserve0|uint112 :  904707959878549431082261
	// _reserve1|uint112 :  1494497389348623915251951
	const reqAmountinLP = BigNumber.from('904707959878549431082261')
	const daiAmountinLP = BigNumber.from('1494497389348623915251951')

	const liqDaiREQT = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairREQT_DAI, REQ.address, dai.address,
		reqAmountinLP,
		daiAmountinLP,
		reqAmountinLP,
		daiAmountinLP,
		localhost,
		'99999999999999999999');


	const pairContract = await ethers.getContractAt('RequiemWeightedPair', pairREQT_DAI);
	const priceReqt = await pairContract.calculateSwapGivenIn(reqtContract.address, dai.address, BigNumber.from('1000000000000000000'))
	console.log("price of reqt in DAI", priceReqt.toString())

	// ---- create U2 actual weighted pair

	await factoryContract.createPair(REQ.address, dai.address, ethers.BigNumber.from(50), ethers.BigNumber.from(25))
	const pairREQT_DAI5 = await factoryContract.getPair(REQ.address, dai.address, ethers.BigNumber.from(50), ethers.BigNumber.from(25))
	console.log("deposit dai reqt", pairREQT_DAI)
	// await execute('TestWETH', { from: localhost, value: BigNumber.from('10000000000000') }, 'deposit')
	// console.log("addWETH Liquidity")

	// _reserve0|uint112 :  904707959878549431082261
	// _reserve1|uint112 :  1494497389348623915251951
	const reqAmountinLPU2 = reqAmountinLP.mul(BigNumber.from(20)).div(BigNumber.from(80))
	const daiAmountinLPU2 = daiAmountinLP

	const liqDaiREQT50 = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairREQT_DAI5, REQ.address, dai.address,
		reqAmountinLPU2,
		daiAmountinLPU2,
		reqAmountinLPU2,
		daiAmountinLPU2,
		localhost,
		'99999999999999999999');


	const pairContract50 = await ethers.getContractAt('RequiemWeightedPair', pairREQT_DAI);
	const priceReqt50 = await pairContract50.calculateSwapGivenIn(reqtContract.address, dai.address, BigNumber.from('1000000000000000000'))
	console.log("price of reqt in DAI", priceReqt50.toString())


	const tV4 = await bondingCalculatorContract.getTotalValue(pairREQT_DAI)

	console.log("indexValue DAI", tV4.toString())


	const treasuryFactory = await ethers.getContractFactory('Treasury');

	const treasury = await treasuryFactory.deploy(
		REQ.address,	// address _REQT,
		dai.address, // address _DAI,
		dai.address,// address _Frax,
		pairREQT_DAI,// address _REQTDAI,
		0,// uint256 _blocksNeededForQueue
	);

	const bondingDepository = await deploy('BondDepository', {
		contract: 'BondDepository',
		from: localhost,
		log: true,
		args: [
			REQ.address, // address _REQT,
			pairREQT_DAI, // address _principle,
			treasury.address, // address _treasury,
			localhost, // address _DAO,
			bondingCalculator.address// address _bondCalculator
		],
	});

	console.log('set treasury as vault')
	await reqtContract.setMinter(treasury.address, ethers.constants.MaxInt256)

	const depositoryContract = await ethers.getContractAt('BondDepository', bondingDepository.address);
	const treasuryContract = await ethers.getContractAt('Treasury', treasury.address);


	const lpTokens = await treasuryContract.liquidityTokens(0)
	console.log("LIQ", lpTokens)

	console.log("get pair data")

	const lpBalante = await pairContract.balanceOf(localhost)
	const ts = await pairContract.totalSupply()

	console.log("balante", lpBalante.toString(), "total supply ", ts.toString())

	console.log("approve spending of treasury")

	console.log("set manager")
	await treasuryContract.pushManagement(localhost)

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
		SREQT
	}

	console.log("depositor queue")

	await treasuryContract.queue(MANAGING.LIQUIDITYDEPOSITOR, localhost)

	console.log("toggle depositor")

	const dep = await treasuryContract.toggle(
		MANAGING.LIQUIDITYDEPOSITOR, // MANAGING _managing,
		localhost, // address _address,
		bondingCalculator.address// address _calculator
	)


	const isLP = await treasuryContract.isLiquidityToken(pairREQT_DAI)
	console.log("is lp", isLP)

	const bc = await treasuryContract.bondCalculator(pairREQT_DAI)
	console.log("is bc", bc)

	const bn = await ethers.provider.getBlockNumber()
	console.log("block number", bn)

	console.log("toggle token")
	const togToken = await treasuryContract.toggle(
		MANAGING.LIQUIDITYTOKEN, // MANAGING _managing,
		pairREQT_DAI, // address _address,
		bondingCalculator.address// address _calculator
	)

	const queue = await treasuryContract.LiquidityTokenQueue(pairREQT_DAI)
	console.log("token queue", queue.toString())

	console.log("queue token pairREQT_DAI")
	await treasuryContract.queue(MANAGING.LIQUIDITYTOKEN, pairREQT_DAI)

	console.log("toggle token2")
	const togToken1 = await treasuryContract.toggle(
		MANAGING.LIQUIDITYTOKEN, // MANAGING _managing,
		pairREQT_DAI, // address _address,
		bondingCalculator.address// address _calculator
	)

	// const ibonding = await ethers.getContractFactory("IBondingCalculator")
	// const bonding = await ibonding.attach(bondingCalculator.address)

	// const gg = await bonding.valuation(pairREQT_DAI, 12412)
	// console.log("GG", gg.toString())

	const bc2 = await treasuryContract.bondCalculator(pairREQT_DAI)
	console.log("is bc after toggle", bc2)
	// console.log("toggle token", togToken)

	const inp1 = ts.div(10000) // is reqt in lp / 10000
	// 10000000000000000 reqt
	// 200000000000000000 dai
	const daiShare = daiAmountinLP.div(10000) //((daiAmountinLP.mul(inp1).mul(daiAmountinLP).div(reqAmountinLP.add(daiAmountinLP))).div(ts)) // ibps o
	const reqShare = reqAmountinLP.div(10000)
	console.log("dai 10bps of lp", daiShare.toString())
	console.log("req 10bps of lp", reqShare.toString())

	
	const bn2 = await ethers.provider.getBlockNumber()
	console.log("block number", bn2)
	const wpairContract = await ethers.getContractAt('RequiemWeightedPair', pairREQT_DAI);
	const testVal = await wpairContract.calculateSwapGivenIn(dai.address, REQ.address, daiShare);

	// const formulaLite = await deploy('RequiemFormulaLite', {
	// 	contract: 'RequiemFormulaLite',
	// 	from: localhost,
	// 	log: true,
	// 	args: [],
	// });

	const bondingQCalculator = await deploy('RequiemUV2BondingCalculator', {
		contract: 'RequiemUV2BondingCalculator',
		from: localhost,
		log: true,
		args: [REQ.address],
	});

	const bondingUV2CalculatorContract = await ethers.getContractAt('RequiemUV2BondingCalculator', bondingQCalculator.address);


	const testVal1 = await wpairContract.calculateSwapGivenIn(dai.address, REQ.address, daiShare);
	const testVal0 = await bondingUV2CalculatorContract.valuation(pairREQT_DAI, inp1)
	console.log("act", testVal0.toString(), "real", testVal1.add(reqShare).toString())


	const testVal2 = await bondingUV2CalculatorContract.valuation(pairREQT_DAI, inp1)

	const totalQ = await bondingUV2CalculatorContract.getTotalValue(pairREQT_DAI)
	const totalU2 = await bondingCalculatorContract.getTotalValue(pairREQT_DAI)

	console.log("U2", totalU2.toString())
	console.log("QR", totalQ.toString())



	console.log("test value of CS", inp1.toString(), testVal.toString())
	// console.log("test value of CS", inp1.toString(), testVal1.toString())
	console.log("test value of QR", inp1.toString(), testVal2.toString())




	await depositoryContract.initializeBondTerms(
		30000,// uint256 _controlVariable,
		10000,// uint256 _vestingTerm,
		500,// uint256 _minimumPrice,
		'100000000000000000000000',// uint256 _maxPayout,
		0,// uint256 _fee,
		'200000000000000000000000000',// uint256 _maxDebt,
		0,// uint256 _initialDebt
	)

	const payoutInp = lpBalante.div(10)


	const bp = await depositoryContract.bondPrice(

	)
	console.log("bond price", bp.toString())


	console.log("-- depositor queue add depository")

	await treasuryContract.queue(MANAGING.LIQUIDITYDEPOSITOR, bondingDepository.address)

	console.log("toggle depository")

	const depDepository = await treasuryContract.toggle(
		MANAGING.LIQUIDITYDEPOSITOR, // MANAGING _managing,
		bondingDepository.address, // address _address,
		bondingCalculator.address// address _calculator
	)


	const mU2 = await bondingUV2CalculatorContract.markdown(pairREQT_DAI)
	const mQ = await bondingCalculatorContract.markdown(pairREQT_DAI)
	const mQ1 = await bondingCalculatorContract.markdown(pairREQT_DAI5)
	console.log("markdown U2", mU2.toString())
	console.log("markdown Q", mQ.toString())
	console.log("markdown Q 50 50 pair", mQ1.toString())

	const priceUSD0 = await depositoryContract.bondPriceInUSD()
	const price0 = await depositoryContract.bondPrice()
	const debtR0 = await depositoryContract.debtRatio()
	console.log("resulting price USD", priceUSD0.toString())
	console.log("resulting price", price0.toString())

	console.log("debt ratio", debtR0.toString())


	// 149614588815
	// console.log("value of ", 12132, val.toString())
	await depositoryContract.deposit(
		payoutInp,// uint256 _amount,
		'1000000',// uint256 _maxPrice,
		localhost// address _depositor
	)

	console.log("deposit done")

	const priceUSD = await depositoryContract.bondPriceInUSD()
	const price = await depositoryContract.bondPrice()
	const debtR = await depositoryContract.debtRatio()
	console.log("resulting price USD", priceUSD.toString())
	console.log("resulting price", price.toString())

	console.log("debt ratio", debtR.toString())

	// 149614588815
	// console.log("value of ", 12132, val.toString())
	await depositoryContract.deposit(
		payoutInp,// uint256 _amount,
		'1000000',// uint256 _maxPrice,
		localhost// address _depositor
	)

	console.log("deposit2 done")

	const price2USD = await depositoryContract.bondPriceInUSD()
	const price2 = await depositoryContract.bondPrice()
	const debtR2 = await depositoryContract.debtRatio()
	console.log("resulting price2 USD", price2USD.toString())
	console.log("resulting price2", price2.toString())

	console.log("debt ratio", debtR2.toString())
	console.log("REQT price", priceReqt.toString())


};
export default func;
func.tags = ['bonding-calc-localhost-wq'];
