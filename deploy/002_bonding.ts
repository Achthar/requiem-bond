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
	const { deployer , user } = await getNamedAccounts();

	// console.log('network', network);
	console.log('deployer ', deployer );
	console.log('2ndParty', user);
	const provider = waffle.provider;
	const balance0ETH = await provider.getBalance(deployer );
	console.log('deployer  balante', balance0ETH);

	// const t1 = await deploy('T1', {
	// 	contract: 'MockERC20',
	// 	from: deployer ,
	// 	log: true,
	// 	args: ['T1 Coin', 'T1', 6],
	// });

	// const t2 = await deploy('T2', {
	// 	contract: 'MockERC20',
	// 	from: deployer ,
	// 	log: true,
	// 	args: ['T2 Coin', 'T2', 6],
	// });

	// const t3 = await deploy('T3', {
	// 	contract: 'MockERC20',
	// 	from: deployer ,
	// 	log: true,
	// 	args: ['T3 Coin', 'T3', 18],
	// });


	// const t4 = await deploy('T4', {
	// 	contract: 'MockERC20',
	// 	from: deployer ,
	// 	log: true,
	// 	args: ['T4 Coin', 'T4', 18],
	// });

	// const weth = await deploy('TestWETH', {
	// 	contract: 'TestWETH',
	// 	from: deployer ,
	// 	log: true,
	// 	args: [deployer ],
	// });

	// await execute('T1', { from: deployer , log: true }, 'mint', deployer , parseUnits('10000000', 6));
	// await execute('T2', { from: deployer , log: true }, 'mint', deployer , parseUnits('10000000', 6));
	// await execute('T3', { from: deployer , log: true }, 'mint', deployer , parseUnits('10000000', 18));
	// await execute('T4', { from: deployer , log: true }, 'mint', deployer , parseUnits('10000000', 18));
	// await execute('T1', { from: deployer , log: true }, 'mint', user, parseUnits('10000000', 6) );
	// await execute('T2', { from: deployer , log: true }, 'mint', user, parseUnits('10000000', 6) );
	// await execute('T3', { from: deployer , log: true }, 'mint', user, parseUnits('10000000', 18) );
	// await execute('T4', { from: deployer , log: true }, 'mint', user, parseUnits('10000000', 18) );

	const wethAddress = '0xd00ae08403B9bbb9124bB305C09058E32C39A48c'//await getWeth(hre);

	// const weth = await ethers.getContractAt("IWETH", wethAddress);

	// const wethContract = await weth.attach(
	// 	wethAddress
	//   );
	// const vaultAuthorization = await deploy("VaultAuthorization", {
	// 	contract: "VaultAuthorization",
	// 	skipIfAlreadyDeployed: true,
	// 	from: deployer ,
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
		from: deployer ,
		args: [],
		log: true,
	});

	const factory = await deploy("RequiemFactory", {
		contract: "RequiemFactory",
		skipIfAlreadyDeployed: true,
		from: deployer ,
		args: [deployer , formula.address],
		log: true,
	});

	const pairManager = await deploy("RequiemQPairManager", {
		contract: "RequiemQPairManager",
		skipIfAlreadyDeployed: true,
		from: deployer ,
		args: [factory.address, wethAddress],
		log: true,
	});

	const router = await deploy("RequiemQRouter", {
		contract: "RequiemQRouter",
		skipIfAlreadyDeployed: true,
		from: deployer ,
		args: [factory.address, wethAddress],
		log: true,
	});

	// await execute('T1', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T2', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T3', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T4', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	// await execute('T1', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	// await execute('T2', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	// await execute('T3', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	// await execute('T4', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);

	await execute('TestWETH', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);



	console.log("--- deploy stables --- ")

	const usdc = await deploy('USDC', {
		contract: 'MockERC20',
		from: deployer ,
		log: true,
		args: ['USD Coin', 'USDC', 6],
	});

	const usdt = await deploy('USDT', {
		contract: 'MockERC20',
		from: deployer ,
		log: true,
		args: ['Tether USD', 'USDT', 6],
	});

	const dai = await deploy('DAI', {
		contract: 'MockERC20',
		from: deployer ,
		log: true,
		args: ['DAI Stablecoin', 'DAI', 18],
	});


	const tusd = await deploy('TUSD', {
		contract: 'MockERC20',
		from: deployer ,
		log: true,
		args: ['True USD', 'TUSD', 18],
	});

	await execute('USDC', { from: deployer , log: true }, 'mint', deployer , parseUnits('100000000000', 6));
	await execute('USDT', { from: deployer , log: true }, 'mint', deployer , parseUnits('100000000000', 6));
	await execute('DAI', { from: deployer , log: true }, 'mint', deployer , parseUnits('100000000000', 18));
	await execute('TUSD', { from: deployer , log: true }, 'mint', deployer , parseUnits('100000000000', 18));

	await execute('USDC', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('USDT', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('DAI', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);
	await execute('TUSD', { from: deployer  }, 'approve', router.address, ethers.constants.MaxInt256);


	const deadline = Math.floor(Date.now() / 1000 + 7200);



	await execute('USDC', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('USDT', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('DAI', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);
	await execute('TUSD', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);


	await execute('TestWETH', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);



	const factoryContract = await ethers.getContractAt('RequiemFactory', factory.address);
	// const routerContract = await ethers.getContract('RequiemRouter');


	// const liqWeth32 = await execute('RequiemQPairManager', { from: deployer  }, 'removeLiquidity', pairWeth, weth.address, t2.address,
	// 	BigNumber.from(1000),
	// 	BigNumber.from('1000000'),
	// 	BigNumber.from('10000000'),
	// 	deployer ,
	// 	deadline);
	// console.log("LP received weth t2", liqWeth32)
	const REQ = await deploy('RequiemERC20Token', {
		contract: 'RequiemERC20Token',
		from: deployer ,
		log: true,
		args: [],
	});

	await factoryContract.createPair(wethAddress, REQ.address, ethers.BigNumber.from(20), ethers.BigNumber.from(25))


	await execute('RequiemERC20Token', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);


	await execute('TestWETH', { from: deployer  }, 'approve', pairManager.address, ethers.constants.MaxInt256);

	const wethContract = await ethers.getContractAt('TestWETH', wethAddress);
	const reqtContract = await ethers.getContractAt('RequiemERC20Token', REQ.address);

	await wethContract.approve(pairManager.address, ethers.constants.MaxInt256)
	await reqtContract.approve(pairManager.address, ethers.constants.MaxInt256)

	await reqtContract.approve(router.address, ethers.constants.MaxInt256)

	await reqtContract.setVault(deployer )
	await reqtContract.mint(deployer , '1000000000098298432432')

	const allow = await reqtContract.allowance(deployer , pairManager.address)
	const allow1 = await wethContract.allowance(deployer , pairManager.address)
	console.log("approved", allow.toString(), allow1.toString())


	await ethers.getContractFactory('RequiemERC20Token');
	// const req = await REQ.deploy();

	// const MockBonding = await ethers.getContractFactory('RequiemQBondingCalculator');
	// const mockBonding = await MockBonding.deploy(REQ.address);

	const bondingCalculator = await deploy('RequiemQBondingCalculator', {
		contract: 'RequiemQBondingCalculator',
		from: deployer ,
		log: true,
		args: [REQ.address],
	});

	const bondingCalculatorContract = await ethers.getContractAt('RequiemQBondingCalculator', bondingCalculator.address);


	const sREQ = await deploy('sRequiem', {
		contract: 'sRequiem',
		from: deployer ,
		log: true,
		args: [],
	});

	const staking = await deploy('RequiemStaking', {
		contract: 'RequiemStaking',
		from: deployer ,
		log: true,
		args: [
			REQ.address, //address _REQT,
			sREQ.address, // address _sREQT,
			10000,// uint256 _epochLength,
			0,// uint256 _firstEpochNumber,
			0// uint256 _firstEpochBlock
		],
	});

	await factoryContract.createPair(REQ.address, dai.address, ethers.BigNumber.from(80), ethers.BigNumber.from(5))
	const pairREQT_DAI = await factoryContract.getPair(REQ.address, dai.address, ethers.BigNumber.from(80), ethers.BigNumber.from(5))
	console.log("deposit dai reqt", pairREQT_DAI)
	// await execute('TestWETH', { from: deployer , value: BigNumber.from('10000000000000') }, 'deposit')
	// console.log("addWETH Liquidity")



	const liqDaiREQT = await execute('RequiemQPairManager', { from: deployer  }, 'addLiquidity', pairREQT_DAI, REQ.address, dai.address,
		BigNumber.from('32000000000000000000'),
		BigNumber.from('20000000000000000'),
		BigNumber.from('32000000000000000000'),
		BigNumber.from('20000000000000000'),
		deployer ,
		'99999999999999999999');


	const tV4 = await bondingCalculatorContract.getTotalValue(pairREQT_DAI)

	console.log("indexValue DAI", tV4.toString())


	const treasury = await deploy('RequiemTreasury', {
		contract: 'RequiemTreasury',
		from: deployer ,
		log: true,
		args: [
			REQ.address,	// address _REQT,
			dai.address, // address _DAI,
			tusd.address,// address _Frax,
			pairREQT_DAI,// address _REQTDAI,
			0,// uint256 _blocksNeededForQueue
		],
	});

	const bondingDepository = await deploy('RequiemQBondDepository', {
		contract: 'RequiemQBondDepository',
		from: deployer ,
		log: true,
		args: [
			REQ.address, // address _REQT,
			pairREQT_DAI, // address _principle,
			treasury.address, // address _treasury,
			deployer , // address _DAO,
			bondingCalculator.address// address _bondCalculator
		],
	});

	console.log('set treasury as vault')
	await reqtContract.setVault(treasury.address)

	const depositoryContract = await ethers.getContractAt('RequiemQBondDepository', bondingDepository.address);
	const treasuryContract = await ethers.getContractAt('RequiemTreasury', treasury.address);

	console.log("get pair data")
	const pairContract = await ethers.getContractAt('RequiemERC20', pairREQT_DAI);
	const lpBalante = await pairContract.balanceOf(deployer )

	console.log("balante", lpBalante.toString())

	console.log("approve spending of treasury")


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

	console.log("set manager")
	await treasuryContract.pushManagement(deployer )

	console.log("depositor queue")

	await treasuryContract.queue(MANAGING.LIQUIDITYDEPOSITOR, deployer )

	console.log("toggle depositor")

	const dep = await treasuryContract.toggle(
		MANAGING.LIQUIDITYDEPOSITOR, // MANAGING _managing,
		deployer , // address _address,
		bondingCalculator.address// address _calculator
	)
	// console.log("toggle depositor", dep)

	// console.log("queue token")
	// await treasuryContract.queue(MANAGING.LIQUIDITYTOKEN, pairREQT_DAI)

	// const queue = await treasuryContract.LiquidityTokenQueue(pairREQT_DAI)
	// console.log("token queue", queue.toString())

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



	const bc2 = await treasuryContract.bondCalculator(pairREQT_DAI)
	console.log("is bc after toggle", bc2)
	// console.log("toggle token", togToken)

	const inp1 = '121432443232324322'

	const valparams = await treasuryContract['valueOfParams(address,uint256)'](
		pairREQT_DAI,// address _token, 
		inp1// uint256 _amount
	)

	console.log("params", valparams)

	let val = await treasuryContract['valueOf(address,uint256)'](
		pairREQT_DAI,// address _token, 
		inp1// uint256 _amount
	)
	const bn2 = await ethers.provider.getBlockNumber()
	console.log("block number", bn2)
	const wpairContract = await ethers.getContractAt('RequiemPair', pairREQT_DAI);
	const testVal = await wpairContract.calculateSwapGivenIn(REQ.address, REQ.address, inp1);


	console.log("value of ", inp1, val.toString())
	console.log("test value of ", inp1, testVal.toString())
	// console.log("val of call")
	//  let val = await execute('RequiemTreasury', { from: deployer  }, 'valueOf',
	// 	pairREQT_DAI,
	// 	'123321'
	// );

	const valparams1 = await treasuryContract['deposit(uint256,address,uint256)'](
		inp1,// uint256 _amount,
		pairREQT_DAI,// address _token,
		321// uint256 _profit
	)



	const x = await depositoryContract.payoutFor(
		lpBalante.div(10)// uint256 _value
	)
	console.log("payoutFor", x.toString())
	// console.log("value of ", 12132, val.toString())
	await depositoryContract.deposit(
		lpBalante.div(10),// uint256 _amount,
		'3213211', // uint256 _profit
		pairREQT_DAI, // address _token,
	)

	console.log("deposit done")

	// const MockPair = await ethers.getContractFactory('TestToken1');
	// const mockPair = await MockPair.deploy();

	// const BondingCalcContract = await ethers.getContractFactory('RequiemBondingCalculator');
	// const bondingCalcContract = await BondingCalcContract.deploy();

	// const Treasury = await ethers.getContractFactory('MockTreasury');
	// const treasury = await Treasury.deploy();

	// const BondingFacilitator = await ethers.getContractFactory('BondingFacilitator');
	// const bondingFacilitator = await BondingFacilitator.deploy();

	// await mockBonding.initialize(bondingFacilitator.address);
	// await bondingFacilitator.initialize(bondingCalcContract.address, req.address, mockBonding.address, treasury.address);

	// await mockPair.approve(mockBonding.address, '10000000000000000');
	// await mockPair.connect(user).approve(mockBonding.address, '10000000000000000');

	// await req.transferOwnership(bondingFacilitator.address);



	// let
	// 	Treasury,
	// 	treasury,
	// 	Trader, 
	// 	trader,
	// 	OLY,
	// 	oly,
	// 	DAI,
	// 	dai,
	// 	Sale,
	// 	sale,
	// 	deployer,
	// 	addr1

	// 	async () => {
	// 		const [deployer, addr1] = await ethers.getSigners();

	// 		const OLY = await ethers.getContractFactory('OlympusERC20TOken');
	// 		const oly = await OLY.deploy();

	// 		const DAI = await ethers.getContractFactory('DAI');
	// 		const dai = await DAI.deploy(9);

	// 		const Treasury = await ethers.getContractFactory('MockTreasury');
	// 		const treasury = await Treasury.deploy();

	// 		const Sale = await ethers.getContractFactory('OlySaleNew');
	// 		const sale = await Sale.deploy();

	// 		const Trader = await ethers.getContractFactory('UniV2CompatTrader');
	// 		const trader = await Trader.deploy();




	// 		it('should let the owner set the treasury address', async () => {
	// 			await sale.setTreasury(treasury.address);
	// 		});

	// 		it('should not let the owner set the treasury if it has already been set', async () => {
	// 			await sale.setTreasury(treasury.address);
	// 			await expect(sale.setTreasury(deployer.address)).to.be.revertedWith('');
	// 		});

	// 		it('should NOT let a non owner set the treasury address', async () => {
	// 			await expect(sale.connect(addr1).setTreasury(treasury.address)).to.be.revertedWith('');
	// 		});

	// 		it('should NOT let a non owner set the treasury if it has already been set', async () => {
	// 			await sale.setTreasury(treasury.address);
	// 			await expect(sale.connect(addr1).setTreasury(deployer.address)).to.be.revertedWith('');
	// 		});


	// 	describe('listToken()', () => {

	// 		it('should allow to list OLY as token to sell', async () => {
	// 			await sale.listToken(oly.address, dai.address, trader.address, deployer.address, deployer.address);
	// 		});

	// 		it('should allow to list DAI as token to sell', async () => {
	// 			await sale.listToken(dai.address, oly.address, trader.address, deployer.address, deployer.address);
	// 		});

	// 		it('should NOT allow non owner address to call function', async () => {
	// 			await expect(sale.connect(addr1).listToken(dai.address, oly.address, trader.address, deployer.address, deployer.address))
	// 			.to.be.revertedWith('');
	// 		});
	// 	});

	// 	describe('executeEpochSale()', () => {
	// 		it('function call should work', async () => {
	// 			await sale.executeEpochSale( oly.address, 10000000, 1000000000, 1, 2, 3);
	// 		});

	// 	});
	// }


};
export default func;
func.tags = ['bonding-fuji'];
