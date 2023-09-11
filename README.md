---

# Token Swapping DApp with 0x API

Welcome to the Token Swapping DApp built using Next.js and the 0x API. This DApp aggregates liquidity across the greater DEX (Decentralized Exchange) ecosystem and surfaces the best price to the user. It leverages the 0x API swap endpoint for efficient token swaps with minimal slippage and transaction costs.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Introduction

This DApp allows users to swap tokens using the 0x API, which aggregates liquidity from various DEXs to find the best possible price for a token swap. It's designed to offer an efficient and cost-effective trading experience without the need to write smart contracts.

### Features

- Token swapping with minimal slippage and transaction costs.
- Aggregated liquidity from major DEXs.
- Easy integration with 0x API for fetching quotes and executing swaps.
- A clean and intuitive user interface.

## Getting Started

### Prerequisites

Before you start, make sure you have the following prerequisites:

- Node.js and npm installed.
- A web3 wallet (e.g., MetaMask) for Ethereum transactions.
- An API key from 0x API (follow the [official documentation](https://0x.org/docs/introduction/getting-started) to obtain one).

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/KunJon-analytics/kunjonswap.git
   cd kunjonswap
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your 0x API key:

   ```bash
   DATA_API_KEY=your-api-key-here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

1. Access the DApp via your web browser at `http://localhost:3000`.
2. Connect your web3 wallet (e.g., MetaMask).
3. Select the tokens you want to swap.
4. Review the available quotes with their prices and slippage.
5. Choose the best quote and proceed with the swap.
6. Confirm the transaction in your wallet.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
