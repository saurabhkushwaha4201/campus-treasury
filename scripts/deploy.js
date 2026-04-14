const hre = require("hardhat");

async function main() {
  const treasury = await hre.ethers.deployContract("ClubTreasury");
  await treasury.waitForDeployment();

  const address = await treasury.getAddress();
  console.log(`ClubTreasury deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
