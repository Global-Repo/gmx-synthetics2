import dotenv from "dotenv";
dotenv.config();

import path from "path";
import fs from "fs";
import { ethers } from "ethers";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "hardhat-deploy";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";

// extends hre with gmx domain data
import "./config";

// add test helper methods
import "./utils/test";

const getRpcUrl = (network) => {
  const defaultRpcs = {
    arbitrum: "https://arb1.arbitrum.io/rpc",
    avalanche: "https://api.avax.network/ext/bc/C/rpc",
    arbitrumGoerli: "https://goerli-rollup.arbitrum.io/rpc",
    avalancheFuji: "https://api.avax-test.network/ext/bc/C/rpc",
    snowtrace: "https://api.avax.network/ext/bc/C/rpc",
    bsc: "https://bsc-dataseed.binance.org/",
    bscTest: "https://data-seed-prebsc-1-s1.binance.org:8545",
  };

  return defaultRpcs[network];
};

const getEnvAccountsBeGlo = () => {
  if (!process.env.ACCOUNT_MNEMONIC) {
    throw new Error("Invalid mnemonic");
  }

  const wallet = ethers.Wallet.fromMnemonic(process.env.ACCOUNT_MNEMONIC);
  return [wallet.privateKey];
};

const getEnvAccounts = () => {
  const { ACCOUNT_KEY, ACCOUNT_MNEMONIC } = process.env;

  if (ACCOUNT_KEY) {
    return [ACCOUNT_KEY];
  }

  if (!ACCOUNT_MNEMONIC) {
    throw new Error("Invalid mnemonic");
  }
  const wallet = ethers.Wallet.fromMnemonic(ACCOUNT_MNEMONIC);
  return [wallet.privateKey];
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10,
        details: {
          constantOptimizer: true,
        },
      },
    },
  },
  networks: {
    hardhat: {
      saveDeployments: true,
      // forking: {
      //   url: `https://rpc.ankr.com/avalanche`,
      //   blockNumber: 33963320,
      // },
    },
    localhost: {
      saveDeployments: true,
    },
    bscTest: {
      // url: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
      url: getRpcUrl("bscTest"),
      chainId: 97,
      //accounts: {mnemonic: mnemonicDep},
      accounts: getEnvAccounts(),
      verify: {
        etherscan: {
          apiUrl: "https://api-testnet.bscscan.com/api",
          apiKey: process.env.BSC_API_KEY,
        },
      },
    },
    bsc: {
      url: getRpcUrl("bsc"),
      chainId: 56,
      //accounts: {mnemonic: mnemonicDep},
      accounts: getEnvAccounts(),
      verify: {
        etherscan: {
          apiUrl: "https://api.bscscan.com/api",
          apiKey: process.env.BSC_API_KEY,
        },
      },
    },
    arbitrum: {
      url: getRpcUrl("arbitrum"),
      chainId: 42161,
      accounts: getEnvAccounts(),
      verify: {
        etherscan: {
          apiUrl: "https://api.arbiscan.io/",
          apiKey: process.env.ARBISCAN_API_KEY,
        },
      },
      blockGasLimit: 20_000_000,
    },
    avalanche: {
      url: getRpcUrl("avalanche"),
      chainId: 43114,
      accounts: getEnvAccounts(),
      gasPrice: 200000000000,
      verify: {
        etherscan: {
          apiUrl: "https://api.snowtrace.io/",
          apiKey: process.env.SNOWTRACE_API_KEY,
        },
      },
      blockGasLimit: 15_000_000,
    },
    snowtrace: {
      url: getRpcUrl("snowtrace"),
      accounts: getEnvAccounts(),
    },
    arbitrumGoerli: {
      url: getRpcUrl("arbitrumGoerli"),
      chainId: 421613,
      accounts: getEnvAccounts(),
      verify: {
        etherscan: {
          apiUrl: "https://api-goerli.arbiscan.io/",
          apiKey: process.env.ARBISCAN_API_KEY,
        },
      },
      blockGasLimit: 10000000,
    },
    avalancheFuji: {
      url: getRpcUrl("avalancheFuji"),
      chainId: 43113,
      accounts: getEnvAccounts(),
      verify: {
        etherscan: {
          apiUrl: "https://api-testnet.snowtrace.io/",
          apiKey: process.env.SNOWTRACE_API_KEY,
        },
      },
      blockGasLimit: 2500000,
      // gasPrice: 50000000000,
    },
  },
  // hardhat-deploy has issues with some contracts
  // https://github.com/wighawag/hardhat-deploy/issues/264
  etherscan: {
    apiKey: {
      // hardhat-etherscan plugin uses "avalancheFujiTestnet" name
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      avalanche: process.env.SNOWTRACE_API_KEY,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
      snowtrace: "snowtrace", // apiKey is not required, just set a placeholder
      bscTest: process.env.BSC_API_KEY,
      bsc: process.env.BSC_API_KEY,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
  namedAccounts: {
    deployer: 0, //TODO PONER DEPLOYER ADDRESS
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
