import { Contract, providers, utils } from 'ethers';
import ABI from './abis/Dappazon.json';
import { SMART_CONTRACT_ADDRESS } from './constants';

export const shortenAccountAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(38, 42)}` : '';
};

const getItems = async (contract) => {
  const items = [];

  for (let i = 0; i < 9; i++) {
    const item = await contract.items(i + 1);
    items.push(item);
  }

  return items;
};

export const addFilterCategoriesMutable = (items) => {
  items.filterWithCategories = filterWithCategories;
  return items;
};

const select = (category) => (item) => item.category === category;

export function filterWithCategories(categories) {
  return categories.reduce((acc, category) => {
    acc[`${category}`] = this.filter(select(category));
    return acc;
  }, {});
}

const getAddress = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  return utils.getAddress(accounts[0]);
};

const getProvider = () => new providers.Web3Provider(window.ethereum);

const getContract = (provider) =>
  new Contract(SMART_CONTRACT_ADDRESS, ABI, provider);

export const connectAccount = async () => {
  const address = await getAddress();
  const provider = getProvider();
  const contract = getContract(provider);
  const items = await getItems(contract);

  return {
    address,
    provider,
    contract,
    items,
  };
};
