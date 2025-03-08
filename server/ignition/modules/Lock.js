const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EnhancedDigitalLocker", (m) => {
  const enhancedDigitalLocker = m.contract("EnhancedDigitalLocker");
  
  return { enhancedDigitalLocker };
});
