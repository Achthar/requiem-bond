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
	
	const reqt = await deploy('RequiemERC20Token', {
		contract: 'RequiemERC20Token',
		from: deployer,
		log: true,
		args: [],
	});

	const reqtContract = await ethers.getContractAt('RequiemERC20Token', reqt.address);

	await reqtContract.setMinter(deployer, '1000000000000000000000000')
	await reqtContract.mint(deployer, '1000000000000000000000000') // 1m tokens

	console.log("deployment and minting pof REQT Token done")


};
export default func;
func.tags = ['reqt-quark-test-s0'];
