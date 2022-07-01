/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DAI, DAIInterface } from "../DAI";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId_",
        type: "uint256",
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
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "sig",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "arg1",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "arg2",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "LogNote",
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
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
    name: "PERMIT_TYPEHASH",
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
        name: "usr",
        type: "address",
      },
    ],
    name: "addAuth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
      },
    ],
    name: "adjustDailyDAILimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "address",
        name: "sender_",
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
        name: "usr_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad_",
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
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
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
    name: "daiMintedToday",
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
    name: "dailyDAILimit",
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
    inputs: [
      {
        internalType: "address",
        name: "guy",
        type: "address",
      },
    ],
    name: "deny",
    outputs: [],
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
    name: "lastMintRestart",
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
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
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
    name: "move",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
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
        name: "holder",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "allowed",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "pull",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "push",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guy",
        type: "address",
      },
    ],
    name: "rely",
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
    inputs: [],
    name: "version",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wards",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161178438038061178483398101604081905261002f9161012b565b336000908152602081815260409182902060019081905582518084018452600e81526d2230b49029ba30b13632b1b7b4b760911b9083015282518084018452908152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527f0b1461ddc0c1d5ded79a1db0f74dae949050a7c0b28728c724b24958c27a328b818401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6606082015260808101939093523060a0808501919091528251808503909101815260c0909301909152815191012060085569021e19e0c9bab2400000600255610144565b60006020828403121561013d57600080fd5b5051919050565b611631806101536000396000f3fe608060405234801561001057600080fd5b50600436106101b95760003560e01c8063798247ae116100f9578063a9059cbb11610097578063bf353dbb11610071578063bf353dbb1461044c578063dd62ed3e1461046c578063ef1277e01461047f578063f2d5d56b1461048857600080fd5b8063a9059cbb14610413578063b753a98c14610426578063bb35783b1461043957600080fd5b806392bc513c116100d357806392bc513c1461039157806395d89b41146103b15780639c52a7f1146103ed5780639dc29fac1461040057600080fd5b8063798247ae1461033e5780637ecebe001461035e5780638fcbaf0c1461037e57600080fd5b806333b3cfc6116101665780635422224e116101405780635422224e146102cf57806354fd4d50146102e257806365fae35e146102cf57806370a082311461031e57600080fd5b806333b3cfc61461029e5780633644e515146102b357806340c10f19146102bc57600080fd5b806323b872dd1161019757806323b872dd1461024a57806330adf81f1461025d578063313ce5671461028457600080fd5b806306fdde03146101be578063095ea7b31461021057806318160ddd14610233575b600080fd5b6101fa6040518060400160405280600e81526020017f44616920537461626c65636f696e00000000000000000000000000000000000081525081565b6040516102079190611372565b60405180910390f35b61022361021e36600461140e565b61049b565b6040519015158152602001610207565b61023c60015481565b604051908152602001610207565b610223610258366004611438565b6104b0565b61023c7fea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb81565b61028c601281565b60405160ff9091168152602001610207565b6102b16102ac366004611474565b6107a5565b005b61023c60085481565b6102b16102ca36600461140e565b610823565b6102b16102dd36600461148d565b610a20565b6101fa6040518060400160405280600181526020017f310000000000000000000000000000000000000000000000000000000000000081525081565b61023c61032c36600461148d565b60036020526000908152604090205481565b61023c61034c36600461148d565b60066020526000908152604090205481565b61023c61036c36600461148d565b60056020526000908152604090205481565b6102b161038c3660046114a8565b610ac3565b61023c61039f36600461148d565b60076020526000908152604090205481565b6101fa6040518060400160405280600381526020017f444149000000000000000000000000000000000000000000000000000000000081525081565b6102b16103fb36600461148d565b610eee565b6102b161040e36600461140e565b610f8e565b61022361042136600461140e565b611250565b6102b161043436600461140e565b61125d565b6102b1610447366004611438565b61126d565b61023c61045a36600461148d565b60006020819052908152604090205481565b61023c61047a366004611532565b61127e565b61023c60025481565b6102b161049636600461140e565b6112b8565b60006104a783836112c3565b90505b92915050565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260036020526040812054821115610544576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4461692f696e73756666696369656e742d62616c616e6365000000000000000060448201526064015b60405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff841633148015906105ba575073ffffffffffffffffffffffffffffffffffffffff841660009081526004602090815260408083203384529091529020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14155b156106c65773ffffffffffffffffffffffffffffffffffffffff84166000908152600460209081526040808320338452909152902054821115610659576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4461692f696e73756666696369656e742d616c6c6f77616e6365000000000000604482015260640161053b565b73ffffffffffffffffffffffffffffffffffffffff84166000908152600460209081526040808320338452909152902054610694908361133c565b73ffffffffffffffffffffffffffffffffffffffff851660009081526004602090815260408083203384529091529020555b73ffffffffffffffffffffffffffffffffffffffff84166000908152600360205260409020546106f6908361133c565b73ffffffffffffffffffffffffffffffffffffffff80861660009081526003602052604080822093909355908516815220546107329083611357565b73ffffffffffffffffffffffffffffffffffffffff80851660008181526003602052604090819020939093559151908616907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906107939086815260200190565b60405180910390a35060019392505050565b3360009081526020819052604090205460011461081e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4461692f6e6f742d617574686f72697a65640000000000000000000000000000604482015260640161053b565b600255565b3360009081526020819052604081205490036109675760025433600090815260076020526040902054610857908390611357565b11158061088e5750336000908152600660205260409020546119649061087e90439061133c565b1015801561088e57506002548111155b6108f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f4f766572206461696c7920444149204c696d6974000000000000000000000000604482015260640161053b565b336000908152600660205260409020546119649061091390439061133c565b1061093c5733600090815260076020908152604080832084905560069091529020439055610967565b336000908152600760205260409020546109569082611357565b336000908152600760205260409020555b73ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260409020546109979082611357565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600360205260409020556001546109ca9082611357565b60015560405181815273ffffffffffffffffffffffffffffffffffffffff8316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a35050565b33600090815260208190526040902054600114610a99576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4461692f6e6f742d617574686f72697a65640000000000000000000000000000604482015260640161053b565b73ffffffffffffffffffffffffffffffffffffffff16600090815260208190526040902060019055565b600854604080517fea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb602082015273ffffffffffffffffffffffffffffffffffffffff808c169282019290925290891660608201526080810188905260a0810187905285151560c08201526000919060e00160405160208183030381529060405280519060200120604051602001610b8c9291907f190100000000000000000000000000000000000000000000000000000000000081526002810192909252602282015260420190565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190528051602090910120905073ffffffffffffffffffffffffffffffffffffffff8916610c41576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f4461692f696e76616c69642d616464726573732d300000000000000000000000604482015260640161053b565b60408051600081526020810180835283905260ff861691810191909152606081018490526080810183905260019060a0016020604051602081039080840390855afa158015610c94573d6000803e3d6000fd5b5050506020604051035173ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff1614610d32576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4461692f696e76616c69642d7065726d69740000000000000000000000000000604482015260640161053b565b851580610d3f5750854211155b610da5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4461692f7065726d69742d657870697265640000000000000000000000000000604482015260640161053b565b73ffffffffffffffffffffffffffffffffffffffff89166000908152600560205260408120805491610dd683611594565b919050558714610e42576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f4461692f696e76616c69642d6e6f6e6365000000000000000000000000000000604482015260640161053b565b600085610e50576000610e72565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5b73ffffffffffffffffffffffffffffffffffffffff8b81166000818152600460209081526040808320948f16808452948252918290208590559051848152939450919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a350505050505050505050565b33600090815260208190526040902054600114610f67576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4461692f6e6f742d617574686f72697a65640000000000000000000000000000604482015260640161053b565b73ffffffffffffffffffffffffffffffffffffffff16600090815260208190526040812055565b73ffffffffffffffffffffffffffffffffffffffff821660009081526003602052604090205481111561101d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4461692f696e73756666696369656e742d62616c616e63650000000000000000604482015260640161053b565b73ffffffffffffffffffffffffffffffffffffffff82163314801590611093575073ffffffffffffffffffffffffffffffffffffffff821660009081526004602090815260408083203384529091529020547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14155b1561119f5773ffffffffffffffffffffffffffffffffffffffff82166000908152600460209081526040808320338452909152902054811115611132576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4461692f696e73756666696369656e742d616c6c6f77616e6365000000000000604482015260640161053b565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260046020908152604080832033845290915290205461116d908261133c565b73ffffffffffffffffffffffffffffffffffffffff831660009081526004602090815260408083203384529091529020555b73ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260409020546111cf908261133c565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260036020526040902055600154611202908261133c565b60015560405181815260009073ffffffffffffffffffffffffffffffffffffffff8416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610a14565b60006104a73384846104b0565b6112683383836104b0565b505050565b6112788383836104b0565b50505050565b73ffffffffffffffffffffffffffffffffffffffff80831660009081526004602090815260408083209385168352929052908120546104a7565b6112688233836104b0565b33600081815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061132b9086815260200190565b60405180910390a350600192915050565b60008261134983826115cc565b91508111156104aa57600080fd5b60008261136483826115e3565b91508110156104aa57600080fd5b600060208083528351808285015260005b8181101561139f57858101830151858201604001528201611383565b818111156113b1576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461140957600080fd5b919050565b6000806040838503121561142157600080fd5b61142a836113e5565b946020939093013593505050565b60008060006060848603121561144d57600080fd5b611456846113e5565b9250611464602085016113e5565b9150604084013590509250925092565b60006020828403121561148657600080fd5b5035919050565b60006020828403121561149f57600080fd5b6104a7826113e5565b600080600080600080600080610100898b0312156114c557600080fd5b6114ce896113e5565b97506114dc60208a016113e5565b96506040890135955060608901359450608089013580151581146114ff57600080fd5b935060a089013560ff8116811461151557600080fd5b979a969950949793969295929450505060c08201359160e0013590565b6000806040838503121561154557600080fd5b61154e836113e5565b915061155c602084016113e5565b90509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036115c5576115c5611565565b5060010190565b6000828210156115de576115de611565565b500390565b600082198211156115f6576115f6611565565b50019056fea26469706673582212201cedcb668af52fd1770b838b22f80a72025055cd51950d17a0edd0f1e4c3aa8a64736f6c634300080f0033";

export class DAI__factory extends ContractFactory {
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
    chainId_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DAI> {
    return super.deploy(chainId_, overrides || {}) as Promise<DAI>;
  }
  getDeployTransaction(
    chainId_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(chainId_, overrides || {});
  }
  attach(address: string): DAI {
    return super.attach(address) as DAI;
  }
  connect(signer: Signer): DAI__factory {
    return super.connect(signer) as DAI__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DAIInterface {
    return new utils.Interface(_abi) as DAIInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DAI {
    return new Contract(address, _abi, signerOrProvider) as DAI;
  }
}
