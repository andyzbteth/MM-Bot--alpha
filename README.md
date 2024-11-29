# MM-Bot--alpha

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Node.js](https://img.shields.io/badge/node.js-v14.0.0-green.svg)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Security Tips](#security-tips)
- [License](#license)

---

## Introduction

**MM Bots** is a Node.js-based application that automates cryptocurrency trading on the Ethereum blockchain using Uniswap V3. It includes functionalities to buy, sell, and manage trading volume based on predefined parameters.

---

## Features

- **Buy Bot**: Automatically purchases tokens at a target price.
- **Sell Bot**: Automatically sells tokens at a target price.
- **Volume Bot**: Alternates between buying and selling at set intervals.
- **Uniswap V3 Integration**: Executes trades through Uniswap V3 pools.

---

## Prerequisites

Before getting started, ensure you have the following:

- **Node.js** (v14.x or higher): [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Ethereum Wallet** (e.g., MetaMask) with sufficient ETH for transactions.
- **Infura Account**: To obtain an API key for Ethereum network access. [Sign up at Infura](https://infura.io/)

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/andyzbteth/MM-Bot--alpha.git
   cd MM-BOT--ALPHA
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

---

## Configuration

1. **Create a `.env` File**

   In the root directory of the project, create a `.env` file to store your configuration variables.

   ```bash
   touch .env
   ```

2. **Add the Following Variables to `.env`**

   ```env
   # Ethereum Wallet Private Key
   PRIVATE_KEY=your_private_key_here

   # Infura Project ID
   INFURA_PROJECT_ID=your_infura_project_id

   # Token Configuration
   TOKEN_ADDRESS=0xYourTokenAddress

   # Uniswap V3 Pool Address
   UNISWAP_POOL_ADDRESS=0xUniswapPoolAddress

   # Trading Parameters
   TARGET_BUY_PRICE=desired_buy_price_in_eth
   TARGET_SELL_PRICE=desired_sell_price_in_eth
   MAX_TOKEN_PER_TX=amount_of_token_per_transaction
   MAX_ETH_PER_TX=amount_of_eth_per_transaction
   ```

   **⚠️ Important:** 
   - Replace the placeholder values (`your_private_key_here`, `your_infura_project_id`, etc.) with your actual information.
   - **Never share your private key**. Ensure the `.env` file is included in `.gitignore` to prevent it from being pushed to version control.

---

## Usage

1. **Start the Bot**

   Run the main script to start the trading bots:

   ```bash
   node index.js
   ```

   The bots will begin monitoring the market and execute buy/sell transactions based on your configured parameters.

2. **Bot Operations**

   - **Buy Bot**: Buys tokens when the market price is at or below `TARGET_BUY_PRICE`.
   - **Sell Bot**: Sells tokens when the market price is at or above `TARGET_SELL_PRICE`.
   - **Volume Bot**: Alternates between buying and selling at intervals defined in the configuration.

---

## Security Tips

- **Protect Your Private Key**: 
  - Store your `.env` file securely.
  - Do not expose your private key in any public repositories or platforms.

- **Use Testnets for Testing**:
  - Before deploying with real funds, test your bots on Ethereum testnets like Ropsten or Rinkeby.

- **Monitor Transactions**:
  - Regularly check your transactions and bot activities to ensure everything operates as expected.

- **Update Dependencies**:
  - Keep your Node.js packages up to date to benefit from security patches and improvements.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Disclaimer:**  
Automated trading involves significant risk, including financial loss. Ensure you understand the risks and have appropriate safeguards in place before deploying any trading bots with real funds. The authors are not responsible for any losses incurred through the use of this software.
