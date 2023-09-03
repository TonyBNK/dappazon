const { ethers } = require('hardhat');
const { items } = require('../src/items.json');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

async function main() {
  // Setup account
  const [storeOwner] = await ethers.getSigners();

  // Deploy contract
  const Dappazon = await ethers.getContractFactory('Dappazon');
  const dappazon = await Dappazon.deploy();
  await dappazon.deployed();

  console.log(`Deployed Dappazon contract at: ${dappazon.address}\n`);

  // List items
  for (const item of items) {
    const transaction = await dappazon
      .connect(storeOwner)
      .list(
        item.id,
        item.name,
        item.category,
        item.image,
        tokens(item.price),
        item.rating,
        item.stock
      );

    await transaction.wait();

    console.log(`Listed item: ${item.id} - ${item.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
