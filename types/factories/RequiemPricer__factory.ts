/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { RequiemPricer, RequiemPricerInterface } from "../RequiemPricer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_REQ",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "REQ",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getTotalSlashedValue",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "address",
        name: "_quote",
        type: "address",
      },
    ],
    name: "getTotalValue",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "address",
        name: "_quote",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "slashedValuation",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "address",
        name: "_quote",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "valuation",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051610be3380380610be383398101604081905261002f91610053565b6001600160a01b03811661004257600080fd5b6001600160a01b0316608052610083565b60006020828403121561006557600080fd5b81516001600160a01b038116811461007c57600080fd5b9392505050565b608051610b3f6100a46000396000818160d001526103aa0152610b3f6000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c8063831abd4411610050578063831abd44146100a5578063ae25331c146100b8578063d2670025146100cb57600080fd5b806315739b001461006c5780635220084a14610092575b600080fd5b61007f61007a366004610722565b610117565b6040519081526020015b60405180910390f35b61007f6100a0366004610763565b6101b8565b61007f6100b3366004610722565b61042e565b61007f6100c6366004610763565b610437565b6100f27f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610089565b60008061012485856101b8565b905060008573ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610173573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610197919061079c565b9050806101a485846107e4565b6101ae9190610821565b9695505050505050565b6000808373ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b8152600401608060405180830381865afa158015610206573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022a919061085c565b905060008473ffffffffffffffffffffffffffffffffffffffff1663d21220a76040518163ffffffff1660e01b8152600401602060405180830381865afa158015610279573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061029d91906108e9565b73ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156102e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061030b919061090d565b610316906012610930565b61032190600a610a75565b90508473ffffffffffffffffffffffffffffffffffffffff1663d21220a76040518163ffffffff1660e01b8152600401602060405180830381865afa15801561036e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061039291906108e9565b73ffffffffffffffffffffffffffffffffffffffff167f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff160361040757602082015182516103f69083906107e4565b6104009190610a84565b9250610426565b815160208301516104199083906107e4565b6104239190610a84565b92505b505092915050565b60008061012485855b6000808373ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b8152600401608060405180830381865afa158015610485573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104a9919061085c565b90506000808573ffffffffffffffffffffffffffffffffffffffff1663a5ea11da6040518163ffffffff1660e01b8152600401608060405180830381865afa1580156104f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061051d9190610ab5565b5050915091508573ffffffffffffffffffffffffffffffffffffffff16630dfe16816040518163ffffffff1660e01b8152600401602060405180830381865afa15801561056e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061059291906108e9565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff160361061b5760608301516105d99063ffffffff84166107e4565b83602001518263ffffffff1685604001516105f491906107e4565b6105fe91906107e4565b6106089190610821565b83516106149190610a84565b935061066e565b60408301516106309063ffffffff83166107e4565b835160608501516106489063ffffffff8616906107e4565b61065291906107e4565b61065c9190610821565b836020015161066b9190610a84565b93505b8473ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106dd919061090d565b6106e8906012610930565b6106f390600a610a75565b6101ae90856107e4565b73ffffffffffffffffffffffffffffffffffffffff8116811461071f57600080fd5b50565b60008060006060848603121561073757600080fd5b8335610742816106fd565b92506020840135610752816106fd565b929592945050506040919091013590565b6000806040838503121561077657600080fd5b8235610781816106fd565b91506020830135610791816106fd565b809150509250929050565b6000602082840312156107ae57600080fd5b5051919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561081c5761081c6107b5565b500290565b600082610857577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b60006080828403121561086e57600080fd5b6040516080810181811067ffffffffffffffff821117156108b8577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b8060405250825181526020830151602082015260408301516040820152606083015160608201528091505092915050565b6000602082840312156108fb57600080fd5b8151610906816106fd565b9392505050565b60006020828403121561091f57600080fd5b815160ff8116811461090657600080fd5b600060ff821660ff84168082101561094a5761094a6107b5565b90039392505050565b600181815b808511156109ac57817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115610992576109926107b5565b8085161561099f57918102915b93841c9390800290610958565b509250929050565b6000826109c357506001610a6f565b816109d057506000610a6f565b81600181146109e657600281146109f057610a0c565b6001915050610a6f565b60ff841115610a0157610a016107b5565b50506001821b610a6f565b5060208310610133831016604e8410600b8410161715610a2f575081810a610a6f565b610a398383610953565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04821115610a6b57610a6b6107b5565b0290505b92915050565b600061090660ff8416836109b4565b60008219821115610a9757610a976107b5565b500190565b805163ffffffff81168114610ab057600080fd5b919050565b60008060008060808587031215610acb57600080fd5b610ad485610a9c565b9350610ae260208601610a9c565b9250610af060408601610a9c565b9150610afe60608601610a9c565b90509295919450925056fea264697066735822122077d6e44be8fc0337a7129d0eb65fe01b04edba27a5313d76b48247e0d4ee702064736f6c634300080f0033";

export class RequiemPricer__factory extends ContractFactory {
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
    _REQ: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RequiemPricer> {
    return super.deploy(_REQ, overrides || {}) as Promise<RequiemPricer>;
  }
  getDeployTransaction(
    _REQ: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_REQ, overrides || {});
  }
  attach(address: string): RequiemPricer {
    return super.attach(address) as RequiemPricer;
  }
  connect(signer: Signer): RequiemPricer__factory {
    return super.connect(signer) as RequiemPricer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RequiemPricerInterface {
    return new utils.Interface(_abi) as RequiemPricerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RequiemPricer {
    return new Contract(address, _abi, signerOrProvider) as RequiemPricer;
  }
}
