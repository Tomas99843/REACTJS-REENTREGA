import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Counter.css';

const Counter = ({ 
  initial = 0, 
  stock = 10, 
  onAdd,        
  showAddButton = true  
}) => {
  const [quantity, setQuantity] = useState(initial);

  const handleIncrement = () => {
    if (quantity >= stock) {
      Swal.fire({
        title: '¡Stock máximo!',
        text: `Solo hay ${stock} unidades disponibles`,
        icon: 'warning',
        confirmButtonColor: '#0071e3'
      });
      return;
    }
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(Math.max(0, quantity - 1));  
  };

  return (
    <div className="counter-container">
      <div className="counter-controls">
        <button 
          onClick={handleDecrement} 
          disabled={quantity <= 0}
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
          onClick={() => onAdd(quantity)}
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