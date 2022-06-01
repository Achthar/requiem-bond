// hardhat.config.ts

import 'dotenv/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-solhint';
import '@tenderly/hardhat-tenderly';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import 'hardhat-spdx-license-identifier';
import '@typechain/hardhat';
import 'hardhat-watcher';
import 'solidity-coverage';
import "hardhat-contract-sizer";
// import {accounts} from './utils/networks';

//import './tasks';
import * as dotenv from 'dotenv';

dotenv.config();

import { HardhatUserConfig } from 'hardhat/types';
import { removeConsoleLog } from 'hardhat-preprocessor';

const accounts = {
  mnemonic:
    'test test test test test test test test test test test junk',
  accountsBalance: "990000000000000000000",
};

const pk1: string = process.env.PK_1 || '';
const pk2: string = process.env.PK_2 || '';
const pk_local: string = process.env.PRIVATE_KEY_LOCAL || '';
const config: HardhatUserConfig = {
  abiExporter: {
    path: './abi',
    clear: false,
    flat: true,
    // only: [],
    // except: []
  },
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
    enabled: true,
    excludeContracts: ['contracts/mocks/', 'contracts/libraries/'],
  },
  mocha: {
    timeout: 20000,
  },
  namedAccounts: {
    operator: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B',
    deployer: {
      default: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B',//'0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
      localhost: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      ropsten: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
      'bsc-testnet': '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
      kovan: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
      mumbai: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
      fuji: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
    },
    localhost: {
      default: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',//'0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
    },
    user: {
      default: '0xf67c17F9eB5CB0eB71628714E2bA0bDe8d92d5CC',//'0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
    },
    dev: {
      // Default to 1
      default: '0x10E38dFfFCfdBaaf590D5A9958B01C9cfcF6A63B', //'0x333132d4FCbe1B7F34198AD545672BbA95c5882b',
      localhost: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      // dev address mainnet
      // 1: "",
    },
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    localhost: {
      url: 'http://localhost:8545',
      live: false,
      saveDeployments: true,
      tags: ['local'],
      accounts
    },
    hardhat: {
      forking: {
        enabled: process.env.FORKING === 'true',
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      },
      live: false,
      saveDeployments: true,
      tags: ['test', 'local'],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 3,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 4,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 5,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 5000000000,
      gasMultiplier: 2,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 42,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasPrice: 20000000000,
      gasMultiplier: 2,
    },
    moonbase: {
      url: 'https://rpc.testnet.moonbeam.network',
      accounts,
      chainId: 1287,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gas: 5198000,
      gasMultiplier: 2,
    },
    fantom: {
      url: 'https://rpcapi.fantom.network',
      accounts,
      chainId: 250,
      live: true,
      saveDeployments: true,
      gasPrice: 22000000000,
    },
    'fantom-testnet': {
      url: 'https://rpc.testnet.fantom.network',
      accounts,
      chainId: 4002,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com',
      accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts: [pk1, pk2],
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    xdai: {
      url: 'https://rpc.xdaichain.com',
      accounts,
      chainId: 100,
      live: true,
      saveDeployments: true,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org',
      accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    'bsc-testnet': {
      url: 'https://data-seed-prebsc-2-s3.binance.org:8545',
      //accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 1,
      accounts: [pk1, pk2],
      gas: 2100000,
      gasPrice: 10000000000,
      // blockGasLimit: 900000000,
    },
    heco: {
      url: 'https://http-mainnet.hecochain.com',
      accounts,
      chainId: 128,
      live: true,
      saveDeployments: true,
    },
    'heco-testnet': {
      url: 'https://http-testnet.hecochain.com',
      accounts,
      chainId: 256,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      gasPrice: 470000000000,
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [pk1, pk2],
      chainId: 43113,
      live: true,
      saveDeployments: true,
      // tags: ['staging'],
      // gasMultiplier: 4,
      // gas: 800000000,
      // gasPrice: 25000000000,
    },
    'oasis-test': {
      url: 'https://testnet.emerald.oasis.dev',
      accounts: [pk1, pk2],
      chainId: 42261,
      live: true,
      saveDeployments: true,
      // tags: ['staging'],
      // gasMultiplier: 4,
      gas: 800000,
      gasPrice: 2500000000,
    },
    'quarkchain-dev-s0': {
      url: 'http://eth-jrpc.devnet.quarkchain.io:39900',
      accounts: [pk1, pk2],
      chainId: 110001,
      live: true,
      saveDeployments: true,
      // tags: ['staging'],
      // gasMultiplier: 4,
      gas: 800000,
      gasPrice: 2500000000,
    },
    harmony: {
      url: 'https://api.s0.t.hmny.io',
      accounts,
      chainId: 1666600000,
      live: true,
      saveDeployments: true,
    },
    'harmony-testnet': {
      url: 'https://api.s0.b.hmny.io',
      accounts,
      chainId: 1666700000,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    okex: {
      url: 'https://exchainrpc.okex.org',
      accounts,
      chainId: 66,
      live: true,
      saveDeployments: true,
    },
    'okex-testnet': {
      url: 'https://exchaintestrpc.okex.org',
      accounts,
      chainId: 65,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    arbitrum: {
      url: 'https://arb1.arbitrum.io/rpc',
      accounts,
      chainId: 42161,
      live: true,
      saveDeployments: true,
      blockGasLimit: 700000,
    },
    'arbitrum-testnet': {
      url: 'https://kovan3.arbitrum.io/rpc',
      accounts,
      chainId: 79377087078960,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
    celo: {
      url: 'https://forno.celo.org',
      accounts,
      chainId: 42220,
      live: true,
      saveDeployments: true,
    },
    palm: {
      url: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
      accounts,
      chainId: 11297108109,
      live: true,
      saveDeployments: true,
    },
    'palm-testnet': {
      url: 'https://palm-testnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
      accounts,
      chainId: 11297108099,
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      gasMultiplier: 2,
    },
  },
  paths: {
    artifacts: 'artifacts',
    cache: 'cache',
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
    sources: 'contracts',
    tests: 'test',
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== 'hardhat' && bre.network.name !== 'localhost'
    ),
  },
  solidity: {
    compilers: [
      {
        version: '0.8.14',
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
          evmVersion: 'london',
        },
      },
      {
        version: '^0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'istanbul',
        },
      },
      {
        version: '0.8.0',

        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: 'istanbul',
        },
      },
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT!,
    username: process.env.TENDERLY_USERNAME!,
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  watcher: {
    compile: {
      tasks: ['compile'],
      files: ['./src'],
      verbose: true,
    },
  },
  contractSizer: {
    runOnCompile: true,
    disambiguatePaths: false,
  },
};

export default config;
