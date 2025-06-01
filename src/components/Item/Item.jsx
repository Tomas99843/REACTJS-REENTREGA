import React from 'react';
import { Link } from "react-router-dom";
import "./Item.css";

const Item = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/item/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={`/images/products/${product.id}.jpg`} 
            alt={product.title}
            className="product-image"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">${product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  );
};

export default Item;