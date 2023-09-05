import { useMemo, useReducer, useState } from 'react';
import { Navigation, Product, Section } from './components';
import Card from './components/Card';
import { CATEGORIES } from './constants';

function App() {
  const [accountData, setAccountData] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [isOpen, toggle] = useReducer((isOpen) => !isOpen, false);

  const handleClick = (item) => {
    setSelectedItem(item);
    toggle();
  };

  const memoizedItems = useMemo(
    () => (category) =>
      accountData?.items[category].map((item) => (
        <Card
          key={item.id}
          item={item}
          onClick={handleClick}
        />
      )),
    [accountData?.items]
  );

  return (
    <div>
      <Navigation onSet={setAccountData} />
      {accountData && (
        <>
          <h2>Dappazon Best Sellers</h2>
          {accountData.items ? (
            <Sections categories={CATEGORIES}>{memoizedItems}</Sections>
          ) : (
            <h3>Loading...</h3>
          )}
          {isOpen && (
            <Product
              item={selectedItem}
              provider={accountData.provider}
              contract={accountData.contract}
              address={accountData.address}
              onClose={toggle}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

const Sections = ({ categories, children }) => {
  const memoizedPads = useMemo(
    () =>
      categories.map((category) => (
        <Section
          title={category}
          key={category}
        >
          {children?.(category)}
        </Section>
      )),
    [children, categories]
  );

  return <>{memoizedPads}</>;
};
