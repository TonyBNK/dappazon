import { useState } from 'react';
import { CATEGORIES } from '../constants';
import {
  addFilterCategoriesMutable,
  connectAccount,
  shortenAccountAddress,
} from '../utils';

const Navigation = ({ onSet = (f) => f }) => {
  const [accountAddress, setAccountAddress] = useState('');

  const handleClick = async () => {
    const { address, provider, contract, items } = await connectAccount();

    setAccountAddress(address);
    onSet({
      provider,
      contract,
      items: addFilterCategoriesMutable(items).filterWithCategories(CATEGORIES),
      address,
    });
  };

  return (
    <nav>
      <div className="nav__brand">
        <h1>Dappazon</h1>
      </div>
      <input
        type="text"
        className="nav__search"
      />
      {accountAddress ? (
        <button className="nav__connect">
          {shortenAccountAddress(accountAddress)}
        </button>
      ) : (
        <button
          className="nav__connect"
          onClick={handleClick}
        >
          Connect
        </button>
      )}
      <ul className="nav__links">
        <li>
          <a href="#Clothing & Jewerly">Clothing & Jewerly</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
