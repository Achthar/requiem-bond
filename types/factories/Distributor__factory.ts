/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Distributor, DistributorInterface } from "../Distributor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "address",
        name: "_req",
        type: "address",
      },
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
      {
        internalType: "address",
        name: "_authority",
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
        internalType: "contract IAuthority",
        name: "authority",
        type: "address",
      },
    ],
    name: "AuthorityUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_rewardRate",
        type: "uint256",
      },
    ],
    name: "addRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "adjustments",
    outputs: [
      {
        internalType: "bool",
        name: "add",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "target",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "authority",
    outputs: [
      {
        internalType: "contract IAuthority",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bounty",
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
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "info",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
    ],
    name: "nextRewardAt",
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
        name: "_recipient",
        type: "address",
      },
    ],
    name: "nextRewardFor",
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
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "removeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "retrieveBounty",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_add",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_target",
        type: "uint256",
      },
    ],
    name: "setAdjustment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAuthority",
        name: "_newAuthority",
        type: "address",
      },
    ],
    name: "setAuthority",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bounty",
        type: "uint256",
      },
    ],
    name: "setBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x610140604052600c6101008190526b15539055551213d49256915160a21b610120908152620000329160019190620001a7565b50620f424060e0523480156200004757600080fd5b5060405162001eb038038062001eb08339810160408190526200006a916200026a565b600280546001600160a01b0319166001600160a01b0383161790556001600160a01b038416620000e15760405162461bcd60e51b815260206004820152601660248201527f5a65726f20616464726573733a2054726561737572790000000000000000000060448201526064015b60405180910390fd5b6001600160a01b0380851660a0528316620001335760405162461bcd60e51b81526020600482015260116024820152705a65726f20616464726573733a2052455160781b6044820152606401620000d8565b6001600160a01b038084166080528216620001915760405162461bcd60e51b815260206004820152601560248201527f5a65726f20616464726573733a205374616b696e6700000000000000000000006044820152606401620000d8565b506001600160a01b031660c05250620003039050565b828054620001b590620002c7565b90600052602060002090601f016020900481019282620001d9576000855562000224565b82601f10620001f457805160ff191683800117855562000224565b8280016001018555821562000224579182015b828111156200022457825182559160200191906001019062000207565b506200023292915062000236565b5090565b5b8082111562000232576000815560010162000237565b80516001600160a01b03811681146200026557600080fd5b919050565b600080600080608085870312156200028157600080fd5b6200028c856200024d565b93506200029c602086016200024d565b9250620002ac604086016200024d565b9150620002bc606086016200024d565b905092959194509250565b600181811c90821680620002dc57607f821691505b602082108103620002fd57634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a05160c05160e051611b576200035960003960008181610ee901526114d4015260008181610fca015281816111dd01526112da01526000818161108d01526112ad01526000610f0b0152611b576000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c8063943dfef11161008c578063c9fa8b2a11610066578063c9fa8b2a14610233578063e4fc6b6d14610246578063e7187e8a1461024e578063f79822431461025657600080fd5b8063943dfef114610195578063bc3b2b121461019e578063bf7e214f146101ee57600080fd5b80635db854b0116100bd5780635db854b01461015c5780637a9e5e4b1461016f5780638e69e2551461018257600080fd5b80632e340599146100e457806336d33f44146101265780635d87d36314610147575b600080fd5b6100f76100f2366004611803565b610269565b6040805192835273ffffffffffffffffffffffffffffffffffffffff9091166020830152015b60405180910390f35b61013961013436600461183e565b6102ad565b60405190815260200161011d565b61015a610155366004611803565b610369565b005b61015a61016a366004611862565b6104e3565b61015a61017d36600461183e565b610a22565b61015a610190366004611803565b610b8b565b61013960045481565b6101d16101ac366004611803565b60036020526000908152604090208054600182015460029092015460ff909116919083565b60408051931515845260208401929092529082015260600161011d565b60025461020e9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161011d565b610139610241366004611803565b610ee5565b61015a610fb2565b6101396111c3565b61015a6102643660046118a4565b61135b565b6005818154811061027957600080fd5b60009182526020909120600290910201805460019091015490915073ffffffffffffffffffffffffffffffffffffffff1682565b60008060005b600554811015610362578373ffffffffffffffffffffffffffffffffffffffff16600582815481106102e7576102e76118d0565b600091825260209091206001600290920201015473ffffffffffffffffffffffffffffffffffffffff1603610350576103436005828154811061032c5761032c6118d0565b906000526020600020906002020160000154610ee5565b61034d908361192e565b91505b8061035a81611946565b9150506102b3565b5092915050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa1580156103d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103fa919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161460019061046b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610462919061199b565b60405180910390fd5b50671bc16d674ec800008111156104de576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f546f6f206d7563680000000000000000000000000000000000000000000000006044820152606401610462565b600455565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa158015610550573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610574919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806106685750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663452a93206040518163ffffffff1660e01b8152600401602060405180830381865afa158015610615573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610639919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b6106f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f43616c6c6572206973206e6f7420676f7665726e6f72206f722067756172646960448201527f616e0000000000000000000000000000000000000000000000000000000000006064820152608401610462565b600073ffffffffffffffffffffffffffffffffffffffff166005858154811061071f5761071f6118d0565b600091825260209091206001600290920201015473ffffffffffffffffffffffffffffffffffffffff16036107b0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f526563697069656e7420646f6573206e6f7420657869737400000000000000006044820152606401610462565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663452a93206040518163ffffffff1660e01b8152600401602060405180830381865afa15801561081d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610841919061197e565b73ffffffffffffffffffffffffffffffffffffffff163303610904576103e860058581548110610873576108736118d0565b90600052602060002090600202016000015460196108919190611a79565b61089b9190611ab6565b821115610904576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f4c696d697465723a2063616e6e6f742061646a757374206279203e322e3525006044820152606401610462565b826109bd576005848154811061091c5761091c6118d0565b9060005260206000209060020201600001548211156109bd576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602f60248201527f43616e6e6f742064656372656173652072617465206279206d6f72652074686160448201527f6e20697420616c726561647920697300000000000000000000000000000000006064820152608401610462565b6040805160608101825293151584526020808501938452848201928352600095865260039052909320915182547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169015151782555160018201559051600290910155565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a8f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ab3919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614600190610b1b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610462919061199b565b50600280547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040517f2f658b440c35314f52658ea8a740e05b284cdc84dc9ae01e891f21b8933e7cad90600090a250565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa158015610bf8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c1c919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610d105750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663452a93206040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cbd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ce1919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b610d9c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f43616c6c6572206973206e6f7420676f7665726e6f72206f722067756172646960448201527f616e0000000000000000000000000000000000000000000000000000000000006064820152608401610462565b600073ffffffffffffffffffffffffffffffffffffffff1660058281548110610dc757610dc76118d0565b600091825260209091206001600290920201015473ffffffffffffffffffffffffffffffffffffffff1603610e58576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f526563697069656e7420646f6573206e6f7420657869737400000000000000006044820152606401610462565b600060058281548110610e6d57610e6d6118d0565b906000526020600020906002020160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060058281548110610ed157610ed16118d0565b600091825260209091206002909102015550565b60007f0000000000000000000000000000000000000000000000000000000000000000827f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610f74573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f989190611af1565b610fa29190611a79565b610fac9190611ab6565b92915050565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614611051576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f4f6e6c79207374616b696e6700000000000000000000000000000000000000006044820152606401610462565b60005b6005548110156111c057600060058281548110611073576110736118d0565b90600052602060002090600202016000015411156111ae577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166340c10f19600583815481106110da576110da6118d0565b906000526020600020906002020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166111226005858154811061032c5761032c6118d0565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815273ffffffffffffffffffffffffffffffffffffffff90921660048301526024820152604401600060405180830381600087803b15801561118d57600080fd5b505af11580156111a1573d6000803e3d6000fd5b505050506111ae81611616565b806111b881611946565b915050611054565b50565b60003373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614611264576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f4f6e6c79207374616b696e6700000000000000000000000000000000000000006044820152606401610462565b6004541561135457600480546040517f40c10f1900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016926340c10f1992611321927f0000000000000000000000000000000000000000000000000000000000000000920173ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b600060405180830381600087803b15801561133b57600080fd5b505af115801561134f573d6000803e3d6000fd5b505050505b5060045490565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa1580156113c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113ec919061197e565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614600190611454576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610462919061199b565b5073ffffffffffffffffffffffffffffffffffffffff82166114d2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f5a65726f20616464726573733a20526563697069656e740000000000000000006044820152606401610462565b7f000000000000000000000000000000000000000000000000000000000000000081111561155c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f526174652063616e6e6f74206578636565642064656e6f6d696e61746f7200006044820152606401610462565b6040805180820190915290815273ffffffffffffffffffffffffffffffffffffffff918216602082019081526005805460018101825560009190915291517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0600290930292830155517f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db190910180547fffffffffffffffffffffffff00000000000000000000000000000000000000001691909216179055565b6000818152600360209081526040918290208251606081018452815460ff1615158152600182015492810183905260029091015492810192909252156117095780511561170d57806020015160058381548110611675576116756118d0565b90600052602060002090600202016000016000828254611695919061192e565b9091555050604081015160058054849081106116b3576116b36118d0565b90600052602060002090600202016000015410611709576000828152600360205260408082206001019190915581015160058054849081106116f7576116f76118d0565b60009182526020909120600290910201555b5050565b806020015160058381548110611725576117256118d0565b906000526020600020906002020160000154111561178057806020015160058381548110611755576117556118d0565b906000526020600020906002020160000160008282546117759190611b0a565b909155506117a79050565b600060058381548110611795576117956118d0565b60009182526020909120600290910201555b8060400151600583815481106117bf576117bf6118d0565b90600052602060002090600202016000015411611709576000828152600360205260408082206001019190915581015160058054849081106116f7576116f76118d0565b60006020828403121561181557600080fd5b5035919050565b73ffffffffffffffffffffffffffffffffffffffff811681146111c057600080fd5b60006020828403121561185057600080fd5b813561185b8161181c565b9392505050565b6000806000806080858703121561187857600080fd5b843593506020850135801515811461188f57600080fd5b93969395505050506040820135916060013590565b600080604083850312156118b757600080fd5b82356118c28161181c565b946020939093013593505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008219821115611941576119416118ff565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611977576119776118ff565b5060010190565b60006020828403121561199057600080fd5b815161185b8161181c565b600060208083526000845481600182811c9150808316806119bd57607f831692505b85831081036119f3577f4e487b710000000000000000000000000000000000000000000000000000000085526022600452602485fd5b878601838152602001818015611a105760018114611a3f57611a6a565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00861682528782019650611a6a565b60008b81526020902060005b86811015611a6457815484820152908501908901611a4b565b83019750505b50949998505050505050505050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611ab157611ab16118ff565b500290565b600082611aec577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b600060208284031215611b0357600080fd5b5051919050565b600082821015611b1c57611b1c6118ff565b50039056fea26469706673582212208eb37df03da5d80378b4433908834454e3bb8402cbc71e9a46749091ea0436c764736f6c634300080e0033";

export class Distributor__factory extends ContractFactory {
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
    _treasury: string,
    _req: string,
    _staking: string,
    _authority: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Distributor> {
    return super.deploy(
      _treasury,
      _req,
      _staking,
      _authority,
      overrides || {}
    ) as Promise<Distributor>;
  }
  getDeployTransaction(
    _treasury: string,
    _req: string,
    _staking: string,
    _authority: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _treasury,
      _req,
      _staking,
      _authority,
      overrides || {}
    );
  }
  attach(address: string): Distributor {
    return super.attach(address) as Distributor;
  }
  connect(signer: Signer): Distributor__factory {
    return super.connect(signer) as Distributor__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DistributorInterface {
    return new utils.Interface(_abi) as DistributorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Distributor {
    return new Contract(address, _abi, signerOrProvider) as Distributor;
  }
}
