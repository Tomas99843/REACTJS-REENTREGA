import React, { useState, useEffect } from 'react';
import './Counter.css';

const Counter = ({ 
  initial = 1,
  stock = 10,
  onAdd,
  onUpdate,
  showAddButton = true
}) => {
  const [quantity, setQuantity] = useState(initial);

  // Sincronización con cambios externos
  useEffect(() => {
    setQuantity(initial);
  }, [initial]);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (showAddButton) {
      onAdd && onAdd(newQuantity);
    } else {
      onUpdate && onUpdate(newQuantity);
    }
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(showAddButton ? 0 : 1, quantity - 1);
    setQuantity(newQuantity);
    if (showAddButton) {
      onAdd && onAdd(newQuantity);
    } else {
      onUpdate && onUpdate(newQuantity);
    }
  };

  return (
    <div className="counter-container">
      <div className="counter-controls">
        <button 
          onClick={handleDecrement} 
          disabled={quantity <= (showAddButton ? 0 : 1)}
          className="counter-btn"
        >
          −
        </button>
        <span className="counter-value">{quantity}</span>
        <button 
          onClick={handleIncrement}
          disabled={quantity >= stock}
          className="counter-btn"
        >
          +
        </button>
      </div>

      {showAddButton && (
        <button
          onClick={() => onAdd && onAdd(quantity)}
          disabled={quantity === 0}
          className="counter-add-btn"
        >
          Agregar ({quantity})
        </button>
      )}
    </div>
  );
};

export default Counter;