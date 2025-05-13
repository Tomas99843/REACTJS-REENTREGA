import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Counter.css';

const Counter = ({ 
  initial = 1, 
  stock = 10, 
  onQuantityChange,  // Nueva prop: notifica cambios de cantidad al padre
  showAddButton = false // Opcional: permite ocultar el botón "Agregar"
}) => {
  const [quantity, setQuantity] = useState(initial);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    if (newQuantity > stock) {
      Swal.fire({
        title: '¡Stock máximo!',
        text: `Solo dispones de ${stock} unidades`,
        icon: 'warning',
        confirmButtonColor: '#0071e3',
        background: '#ffffff',
        timer: 2000
      });
      return;
    }
    setQuantity(newQuantity);
    if (onQuantityChange) onQuantityChange(newQuantity); // Notifica al padre
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    if (onQuantityChange) onQuantityChange(newQuantity); // Notifica al padre
  };

  return (
    <div className="counter-container">
      <div className="counter-controls">
        <button 
          onClick={handleDecrement} 
          disabled={quantity <= 1}
          className="counter-btn"
          aria-label="Reducir cantidad"
        >
          −
        </button>
        <span className="counter-value">{quantity}</span>
        <button 
          onClick={handleIncrement}
          disabled={quantity >= stock}
          className="counter-btn"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      {/* Botón "Agregar" (opcional, si no se usa en ItemDetailContainer) */}
      {showAddButton && (
        <button 
          onClick={() => onAdd(quantity)}
          className="counter-add-btn"
          disabled={stock === 0}
        >
          <i className="bi bi-cart-plus"></i> Agregar
        </button>
      )}
    </div>
  );
};

export default Counter;