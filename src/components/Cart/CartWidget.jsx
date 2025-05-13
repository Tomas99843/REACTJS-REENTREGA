import React from 'react';
import { useCart } from "../../context/CartContext";
import "./CartWidget.css";

const CartWidget = () => {
  const { totalItems } = useCart();

  return (
    <div className="cart-widget">
      <i className="bi bi-cart"></i> 
      {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
    </div>
  );
};

export default CartWidget;