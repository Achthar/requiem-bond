/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PriceConsumer, PriceConsumerInterface } from "../PriceConsumer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_feed",
        type: "address",
      },
    ],
    name: "getLatestPriceData",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506101e9806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806357931c0f14610030575b600080fd5b61004361003e366004610107565b61007e565b6040805169ffffffffffffffffffff968716815260208101959095528401929092526060830152909116608082015260a00160405180910390f35b60008060008060008573ffffffffffffffffffffffffffffffffffffffff1663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa1580156100d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100f59190610163565b939a9299509097509550909350915050565b60006020828403121561011957600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811461013d57600080fd5b9392505050565b805169ffffffffffffffffffff8116811461015e57600080fd5b919050565b600080600080600060a0868803121561017b57600080fd5b61018486610144565b94506020860151935060408601519250606086015191506101a760808701610144565b9050929550929590935056fea264697066735822122092e4bff6b120c0946d1c6021dc16ba7471e8fe2c62717c4b66b117b2cc29d4e764736f6c634300080f0033";

export class PriceConsumer__factory extends ContractFactory {
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
  ): Promise<PriceConsumer> {
    return super.deploy(overrides || {}) as Promise<PriceConsumer>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PriceConsumer {
    return super.attach(address) as PriceConsumer;
  }
  connect(signer: Signer): PriceConsumer__factory {
    return super.connect(signer) as PriceConsumer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PriceConsumerInterface {
    return new utils.Interface(_abi) as PriceConsumerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PriceConsumer {
    return new Contract(address, _abi, signerOrProvider) as PriceConsumer;
  }
}
