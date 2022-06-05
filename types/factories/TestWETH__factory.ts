/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TestWETH, TestWETHInterface } from "../TestWETH";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "minter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "guy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "destinatary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60c0604052600d60808190526c2bb930b83832b21022ba3432b960991b60a0908152620000309160019190620001c9565b50604080518082019091526004808252630ae8aa8960e31b60209092019182526200005e91600291620001c9565b506003805460ff191660121790553480156200007957600080fd5b50604051620015f3380380620015f38339810160408190526200009c916200026f565b620000a9600082620000dc565b620000d57f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a682620000dc565b50620002dd565b620000e88282620000ec565b5050565b6000828152602081815260409091206200011191839062000bec62000153821b17901c565b15620000e85760405133906001600160a01b0383169084907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d90600090a45050565b6001600160a01b0381166000908152600183016020526040812054620001bf57508154600180820184556000848152602080822090930180546001600160a01b0319166001600160a01b03861690811790915585549082528286019093526040902091909155620001c3565b5060005b92915050565b828054620001d790620002a1565b90600052602060002090601f016020900481019282620001fb576000855562000246565b82601f106200021657805160ff191683800117855562000246565b8280016001018555821562000246579182015b828111156200024657825182559160200191906001019062000229565b506200025492915062000258565b5090565b5b8082111562000254576000815560010162000259565b6000602082840312156200028257600080fd5b81516001600160a01b03811681146200029a57600080fd5b9392505050565b600181811c90821680620002b657607f821691505b602082108103620002d757634e487b7160e01b600052602260045260246000fd5b50919050565b61130680620002ed6000396000f3fe60806040526004361061016e5760003560e01c806370a08231116100cb578063a9059cbb1161007f578063d539139311610059578063d5391393146103fa578063d547741f1461042e578063dd62ed3e1461044e57600080fd5b8063a9059cbb146103b2578063ca15c873146103d2578063d0e30db0146103f257600080fd5b806391d14854116100b057806391d148541461036857806395d89b4114610388578063a217fddf1461039d57600080fd5b806370a08231146102f65780639010d07c1461032357600080fd5b80632e1a7d4d11610122578063313ce56711610107578063313ce5671461028a57806336568abe146102b657806340c10f19146102d657600080fd5b80632e1a7d4d1461024a5780632f2ff15d1461026a57600080fd5b806318160ddd1161015357806318160ddd146101dd57806323b872dd146101fa578063248a9ca31461021a57600080fd5b806306fdde0314610182578063095ea7b3146101ad57600080fd5b3661017d5761017b610486565b005b600080fd5b34801561018e57600080fd5b506101976104e1565b6040516101a49190611013565b60405180910390f35b3480156101b957600080fd5b506101cd6101c83660046110af565b61056f565b60405190151581526020016101a4565b3480156101e957600080fd5b50475b6040519081526020016101a4565b34801561020657600080fd5b506101cd6102153660046110d9565b6105e9565b34801561022657600080fd5b506101ec610235366004611115565b60009081526020819052604090206002015490565b34801561025657600080fd5b5061017b610265366004611115565b6108bf565b34801561027657600080fd5b5061017b61028536600461112e565b6109c2565b34801561029657600080fd5b506003546102a49060ff1681565b60405160ff90911681526020016101a4565b3480156102c257600080fd5b5061017b6102d136600461112e565b6109f8565b3480156102e257600080fd5b5061017b6102f13660046110af565b610a26565b34801561030257600080fd5b506101ec61031136600461115a565b60046020526000908152604090205481565b34801561032f57600080fd5b5061034361033e366004611175565b610b3f565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101a4565b34801561037457600080fd5b506101cd61038336600461112e565b610b5e565b34801561039457600080fd5b50610197610b96565b3480156103a957600080fd5b506101ec600081565b3480156103be57600080fd5b506101cd6103cd3660046110af565b610ba3565b3480156103de57600080fd5b506101ec6103ed366004611115565b610bb0565b61017b610486565b34801561040657600080fd5b506101ec7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b34801561043a57600080fd5b5061017b61044936600461112e565b610bc4565b34801561045a57600080fd5b506101ec610469366004611197565b600560209081526000928352604080842090915290825290205481565b33600090815260046020526040812080543492906104a59084906111f0565b909155505060405134815233907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9060200160405180910390a2565b600180546104ee90611208565b80601f016020809104026020016040519081016040528092919081815260200182805461051a90611208565b80156105675780601f1061053c57610100808354040283529160200191610567565b820191906000526020600020905b81548152906001019060200180831161054a57829003601f168201915b505050505081565b33600081815260056020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906105d79086815260200190565b60405180910390a35060015b92915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526004602052604081205482111561067d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f494e53554646494349454e545f42414c414e434500000000000000000000000060448201526064015b60405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff841633148015906106f3575073ffffffffffffffffffffffffffffffffffffffff841660009081526005602090815260408083203384529091529020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14155b156107d85773ffffffffffffffffffffffffffffffffffffffff84166000908152600560209081526040808320338452909152902054821115610792576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f494e53554646494349454e545f414c4c4f57414e4345000000000000000000006044820152606401610674565b73ffffffffffffffffffffffffffffffffffffffff84166000908152600560209081526040808320338452909152812080548492906107d290849061125b565b90915550505b73ffffffffffffffffffffffffffffffffffffffff84166000908152600460205260408120805484929061080d90849061125b565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600090815260046020526040812080548492906108479084906111f0565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108ad91815260200190565b60405180910390a35060019392505050565b33600090815260046020526040902054811115610938576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f494e53554646494349454e545f42414c414e43450000000000000000000000006044820152606401610674565b336000908152600460205260408120805483929061095790849061125b565b9091555050604051339082156108fc029083906000818181858888f19350505050158015610989573d6000803e3d6000fd5b5060405181815233907f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b659060200160405180910390a250565b6000828152602081905260409020600201546109ea906109e29033610b5e565b6101a6610c90565b6109f48282610c9e565b5050565b610a1c73ffffffffffffffffffffffffffffffffffffffff821633146101a8610c90565b6109f48282610d04565b610a507f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610b5e565b610ab6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f4e4f545f4d494e544552000000000000000000000000000000000000000000006044820152606401610674565b73ffffffffffffffffffffffffffffffffffffffff821660009081526004602052604081208054839290610aeb9084906111f0565b909155505060405181815273ffffffffffffffffffffffffffffffffffffffff8316907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9060200160405180910390a25050565b6000828152602081905260408120610b579083610d6a565b9392505050565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff851684526001019091528120541515610b57565b600280546104ee90611208565b6000610b573384846105e9565b6000818152602081905260408120546105e3565b600082815260208190526040902060020154610a1c90610be49033610b5e565b6101a7610c90565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600183016020526040812054610c8857508154600180820184556000848152602080822090930180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8616908117909155855490825282860190935260409020919091556105e3565b5060006105e3565b816109f4576109f481610d86565b6000828152602081905260409020610cb69082610bec565b156109f457604051339073ffffffffffffffffffffffffffffffffffffffff83169084907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d90600090a45050565b6000828152602081905260409020610d1c9082610dfa565b156109f457604051339073ffffffffffffffffffffffffffffffffffffffff83169084907ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b90600090a45050565b8154600090610d7c9083106064610c90565b610b578383610fd3565b6030600a820601600a820491506030600a830601600a830492506030600a8406018060101b8260081b84010166524551230000000160c81b925050507f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260076024528060445260646000fd5b73ffffffffffffffffffffffffffffffffffffffff811660009081526001830160205260408120548015610fc9576000610e3560018361125b565b8554909150600090610e499060019061125b565b9050808214610f28576000866000018281548110610e6957610e69611272565b600091825260209091200154875473ffffffffffffffffffffffffffffffffffffffff90911691508190889085908110610ea557610ea5611272565b600091825260209091200180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055610efe8360016111f0565b73ffffffffffffffffffffffffffffffffffffffff90911660009081526001880160205260409020555b8554869080610f3957610f396112a1565b6000828152602080822083017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90810180547fffffffffffffffffffffffff000000000000000000000000000000000000000016905590920190925573ffffffffffffffffffffffffffffffffffffffff871682526001888101909152604082209190915593506105e392505050565b60009150506105e3565b6000826000018281548110610fea57610fea611272565b60009182526020909120015473ffffffffffffffffffffffffffffffffffffffff169392505050565b600060208083528351808285015260005b8181101561104057858101830151858201604001528201611024565b81811115611052576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146110aa57600080fd5b919050565b600080604083850312156110c257600080fd5b6110cb83611086565b946020939093013593505050565b6000806000606084860312156110ee57600080fd5b6110f784611086565b925061110560208501611086565b9150604084013590509250925092565b60006020828403121561112757600080fd5b5035919050565b6000806040838503121561114157600080fd5b8235915061115160208401611086565b90509250929050565b60006020828403121561116c57600080fd5b610b5782611086565b6000806040838503121561118857600080fd5b50508035926020909101359150565b600080604083850312156111aa57600080fd5b6111b383611086565b915061115160208401611086565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008219821115611203576112036111c1565b500190565b600181811c9082168061121c57607f821691505b602082108103611255577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60008282101561126d5761126d6111c1565b500390565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220a2345bb9c1e0b7d98bc3c01d9c60591e9f38c1a28360e1ea2c26b736ad50144a64736f6c634300080e0033";

export class TestWETH__factory extends ContractFactory {
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
    minter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWETH> {
    return super.deploy(minter, overrides || {}) as Promise<TestWETH>;
  }
  getDeployTransaction(
    minter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(minter, overrides || {});
  }
  attach(address: string): TestWETH {
    return super.attach(address) as TestWETH;
  }
  connect(signer: Signer): TestWETH__factory {
    return super.connect(signer) as TestWETH__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWETHInterface {
    return new utils.Interface(_abi) as TestWETHInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWETH {
    return new Contract(address, _abi, signerOrProvider) as TestWETH;
  }
}
