import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import close from '../assets/close.svg';
import Rating from './Rating';

const Product = ({ item, provider, address, contract, onClose }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  const handleBuy = async () => {
    const signer = await provider.getSigner();

    const transaction = await contract
      .connect(signer)
      .buy(item.id, { value: item.cost });
    await transaction.wait();

    setHasBought(true);
  };

  useEffect(() => {
    async function fetchDetails() {
      const events = await contract.queryFilter('Buy');
      const orders = events.filter(
        (event) =>
          event.args.buyer === address &&
          event.args.itemId.toString() === item.id.toString()
      );

      if (!orders.length) return;

      const order = await contract.orders(address, orders[0].args.orderId);
      setOrder(order);
    }

    fetchDetails();
  }, [address, contract, hasBought, item.id]);

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img
            src={item.image}
            alt="Product"
          />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2>{utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>

          <hr />

          <h2>Overview</h2>

          <p>
            {item.description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem,
            iusto, consectetur inventore quod soluta quos qui assumenda aperiam,
            eveniet doloribus commodi error modi eaque! Iure repudiandae
            temporibus ex? Optio!
          </p>
        </div>

        <div className="product__order">
          <h1>{utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>

          <p>
            FREE delivery <br />
            <strong>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </p>

          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}

          <button
            className="product__buy"
            onClick={handleBuy}
          >
            Buy Now
          </button>

          <p>
            <small>Ships from</small> Dappazon
          </p>
          <p>
            <small>Sold by</small> Dappazon
          </p>

          {order && (
            <div className="product__bought">
              Item bought on <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + '000')
                ).toLocaleDateString(undefined, {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </strong>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="product__close"
        >
          <img
            src={close}
            alt="Close"
          />
        </button>
      </div>
    </div>
  );
};

export default Product;
