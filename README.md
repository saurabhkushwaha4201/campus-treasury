# Campus Treasury Project

A full-stack Ethereum demo for transparent student club fund management.

This repository includes:
- A Solidity smart contract (`ClubTreasury`) for contributions and owner-only withdrawals.
- A Hardhat backend for compile, test, deploy, and local blockchain simulation.
- A Vite + React frontend dashboard that reads live on-chain treasury state.

## What This Project Demonstrates

- **Role-Based Access:** A UI toggle switches between 'Admin' and 'Member' modes to demonstrate smart contract access control.
- **Member Contributions:** Anyone can contribute ETH to the shared treasury.
- **Protected Withdrawals:** The smart contract strictly enforces that only the owner/admin can withdraw funds.
- **Immutable Transparency:** Every withdrawal is permanently logged as an expense record (purpose, amount, timestamp) and displayed on the public dashboard.

## Tech Stack

- Solidity + Hardhat
- Ethers.js v6
- React (Vite)
- Tailwind CSS

## Repository Layout

- `contracts/ClubTreasury.sol` - treasury contract logic
- `scripts/deploy.js` - deploys contract to a selected network
- `scripts/sync-abi.js` - copies contract ABI into frontend
- `test/ClubTreasury.test.js` - unit tests for contribution and withdrawal behavior
- `frontend/` - React app and dashboard components

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Setup

### 1) Install dependencies

From the repository root:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix frontend install
```

### 2) Compile contract and sync ABI to frontend

```bash
npm run compile:sync
```

This generates build artifacts and updates:
- `frontend/src/abi/ClubTreasury.json`

### 3) Start the local blockchain

Run this in terminal A (keep it running):

```bash
npm run node
```

Hardhat will print test accounts and private keys. You will use two keys in the frontend env file.

### 4) Deploy contract to localhost

Run this in terminal B:

```bash
npm run deploy
```

Copy the deployed address from output:

```text
ClubTreasury deployed to: 0x...
```

### 5) Create frontend environment file

Create `frontend/.env` with the following values:

```env
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_ADMIN_KEY=0xPRIVATE_KEY_OF_HARDHAT_ACCOUNT_0
VITE_STUDENT_KEY=0xPRIVATE_KEY_OF_ANOTHER_HARDHAT_ACCOUNT
```

Notes:
- `VITE_ADMIN_KEY` should match the deployer/owner account.
- Use only local Hardhat test keys. Never use real wallet private keys.

### 6) Start frontend

Run this in terminal C:

```bash
npm run frontend:dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Start Flow (Quick Sequence)

Use this order every time you run locally:

1. `npm run compile:sync`
2. Terminal A: `npm run node`
3. Terminal B: `npm run deploy`
4. Update `frontend/.env` with the new deployed address
5. Terminal C: `npm run frontend:dev`

## Useful Commands

- `npm test` - run Hardhat tests
- `npm run compile` - compile contracts
- `npm run sync:abi` - sync ABI only
- `npm run frontend:build` - build frontend for production
- `npx hardhat clean` - clears the cache and artifacts if the local node acts up

## Troubleshooting

- **Blank UI or contract errors:**
  - Confirm `VITE_CONTRACT_ADDRESS` is from the latest deploy on the currently running local node.
- **"Set wallet keys in frontend/.env":**
  - Add valid Hardhat private keys for `VITE_ADMIN_KEY` and `VITE_STUDENT_KEY`.
- **ABI mismatch after contract edits:**
  - Re-run `npm run compile:sync` and restart the frontend.
- **Transactions fail after restarting node:**
  - Hardhat resets its state when restarted. You must re-deploy (`npm run deploy`) and update `VITE_CONTRACT_ADDRESS` in your `.env`.

## Security Notice

This project is for local development and learning. Do not use these keys, config, or code as-is in production.
