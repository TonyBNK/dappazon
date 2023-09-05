import { utils } from 'ethers';
import React from 'react';
import Rating from './Rating';

const Card = ({ item, onClick = (f) => f }) => {
  return (
    <div
      className="card"
      onClick={() => onClick(item)}
    >
      <div className="card__image">
        <img
          src={item.image}
          alt="Item"
        />
      </div>
      <div className="card__info">
        <h4>{item.name}</h4>
        <Rating value={item.rating} />
        <p>{utils.formatUnits(item.cost.toString(), 'ether')} ETH</p>
      </div>
    </div>
  );
};

export default Card;
