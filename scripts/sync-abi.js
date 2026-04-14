const fs = require("node:fs");
const path = require("node:path");

const artifactPath = path.join(
  __dirname,
  "..",
  "artifacts",
  "contracts",
  "ClubTreasury.sol",
  "ClubTreasury.json"
);

const frontendAbiPath = path.join(
  __dirname,
  "..",
  "frontend",
  "src",
  "abi",
  "ClubTreasury.json"
);

function main() {
  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      "Missing artifact. Run `npm run compile` before syncing ABI."
    );
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  fs.mkdirSync(path.dirname(frontendAbiPath), { recursive: true });
  fs.writeFileSync(
    frontendAbiPath,
    JSON.stringify({ abi: artifact.abi }, null, 2) + "\n"
  );

  console.log(`ABI synced: ${frontendAbiPath}`);
}

main();
