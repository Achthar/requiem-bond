import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers, waffle } from 'hardhat';

// const { solidity } = 'ethereum-waffle'
// const { expect } = 'chai'
import { DeployFunction } from "hardhat-deploy/types";
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from "ethers";
import { constants } from 'ethers';
import { Console } from 'console';
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


	const capacity = BigNumber.from('4000000').mul(ONEE18);
	const initialPrice = BigNumber.from('4').mul(ONEE18);
	const buffer = 2e5;

	const vesting = 100000;
	const timeToConclusion = 60 * 60 * 24;

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

	await execute('BondDepository', { from: deployer, log: true }, 'setRewards', refReward, daoReward);

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

	await execute('BondDepository', { from: deployer, log: true }, 'create',
		_quoteToken, // IERC20 _quoteToken,
		[capacity, initialPrice, buffer],
		[false, true],
		[vesting, conclusion],
		[depositInterval, tuneInterval]
	)

	const mD = await execute('BondDepository', { from: deployer, log: true }, 'metadata', 0)
	const dR = await execute('BondDepository', { from: deployer, log: true }, 'debtRatio', 0)
	const cD = await execute('BondDepository', { from: deployer, log: true }, 'currentDebt', 0)
	const bS = await execute('Treasury', { from: deployer, log: true }, 'baseSupply')
	const tD = await execute('Treasury', { from: deployer, log: true }, 'totalDebt')
	const tR = await execute('Treasury', { from: deployer, log: true }, 'totalReserves')
	const terms = await execute('BondDepository', { from: deployer, log: true }, 'terms', 0)
	const cV = await execute('BondDepository', { from: deployer, log: true }, 'currentControlVariable', 0)
	const excessRes = await execute('Treasury', { from: deployer, log: true }, 'excessReserves')
	const tS = await execute('RequiemERC20', { from: deployer, log: true }, 'totalSupply')

	console.log("metaData", mD)
	console.log("debtRatio", dR.toString())
	console.log("currentDebt", cD.toString())
	console.log("baseSupply", bS.toString())
	console.log("totalDebt", tD.toString())
	console.log("totalReserves", tR.toString())
	console.log("totalSupply", tS.toString())
	console.log("terms", terms)
	// console.log("CVariable", terms.controlVariable.toString())
	console.log("CVariable Current", cV.toString())
	console.log("excess Reserves", excessRes.toString())

	const bp = await execute('BondDepository', { from: deployer, log: true }, 'marketPrice',
		0
	)
	console.log("bond price", bp.toString())
	// console.log("bond price manual", cV.mul(dR).div(BigNumber.from('1000000000000000000')).toString())

	const payoutInp = BigNumber.from(ONEE18.mul(BigNumber.from('10')))

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
	await execute('BondDepository', { from: deployer, log: true }, 'deposit',
		0, // uint256 _id,
		payoutInp, // uint256 _amount,
		BigNumber.from('9999999999999999999999999999999'), // uint256 _maxPrice,
		deployer, // address _user,
		deployer // address _referral
	)

	const mD1 = await execute('BondDepository', { from: deployer, log: true }, 'metadata', 0)
	const dR1 = await execute('BondDepository', { from: deployer, log: true }, 'debtRatio', 0)
	const cD1 = await execute('BondDepository', { from: deployer, log: true }, 'currentDebt', 0)
	const bS1 = await execute('Treasury', { from: deployer, log: true }, 'baseSupply')
	const tD1 = await execute('Treasury', { from: deployer, log: true }, 'totalDebt')
	const tR1 = await execute('Treasury', { from: deployer, log: true }, 'totalReserves')
	const terms1 = await execute('BondDepository', { from: deployer, log: true }, 'terms', 0)
	const cV1 = await execute('BondDepository', { from: deployer, log: true }, 'currentControlVariable', 0)
	const excessRes1 = await execute('Treasury', { from: deployer, log: true }, 'excessReserves')
	const tS1 = await execute('RequiemERC20', { from: deployer, log: true }, 'totalSupply')

	console.log("metaData", mD1)
	console.log("debtRatio", dR1.toString())
	console.log("currentDebt", cD1.toString())
	console.log("baseSupply", bS1.toString())
	console.log("totalDebt", tD1.toString())
	console.log("totalReserves", tR1.toString())
	console.log("totalSupply", tS1.toString())
	console.log("terms", terms1)
	// console.log("CVariable", terms1.controlVariable.toString())
	console.log("CVariable Current", cV1.toString())
	console.log("excess Reserves", excessRes1.toString())


	const bp1 = await execute('BondDepository', { from: deployer, log: true }, 'marketPrice', 0)
	console.log("bond price", bp1.toString())
	// console.log("bond price manual", cV1.mul(dR1).div(BigNumber.from('1000000000000000000')).toString())

};
export default func;
func.tags = ['bonding-create-fuji'];
