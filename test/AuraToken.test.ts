import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
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

  it("Should mint once", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const mintAmount = await auraToken.setMintAmount(100n * 10n ** 18n);
    await auraToken.mint();
    const totalSupply = await auraToken.totalSupply();
    const ownerBalance = await auraToken.balanceOf(owner.address);
    expect(totalSupply).to.equal(1100n * 10n ** 18n);
    expect(ownerBalance).to.equal(1100n * 10n ** 18n);
  });

  it("Should mint twice (different acounts)", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.setMintAmount(100n * 10n ** 18n);
    await auraToken.mint();

    const instance = auraToken.connect(otherAccount);
    await instance.mint();
    const totalSupply = await auraToken.totalSupply();
    const ownerBalance = await auraToken.balanceOf(owner.address);
    const otherAccountBalance = await auraToken.balanceOf(otherAccount.address);
    expect(totalSupply).to.equal(1200n * 10n ** 18n);
    expect(ownerBalance).to.equal(1100n * 10n ** 18n);
    expect(otherAccountBalance).to.equal(100n * 10n ** 18n);
  });

  it("Should mint twice (_mintDelay)", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.setMintAmount(100n * 10n ** 18n);
    await auraToken.mint();
    await time.increase(60 * 60 * 24 * 2);
    await auraToken.mint();
    const totalSupply = await auraToken.totalSupply();
    const ownerBalance = await auraToken.balanceOf(owner.address);
    expect(totalSupply).to.equal(1200n * 10n ** 18n);
    expect(ownerBalance).to.equal(1200n * 10n ** 18n);
  });

  it("Should NOT set mint amount (not owner)", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const instance = auraToken.connect(otherAccount);
    expect(instance.setMintAmount(100n * 10n ** 18n)).to.be.rejectedWith(
      "AuraToken: only owner can call this function"
    );
  });

  it("Should NOT set mint delay (not owner)", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    const instance = auraToken.connect(otherAccount);
    expect(instance.setMintDelay(60 * 60 * 24 * 2)).to.be.rejectedWith(
      "AuraToken: only owner can call this function"
    );
  });

  it("Should NOT mint", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    expect(auraToken.mint()).to.be.rejectedWith("AuraToken: mint amount is 0");
  });

  it("Should NOT mint twice (mint delay not passed)", async function () {
    const { auraToken, owner, otherAccount } = await loadFixture(deployFixture);
    await auraToken.setMintAmount(100n * 10n ** 18n);
    await auraToken.mint();
    expect(auraToken.mint()).to.be.rejectedWith(
      "AuraToken: mint is not allowed yet"
    );
  });
});
