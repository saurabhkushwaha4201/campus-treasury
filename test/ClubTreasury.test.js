const { expect } = require("chai");
const hre = require("hardhat");

describe("ClubTreasury", function () {
  async function deployTreasury() {
    const treasury = await hre.ethers.deployContract("ClubTreasury");
    await treasury.waitForDeployment();
    return treasury;
  }

  it("records deposits and blocks non-owners from withdrawing", async function () {
    const [owner, member] = await hre.ethers.getSigners();
    const treasury = await deployTreasury();

    await expect(
      treasury.connect(member).contribute({ value: hre.ethers.parseEther("1.0") })
    ).to.not.be.reverted;

    expect(await treasury.getBalance()).to.equal(hre.ethers.parseEther("1.0"));
    expect(await treasury.getContribution(member.address)).to.equal(
      hre.ethers.parseEther("1.0")
    );

    await expect(
      treasury
        .connect(member)
        .withdraw(hre.ethers.parseEther("0.1"), "Venue booking for Tech Fest")
    ).to.be.revertedWith("ClubTreasury: only owner");

    await expect(
      treasury
        .connect(owner)
        .withdraw(hre.ethers.parseEther("0.1"), "Venue booking for Tech Fest")
    ).to.not.be.reverted;

    expect(await treasury.getBalance()).to.equal(hre.ethers.parseEther("0.9"));

    const expenses = await treasury.getExpenses();
    expect(expenses.length).to.equal(1);
    expect(expenses[0].amount).to.equal(hre.ethers.parseEther("0.1"));
    expect(expenses[0].purpose).to.equal("Venue booking for Tech Fest");
  });
});
