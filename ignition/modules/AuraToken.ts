import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AuraToken = buildModule("AuraTokenModule", (m) => {
  const auraToken = m.contract("AuraToken");

  return { auraToken };
});

export default AuraToken;
