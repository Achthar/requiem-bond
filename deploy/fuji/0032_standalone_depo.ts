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

	const pairWAVAX_USDC = '0x1152803C660f86D262f9A235612ddc82f705c0bD'

	const calculator = '0x7b4E3397CCcc97Bbd93dAF582575858f7Db092e6'

	const reqtAddress = '0x2d90e6d9368b2838a9558B0a609750243C5C4679'

	const treasuryAddress = '0x30E4242b17Cda7e6C5F05B7b2cE35A38e06BD7Ee'

	const bondingDepository = await deploy('RequiemQBondDepository', {
		contract: 'RequiemQBondDepository',
		from: deployer,
		log: true,
		// skipIfAlreadyDeployed: true,
		args: [
			reqtAddress, // address _reqtT,
			pairWAVAX_USDC, // address _principle,
			treasuryAddress, // address _treasury,
			deployer, // address _DAO,
			calculator// address _bondCalculator
		],
	});


	console.log("deployment of bonding depo done")


};
export default func;
func.tags = ['bonding-depo-regular-fuji'];

