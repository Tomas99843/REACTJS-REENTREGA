import React, { useState, useEffect } from 'react';
import './Counter.css';

const Counter = ({ 
  initial = 1,
  stock = 10,
  onAdd,
  onUpdate,
  showAddButton = true,
  currentCartQuantity = 0
}) => {
  const [quantity, setQuantity] = useState(initial);
  const availableStock = stock - (showAddButton ? 0 : currentCartQuantity);

  useEffect(() => {
    setQuantity(initial);
  }, [initial]);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= availableStock) {
      setQuantity(newQuantity);
      if (!showAddButton && onUpdate) onUpdate(newQuantity);
    }
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(showAddButton ? 1 : 0, quantity - 1);
    setQuantity(newQuantity);
    if (!showAddButton && onUpdate) onUpdate(newQuantity);
  };

  return (
    <div className="counter-container">
      <div className="counter-controls">
        <button 
          onClick={handleDecrement} 
          disabled={quantity <= (showAddButton ? 1 : 0)}
          className="counter-btn"
          aria-label="Reducir cantidad"
        >
          −
        </button>
        <span className="counter-value">{quantity}</span>
        <button 
          onClick={handleIncrement}
          disabled={quantity >= availableStock}
          className="counter-btn"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      {showAddButton && (
        <button
          onClick={() => onAdd(quantity)}
          disabled={quantity === 0 || quantity > availableStock}
          className="counter-add-btn"
        >
          Agregar al carrito
        </button>
      )}
    </div>
  );
};

export default Counter;