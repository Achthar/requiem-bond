import { expect } from "./chai-setup";
import { BigNumber, Contract } from 'ethers'
import { ecsign } from 'ethereumjs-util'

import {
	keccak256,
	defaultAbiCoder,
	toUtf8Bytes,
	hexlify,
	parseUnits
} from 'ethers/lib/utils'
import { ethers, network } from "hardhat";



import { getApprovalDigest } from './shared/common'
import { maxUint256, toWei } from './shared/utilities'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
	TestPair__factory,
	WeightedPairBondingCalculator__factory,
	WeightedRequiemCalculator__factory,
	MockERC20__factory,
	Treasury__factory,
	BondDepo__factory,
	RequiemERC20Token__factory,
	Authority__factory
} from "../../types";


const TOTAL_SUPPLY = BigNumber.from('1000000000000000000')
const TEST_AMOUNT = BigNumber.from(1e9)

describe('Depo-Test', () => {


	// enum according to the contract
	enum STATUS {
		RESERVEDEPOSITOR,
		RESERVESPENDER,
		RESERVETOKEN,
		RESERVEMANAGER,
		ASSETDEPOSITOR,
		ASSET,
		ASSETMANAGER,
		RESERVEDEBTOR,
		REWARDMANAGER,
		SREQ,
		REQDEBTOR
	}


	let signers: SignerWithAddress[];

	let wallet: SignerWithAddress;
	let bob: SignerWithAddress;
	let carol: SignerWithAddress;
	let other: SignerWithAddress;
	let deployWallet: any;

	let tokenA: Contract
	let tokenB: Contract
	let tokenC: Contract
	let tokenUSDC: Contract
	let tokenUSDT: Contract
	let tokenDAI: Contract
	let tokenTUSD: Contract
	let weth: Contract
	let formula: Contract
	let factory: Contract
	let calculatorRequiemNative: Contract
	let calculatorRequiem: Contract
	let treasury: Contract


	let depo: Contract
	let req: Contract


	let pairA_USDC_Contract: Contract
	let pairDAI_B_Contract: Contract
	let pairA_B_Contract: Contract
	let pairB_C_Contract: Contract
	let pairTest_Contract: Contract
	let authority: Contract
	// specs for pair
	let tokenWeightA = BigNumber.from(20)
	let swapFee = BigNumber.from(10)
	let amplification = BigNumber.from(15000)

	let newSwapFee = BigNumber.from(20)
	let newAmplification = BigNumber.from(20000)

	let reserve0 = parseUnits('50', 18)
	let reserve1 = parseUnits('60', 18)

	let vReserve0 = parseUnits('55', 18)
	let vReserve1 = parseUnits('70', 18)

	let weight0 = 70
	let weight1 = 30


	let ZERO = BigNumber.from(0)
	let testPair: Contract
	let deadline = '9999999999999999'

	let tokenWeightB = BigNumber.from(60)

	let supply = parseUnits('10000', 18)
	let amountIn: BigNumber
	let amountOut: BigNumber

	let amountC = parseUnits('3231', 8)
	const amountInMax = ethers.constants.MaxUint256
	let amountUSDC = parseUnits('10010', 6)
	let amountDAI = parseUnits('10000', 18)

	let timelock = BigNumber.from(0)
	let meta: any
	let markets: any[]
	let marketPrice: any
	let userTerms: any[]
	let userTerm: any
	let excessReserves: any
	let balance: any
	let payout: any
	let bid: number
	// Additional info about market.
	//   struct Metadata {
	//     uint48 lastTune; // last timestamp when control variable was tuned
	//     uint48 lastDecay; // last timestamp when market was created and debt was decayed
	//     uint48 length; // time from creation to conclusion. used as speed to decay debt.
	//     uint48 depositInterval; // target frequency of deposits
	//     uint48 tuneInterval; // frequency of tuning
	//     uint8 quoteDecimals; // decimals of quote token
	//   }


	beforeEach(async () => {
		// deployWallet = await ethers.Wallet.fromMnemonic(((network.config.accounts) as any).mnemonic);
		const signers = await ethers.getSigners();
		wallet = signers[0];
		bob = signers[1];
		carol = signers[2];

		// tokens
		tokenA = await new MockERC20__factory(wallet).deploy("token A", "A", 18)
		tokenB = await new MockERC20__factory(wallet).deploy("token B", "B", 18)
		tokenC = await new MockERC20__factory(wallet).deploy("token C", "C", 8)

		// stables
		tokenUSDC = await new MockERC20__factory(wallet).deploy("MockUSDC", "MUSDC", 6)
		tokenUSDT = await new MockERC20__factory(wallet).deploy("MockUSDT", "MUSDT", 6)
		tokenDAI = await new MockERC20__factory(wallet).deploy("MockDAI", "MDAI", 18)
		tokenTUSD = await new MockERC20__factory(wallet).deploy("MockTUSD", "MTUSD", 18)

		// mint

		await tokenDAI.mint(wallet.address, parseUnits('100', 18))

		// requiem token
		req = await new RequiemERC20Token__factory(wallet).deploy()

		//authority
		authority = await new Authority__factory(wallet).deploy(wallet.address, wallet.address, wallet.address, wallet.address)

		// calculators
		calculatorRequiem = await new WeightedPairBondingCalculator__factory(wallet).deploy(tokenDAI.address)
		calculatorRequiemNative = await new WeightedRequiemCalculator__factory(wallet).deploy(tokenA.address)

		// test pair
		testPair = await new TestPair__factory(wallet).deploy(tokenA.address, tokenDAI.address, weight0, weight1)
		await testPair.setReserves(reserve0, reserve1, vReserve0, vReserve1)

		await testPair.mint(wallet.address, supply)


		treasury = await new Treasury__factory(wallet).deploy(req.address, timelock, authority.address)

		await req.setMinter(treasury.address, ethers.constants.MaxUint256)
		// await req.setMinter(wallet.address, parseUnits('1', 18))
		// await req.mint(wallet.address, parseUnits('1', 18))
	})
	describe('Asset Backed Requiem', async () => {

		it('test calculator', async () => {


			const val = await calculatorRequiem.getTotalValue(testPair.address)
			expect(val.toString()).to.equal('208484848484848484848') // 208.484848485
			console.log("VAL", val.toString())
		})


		it('test requiem calculator', async () => {


			const val = await calculatorRequiemNative.getTotalValue(testPair.address)
			// console.log("VAL", val.toString())
			expect(val.toString()).to.equal('110000000000000000000') // 110.00


			const markdown = await calculatorRequiemNative.markdown(testPair.address)
			// console.log("Markdown", markdown.toString())
			expect(markdown.toString()).to.equal('1090909090909090909') // 110.00

		})
	})

	it('Treasury', async () => {
		// deploy depo
		depo = await new BondDepo__factory(wallet).deploy(authority.address, req.address, treasury.address)

		// init treasury
		await treasury.initialize()

		// console.log("queueTimelock depositor")
		await treasury.queueTimelock(
			STATUS.ASSETDEPOSITOR, // STATUS _managing,
			wallet.address, // address _address,
			calculatorRequiemNative.address// address _calculator
		)
		await treasury.execute(0)


		// console.log("queueTimelock token")
		await treasury.queueTimelock(
			STATUS.ASSET, // STATUS _managing,
			testPair.address, // address _address,
			calculatorRequiemNative.address// address _calculator
		)
		await treasury.execute(1)

		// console.log("queueTimelock deposoitorC")
		await treasury.queueTimelock(
			STATUS.ASSETDEPOSITOR, // STATUS _managing,
			depo.address, // address _address,
			calculatorRequiemNative.address// address _calculator
		)
		await treasury.execute(2)

		// console.log("queueTimelock spender")
		await treasury.queueTimelock(
			STATUS.RESERVESPENDER, // STATUS _managing,
			depo.address, // address _address,
			calculatorRequiemNative.address// address _calculator
		)
		await treasury.execute(3)

		// console.log("queueTimelock rewardmanager")
		await treasury.queueTimelock(
			STATUS.REWARDMANAGER, // STATUS _managing,
			depo.address, // address _address,
			calculatorRequiemNative.address// address _calculator
		)
		await treasury.execute(4)


		// console.log("queueTimelock rewardmanager")
		await treasury.queueTimelock(
			STATUS.RESERVETOKEN, // STATUS _managing,
			tokenDAI.address, // address _address,
			ethers.constants.AddressZero// address _calculator
		)
		await treasury.execute(5)

		// console.log("queueTimelock rewardmanager")
		await treasury.queueTimelock(
			STATUS.RESERVEDEPOSITOR, // STATUS _managing,
			wallet.address, // address _address,
			ethers.constants.AddressZero// address _calculator
		)
		await treasury.execute(6)



		// deposit base reserve

		await tokenDAI.approve(treasury.address, ethers.constants.MaxUint256)
		await treasury.deposit(
			parseUnits('100', 18), // uint256 _amount,
			tokenDAI.address, // address _token,
			parseUnits('99', 18) // uint256 _profit
		)

		balance = await req.balanceOf(wallet.address)
		// console.log("BALANCE", balance.toString())
		await treasury.auditReserves()

		excessReserves = await treasury.excessReserves()

		// console.log("EXCESS RESERVES", excessReserves.toString())

		// params
		const capacity = parseUnits('50000', 18)
		const initialPrice = parseUnits('4', 18)
		const buffer = 2e5;

		const vesting = 100000;
		const timeToConclusion = 60 * 60 * 24;

		const depositInterval = 60 * 60 * 30;
		const tuneInterval = 60 * 60;

		const block = await ethers.provider.getBlock("latest");
		const conclusion = block.timestamp + timeToConclusion;

		console.log("CREATE")
		// it('create market', async () => {
		// create market
		await depo.create(
			testPair.address, // IERC20 _quoteToken,
			[capacity, initialPrice, buffer],
			[false, true],
			[vesting, conclusion],
			[depositInterval, tuneInterval]
		)
		describe('Market Data', async () => {
			await depo.create(
				testPair.address, // IERC20 _quoteToken,
				[capacity, initialPrice, buffer],
				[false, true],
				[vesting, conclusion],
				[depositInterval, tuneInterval]
			)
			it('has the correct market created', async () => {
				markets = await depo.liveMarkets()
				console.log("MARKETS", markets)
				expect(markets[0]).to.equal(0)
			})



			it("should update IDs of markets", async () => {
				// create a second bond
				await depo.create(
					tokenDAI.address,
					[capacity, initialPrice, buffer],
					[false, true],
					[vesting, conclusion],
					[depositInterval, tuneInterval]
				);
				// close the first bond
				await depo.close(0);
				const [first] = await depo.liveMarkets();
				expect(Number(first)).to.equal(1);
			});

		})

		// markets = await depo.liveMarkets()
		// meta = await depo.metadata(0)
		// marketPrice = await depo.marketPrice(0)
		// console.log("MARKETS", markets, meta, marketPrice.toString())
		payout = await depo.payoutFor(parseUnits('390', 18), 0)

		await testPair.approve(depo.address, ethers.constants.MaxUint256)
		console.log("DEPOSIT", payout.toString())
		await depo.deposit(
			0, // uint256 _id,
			parseUnits('390', 18), // uint256 _amount,
			ethers.constants.MaxUint256, // uint256 _maxPrice,
			wallet.address, // address _user,
			wallet.address // address _referral
		)

		excessReserves = await treasury.excessReserves()

		console.log("EXCESS RESERVES POST DEPO PRE AUDIT", excessReserves.toString())

		await treasury.auditReserves()

		excessReserves = await treasury.excessReserves()

		describe('Price', async () => {
			const bs = await treasury.baseSupply()
			console.log("BS", bs.toString())
			bid = 0
			it("should start with price at initial price", async () => {
				let lowerBound = initialPrice.mul(9999).div(10000)
				const price = await depo.marketPrice(bid)
				console.log("LB", lowerBound, price)
				expect(Number(await depo.marketPrice(bid))).to.be.greaterThan(lowerBound);
			});

			it("should give accurate payout for price", async () => {
				let price = await depo.marketPrice(bid);
				let amount = parseUnits('10000', 18) // 10,000
				let expectedPayout = amount.div(price);
				let lowerBound = expectedPayout.mul(9999).div(10000) // * 0.9999;
				console.log("PRICE", price)
				expect(Number(await depo.payoutFor(amount, 0))).to.be.greaterThan(Number(lowerBound.toString()));
			});

		})


		describe('Interval', async () => {
			bid = 0
			markets = await depo.liveMarkets()
			console.log("markets", markets)
			it("should decay a max payout in target deposit interval", async () => {
				let [, , , , , maxPayout, ,] = await depo.markets(bid);
				let price = await depo.marketPrice(bid);
				let amount = maxPayout * price;
				await depo.connect(bob).deposit(
					bid,
					amount, // amount for max payout
					initialPrice,
					bob.address,
					wallet.address
				);
				await network.provider.send("evm_increaseTime", [depositInterval]);
				let newPrice = await depo.marketPrice(bid);
				expect(Number(newPrice)).to.be.lessThan(initialPrice);
			});
		});


		describe('Redeems UserTerms', async () => {
			userTerm = await depo.userTerms(wallet.address, 0)
			console.log('TERM', userTerm)

			it('creates userTerms correctly', () => {

			})

			it('does not redeem early', () => {

			})

			await network.provider.send("evm_increaseTime", [vesting])
			it('redeems if matured', () => {


			})
		})

		console.log("EXCESS RESERVES POST AUDIT POST DEPO", excessReserves.toString())



		describe('Concluded', () => {
			it('reverts when concluded', async () => {
				await network.provider.send("evm_increaseTime", [vesting])
				await expect(depo.deposit(
					0, // uint256 _id,
					parseUnits('200', 18), // uint256 _amount,
					ethers.constants.MaxUint256, // uint256 _maxPrice,
					wallet.address, // address _user,
					wallet.address // address _referral
				)).to.be.revertedWith('Depository: market concluded')
			})
		})

		await network.provider.send("evm_increaseTime", [vesting])


		// await network.provider.send("evm_setNextBlockTimestamp", [3600 * 24 * 10])
		const val = await calculatorRequiem.getTotalValue(testPair.address)
		expect(val.toString()).to.equal('208484848484848484848') // 208.484848485
		// })

	})

})
