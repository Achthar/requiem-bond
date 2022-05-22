/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IStakingHelper,
  IStakingHelperInterface,
} from "../IStakingHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IStakingHelper__factory {
  static readonly abi = _abi;
  static createInterface(): IStakingHelperInterface {
    return new utils.Interface(_abi) as IStakingHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IStakingHelper {
    return new Contract(address, _abi, signerOrProvider) as IStakingHelper;
  }
}
