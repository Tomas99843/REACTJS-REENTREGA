import React from 'react';
import './ItemDetail.css';

const ItemDetail = ({ product }) => {
  return (
    <div className="item-detail">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p className="price">${product.price}</p>
      <p className="description">{product.description}</p>
      <p className="stock">{product.stock} unidades disponibles</p>
    </div>
  );
};

export default ItemDetail;