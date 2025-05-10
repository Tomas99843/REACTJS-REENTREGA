import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Counter.css';

const Counter = ({ initial = 1, stock = 10, onAdd }) => {
  const [quantity, setQuantity] = useState(initial);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    if (newQuantity > stock) {
      Swal.fire({
        title: '¡Stock máximo!',
        text: `Solo dispones de ${stock} unidades`,
        icon: 'warning',
        confirmButtonColor: '#0071e3', // Azul Apple
        background: '#ffffff', // Fondo blanco
        customClass: {
          title: 'swal-title', // Clase para personalizar
          confirmButton: 'swal-confirm' // Clase para el botón
        }
      });
      return;
    }
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const handleAdd = () => {
    onAdd(quantity);
    Swal.fire({
      title: '¡Añadido!',
      text: `${quantity} producto(s) agregado(s) al carrito`,
      icon: 'success',
      confirmButtonColor: '#0071e3',
      timer: 1500 // Cierre automático
    });
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
      <button 
        onClick={handleAdd}
        className="counter-add-btn"
        disabled={stock === 0}
      >
        <i className="bi bi-cart-plus"></i> Agregar
      </button>
    </div>
  );
};

export default Counter;