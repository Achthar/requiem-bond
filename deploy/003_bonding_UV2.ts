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

	const t1 = await deploy('T1', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['T1 Coin', 'T1', 6],
	});

	const t2 = await deploy('T2', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['T2 Coin', 'T2', 6],
	});

	const t3 = await deploy('T3', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['T3 Coin', 'T3', 18],
	});


	const t4 = await deploy('T4', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['T4 Coin', 'T4', 18],
	});

	const weth = await deploy('TestWETH', {
		contract: 'TestWETH',
		from: localhost,
		log: true,
		args: [localhost],
	});

	await execute('T1', { from: localhost, log: true }, 'mint', localhost, parseUnits('10000000', 6));
	await execute('T2', { from: localhost, log: true }, 'mint', localhost, parseUnits('10000000', 6));
	await execute('T3', { from: localhost, log: true }, 'mint', localhost, parseUnits('10000000', 18));
	await execute('T4', { from: localhost, log: true }, 'mint', localhost, parseUnits('10000000', 18));
	// await execute('T1', { from: localhost, log: true }, 'mint', user, parseUnits('10000000', 6) );
	// await execute('T2', { from: localhost, log: true }, 'mint', user, parseUnits('10000000', 6) );
	// await execute('T3', { from: localhost, log: true }, 'mint', user, parseUnits('10000000', 18) );
	// await execute('T4', { from: localhost, log: true }, 'mint', user, parseUnits('10000000', 18) );

	// const wethAddress = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c'//await getWeth(hre);

	// const weth = await ethers.getContractAt("IWETH", wethAddress);

	// const wethContract = await weth.attach(
	// 	wethAddress
	//   );
	// const vaultAuthorization = await deploy("VaultAuthorization", {
	// 	contract: "VaultAuthorization",
	// 	skipIfAlreadyDeployed: true,
	// 	from: localhost,
	// 	args: [
	// 		authorizer.address,	// IAuthorizer authorizer,
	// 	],
	// 	log: true,
	// });

	// await execute('T1', { from: user }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T2', { from: user }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T3', { from: user }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T4', { from: user }, 'approve', router.address, ethers.constants.MaxInt256);

	console.log("--- deploy formulas ---")
	const formula = await deploy("RequiemFormula", {
		contract: "RequiemFormula",
		skipIfAlreadyDeployed: true,
		from: localhost,
		args: [],
		log: true,
	});

	const factory = await deploy("RequiemFactory", {
		contract: "RequiemFactory",
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

	await execute('T1', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('T2', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('T3', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('T4', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('T1', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('T2', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('T3', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('T4', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);

	await execute('TestWETH', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);



	console.log("--- deploy stables --- ")

	const usdc = await deploy('USDC', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['USD Coin', 'USDC', 6],
	});

	const usdt = await deploy('USDT', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['Tether USD', 'USDT', 6],
	});

	const dai = await deploy('DAI', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['DAI Stablecoin', 'DAI', 18],
	});


	const tusd = await deploy('TUSD', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['True USD', 'TUSD', 18],
	});

	await execute('USDC', { from: localhost, log: true }, 'mint', localhost, parseUnits('100000000000', 6));
	await execute('USDT', { from: localhost, log: true }, 'mint', localhost, parseUnits('100000000000', 6));
	await execute('DAI', { from: localhost, log: true }, 'mint', localhost, parseUnits('100000000000', 18));
	await execute('TUSD', { from: localhost, log: true }, 'mint', localhost, parseUnits('100000000000', 18));

	await execute('USDC', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('USDT', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('DAI', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('TUSD', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);


	const deadline = Math.floor(Date.now() / 1000 + 7200);



	await execute('USDC', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('USDT', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('DAI', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('TUSD', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);


	await execute('TestWETH', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);



	const factoryContract = await ethers.getContractAt('RequiemFactory', factory.address);
	console.log("--- create t1 t2 pair ----")
	await factoryContract.createPair(t1.address, t2.address, ethers.BigNumber.from(50), ethers.BigNumber.from(10))
	const pair = await factoryContract.getPair(t1.address, t2.address, ethers.BigNumber.from(50), ethers.BigNumber.from(10))
	console.log("--- create t2 usdt pair ----")
	await factoryContract.createPair(usdt.address, t2.address, ethers.BigNumber.from(50), ethers.BigNumber.from(50))
	const pair2 = await factoryContract.getPair(usdt.address, t2.address, ethers.BigNumber.from(50), ethers.BigNumber.from(50))

	console.log("pair:", pair, pair2)
	// const routerContract = await ethers.getContract('RequiemRouter');


	const liq = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pair, t1.address, t2.address,
		parseUnits('10003245', 18),
		parseUnits('13002330', 18),
		parseUnits('10003245', 18),
		parseUnits('13002330', 18),
		localhost,
		deadline);

	const liq2 = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pair2, t2.address, usdt.address,
		BigNumber.from('1200000000'),
		BigNumber.from('1000000000'),
		BigNumber.from('1200000000'),
		BigNumber.from('1000000000'),
		localhost,
		deadline);



	console.log("--- create WETH t2 pair ----")
	await factoryContract.createPair(weth.address, t2.address, ethers.BigNumber.from(48), ethers.BigNumber.from(10))
	const pairWeth = await factoryContract.getPair(weth.address, t2.address, ethers.BigNumber.from(48), ethers.BigNumber.from(10))
	console.log("deposit eth")
	await execute('TestWETH', { from: localhost, value: BigNumber.from('10000000000') }, 'deposit')
	console.log("addWETH Liquidity")


	const liqWeth = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairWeth, weth.address, t2.address,
		BigNumber.from('100000000'),
		BigNumber.from('1000000000'),
		BigNumber.from('100000000'),
		BigNumber.from('1000000000'),
		localhost,
		deadline);
	console.log("LP received weth t2", 'liqWeth')

	const pairWethContract = await ethers.getContractAt('RequiemPair', pairWeth);

	console.log("calc swap test")
	const inT2 = await pairWethContract.calculateSwapGivenOut(weth.address, weth.address, 4321234)

	const y = await pairWethContract.calculateSwapGivenIn(weth.address, weth.address, inT2)
	console.log("amountIn", inT2.toString(), "outs", 4321234, y.toString())


	// const liqWeth32 = await execute('RequiemQPairManager', { from: localhost }, 'removeLiquidity', pairWeth, weth.address, t2.address,
	// 	BigNumber.from(1000),
	// 	BigNumber.from('1000000'),
	// 	BigNumber.from('10000000'),
	// 	localhost,
	// 	deadline);
	// console.log("LP received weth t2", liqWeth32)
	const REQ = await deploy('RequiemERC20Token', {
		contract: 'RequiemERC20Token',
		from: localhost,
		log: true,
		args: [],
	});

	await factoryContract.createPair(weth.address, REQ.address, ethers.BigNumber.from(20), ethers.BigNumber.from(25))

	const pairWETH_REQ = await factoryContract.getPair(weth.address, REQ.address, ethers.BigNumber.from(20), ethers.BigNumber.from(25))
	console.log("deposit eth", pairWETH_REQ)
	await execute('TestWETH', { from: localhost, value: BigNumber.from('10000000000000') }, 'deposit')
	console.log("addWETH Liquidity")

	await execute('RequiemERC20Token', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);


	await execute('TestWETH', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);

	const wethContract = await ethers.getContractAt('TestWETH', weth.address);
	const reqtContract = await ethers.getContractAt('RequiemERC20Token', REQ.address);

	await wethContract.approve(pairManager.address, ethers.constants.MaxInt256)
	await reqtContract.approve(pairManager.address, ethers.constants.MaxInt256)

	await reqtContract.approve(router.address, ethers.constants.MaxInt256)

	await reqtContract.setVault(localhost)
	await reqtContract.mint(localhost, '1000000000098298432432')

	const allow = await reqtContract.allowance(localhost, pairManager.address)
	const allow1 = await wethContract.allowance(localhost, pairManager.address)
	console.log("approved", allow.toString(), allow1.toString())

	const liqWethREQT = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairWETH_REQ, weth.address, REQ.address,
		BigNumber.from('8000000000000'),
		BigNumber.from('2000000000000'),
		BigNumber.from('8000000000000'),
		BigNumber.from('2000000000000'),
		localhost,
		'99999999999999999999');

	console.log("LP received weth req", 'liqWeth')

	await ethers.getContractFactory('RequiemERC20Token');
	// const req = await REQ.deploy();

	// const MockBonding = await ethers.getContractFactory('RequiemUV2BondingCalculator');
	// const mockBonding = await MockBonding.deploy(REQ.address);

	const bondingCalculator = await deploy('RequiemUV2BondingCalculator', {
		contract: 'RequiemUV2BondingCalculator',
		from: localhost,
		log: true,
		args: [REQ.address],
	});

	const bondingCalculatorContract = await ethers.getContractAt('RequiemUV2BondingCalculator', bondingCalculator.address);

	const tV = await bondingCalculatorContract.getTotalValue(pairWeth)

	console.log("indexValue", tV.toString())

	const tV2 = await bondingCalculatorContract.getTotalValue(pairWETH_REQ)

	console.log("indexValue2", tV2.toString())

	const pools8 = [pairWETH_REQ]
	const tokens8 = [REQ.address, weth.address]
	await execute('RequiemQRouter', { from: localhost }, 'onSwapTokensForExactTokens',
		pools8,
		tokens8,
		BigNumber.from('3232112'), // out
		BigNumber.from('99999999999999999999999'), //in max
		localhost,// address to,
		deadline,// uint256 deadline
	);
	console.log("trade done")

	const tV3 = await bondingCalculatorContract.getTotalValue(pairWETH_REQ)

	console.log("indexValue3", tV3.toString())

	const sREQ = await deploy('sRequiem', {
		contract: 'sRequiem',
		from: localhost,
		log: true,
		args: [],
	});

	const staking = await deploy('RequiemStaking', {
		contract: 'RequiemStaking',
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

	await factoryContract.createPair(REQ.address, dai.address, ethers.BigNumber.from(50), ethers.BigNumber.from(1))
	const pairREQT_DAI = await factoryContract.getPair(REQ.address, dai.address, ethers.BigNumber.from(50), ethers.BigNumber.from(1))
	console.log("deposit dai reqt", pairREQT_DAI)
	// await execute('TestWETH', { from: localhost, value: BigNumber.from('10000000000000') }, 'deposit')
	// console.log("addWETH Liquidity")

	const reqAmountinLP = BigNumber.from('100000000000000000000')
	const daiAmountinLP = BigNumber.from('2000000000000000000000')

	const liqDaiREQT = await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairREQT_DAI, REQ.address, dai.address,
		reqAmountinLP,
		daiAmountinLP,
		reqAmountinLP,
		daiAmountinLP,
		localhost,
		'99999999999999999999');


	const tV4 = await bondingCalculatorContract.getTotalValue(pairREQT_DAI)

	console.log("indexValue DAI", tV4.toString())


	// const treasury = await deploy('RequiemTreasury', {
	// 	contract: 'RequiemTreasury',
	// 	from: localhost,
	// 	log: true,
	// 	args: [
	// 		REQ.address,	// address _REQT,
	// 		dai.address, // address _DAI,
	// 		tusd.address,// address _Frax,
	// 		pairREQT_DAI,// address _REQTDAI,
	// 		0,// uint256 _blocksNeededForQueue
	// 	],
	// });

	const treasuryFactory = await ethers.getContractFactory('RequiemTreasury');

	const treasury = await treasuryFactory.deploy(
		REQ.address,	// address _REQT,
		dai.address, // address _DAI,
		tusd.address,// address _Frax,
		pairREQT_DAI,// address _REQTDAI,
		0,// uint256 _blocksNeededForQueue
	);

	const bondingDepository = await deploy('RequiemQBondDepository', {
		contract: 'RequiemQBondDepository',
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
	await reqtContract.setVault(treasury.address)

	const depositoryContract = await ethers.getContractAt('RequiemQBondDepository', bondingDepository.address);
	const treasuryContract = await ethers.getContractAt('RequiemTreasury', treasury.address);

	const lpTokens = await treasuryContract.liquidityTokens(0)
	console.log("LIQ", lpTokens)

	console.log("get pair data")
	const pairContract = await ethers.getContractAt('RequiemERC20', pairREQT_DAI);
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
	// // console.log("toggle depositor", dep)

	// console.log("queue token pairREQT_DAI")
	// await treasuryContract.queue(MANAGING.LIQUIDITYTOKEN, pairREQT_DAI)

	// const queue = await treasuryContract.LiquidityTokenQueue(pairREQT_DAI)
	// console.log("token queue", queue.toString())

	await execute('RequiemQRouter', { from: localhost }, 'onSwapTokensForExactTokens',
		pools8,
		tokens8,
		BigNumber.from('3232112'), // out
		BigNumber.from('99999999999999999999999'), //in max
		localhost,// address to,
		deadline,// uint256 deadline
	);
	console.log("trade done")

	const tV21 = await bondingCalculatorContract.getTotalValue(pairWETH_REQ)

	console.log("indexValue3", tV21.toString())

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
	// const valparams = await treasuryContract['valueOfParams(address,uint256)'](
	// 	pairREQT_DAI,// address _token, 
	// 	inp1// uint256 _amount
	// )

	// const req = await REQ.deploy();

	// const MockBonding = await ethers.getContractFactory('RequiemQBondingCalculator');
	// const mockBonding = await MockBonding.deploy(REQ.address);



	// console.log("params", valparams)

	let val = await treasuryContract['valueOf(address,uint256)'](
		pairREQT_DAI,// address _token, 
		inp1// uint256 _amount
	)
	const bn2 = await ethers.provider.getBlockNumber()
	console.log("block number", bn2)
	const wpairContract = await ethers.getContractAt('RequiemPair', pairREQT_DAI);
	const testVal = await wpairContract.calculateSwapGivenIn(dai.address, REQ.address, daiShare);

	// const formulaLite = await deploy('RequiemFormulaLite', {
	// 	contract: 'RequiemFormulaLite',
	// 	from: localhost,
	// 	log: true,
	// 	args: [],
	// });

	const bondingQCalculator = await deploy('RequiemQBondingCalculator', {
		contract: 'RequiemQBondingCalculator',
		from: localhost,
		log: true,
		args: [REQ.address],
	});

	const bondingQCalculatorContract = await ethers.getContractAt('RequiemQBondingCalculator', bondingQCalculator.address);


	const testVal1 = await wpairContract.calculateSwapGivenIn(dai.address, REQ.address, daiShare);
	const testVal0 = await bondingQCalculatorContract.valuation(pairREQT_DAI, inp1)
	console.log("act", testVal0.toString(), "real", testVal1.add(reqShare).toString())

	// const priceData = await bondingQCalculatorContract.calculatePrice(
	// 	pairREQT_DAI
	// )
	// console.log("--- price data ---\n",
	// 	priceData[0].toString(),// uint256 reservesREQT,
	// 	priceData[1].toString(),// uint256 numeratorInREQT,
	// 	priceData[2].toString(),// uint256 reservesOther,
	// 	priceData[3].toString(),// uint256 denominatorInOther
	// )

	const testVal2 = await bondingQCalculatorContract.valuation(pairREQT_DAI, inp1)

	const totalQ = await bondingQCalculatorContract.getTotalValue(pairREQT_DAI)
	const totalU2 = await bondingCalculatorContract.getTotalValue(pairREQT_DAI)

	console.log("U2", totalU2.toString())
	console.log("QR", totalQ.toString())


	// const kQ = await bondingQCalculatorContract.getKValue(pairREQT_DAI)
	// const kU2 = await bondingCalculatorContract.getKValue(pairREQT_DAI)


	// console.log("K2", kU2.toString())
	// console.log("KR", kQ.toString())

	console.log("test of Treasury", inp1.toString(), val.toString())
	console.log("test value of CS", inp1.toString(), testVal.toString())
	// console.log("test value of CS", inp1.toString(), testVal1.toString())
	console.log("test value of QR", inp1.toString(), testVal2.toString())
	let val2 = await treasuryContract['valueOf(address,uint256)'](
		dai.address,// address _token, 
		inp1// uint256 _amount
	)

	console.log("value of dai", inp1, val2.toString())
	// console.log("val of call")
	//  let val = await execute('RequiemTreasury', { from: localhost }, 'valueOf',
	// 	pairREQT_DAI,
	// 	'123321'
	// );

	// const valparams1 = await treasuryContract['deposit(uint256,address,uint256)'](
	// 	inp1,// uint256 _amount,
	// 	pairREQT_DAI,// address _token,
	// 	321// uint256 _profit
	// )


	await depositoryContract.initializeBondTerms(
		11233210,// uint256 _controlVariable,
		1032432,// uint256 _vestingTerm,
		4321,// uint256 _minimumPrice,
		'1242144321443279897832',// uint256 _maxPayout,
		21,// uint256 _fee,
		21432432,// uint256 _maxDebt,
		121,// uint256 _initialDebt
	)

	const payoutInp = lpBalante.div(10)


	let valForPayout = await treasuryContract['valueOf(address,uint256)'](
		pairREQT_DAI,// address _token, 
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
	// 149614588815
	// console.log("value of ", 12132, val.toString())
	await depositoryContract.deposit(
		payoutInp,// uint256 _amount,
		'10000',// uint256 _maxPrice,
		localhost// address _depositor
	)

	console.log("deposit done")


};
export default func;
func.tags = ['bonding-localhost-uv2'];
