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
import type { Staking, StakingInterface } from "../Staking";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_req",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sREQ",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gREQ",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_epochLength",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_firstEpochNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_firstEpochTime",
        type: "uint256",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "distributor",
        type: "address",
      },
    ],
    name: "DistributorSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "warmup",
        type: "uint256",
      },
    ],
    name: "WarmupSet",
    type: "event",
  },
  {
    inputs: [],
    name: "REQ",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
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
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_rebasing",
        type: "bool",
      },
    ],
    name: "claim",
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
    inputs: [],
    name: "distributor",
    outputs: [
      {
        internalType: "contract IDistributor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "epoch",
    outputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "number",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "distribute",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "forfeit",
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
    inputs: [],
    name: "gREQ",
    outputs: [
      {
        internalType: "contract IgREQ",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "index",
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
    name: "rebase",
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
    inputs: [],
    name: "sREQ",
    outputs: [
      {
        internalType: "contract IsREQ",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "secondsToNextEpoch",
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
        internalType: "address",
        name: "_distributor",
        type: "address",
      },
    ],
    name: "setDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_warmupPeriod",
        type: "uint256",
      },
    ],
    name: "setWarmupLength",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_rebasing",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_claim",
        type: "bool",
      },
    ],
    name: "stake",
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
    inputs: [],
    name: "supplyInWarmup",
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
    name: "toggleLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_trigger",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_rebasing",
        type: "bool",
      },
    ],
    name: "unstake",
    outputs: [
      {
        internalType: "uint256",
        name: "amount_",
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
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "unwrap",
    outputs: [
      {
        internalType: "uint256",
        name: "sBalance_",
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
        name: "",
        type: "address",
      },
    ],
    name: "warmupInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gons",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "lock",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "warmupPeriod",
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
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "wrap",
    outputs: [
      {
        internalType: "uint256",
        name: "gBalance_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x610120604052600c60e08190526b15539055551213d49256915160a21b610100908152620000319160009190620001c1565b503480156200003f57600080fd5b50604051620026b3380380620026b3833981016040819052620000629162000284565b600180546001600160a01b0319166001600160a01b0383161790556001600160a01b038716620000cd5760405162461bcd60e51b81526020600482015260116024820152705a65726f20616464726573733a2052455160781b60448201526064015b60405180910390fd5b6001600160a01b038088166080528616620001205760405162461bcd60e51b81526020600482015260126024820152715a65726f20616464726573733a207352455160701b6044820152606401620000c4565b6001600160a01b0380871660a0528516620001735760405162461bcd60e51b81526020600482015260126024820152715a65726f20616464726573733a206752455160701b6044820152606401620000c4565b506001600160a01b0390931660c052604080516080810182528381526020810183905290810184905260006060909101819052600292909255600355600491909155600555506200033a9050565b828054620001cf90620002fe565b90600052602060002090601f016020900481019282620001f357600085556200023e565b82601f106200020e57805160ff19168380011785556200023e565b828001600101855582156200023e579182015b828111156200023e57825182559160200191906001019062000221565b506200024c92915062000250565b5090565b5b808211156200024c576000815560010162000251565b80516001600160a01b03811681146200027f57600080fd5b919050565b600080600080600080600060e0888a031215620002a057600080fd5b620002ab8862000267565b9650620002bb6020890162000267565b9550620002cb6040890162000267565b9450606088015193506080880151925060a08801519150620002f060c0890162000267565b905092959891949750929550565b600181811c908216806200031357607f821691505b6020821081036200033457634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a05160c0516122a162000412600039600081816103a5015281816105790152818161061701528181610e1c01528181610ebd015281816114fb015281816115ca01528181611c1c0152611d5601526000818161024401528181610457015281816104d8015281816106b501528181610cd101528181610dae01528181611122015281816113be015281816114a4015281816117d4015281816119480152611bbf01526000818161036201528181610f79015281816110a1015281816113380152818161164a0152611a9601526122a16000f3fe608060405234801561001057600080fd5b50600436106101825760003560e01c8063990966d5116100d8578063d26700251161008c578063ee487d9e11610066578063ee487d9e146103a0578063f3d86e4a146103c7578063ff9413d8146103cf57600080fd5b8063d26700251461035d578063d866c9d814610384578063deac361a1461039757600080fd5b8063bf376c7a116100bd578063bf376c7a1461030a578063bf7e214f1461031d578063bfe109281461033d57600080fd5b8063990966d5146102ef578063af14052c1461030257600080fd5b80637a9e5e4b1161013a5780639238d592116101145780639238d592146102c157806392fd2daf146102d45780639483c1d7146102e757600080fd5b80637a9e5e4b1461022c5780638cb649e11461023f578063900cf0cf1461028b57600080fd5b806339f476931161016b57806339f47693146101aa5780636746f4c2146101bd57806375619ab51461021757600080fd5b806320138641146101875780632986c0e5146101a2575b600080fd5b61018f610414565b6040519081526020015b60405180910390f35b61018f6104d4565b61018f6101b8366004611f6d565b610541565b6101f56101cb366004611f99565b60076020526000908152604090208054600182015460028301546003909301549192909160ff1684565b6040805194855260208501939093529183015215156060820152608001610199565b61022a610225366004611f99565b6106e2565b005b61022a61023a366004611f99565b61085f565b6102667f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610199565b6002546003546004546005546102a19392919084565b604080519485526020850193909352918301526060820152608001610199565b61022a6102cf366004611fb6565b6109c8565b61018f6102e2366004611fdd565b610af7565b61018f610d69565b61018f6102fd366004612016565b610d7a565b61018f6110d1565b61018f610318366004611f6d565b611488565b6001546102669073ffffffffffffffffffffffffffffffffffffffff1681565b6006546102669073ffffffffffffffffffffffffffffffffffffffff1681565b6102667f000000000000000000000000000000000000000000000000000000000000000081565b61018f610392366004612016565b61162e565b61018f60085481565b6102667f000000000000000000000000000000000000000000000000000000000000000081565b61018f6119dd565b61022a33600090815260076020526040902060030180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00811660ff90911615179055565b6009546040517f7965d56d00000000000000000000000000000000000000000000000000000000815260009173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001691637965d56d9161048e9160040190815260200190565b602060405180830381865afa1580156104ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104cf9190612069565b905090565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16632986c0e56040518163ffffffff1660e01b8152600401602060405180830381865afa1580156104ab573d6000803e3d6000fd5b6040517f9dc29fac000000000000000000000000000000000000000000000000000000008152336004820152602481018290526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1690639dc29fac90604401600060405180830381600087803b1580156105d257600080fd5b505af11580156105e6573d6000803e3d6000fd5b50506040517fa8248768000000000000000000000000000000000000000000000000000000008152600481018590527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16925063a82487689150602401602060405180830381865afa158015610675573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106999190612069565b90506106dc73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168483611ac4565b92915050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107739190612082565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146000906107e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107db919061209f565b60405180910390fd5b50600680547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040519081527f86719c518c7d99ac94b3d405d462ea876ba5cd0a978461dc9a7c9862a9485886906020015b60405180910390a150565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa1580156108cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f09190612082565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614600090610958576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107db919061209f565b50600180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040517f2f658b440c35314f52658ea8a740e05b284cdc84dc9ae01e891f21b8933e7cad90600090a250565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630c340a246040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a35573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a599190612082565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614600090610ac1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107db919061209f565b5060088190556040518181527fac17d51c35ac71d3eddc155985908430e88946d51e2f6093e93c1c0aba08f6c490602001610854565b73ffffffffffffffffffffffffffffffffffffffff821660009081526007602090815260408083208151608081018352815481526001820154938101939093526002810154918301919091526003015460ff16151560608201819052610bfc5773ffffffffffffffffffffffffffffffffffffffff84163314610bfc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45787465726e616c20636c61696d7320666f72206163636f756e74206172652060448201527f6c6f636b6564000000000000000000000000000000000000000000000000000060648201526084016107db565b604081015160035410801590610c155750604081015115155b15610d5f5773ffffffffffffffffffffffffffffffffffffffff841660009081526007602090815260408220828155600181018390556002810183905560030180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690558201516009805491929091610c919084906121ac565b909155505060208101516040517f7965d56d0000000000000000000000000000000000000000000000000000000081526004810191909152610d579085907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1690637965d56d90602401602060405180830381865afa158015610d2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d519190612069565b85611b9d565b9150506106dc565b5060009392505050565b6004546000906104cf9042906121ac565b8260008315610d8e57610d8b6110d1565b90505b8215610de757610dd673ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016333088611de2565b610de081836121c3565b9150610f4b565b6040517f9dc29fac000000000000000000000000000000000000000000000000000000008152336004820152602481018690527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1690639dc29fac90604401600060405180830381600087803b158015610e7557600080fd5b505af1158015610e89573d6000803e3d6000fd5b50506040517fa8248768000000000000000000000000000000000000000000000000000000008152600481018590528392507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16915063a824876890602401602060405180830381865afa158015610f1a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f3e9190612069565b610f4891906121c3565b91505b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906370a0823190602401602060405180830381865afa158015610fd5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ff99190612069565b821115611087576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f496e73756666696369656e74205245512062616c616e636520696e20636f6e7460448201527f726163740000000000000000000000000000000000000000000000000000000060648201526084016107db565b6110c873ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168784611ac4565b50949350505050565b60008042600280015411611483576005546003546040517f058ecdb400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169263058ecdb49261115e92600401918252602082015260400190565b6020604051808303816000875af115801561117d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111a19190612069565b50600254600480546000906111b79084906121c3565b9091555050600380549060006111cc836121db565b909155505060065473ffffffffffffffffffffffffffffffffffffffff161561130757600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e4fc6b6d6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561125957600080fd5b505af115801561126d573d6000803e3d6000fd5b50505050600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e7187e8a6040518163ffffffff1660e01b81526004016020604051808303816000875af11580156112e0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113049190612069565b90505b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906370a0823190602401602060405180830381865afa158015611394573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113b89190612069565b905060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16639358928b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611427573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061144b9190612069565b905061145783826121c3565b8211611467576000600555611480565b8261147282846121ac565b61147c91906121ac565b6005555b50505b919050565b60006114cc73ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016333085611de2565b6040517f66a5236c000000000000000000000000000000000000000000000000000000008152600481018390527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906366a5236c90602401602060405180830381865afa158015611557573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061157b9190612069565b6040517f40c10f1900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8581166004830152602482018390529192507f0000000000000000000000000000000000000000000000000000000000000000909116906340c10f1990604401600060405180830381600087803b15801561161057600080fd5b505af1158015611624573d6000803e3d6000fd5b5050505092915050565b600061167273ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016333087611de2565b61167a6110d1565b61168490856121c3565b93508180156116935750600854155b156116aa576116a3858585611b9d565b90506119d5565b73ffffffffffffffffffffffffffffffffffffffff851660009081526007602090815260409182902082516080810184528154815260018201549281019290925260028101549282019290925260039091015460ff161515606082018190526117b25773ffffffffffffffffffffffffffffffffffffffff861633146117b2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f45787465726e616c206465706f7369747320666f72206163636f756e7420617260448201527f65206c6f636b656400000000000000000000000000000000000000000000000060648201526084016107db565b60405180608001604052808683600001516117cd91906121c3565b81526020017f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16631bd39674886040518263ffffffff1660e01b815260040161182d91815260200190565b602060405180830381865afa15801561184a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061186e9190612069565b836020015161187d91906121c3565b815260200160085460026001015461189591906121c3565b8152606083810151151560209283015273ffffffffffffffffffffffffffffffffffffffff898116600090815260078452604090819020855181559385015160018501558481015160028501559390910151600390920180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169215159290921790915590517f1bd39674000000000000000000000000000000000000000000000000000000008152600481018790527f000000000000000000000000000000000000000000000000000000000000000090911690631bd3967490602401602060405180830381865afa158015611991573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119b59190612069565b600960008282546119c691906121c3565b909155508592506119d5915050565b949350505050565b3360008181526007602081815260408084208151608081018352815481526001820180548286019081526002840180549584019590955260038401805460ff811615156060860152998952969095529186905590859055908490557fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0090941690915551600980549293928490611a749084906121ac565b90915550508051611abe9073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016903390611ac4565b51919050565b60405173ffffffffffffffffffffffffffffffffffffffff8316602482015260448101829052611b989084907fa9059cbb00000000000000000000000000000000000000000000000000000000906064015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611e46565b505050565b60008115611bed57611be673ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168585611ac4565b5081611ddb565b6040517f66a5236c000000000000000000000000000000000000000000000000000000008152600481018490527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906340c10f1990869083906366a5236c90602401602060405180830381865afa158015611c82573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ca69190612069565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815273ffffffffffffffffffffffffffffffffffffffff90921660048301526024820152604401600060405180830381600087803b158015611d1157600080fd5b505af1158015611d25573d6000803e3d6000fd5b50506040517f66a5236c000000000000000000000000000000000000000000000000000000008152600481018690527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1692506366a5236c9150602401602060405180830381865afa158015611db4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dd89190612069565b90505b9392505050565b60405173ffffffffffffffffffffffffffffffffffffffff80851660248301528316604482015260648101829052611e409085907f23b872dd0000000000000000000000000000000000000000000000000000000090608401611b16565b50505050565b6000808373ffffffffffffffffffffffffffffffffffffffff1683604051611e6e9190612213565b6000604051808303816000865af19150503d8060008114611eab576040519150601f19603f3d011682016040523d82523d6000602084013e611eb0565b606091505b50909250905081611ec5573d6000803e3d6000fd5b80511580611ee2575080806020019051810190611ee2919061224e565b611e40576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601660248201527f534146455f45524332305f43414c4c5f4641494c45440000000000000000000060448201526064016107db565b73ffffffffffffffffffffffffffffffffffffffff81168114611f6a57600080fd5b50565b60008060408385031215611f8057600080fd5b8235611f8b81611f48565b946020939093013593505050565b600060208284031215611fab57600080fd5b8135611ddb81611f48565b600060208284031215611fc857600080fd5b5035919050565b8015158114611f6a57600080fd5b60008060408385031215611ff057600080fd5b8235611ffb81611f48565b9150602083013561200b81611fcf565b809150509250929050565b6000806000806080858703121561202c57600080fd5b843561203781611f48565b935060208501359250604085013561204e81611fcf565b9150606085013561205e81611fcf565b939692955090935050565b60006020828403121561207b57600080fd5b5051919050565b60006020828403121561209457600080fd5b8151611ddb81611f48565b600060208083526000845481600182811c9150808316806120c157607f831692505b85831081036120f7577f4e487b710000000000000000000000000000000000000000000000000000000085526022600452602485fd5b87860183815260200181801561211457600181146121435761216e565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0086168252878201965061216e565b60008b81526020902060005b868110156121685781548482015290850190890161214f565b83019750505b50949998505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000828210156121be576121be61217d565b500390565b600082198211156121d6576121d661217d565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361220c5761220c61217d565b5060010190565b6000825160005b81811015612234576020818601810151858301520161221a565b81811115612243576000828501525b509190910192915050565b60006020828403121561226057600080fd5b8151611ddb81611fcf56fea2646970667358221220fbb6e1f05920fcb72161e82b6c201373005372511cba539f7433a01021a83fff64736f6c634300080e0033";

export class Staking__factory extends ContractFactory {
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
    _req: string,
    _sREQ: string,
    _gREQ: string,
    _epochLength: BigNumberish,
    _firstEpochNumber: BigNumberish,
    _firstEpochTime: BigNumberish,
    _authority: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Staking> {
    return super.deploy(
      _req,
      _sREQ,
      _gREQ,
      _epochLength,
      _firstEpochNumber,
      _firstEpochTime,
      _authority,
      overrides || {}
    ) as Promise<Staking>;
  }
  getDeployTransaction(
    _req: string,
    _sREQ: string,
    _gREQ: string,
    _epochLength: BigNumberish,
    _firstEpochNumber: BigNumberish,
    _firstEpochTime: BigNumberish,
    _authority: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _req,
      _sREQ,
      _gREQ,
      _epochLength,
      _firstEpochNumber,
      _firstEpochTime,
      _authority,
      overrides || {}
    );
  }
  attach(address: string): Staking {
    return super.attach(address) as Staking;
  }
  connect(signer: Signer): Staking__factory {
    return super.connect(signer) as Staking__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingInterface {
    return new utils.Interface(_abi) as StakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Staking {
    return new Contract(address, _abi, signerOrProvider) as Staking;
  }
}
