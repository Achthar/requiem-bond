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
	MockERC20__factory
} from "../../types";


const TOTAL_SUPPLY = BigNumber.from('1000000000000000000')
const TEST_AMOUNT = BigNumber.from(1e9)

describe('Calculator-Test', () => {


	let signers: SignerWithAddress[];

	let wallet: SignerWithAddress;
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
	let router: Contract


	let feeDistributor: Contract
	let thiefRouter: Contract


	let pairA_USDC_Contract: Contract
	let pairDAI_B_Contract: Contract
	let pairA_B_Contract: Contract
	let pairB_C_Contract: Contract
	let pairTest_Contract: Contract

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

	let supply = parseUnits('55', 18)
	let amountIn: BigNumber
	let amountOut: BigNumber

	let amountC = parseUnits('3231', 8)
	const amountInMax = ethers.constants.MaxUint256
	let amountUSDC = parseUnits('10010', 6)
	let amountDAI = parseUnits('10000', 18)

	beforeEach(async () => {
		deployWallet = await ethers.Wallet.fromMnemonic(((network.config.accounts) as any).mnemonic);
		signers = await ethers.getSigners();
		wallet = signers[0];
		other = signers[1];

		// tokens
		tokenA = await new MockERC20__factory(wallet).deploy("token A", "A", 18)
		tokenB = await new MockERC20__factory(wallet).deploy("token B", "B", 18)
		tokenC = await new MockERC20__factory(wallet).deploy("token C", "C", 8)
		tokenUSDC = await new MockERC20__factory(wallet).deploy("MockUSDC", "MUSDC", 6)
		tokenUSDT = await new MockERC20__factory(wallet).deploy("MockUSDT", "MUSDT", 6)
		tokenDAI = await new MockERC20__factory(wallet).deploy("MockDAI", "MDAI", 18)
		tokenTUSD = await new MockERC20__factory(wallet).deploy("MockTUSD", "MTUSD", 18)

		calculatorRequiem = await new WeightedPairBondingCalculator__factory(wallet).deploy(tokenDAI.address)
		calculatorRequiemNative = await new WeightedRequiemCalculator__factory(wallet).deploy(tokenA.address)

		testPair = await new TestPair__factory(wallet).deploy(tokenA.address, tokenDAI.address, weight0, weight1)
		await testPair.setReserves(reserve0, reserve1, vReserve0, vReserve1)
		await testPair.mint(supply, wallet.address)


	})
	describe('Calculator', () => {

		it('test calculator', async () => {


			const val = await calculatorRequiem.getTotalValue(testPair.address)
			expect(val.toString()).to.equal('208484848484848484848') // 208.484848485
			console.log("VAL", val.toString())
		})


		it('test requiem calculator', async () => {


			const val = await calculatorRequiemNative.getTotalValue(testPair.address)
			console.log("VAL", val.toString())
			expect(val.toString()).to.equal('110000000000000000000') // 110.00


			const markdown = await calculatorRequiemNative.markdown(testPair.address)
			console.log("Markdown", markdown.toString())
			expect(markdown.toString()).to.equal('1090909090909090909') // 110.00

		})
	})

})
