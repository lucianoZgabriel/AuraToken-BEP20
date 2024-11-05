import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("AuraToken", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const AuraToken = await hre.ethers.getContractFactory("AuraToken");
    const auraToken = await AuraToken.deploy();

    return { auraToken, owner, otherAccount };
  }

  it("Should have correct name", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const name = await auraToken.name();
    expect(name).to.equal("AuraToken");
  });

  it("Should have correct symbol", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const symbol = await auraToken.symbol();
    expect(symbol).to.equal("AUR");
  });

  it("Should have correct decimals", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const decimals = await auraToken.decimals();
    expect(decimals).to.equal(18);
  });

  it("Should have correct total supply", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const totalSupply = await auraToken.totalSupply();
    expect(totalSupply).to.equal(1000n * 10n ** 18n);
  });

  it("Should have correct owner balance", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const balance = await auraToken.balanceOf(owner.address);
    expect(balance).to.equal(1000n * 10n ** 18n);
  });

  it("Should transfer tokens", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.transfer(otherAccount.address, 100n * 10n ** 18n);
    const ownerBalance = await auraToken.balanceOf(owner.address);
    const balance = await auraToken.balanceOf(otherAccount.address);
    expect(balance).to.equal(100n * 10n ** 18n);
    expect(ownerBalance).to.equal(900n * 10n ** 18n);
  });

  it("Should not transfer more tokens than balance", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    expect(
      auraToken.transfer(otherAccount.address, 1001n * 10n ** 18n)
    ).to.be.revertedWithCustomError(auraToken, "ERC20InsufficientBalance");
  });

  it("Should approve tokens", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.approve(otherAccount.address, 100n * 10n ** 18n);
    const allowance = await auraToken.allowance(
      owner.address,
      otherAccount.address
    );
    expect(allowance).to.equal(100n * 10n ** 18n);
  });

  it("Should transfer from", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.approve(otherAccount.address, 200n * 10n ** 18n);
    await auraToken
      .connect(otherAccount)
      .transferFrom(owner.address, otherAccount.address, 100n * 10n ** 18n);
    const ownerBalance = await auraToken.balanceOf(owner.address);
    const balance = await auraToken.balanceOf(otherAccount.address);
    const allowance = await auraToken.allowance(
      owner.address,
      otherAccount.address
    );
    expect(balance).to.equal(100n * 10n ** 18n);
    expect(ownerBalance).to.equal(900n * 10n ** 18n);
    expect(allowance).to.equal(100n * 10n ** 18n);
  });

  it("Should not transfer from more tokens than allowance", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.approve(otherAccount.address, 100n * 10n ** 18n);
    expect(
      auraToken
        .connect(otherAccount)
        .transferFrom(owner.address, otherAccount.address, 101n * 10n ** 18n)
    ).to.be.revertedWithCustomError(auraToken, "ERC20InsufficientAllowance");
  });

  it("Should not transfer from more tokens than balance", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.approve(otherAccount.address, 1001n * 10n ** 18n);
    expect(
      auraToken
        .connect(otherAccount)
        .transferFrom(owner.address, otherAccount.address, 1001n * 10n ** 18n)
    ).to.be.revertedWithCustomError(auraToken, "ERC20InsufficientBalance");
  });
});
