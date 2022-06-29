/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IUserTermsKeeper,
  IUserTermsKeeperInterface,
} from "../IUserTermsKeeper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "indexesFor",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "pendingFor",
    outputs: [
      {
        internalType: "uint256",
        name: "payout_",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "matured_",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "payoffClaimable_",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "pullTerms",
    outputs: [
      {
        internalType: "uint256",
        name: "newIndex_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "pushTerms",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IUserTermsKeeper__factory {
  static readonly abi = _abi;
  static createInterface(): IUserTermsKeeperInterface {
    return new utils.Interface(_abi) as IUserTermsKeeperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUserTermsKeeper {
    return new Contract(address, _abi, signerOrProvider) as IUserTermsKeeper;
  }
}
