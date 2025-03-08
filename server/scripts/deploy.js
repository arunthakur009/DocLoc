const hre = require("hardhat");

async function main() {
  const EnhancedDigitalLocker = await hre.ethers.getContractFactory("EnhancedDigitalLocker");
  const locker = await EnhancedDigitalLocker.deploy();
  await locker.waitForDeployment();
  console.log("EnhancedDigitalLocker deployed to:", await locker.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });