import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers, waffle } from 'hardhat';

// const { solidity } = 'ethereum-waffle'
// const { expect } = 'chai'
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from "ethers";
import { constants } from 'ethers';
import { Console, time } from 'console';
// import { deploy, deployedAt } from "./contract";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, execute, get } = deployments;
	const { deployer, user } = await getNamedAccounts();
	const [owner,] = await ethers.getSigners()
	const ONEE18 = BigNumber.from('1000000000000000000')


	console.log('deployer', deployer);
	console.log('2ndParty', user);
	const provider = waffle.provider;


	const pairREQT_DAI = '0xcde9f3be9786e91b3b309bcf5f6de69c9ea8739c'

	console.log("get stables contracts")
	console.log("dai")
	const dai = await ethers.getContractFactory('MockERC20');
	const daiContract = await dai.attach('0xaea51e4fee50a980928b4353e852797b54deacd8');

	const bondingCalculatorAddress = '0x0122829337D9432D72382C7C8DEe57361D8BfD73'

	const REQ = await deploy('RequiemERC20Token', {
		contract: 'RequiemERC20Token',
		from: deployer,
		log: true,
		args: [],
	});

	const reqtContract = await ethers.getContractAt('RequiemERC20Token', REQ.address);

	await execute('RequiemERC20Token', { from: deployer, log: true }, 'setMinter', deployer, ethers.constants.MaxInt256);


	const sREQ = await deploy('sRequiem', {
		contract: 'sRequiem',
		from: deployer,
		log: true,
		args: [],
	});

	await execute('sRequiem', { from: deployer, log: true }, 'setIndex', '50000000000000000000')


	const gREQ = await deploy('gREQ', {
		contract: 'gREQ',
		from: deployer,
		log: true,
		args: [
			deployer,
			sREQ.address
		],
	});

	await execute('gREQ', { from: deployer, log: true }, 'mint', deployer, ONEE18.mul(BigNumber.from(10)))


	const authority = await deploy('Authority', {
		contract: 'Authority',
		from: deployer,
		log: true,
		args: [
			deployer, // address _governor,
			deployer, // address _guardian,
			deployer, // address _policy,
			deployer // address _vault
		],
	});
	const timeStamp = Math.round((new Date()).getTime() / 1000);

	const staking = await deploy('Staking', {
		contract: 'Staking',
		from: deployer,
		log: true,
		args: [
			REQ.address, //address _REQT,
			sREQ.address, // address _sREQT,
			gREQ.address,
			60 * 60 * 24 * 30 * 6,// uint256 _epochLength,
			1,// uint256 _firstEpochNumber,
			timeStamp + 60 * 60 * 24 * 30 * 6, // uint256 _firstEpochBlock
			authority.address
		],
	});
	console.log("init sreq")

	await execute('sRequiem', { from: deployer, log: true }, 'initialize', staking.address)

	const treasury = await deploy('Treasury', {
		contract: 'Treasury',
		from: deployer,
		log: true,
		args: [
			REQ.address, // address _req,
			0, // uint256 _timelock,
			authority.address // address _authority
		],
	});

	const bondingDepository = await deploy('BondDepository', {
		contract: 'BondDepository',
		from: deployer,
		log: true,
		args: [
			authority.address, // IAuthority _authority,
			REQ.address, // IERC20 _req,
			gREQ.address, // IgREQ _greq,
			staking.address, // IStaking _staking,
			treasury.address// ITreasury _treasury
		],
	});

	console.log('set treasury as minter')
	await execute('RequiemERC20Token', { from: deployer, log: true }, 'setMinter', treasury.address, ethers.constants.MaxInt256);
	await execute('RequiemERC20Token', { from: deployer, log: true }, 'mint', treasury.address, ONEE18.mul('1000000'));

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

	console.log("connect to treasury")


	console.log("init Treasury")
	await execute('Treasury', { from: deployer, log: true }, 'initialize')

	console.log("queueTimelock depositor")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.LIQUIDITYDEPOSITOR, // STATUS _managing,
		deployer, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 0)


	console.log("queueTimelock token")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.LIQUIDITYTOKEN, // STATUS _managing,
		pairREQT_DAI, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 1)

	console.log("queueTimelock deposoitorC")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.LIQUIDITYDEPOSITOR, // STATUS _managing,
		bondingDepository.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 2)

	console.log("queueTimelock spender")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.RESERVESPENDER, // STATUS _managing,
		bondingDepository.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 3)

	console.log("queueTimelock rewardmanager")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.REWARDMANAGER, // STATUS _managing,
		bondingDepository.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 4)

	console.log("queueTimelock reserveToken")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.RESERVETOKEN, // STATUS _managing,
		reqtContract.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 5)


	console.log("queueTimelock reserveToken g")

	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.RESERVETOKEN, // STATUS _managing,
		gREQ.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 6)

	console.log("queueTimelock sreq")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.SREQ, // STATUS _managing,
		sREQ.address, // address _address,
		bondingCalculatorAddress// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 7)

	const wavaxUsdcLp = '0x1152803C660f86D262f9A235612ddc82f705c0bD'
	const weightedCalc = '0xf6E44b8210d6d0b07ff90ABD23d40b937079b161'
	console.log("queueTimelock wavaxLP LP")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.LIQUIDITYTOKEN, // STATUS _managing,
		wavaxUsdcLp, // address _address,
		weightedCalc// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 8)


	const stableCalculator = '0x788E4f71c710f3dbe028aA19aD52afc42f24F904'
	const stableLP = '0x3372DE341A07418765Ae12f77aEe9029EaA4442A'
	console.log("queueTimelock stable LP")
	await execute('Treasury', { from: deployer, log: true }, 'queueTimelock',
		STATUS.LIQUIDITYTOKEN, // STATUS _managing,
		stableLP, // address _address,
		stableCalculator// address _calculator
	)
	await execute('Treasury', { from: deployer, log: true }, 'execute', 9)


	// await execute('RequiemERC20Token', { from: deployer, log: true }, 'mint', treasury.address, '1000000000000000000000')
	// await daiContract.mint(treasury.address, '1000000000000000000000000')
	await execute('gREQ', { from: deployer, log: true }, 'mint', treasury.address, ONEE18)
	await execute('gREQ', { from: deployer, log: true }, 'migrate', staking.address, sREQ.address)

	const bn2 = await ethers.provider.getBlockNumber()
	console.log("block number", bn2)



	const capacity = BigNumber.from('500000').mul(ONEE18);
	const initialPrice = BigNumber.from('4').mul(ONEE18);
	const buffer = 2e5;

	const vesting = 100000;
	const timeToConclusion = 60 * 60 * 24 * 30 * 6;

	const depositInterval = 60 * 60 * 30;
	const tuneInterval = 60 * 60;

	const refReward = 10;
	const daoReward = 50;

	// var bid = 0;
	const block = await ethers.provider.getBlock("latest");
	const conclusion = block.timestamp + timeToConclusion;

	const mP = capacity.mul(BigNumber.from(depositInterval)).div(BigNumber.from(timeToConclusion))
	console.log("TD1", capacity.mul(ONEE18.mul(ONEE18)).div(initialPrice).div(ONEE18).toString())
	console.log("TD2", capacity.toString())
	console.log("MP", mP.toString())

	await execute('BondDepository', { from: deployer, log: true }, 'setRewards', refReward, daoReward);
	await execute('Treasury', { from: deployer, log: true }, 'auditReserves')


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

	console.log("create req bond")
	const _quoteToken = pairREQT_DAI

	const _market = ["9000000000000000000000000", "3650000000000000000", "200000"].map(n => BigNumber.from(n))

	const _booleans = [0, 1]

	const _terms = [15552000, timeStamp + 15552000]

	const _intervals = [86400, 86400]
	await execute('BondDepository', { from: deployer, log: true }, 'create',
		_quoteToken, // IERC20 _quoteToken,
		_market, // [capacity, initialPrice, buffer],
		_booleans, // [false, true],
		_terms, // [vesting, conclusion],
		_intervals// [depositInterval, tuneInterval]
	)


	console.log("create wavax bond")
	const _quoteToken1 = wavaxUsdcLp // 

	const _market1 = ["9000000000000000000000000", "4050000000000000000", "200000"].map(n => BigNumber.from(n))

	const _booleans1 = [0, 1]

	const _terms1 = [60 * 60 * 24 * 30 * 6, timeStamp + 60 * 60 * 24 * 30 * 6]

	const _intervals1 = [86400, 86400]
	await execute('BondDepository', { from: deployer, log: true }, 'create',
		_quoteToken1, // IERC20 _quoteToken,
		_market1, // [capacity, initialPrice, buffer],
		_booleans1, // [false, true],
		_terms1, // [vesting, conclusion],
		_intervals1// [depositInterval, tuneInterval]
	)


	console.log("create stable LP bond")
	const _quoteToken2 = wavaxUsdcLp // 

	const _market2 = ["9000000000000000000000000", "4050000000000000000", "200000"].map(n => BigNumber.from(n))

	const _booleans2 = [0, 0]

	const _terms2 = [60 * 60 * 24 * 30 * 6, timeStamp + 60 * 60 * 24 * 30 * 6]

	const _intervals2 = [86400, 86400]
	await execute('BondDepository', { from: deployer, log: true }, 'create',
		_quoteToken2, // IERC20 _quoteToken,
		_market2, // [capacity, initialPrice, buffer],
		_booleans2, // [false, true],
		_terms2, // [vesting, conclusion],
		_intervals2// [depositInterval, tuneInterval]
	)

};
export default func;
func.tags = ['bonding-tokens-staking-fuji'];
