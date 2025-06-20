import React from 'react';
import { Link } from 'react-router-dom';
import "./Item.css";

const Item = ({ product }) => {
  return (
    <div className="item-card">
      <div className="item-image-container">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="item-image"
        />
      </div>
      
      <div className="item-info">
        <h3 className="item-title">{product.title}</h3>
        <p className="item-price">${product.price}</p>
      </div>
      
      <Link to={`/item/${product.id}`}>  {/* Usamos product.id */}
        <button className="detail-button">
          Ver detalles
        </button>
      </Link>
    </div>
  );
};

export default Item;