import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers, waffle } from 'hardhat';

// const { solidity } = 'ethereum-waffle'
// const { expect } = 'chai'
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from 'ethers/lib/utils';
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
	const ONEE18 = BigNumber.from('1000000000000000000')
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
	await execute('TestWETH', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);

	const usdc = await deploy('USDC', {
		contract: 'MockERC20',
		from: localhost,
		log: true,
		args: ['USDC Stablecoin', 'USDC', 6],
	});


	await execute('USDC', { from: localhost, log: true }, 'mint', localhost, parseUnits('100000000000', 6));
	await execute('USDC', { from: localhost }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('USDC', { from: localhost }, 'approve', pairManager.address, ethers.constants.MaxInt256);

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


	const reqtContract = await ethers.getContractAt('RequiemERC20Token', REQ.address);

	await reqtContract.approve(pairManager.address, ethers.constants.MaxInt256)

	await reqtContract.approve(router.address, ethers.constants.MaxInt256)

	await reqtContract.setMinter(localhost, ethers.constants.MaxInt256)
	await reqtContract.mint(localhost, '904707959878549431082261')

	const allow = await reqtContract.allowance(localhost, pairManager.address)
	console.log("approved", allow.toString())


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

	const sReqtContract = await ethers.getContractAt('sRequiem', sREQ.address);
	await sReqtContract.setIndex('50000000000000000000')

	const gREQ = await deploy('gREQ', {
		contract: 'gREQ',
		from: localhost,
		log: true,
		args: [
			localhost,
			sReqtContract.address],
	});


	const gReqtContract = await ethers.getContractAt('gREQ', gREQ.address);
	await gReqtContract.mint(localhost, '2904707959878549431082261')


	const authority = await deploy('Authority', {
		contract: 'Authority',
		from: localhost,
		log: true,
		args: [
			localhost, // address _governor,
			localhost, // address _guardian,
			localhost, // address _policy,
			localhost // address _vault
		],
	});


	const staking = await deploy('Staking', {
		contract: 'Staking',
		from: localhost,
		log: true,
		args: [
			REQ.address, //address _REQT,
			sREQ.address, // address _sREQT,
			gREQ.address,
			10000,// uint256 _epochLength,
			1,// uint256 _firstEpochNumber,
			0, // uint256 _firstEpochBlock
			authority.address
		],
	});

	const stakingContract = await ethers.getContractAt('Staking', staking.address);
	console.log("init sreq")
	await sReqtContract.initialize(staking.address)



	// ---- create actual weighted pair

	await factoryContract.createPair(REQ.address, dai.address, ethers.BigNumber.from(80), ethers.BigNumber.from(25))
	const pairREQT_DAI = await factoryContract.getPair(REQ.address, dai.address, ethers.BigNumber.from(80), ethers.BigNumber.from(25))
	console.log("deposit dai reqt", pairREQT_DAI)

	// _reserve0|uint112 :  904707.959878549431082261
	// _reserve1|uint112 :  1494497.389348623915251951
	const reqAmountinLP = BigNumber.from('904707959878549431082261')
	const daiAmountinLP = BigNumber.from('1494497389348623915251951')

	await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairREQT_DAI, REQ.address, dai.address,
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

	await factoryContract.createPair(weth.address, usdc.address, ethers.BigNumber.from(50), ethers.BigNumber.from(15))
	const pairWETH_USDC = await factoryContract.getPair(weth.address, usdc.address, ethers.BigNumber.from(50), ethers.BigNumber.from(15))
	console.log("deposit weth usdc", pairWETH_USDC)

	// _reserve0|uint112 :  904707.959878549431082261
	// _reserve1|uint112 :  1494497.251951
	await execute('TestWETH', { from: localhost, value: BigNumber.from('904707959878549431082') }, 'deposit')
	const wethAmountinLP = BigNumber.from('904707959878549431082')
	const usdcAmountinLP = BigNumber.from('1494495251')

	await execute('RequiemQPairManager', { from: localhost }, 'addLiquidity', pairWETH_USDC, weth.address, usdc.address,
		wethAmountinLP,
		usdcAmountinLP,
		wethAmountinLP,
		usdcAmountinLP,
		localhost,
		'99999999999999999999');


	const pairContractWeth = await ethers.getContractAt('RequiemWeightedPair', pairWETH_USDC);


	const treasuryFactory = await ethers.getContractFactory('Treasury');

	const treasury = await treasuryFactory.deploy(
		REQ.address, // address _req,
		0, // uint256 _timelock,
		authority.address // address _authority
	);


	const bondingDepository = await deploy('BondDepository', {
		contract: 'BondDepository',
		from: localhost,
		log: true,
		args: [
			authority.address, // IAuthority _authority,
			REQ.address, // IERC20 _req,
			gREQ.address, // IgREQ _greq,
			staking.address, // IStaking _staking,
			treasury.address// ITreasury _treasury
		],
	});

	console.log('set treasury as vault')
	await reqtContract.setMinter(treasury.address, ethers.constants.MaxInt256)

	const depositoryContract = await ethers.getContractAt('BondDepository', bondingDepository.address);
	const treasuryContract = await ethers.getContractAt('Treasury', treasury.address);

	console.log("get pair data")

	const reqPairBalance = await pairContract.balanceOf(localhost)
	const wethPairBalance = await pairContractWeth.balanceOf(localhost)
	const ts = await pairContract.totalSupply()

	console.log("balante", reqPairBalance.toString(), "total supply ", ts.toString())

	console.log("approve spending of treasury")

	await pairContract.approve(treasuryContract.address, ethers.constants.MaxInt256)
	console.log("approve spending of Depository")
	await pairContract.connect(localhost)
	await pairContract.approve(bondingDepository.address, ethers.constants.MaxInt256)
	await reqtContract.approve(bondingDepository.address, ethers.constants.MaxInt256)

	await pairContractWeth.connect(localhost)
	await pairContractWeth.approve(bondingDepository.address, ethers.constants.MaxInt256)

	// enum according to the contract
	enum STATUS {
		RESERVEDEPOSITOR,
		RESERVESPENDER,
		RESERVETOKEN,
		RESERVEMANAGER,
		LIQUIDITYDEPOSITOR,
		LIQUIDITYTOKEN,
		LIQUIDITYMANAGER,
		RESERVEDEBTOR,
		REWARDMANAGER,
		SREQ,
		REQDEBTOR
	}

	console.log("init Treasury")

	await treasuryContract.initialize()

	console.log("queueTimelock depositor")

	await treasuryContract.queueTimelock(
		STATUS.LIQUIDITYDEPOSITOR, // STATUS _managing,
		localhost, // address _address,
		bondingCalculator.address// address _calculator
	)
	await treasuryContract.execute(0)
	// const isLP = await treasuryContract.isLiquidityToken(pairREQT_DAI)
	// console.log("is lp", isLP)

	const bc = await treasuryContract.bondCalculator(pairREQT_DAI)
	console.log("is bc", bc)

	const bn = await ethers.provider.getBlockNumber()
	console.log("block number", bn)

	console.log("queueTimelock token")
	const togToken = await treasuryContract.queueTimelock(
		STATUS.LIQUIDITYTOKEN, // STATUS _managing,
		pairREQT_DAI, // address _address,
		bondingCalculator.address// address _calculator
	)
	await treasuryContract.execute(1)

	console.log("queueTimelock deposoitorC")

	await treasuryContract.queueTimelock(
		STATUS.LIQUIDITYDEPOSITOR, // STATUS _managing,
		bondingDepository.address, // address _address,
		bondingCalculator.address// address _calculator
	)

	await treasuryContract.execute(2)

	console.log("queueTimelock spender")

	await treasuryContract.queueTimelock(
		STATUS.RESERVESPENDER, // STATUS _managing,
		bondingDepository.address, // address _address,
		bondingCalculator.address// address _calculator
	)

	await treasuryContract.execute(3)

	console.log("queueTimelock rewardmanager")

	await treasuryContract.queueTimelock(
		STATUS.REWARDMANAGER, // STATUS _managing,
		bondingDepository.address, // address _address,
		bondingCalculator.address// address _calculator
	)

	await treasuryContract.execute(4)

	console.log("queueTimelock reserveToken")

	await treasuryContract.queueTimelock(
		STATUS.RESERVETOKEN, // STATUS _managing,
		reqtContract.address, // address _address,
		bondingCalculator.address// address _calculator
	)

	await treasuryContract.execute(5)


	console.log("queueTimelock reserveToken g")

	await treasuryContract.queueTimelock(
		STATUS.RESERVETOKEN, // STATUS _managing,
		gReqtContract.address, // address _address,
		bondingCalculator.address// address _calculator
	)

	await treasuryContract.execute(6)
	console.log("queueTimelock sreq")

	await treasuryContract.queueTimelock(
		STATUS.SREQ, // STATUS _managing,
		sREQ.address, // address _address,
		bondingCalculator.address// address _calculator
	)

	await treasuryContract.execute(7)

	await reqtContract.mint(treasury.address, '1000000000000000000000000')

	await gReqtContract.mint(treasury.address, '1000000000000000000000000')
	console.log("migrate gREQ")

	await gReqtContract.migrate(staking.address, sReqtContract.address)
	await treasury.auditReserves()

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


	const capacity = BigNumber.from('4000000').mul(ONEE18);
	const initialPrice = BigNumber.from('35').mul(ONEE18).div(BigNumber.from('10'));
	const buffer = 2e5;

	const vesting = 60 * 60 * 24 * 5;
	const timeToConclusion = 60 * 60 * 24 * 30 * 3;

	const depositInterval = 60 * 60 * 30;
	const tuneInterval = 60 * 60;

	const refReward = 10;
	const daoReward = 50;

	var bid = 0;
	const block = await ethers.provider.getBlock("latest");
	const conclusion = block.timestamp + timeToConclusion;
	const mP = capacity.mul(BigNumber.from(depositInterval)).div(BigNumber.from(timeToConclusion))
	console.log("TD1", capacity.mul(ONEE18.mul(ONEE18)).div(initialPrice).div(ONEE18).toString())
	console.log("TD2", capacity.toString())
	console.log("MP", mP.toString())
	await depositoryContract.setRewards(refReward, daoReward);

	/**
	 * @notice             creates a new market type
	 * @dev                current price should be in 9 decimals.
	 * @param _quoteToken  token used to deposit
	 * @param _market      [capacity (in REQ or quote), initial price / REQ (x decimals), debt buffer (3 decimals)]
	 * @param _booleans    [capacity in quote, fixed term]
	 * @param _terms       [vesting length (if fixed term) or vested timestamp, conclusion timestamp]
	 * @param _intervals   [deposit interval (seconds), tune interval (seconds)]
	 * @return id_         ID of new bond market
	 */

	const _quoteToken = pairREQT_DAI
	// const _market = [
	// 	BigNumber.from('1000000000000000000000000'),
	// 	BigNumber.from('3000000000000000000'),
	// 	BigNumber.from('200000')
	// ]
	// const _booleans = [false, true]
	// const _terms = ['100000', '99999999999']
	// const _intervals = [1, 10000]

	await depositoryContract.create(
		_quoteToken, // IERC20 _quoteToken,
		// _market, // uint256[3] memory _market,
		// _booleans, // bool[2] memory _booleans,
		// _terms, // uint256[2] memory _terms,
		// _intervals // uint32[2] memory _intervals
		[capacity, initialPrice, buffer],
		[false, true],
		[vesting, conclusion],
		[depositInterval, tuneInterval]
	)

	const mD = await depositoryContract.metadata(0)
	const dR = await depositoryContract.debtRatio(0)
	const cD = await depositoryContract.currentDebt(0)
	const bS = await treasuryContract.baseSupply()
	const tD = await treasuryContract.totalDebt()
	const tR = await treasuryContract.totalReserves()
	const terms = await depositoryContract.terms(0)
	const cV = await depositoryContract.currentControlVariable(0)
	const excessRes = await treasury.excessReserves()
	const tS = await reqtContract.totalSupply()

	console.log("metaData", mD)
	console.log("debtRatio", dR.toString())
	console.log("currentDebt", cD.toString())
	console.log("baseSupply", bS.toString())
	console.log("totalDebt", tD.toString())
	console.log("totalReserves", tR.toString())
	console.log("totalSupply", tS.toString())
	console.log("terms", terms)
	console.log("CVariable", terms.controlVariable.toString())
	console.log("CVariable Current", cV.toString())
	console.log("excess Reserves", excessRes.toString())

	// 442963761582

	// 18040634706
	// 49999999999997
	// 2425406625868
	// await depositoryContract.initializeBondTerms(
	// 	30000,// uint256 _controlVariable,
	// 	10000,// uint256 _vestingTerm,
	// 	500,// uint256 _minimumPrice,
	// 	'100000000000000000000000',// uint256 _maxPayout,
	// 	0,// uint256 _fee,
	// 	'200000000000000000000000000',// uint256 _maxDebt,
	// 	0,// uint256 _initialDebt
	// )

	const bp = await depositoryContract.marketPrice(
		0
	)
	console.log("bond price", bp.toString())
	console.log("bond price manual", cV.mul(dR).div(BigNumber.from('1000000000000000000')).toString())

	const payoutInp = reqPairBalance.div(10)

	/**
	 * @notice             deposit quote tokens in exchange for a bond from a specified market
	 * @param _id          the ID of the market
	 * @param _amount      the amount of quote token to spend
	 * @param _maxPrice    the maximum price at which to buy
	 * @param _user        the recipient of the payout
	 * @param _referral    the front end operator address
	 * @return payout_     the amount of gREQ due
	 * @return expiry_     the timestamp at which payout is redeemable
	 * @return index_      the user index of the Note (used to redeem or query information)
	 */
	await depositoryContract.deposit(
		0, // uint256 _id,
		payoutInp, // uint256 _amount,
		BigNumber.from('9999999999999999999999999999999'), // uint256 _maxPrice,
		localhost, // address _user,
		localhost // address _referral
	)

	const mD1 = await depositoryContract.metadata(0)
	const dR1 = await depositoryContract.debtRatio(0)
	const cD1 = await depositoryContract.currentDebt(0)
	const bS1 = await treasuryContract.baseSupply()
	const tD1 = await treasuryContract.totalDebt()
	const tR1 = await treasuryContract.totalReserves()
	const terms1 = await depositoryContract.terms(0)
	const cV1 = await depositoryContract.currentControlVariable(0)
	const excessRes1 = await treasury.excessReserves()
	const tS1 = await reqtContract.totalSupply()

	console.log("metaData", mD1)
	console.log("debtRatio", dR1.toString())
	console.log("currentDebt", cD1.toString())
	console.log("baseSupply", bS1.toString())
	console.log("totalDebt", tD1.toString())
	console.log("totalReserves", tR1.toString())
	console.log("totalSupply", tS1.toString())
	console.log("terms", terms1)
	console.log("CVariable", terms1.controlVariable.toString())
	console.log("CVariable Current", cV1.toString())
	console.log("excess Reserves", excessRes1.toString())


	const bp1 = await depositoryContract.marketPrice(0)
	console.log("bond price", bp1.toString())
	console.log("bond price manual", cV1.mul(dR1).div(BigNumber.from('1000000000000000000')).toString())

	console.log("claim")
	await stakingContract.claim(localhost, true)
	const supply = await sReqtContract.circulatingSupply()
	console.log("curculating supply", supply.toString())
	await gReqtContract.approve(staking.address, ethers.constants.MaxInt256)
	await stakingContract.unwrap(localhost, BigNumber.from('21497842172345434353'))
	const capacity1 = BigNumber.from('500000').mul(ONEE18);

	const supply1 = await sReqtContract.circulatingSupply()
	console.log("curculating supply1", supply1.toString())

	const initialPrice1 = BigNumber.from('410').mul(BigNumber.from('10000000000000000'));
	const buffer1 = 2e5;

	const vesting1 = 60 * 60 * 24 * 30;
	const timeToConclusion1 = 60 * 60 * 24 * 30 * 3;

	const depositInterval1 = 60 * 60 * 24;
	const tuneInterval1 = 60 * 60;

	const refReward1 = 10;
	const daoReward1 = 50;

	const block1 = await ethers.provider.getBlock("latest");
	console.log("Current block timestamp", block1.timestamp)
	const conclusion1 = block1.timestamp + timeToConclusion1;

	const mP1 = capacity1.mul(BigNumber.from(depositInterval1)).div(BigNumber.from(timeToConclusion1))
	console.log("TD1", capacity1.mul(ONEE18.mul(ONEE18)).div(initialPrice1).div(ONEE18).toString())
	console.log("TD2", capacity1.toString())
	console.log("MP", mP1.toString())

	/**
	 * @notice             creates a new market type
	 * @dev                current price should be in 9 decimals.
	 * @param _quoteToken  token used to deposit
	 * @param _market      [capacity (in REQ or quote), initial price / REQ (x decimals), debt buffer (3 decimals)]
	 * @param _booleans    [capacity in quote, fixed term]
	 * @param _terms       [vesting length (if fixed term) or vested timestamp, conclusion timestamp]
	 * @param _intervals   [deposit interval (seconds), tune interval (seconds)]
	 * @return id_         ID of new bond market
	 */

	const _quoteToken1 = pairWETH_USDC


	console.log("ARGS")
	console.log("quoteTioken", _quoteToken1)// IERC20 _quoteToken,
	console.log("market", [capacity1.toString(), initialPrice1.toString(), buffer1])
	console.log("booleans", [false, true])
	console.log("terms", [vesting1, conclusion1])
	console.log("intervals", [depositInterval1, tuneInterval1]
	)
	await execute('BondDepository', { from: localhost, log: true }, 'create',
		_quoteToken1, // IERC20 _quoteToken,
		[capacity1, initialPrice1, buffer1],
		[false, true],
		[vesting1, conclusion1],
		[depositInterval1, tuneInterval1]
	)

	console.log("deposit weth usdc pair LP")
	const payoutWethInp = wethPairBalance.div(10)
	console.log("amount", payoutWethInp.toString())
	const capacity2 = await depositoryContract.markets(1)
	console.log("capacity for 2nd LP", capacity2.capacity.toString())
	const marketPrice2 = await depositoryContract.marketPrice(1)
	// payout_ = ((_amount * 10**(2 * req.decimals())) / price) / (10**metadata[_id].quoteDecimals);
	const payout = payoutWethInp.mul(ONEE18).mul(ONEE18).div(marketPrice2).div(ONEE18)
	console.log("payout", payout.toString())

	await depositoryContract.deposit(
		1, // uint256 _id,
		payoutWethInp, // uint256 _amount,
		BigNumber.from('9999999999999999999999999999999'), // uint256 _maxPrice,
		localhost, // address _user,
		localhost // address _referral
	)

	const supply2 = await sReqtContract.circulatingSupply()
	console.log("curculating supply2", supply2.toString())

	const bp12 = await depositoryContract.marketPrice(1)
	console.log("bond price", bp12.toString())


};
export default func;
func.tags = ['bonding-depo-localhost'];
