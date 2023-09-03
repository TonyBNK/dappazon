const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

const id = 1;
const name = 'Shoes';
const categoty = 'Clothing';
const image =
  'https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg';
const cost = tokens(1);
const rating = 4;
const stock = 5;

describe('Dappazon', () => {
  let dappazon;
  let storeOwner, buyer;

  beforeEach(async () => {
    // Setup accounts
    [storeOwner, buyer] = await ethers.getSigners();

    // Deploy contract
    const Dappazon = await ethers.getContractFactory('Dappazon');
    dappazon = await Dappazon.deploy();
  });

  describe('Deployment', () => {
    it('Contract owner should be equal to storeOwner.', async () => {
      expect(await dappazon.owner()).to.equal(storeOwner.address);
    });
  });

  describe('Listing', () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(storeOwner)
        .list(id, name, categoty, image, cost, rating, stock);

      await transaction.wait();
    });

    it('Should return item attributes.', async () => {
      const item = await dappazon.items(id);

      expect(item.id).to.equal(id);
      expect(item.cost).to.equal(cost);
    });

    it('Should emit List event.', async () => {
      expect(transaction).to.emit(dappazon, 'List');
    });
  });

  describe('Buying', () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(storeOwner)
        .list(id, name, categoty, image, cost, rating, stock);

      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(id, { value: cost });

      await transaction.wait();
    });

    it("Should update buyer's order count.", async () => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    });

    it('Should add the order.', async () => {
      const order = await dappazon.orders(buyer.address, 1);

      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(name);
    });

    it('Should update the contract balance.', async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(cost);
    });

    it('Should emit Buy event.', () => {
      expect(transaction).to.emit(dappazon, 'Buy');
    });
  });

  describe('Withdrawing', () => {
    let balanceBefore;

    beforeEach(async () => {
      let transaction = await dappazon
        .connect(storeOwner)
        .list(id, name, categoty, image, cost, rating, stock);
      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(id, { value: cost });
      await transaction.wait();

      // Get storeOwner balance before
      balanceBefore = await ethers.provider.getBalance(storeOwner.address);

      // Withdraw
      transaction = await dappazon.connect(storeOwner).withdraw();
      await transaction.wait();
    });

    it("Should increase the owner's balance.", async () => {
      const balanceAfter = await ethers.provider.getBalance(storeOwner.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should decrease the contract's balance.", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(0);
    });
  });
});
