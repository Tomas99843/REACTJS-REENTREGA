import React from 'react';
import { Link } from "react-router-dom";
import Counter from "../Counter/Counter"; // Asegúrate de que la ruta sea correcta
import "./Item.css";

const Item = ({ product }) => {
  const handleAddToCart = (quantity) => {
    console.log(`Agregando ${quantity} ${product.title} al carrito`);
    // Aquí luego conectarás con tu CartContext
  };

  return (
    <div className="item-card">
      <Link to={`/item/${product.id}`}>
        <img src={product.image} alt={product.title} className="item-image" />
        <h3 className="item-title">{product.title}</h3>
        <p className="item-price">${product.price}</p>
      </Link>
      
      {/* Componente Counter integrado */}
      <Counter 
        stock={product.stock || 10} // Usa el stock del producto o 10 por defecto
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default Item;