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

	// const reqt = await deploy('RequiemERC20Token', {
	// 	contract: 'RequiemERC20Token',
	// 	from: deployer,
	// 	log: true,
	// 	args: [],
	// });

	const reqtFactory = await ethers.getContractFactory('RequiemERC20Token');
	console.log("deploy reqt")
	const reqt = await reqtFactory.deploy(
	);
	console.log("addr", reqt.address)

	const reqtAddr = reqt.address //'0x00c9ac8d414Ea3C7466F27431133dD989d8f20Df'
	const reqtContract = await ethers.getContractAt('RequiemERC20Token', reqtAddr);
	console.log("connect")
	reqtContract.connect(deployer)
	console.log("setminter")
	await reqtContract.setMinter(deployer, '1000000000000000000000000')
	console.log("mint")
	await reqtContract.mint(deployer, '1000000000000000000000000') // 1m tokens

	console.log("deployment and minting pof REQT Token done")


};
export default func;
func.tags = ['reqt-oasis-test'];
