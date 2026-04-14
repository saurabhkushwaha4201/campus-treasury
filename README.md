# Campus Treasury Project

A full-stack Ethereum demo for transparent student club fund management.

[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=000)](https://hardhat.org/docs)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/docs)

This repository includes a Solidity treasury contract, a Hardhat development workflow, and a React dashboard that reads live on-chain state.

## At a Glance

- 🚦 **Role-Based Access:** A UI toggle switches between `Admin` and `Member` modes to demonstrate smart contract access control.
- 💸 **Open Contributions:** Anyone can contribute ETH to the shared treasury.
- 🔒 **Protected Withdrawals:** The smart contract strictly enforces that only the owner/admin can withdraw funds.
- 🧾 **Immutable Expense Ledger:** Every withdrawal is permanently logged as an expense record and shown on the dashboard.

## Quick Start Sequence

Use this sequence if you want to test the app immediately:

1. `npm install`
2. `npm run compile:sync`
3. Terminal A: `npm run node`
4. Terminal B: `npm run deploy`
5. Terminal C: `npm run frontend:dev`

After deployment, set `frontend/.env` with your local node URL, deployed contract address, and two Hardhat private keys.

## Collapsible Setup Guide

<details>
<summary><strong>1. Installing Dependencies</strong></summary>

From the repository root:

```bash
npm install
```

Install the frontend dependencies:

```bash
npm --prefix frontend install
```

</details>

<details>
<summary><strong>2. Compiling the Smart Contract</strong></summary>

Compile the contract and sync the ABI into the frontend:

```bash
npm run compile:sync
```

This updates `frontend/src/abi/ClubTreasury.json` so the UI can talk to the latest contract build.

</details>

<details>
<summary><strong>3. Starting the Local Node</strong></summary>

Run a local Hardhat chain in Terminal A and keep it open:

```bash
npm run node
```

Hardhat prints funded test accounts and their private keys. You will use two of those keys in the frontend environment file.

</details>

<details>
<summary><strong>4. Deploying the Contract</strong></summary>

In Terminal B, deploy the treasury contract to the local node:

```bash
npm run deploy
```

Copy the deployed address from the output:

```text
ClubTreasury deployed to: 0x...
```

Create or update `frontend/.env` with:

```env
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_ADMIN_KEY=0xPRIVATE_KEY_OF_HARDHAT_ACCOUNT_0
VITE_STUDENT_KEY=0xPRIVATE_KEY_OF_ANOTHER_HARDHAT_ACCOUNT
```

Use only local Hardhat test keys. Do not use real wallet private keys.

</details>

<details>
<summary><strong>5. Launching the Frontend</strong></summary>

Start the React app in Terminal C:

```bash
npm run frontend:dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

</details>

## Repository Layout

- `contracts/ClubTreasury.sol` - treasury contract logic
- `scripts/deploy.js` - deploys contract to a selected network
- `scripts/sync-abi.js` - copies contract ABI into frontend
- `test/ClubTreasury.test.js` - unit tests for contribution and withdrawal behavior
- `frontend/` - React app and dashboard components

## Useful Commands

- `npm test` - run Hardhat tests
- `npm run compile` - compile contracts
- `npm run sync:abi` - sync ABI only
- `npm run frontend:build` - build frontend for production
- `npx hardhat clean` - clears the cache and artifacts if the local node acts up

## Troubleshooting FAQ

<details>
<summary><strong>Blank UI or contract errors</strong></summary>

Confirm `VITE_CONTRACT_ADDRESS` is from the latest deploy on the currently running local node.

</details>

<details>
<summary><strong>Set wallet keys in frontend/.env</strong></summary>

Add valid Hardhat private keys for `VITE_ADMIN_KEY` and `VITE_STUDENT_KEY`.

</details>

<details>
<summary><strong>ABI mismatch after contract edits</strong></summary>

Re-run `npm run compile:sync` and restart the frontend.

</details>

<details>
<summary><strong>Transactions fail after restarting node</strong></summary>

Hardhat resets its state when restarted. Re-deploy with `npm run deploy` and update `VITE_CONTRACT_ADDRESS` in your `.env`.

</details>

## Security Notice

This project is for local development and learning. Do not use these keys, config, or code as-is in production.
