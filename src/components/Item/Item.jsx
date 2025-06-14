import React from 'react';
import { Link } from 'react-router-dom';
import "./Item.css";

const Item = ({ product }) => {
  return (
    <div className="item-card">
      <img src={product.imageUrl} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      
      <Link to={`/item/${product.firestoreId}`} className="detail-link">
        Ver detalle
      </Link>
    </div>
  );
};

export default Item;