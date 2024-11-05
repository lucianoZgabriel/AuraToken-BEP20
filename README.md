# AuraToken

AuraToken is a BEP20-compliant token built on the Binance Smart Chain (BSC) testnet. It extends OpenZeppelin's ERC20 implementation and includes minting functionality that allows users to mint new tokens under certain conditions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Compilation](#compilation)
- [Deployment](#deployment)
  - [Deploying to BSC Testnet](#deploying-to-bsc-testnet)
- [Interacting with the Contract](#interacting-with-the-contract)
  - [Minting Tokens](#minting-tokens)
- [License](#license)

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Hardhat](https://hardhat.org/)
- An account on the BSC testnet with some test BNB for gas fees
- [MetaMask](https://metamask.io/) or another Ethereum-compatible wallet
- [Infura](https://infura.io/) account (optional, for Sepolia network)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/auratoken.git
cd auratoken
npm install
```

## Configuration

Create a .env file in the root directory and add the following environment variables:
```
SECRET=
INFURA_URL=
BNB_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
API_KEY=
```
	•	SECRET: Your mnemonic phrase (ensure this is for a test account)
	•	INFURA_URL: Infura project endpoint (for Sepolia network)
	•	BNB_URL: RPC URL for BSC testnet
	•	API_KEY: BscScan API key (optional)

Note: Never expose your mnemonic or private keys in a production environment.

## Compilation

Compile the smart contracts using:
```
npm run compile
```

## Deployment

### Deploying to BSC Testnet

Ensure your wallet (associated with the mnemonic in .env) has test BNB.

Deploy the contract to the BSC testnet:
```
npm run deploy:bsc
```

## Interacting with the Contract

After deployment, note the contract address displayed in the console.

### Minting Tokens

The mint function allows users to mint new tokens, subject to:
```
•	A non-zero mint amount.
•	A delay (_mintDelay) between mints per address. (1 day default).
•	Only the owner can set mint amount.
```

## License

This project is licensed under the MIT License.
