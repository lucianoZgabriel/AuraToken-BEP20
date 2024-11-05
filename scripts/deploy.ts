import { ethers } from "hardhat";

async function main() {
  const auraToken = await ethers.deployContract("AuraToken");
  await auraToken.waitForDeployment();
  console.log("AuraToken deployed to:", auraToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
