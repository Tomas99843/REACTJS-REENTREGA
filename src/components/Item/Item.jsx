import React from 'react';
import { Link } from "react-router-dom";
import Counter from "../Counter/Counter"; 
import "./Item.css";

const Item = ({ product }) => {
  const handleAddToCart = (quantity) => {
    console.log(`Agregando ${quantity} ${product.title} al carrito`);
   
  };

  return (
    <div className="item-card">
      <Link to={`/item/${product.id}`}>
        <img src={product.image} alt={product.title} className="item-image" />
        <h3 className="item-title">{product.title}</h3>
        <p className="item-price">${product.price}</p>
      </Link>
      
     
      <Counter 
        stock={product.stock || 10} 
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default Item;