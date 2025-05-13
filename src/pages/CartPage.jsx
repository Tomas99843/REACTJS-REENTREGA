
import React from 'react';
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, totalItems } = useCart();


  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1>Tu Carrito ({totalItems} items)</h1>
      {cart.length === 0 ? (
        <div>
          <p>El carrito está vacío</p>
          <Link to="/" className="btn">
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} width="80" />
                <div>
                  <h3>{item.title}</h3>
                  <p>${item.price} x {item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn-remove"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button className="btn-checkout">Finalizar compra</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;