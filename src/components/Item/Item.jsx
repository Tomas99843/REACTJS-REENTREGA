import React from 'react';
import { Link } from "react-router-dom";
import "./Item.css";

const Item = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/item/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.imageUrl || '/images/placeholder.jpg'} 
            alt={product.title}
            className="product-image"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.classList.add('error-image'); // Opcional: estilo para imágenes fallidas
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">${product.price?.toLocaleString?.() ?? 'N/A'}</p>
        </div>
      </Link>
    </div>
  );
};

export default Item;