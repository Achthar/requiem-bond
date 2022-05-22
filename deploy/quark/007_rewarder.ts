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

	const reqtAddress = '0x2d90e6d9368b2838a9558B0a609750243C5C4679'
	const requiemChef = '0xD4864BA8C00Eda17eFcbd0163c3202b36E355007'

	const rewarder = await deploy('ComplexRewarderTime',
		{
			from: deployer,
			args: [
				reqtAddress, // IERC20 _rewardToken,
				1,// uint256 _rewardPerSecond,
				requiemChef// address _REQUIEM_CHEF
			],
			log: true,

		});



};
export default func;
func.tags = ['rewarder-fuji'];
