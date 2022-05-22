/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RequiemERC20Token,
  RequiemERC20TokenInterface,
} from "../RequiemERC20Token";

const _abi = [
  {
    inputs: [],
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
        indexed: false,
        internalType: "uint256",
        name: "_newCap",
        type: "uint256",
      },
    ],
    name: "MaxTotalSupplyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cap",
        type: "uint256",
      },
    ],
    name: "MinterUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
    name: "MAX_TOTAL_SUPPLY",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
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
        name: "account",
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
        internalType: "uint256",
        name: "amount",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
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
        name: "",
        type: "address",
      },
    ],
    name: "minters",
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
        name: "",
        type: "address",
      },
    ],
    name: "minters_minted",
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
        name: "owner",
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
    inputs: [],
    name: "owner",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newCap",
        type: "uint256",
      },
    ],
    name: "resetMaxTotalSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_minterCap",
        type: "uint256",
      },
    ],
    name: "setMinter",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
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
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
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
        internalType: "address",
        name: "newOwner_",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101006040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c960e0526a084595161401484a0000006008553480156200004557600080fd5b5060405180604001604052806005815260200164616252455160d81b81525080604051806040016040528060018152602001603160f81b8152506040518060400160405280601a81526020017f4173736574204261636b6564205265717569656d20546f6b656e00000000000081525060405180604001604052806005815260200164616252455160d81b81525060128260039080519060200190620000ed92919062000199565b5081516200010390600490602085019062000199565b506005805460ff90921660ff1990921691909117905550508151602092830120608052805191012060a052507f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60c052600780546001600160a01b031916339081179091556040516000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a36200027b565b828054620001a7906200023f565b90600052602060002090601f016020900481019282620001cb576000855562000216565b82601f10620001e657805160ff191683800117855562000216565b8280016001018555821562000216579182015b8281111562000216578251825591602001919060010190620001f9565b506200022492915062000228565b5090565b5b8082111562000224576000815560010162000229565b600181811c908216806200025457607f821691505b6020821081036200027557634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a05160c05160e051611f0a620002ca6000396000610ea50152600081816105ba01526119e40152600081816105fc0152611a260152600081816105db0152611a050152611f0a6000f3fe608060405234801561001057600080fd5b50600436106101a35760003560e01c8063715018a6116100ee5780639ce3899811610097578063d505accf11610071578063d505accf14610392578063dd62ed3e146103a5578063f2fde38b146103eb578063f46eccc4146103fe57600080fd5b80639ce3899814610359578063a457c2d71461036c578063a9059cbb1461037f57600080fd5b806387de8498116100c857806387de8498146103095780638da5cb5b1461032957806395d89b411461035157600080fd5b8063715018a6146102b857806379cc6790146102c05780637ecebe00146102d357600080fd5b80633644e5151161015057806342966c681161012a57806342966c681461025c57806360c918851461026f57806370a082311461028257600080fd5b80633644e5151461022c578063395093511461023457806340c10f191461024757600080fd5b806323b872dd1161018157806323b872dd146101fb578063313ce5671461020e57806333039d3d1461022357600080fd5b806306fdde03146101a8578063095ea7b3146101c657806318160ddd146101e9575b600080fd5b6101b061041e565b6040516101bd9190611c40565b60405180910390f35b6101d96101d4366004611cdc565b6104b0565b60405190151581526020016101bd565b6002545b6040519081526020016101bd565b6101d9610209366004611d06565b6104c6565b60055460405160ff90911681526020016101bd565b6101ed60085481565b6101ed6105b1565b6101d9610242366004611cdc565b610661565b61025a610255366004611cdc565b6106aa565b005b61025a61026a366004611d42565b6107fc565b61025a61027d366004611d42565b610809565b6101ed610290366004611d5b565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b61025a610957565b61025a6102ce366004611cdc565b610a47565b6101ed6102e1366004611d5b565b73ffffffffffffffffffffffffffffffffffffffff1660009081526006602052604090205490565b6101ed610317366004611d5b565b600a6020526000908152604090205481565b60075460405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101bd565b6101b0610b00565b61025a610367366004611cdc565b610b0f565b6101d961037a366004611cdc565b610d28565b6101d961038d366004611cdc565b610e00565b61025a6103a0366004611d7d565b610e0d565b6101ed6103b3366004611df0565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b61025a6103f9366004611d5b565b611092565b6101ed61040c366004611d5b565b60096020526000908152604090205481565b60606003805461042d90611e23565b80601f016020809104026020016040519081016040528092919081815260200182805461045990611e23565b80156104a65780601f1061047b576101008083540402835291602001916104a6565b820191906000526020600020905b81548152906001019060200180831161048957829003601f168201915b5050505050905090565b60006104bd338484611244565b50600192915050565b60006104d38484846113f7565b73ffffffffffffffffffffffffffffffffffffffff8416600090815260016020908152604080832033845290915290205482811015610599576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201527f6c6c6f77616e636500000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6105a68533858403611244565b506001949350505050565b600061065c60007f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000046604080516020810195909552840192909252606083015260808201523060a082015260c00160405160208183030381529060405280519060200120905090565b905090565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490916104bd9185906106a5908690611ea5565b611244565b33600090815260096020526040902054610720576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f4f6e6c79206d696e7465722063616e20696e74657261637400000000000000006044820152606401610590565b336000908152600a60205260408120805483929061073f908490611ea5565b9091555050336000908152600a602090815260408083205460099092529091205410156107ee576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f4d696e74696e6720616d6f756e742065786365656473206d696e74657220636160448201527f70000000000000000000000000000000000000000000000000000000000000006064820152608401610590565b6107f882826116b6565b5050565b61080633826117e2565b50565b60075473ffffffffffffffffffffffffffffffffffffffff16331461088a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610590565b60025481101561091c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f5f6e65774361702069732062656c6f772063757272656e7420746f74616c207360448201527f7570706c790000000000000000000000000000000000000000000000000000006064820152608401610590565b60088190556040518181527ff2672935fc79f5237559e2e2999dbe743bf65430894ac2b37666890e7c69e1af9060200160405180910390a150565b60075473ffffffffffffffffffffffffffffffffffffffff1633146109d8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610590565b60075460405160009173ffffffffffffffffffffffffffffffffffffffff16907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600780547fffffffffffffffffffffffff0000000000000000000000000000000000000000169055565b6000610a5383336103b3565b905081811015610ae4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f7760448201527f616e6365000000000000000000000000000000000000000000000000000000006064820152608401610590565b610af18333848403611244565b610afb83836117e2565b505050565b60606004805461042d90611e23565b60075473ffffffffffffffffffffffffffffffffffffffff163314610b90576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610590565b73ffffffffffffffffffffffffffffffffffffffff8216610c0d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f696e76616c6964206164647265737300000000000000000000000000000000006044820152606401610590565b73ffffffffffffffffffffffffffffffffffffffff82166000908152600a6020526040902054811015610cc2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603260248201527f4d696e74657220616c7265616479206d696e7465642061206c6172676572206160448201527f6d6f756e74207468616e206e65772063617000000000000000000000000000006064820152608401610590565b73ffffffffffffffffffffffffffffffffffffffff821660008181526009602052604090819020839055517f4806dc7228dc0d536104603610b1cf9b1c98f326289316cf3188bf1c6cf3ef5e90610d1c9084815260200190565b60405180910390a25050565b33600090815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8616845290915281205482811015610de9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152608401610590565b610df63385858403611244565b5060019392505050565b60006104bd3384846113f7565b83421115610e77576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f455850495245445f5045524d49540000000000000000000000000000000000006044820152606401610590565b73ffffffffffffffffffffffffffffffffffffffff87811660008181526006602090815260408083205481517f00000000000000000000000000000000000000000000000000000000000000008185015280830195909552948b166060850152608084018a905260a0840185905260c08085018a90528151808603909101815260e09094019052825192019190912090610f10826119db565b6040805160008082526020820180845284905260ff8a169282019290925260608101889052608081018790529192509060019060a0016020604051602081039080840390855afa158015610f68573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811615801590610fe357508a73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b611049576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f494e56414c49445f5349474e41545552450000000000000000000000000000006044820152606401610590565b611054846001611ea5565b73ffffffffffffffffffffffffffffffffffffffff8c166000908152600660205260409020556110858b8b8b611244565b5050505050505050505050565b60075473ffffffffffffffffffffffffffffffffffffffff163314611113576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610590565b73ffffffffffffffffffffffffffffffffffffffff81166111b6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610590565b60075460405173ffffffffffffffffffffffffffffffffffffffff8084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3600780547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b73ffffffffffffffffffffffffffffffffffffffff83166112e6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610590565b73ffffffffffffffffffffffffffffffffffffffff8216611389576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610590565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff831661149a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610590565b73ffffffffffffffffffffffffffffffffffffffff821661153d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610590565b611548838383611ade565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260208190526040902054818110156115fe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610590565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260208190526040808220858503905591851681529081208054849290611642908490611ea5565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516116a891815260200190565b60405180910390a350505050565b73ffffffffffffffffffffffffffffffffffffffff8216611733576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610590565b61173f60008383611ade565b80600260008282546117519190611ea5565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000908152602081905260408120805483929061178b908490611ea5565b909155505060405181815273ffffffffffffffffffffffffffffffffffffffff8316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff8216611885576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610590565b61189182600083611ade565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015611947576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401610590565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120838303905560028054849290611983908490611ebd565b909155505060405182815260009073ffffffffffffffffffffffffffffffffffffffff8516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b6000611a8660007f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000046604080516020810195909552840192909252606083015260808201523060a082015260c00160405160208183030381529060405280519060200120905090565b6040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281019190915260428101839052606201604051602081830303815290604052805190602001209050919050565b73ffffffffffffffffffffffffffffffffffffffff8316611b785760085481611b0660025490565b611b109190611ea5565b1115611b78576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4d617820746f74616c20737570706c79206578636565646564000000000000006044820152606401610590565b73ffffffffffffffffffffffffffffffffffffffff8216610afb57806008541015611c24576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4275726e20616d6f756e742065786365656473206d617820746f74616c20737560448201527f70706c79000000000000000000000000000000000000000000000000000000006064820152608401610590565b8060086000828254611c369190611ebd565b9091555050505050565b600060208083528351808285015260005b81811015611c6d57858101830151858201604001528201611c51565b81811115611c7f576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114611cd757600080fd5b919050565b60008060408385031215611cef57600080fd5b611cf883611cb3565b946020939093013593505050565b600080600060608486031215611d1b57600080fd5b611d2484611cb3565b9250611d3260208501611cb3565b9150604084013590509250925092565b600060208284031215611d5457600080fd5b5035919050565b600060208284031215611d6d57600080fd5b611d7682611cb3565b9392505050565b600080600080600080600060e0888a031215611d9857600080fd5b611da188611cb3565b9650611daf60208901611cb3565b95506040880135945060608801359350608088013560ff81168114611dd357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b60008060408385031215611e0357600080fd5b611e0c83611cb3565b9150611e1a60208401611cb3565b90509250929050565b600181811c90821680611e3757607f821691505b602082108103611e70577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008219821115611eb857611eb8611e76565b500190565b600082821015611ecf57611ecf611e76565b50039056fea2646970667358221220071df05dba33612dd029341dec2233efccfdeb78590b3690aa5b4bfba92f462d64736f6c634300080e0033";

export class RequiemERC20Token__factory extends ContractFactory {
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
  ): Promise<RequiemERC20Token> {
    return super.deploy(overrides || {}) as Promise<RequiemERC20Token>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RequiemERC20Token {
    return super.attach(address) as RequiemERC20Token;
  }
  connect(signer: Signer): RequiemERC20Token__factory {
    return super.connect(signer) as RequiemERC20Token__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RequiemERC20TokenInterface {
    return new utils.Interface(_abi) as RequiemERC20TokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RequiemERC20Token {
    return new Contract(address, _abi, signerOrProvider) as RequiemERC20Token;
  }
}
