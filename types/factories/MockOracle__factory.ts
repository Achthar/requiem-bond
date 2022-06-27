/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockOracle, MockOracleInterface } from "../MockOracle";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastRoundId",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "refPice",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "_price",
        type: "int256",
      },
    ],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50670de0b6b3a7640000600055600180546001600160501b031916905561034b8061003c6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80639a6fc8f51161005b5780639a6fc8f514610122578063b188725814610173578063f7a308061461017c578063feaf968c1461019157600080fd5b8063313ce5671461008d578063388ca80f146100a157806354fd4d50146100d25780637284e416146100e3575b600080fd5b604051601281526020015b60405180910390f35b6001546100b79069ffffffffffffffffffff1681565b60405169ffffffffffffffffffff9091168152602001610098565b60005b604051908152602001610098565b604080518082018252600481527f4d4f434b00000000000000000000000000000000000000000000000000000000602082015290516100989190610201565b61013c610130366004610274565b60008054919242918291565b6040805169ffffffffffffffffffff968716815260208101959095528401929092526060830152909116608082015260a001610098565b6100d560005481565b61018f61018a3660046102a7565b6101b0565b005b61013c6001546000805469ffffffffffffffffffff9092169242918291565b600081815560018054909182916101d490839069ffffffffffffffffffff166102c0565b92506101000a81548169ffffffffffffffffffff021916908369ffffffffffffffffffff16021790555050565b600060208083528351808285015260005b8181101561022e57858101830151858201604001528201610212565b81811115610240576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60006020828403121561028657600080fd5b813569ffffffffffffffffffff811681146102a057600080fd5b9392505050565b6000602082840312156102b957600080fd5b5035919050565b600069ffffffffffffffffffff80831681851680830382111561030c577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b0194935050505056fea26469706673582212208220b20bae8e062e6563da921633cf94eacbae2d64acd8ca1b45f1a492ff3b1764736f6c634300080f0033";

export class MockOracle__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockOracle> {
    return super.deploy(overrides || {}) as Promise<MockOracle>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockOracle {
    return super.attach(address) as MockOracle;
  }
  connect(signer: Signer): MockOracle__factory {
    return super.connect(signer) as MockOracle__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockOracleInterface {
    return new utils.Interface(_abi) as MockOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockOracle {
    return new Contract(address, _abi, signerOrProvider) as MockOracle;
  }
}
