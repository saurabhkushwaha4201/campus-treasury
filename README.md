# Campus Club Treasury

A local Hardhat + React dashboard that demonstrates transparent club fund management with owner-only withdrawals.

## Project Structure

- `contracts/ClubTreasury.sol`: Treasury logic.
- `scripts/deploy.js`: Local deployment.
- `scripts/sync-abi.js`: Copies the compiled ABI into the frontend.
- `test/ClubTreasury.test.js`: Owner-withdraw and contribution-path tests.
- `frontend/`: Vite + React + Tailwind dashboard.

## Local Setup

1. Install root dependencies:
   - `npm install`
2. Compile contract and sync ABI to frontend:
   - `npm run compile:sync`
3. Start local chain:
   - `npm run node`
4. Deploy in a second terminal:
   - `npm run deploy`
5. Create `frontend/.env` from `frontend/.env.example` and fill:
   - `VITE_RPC_URL`
   - `VITE_CONTRACT_ADDRESS` (from deploy output)
   - `VITE_ADMIN_KEY`
   - `VITE_STUDENT_KEY`
6. Run frontend:
   - `npm --prefix frontend run dev`

## Notes

- The frontend reads ABI from `frontend/src/abi/ClubTreasury.json`.
- Re-run `npm run compile:sync` after contract changes.
- The hook refresh strategy is re-fetch on successful transaction completion.
