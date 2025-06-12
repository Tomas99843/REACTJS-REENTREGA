import React from 'react';
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Counter from "../components/Counter/Counter";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  // Función para calcular el stock disponible considerando lo ya en carrito
  const getAvailableStock = (productId, currentStock) => {
    const cartItem = cart.find(item => item.id === productId);
    return currentStock - (cartItem?.quantity || 0);
  };

  return (
    <div className="cart-page">
      <h1>Tu Carrito ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>El carrito está vacío</p>
          <Link to="/" className="btn btn-primary">
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Precio unitario: ${item.price.toFixed(2)}</p>
                  <div className="item-controls">
                    <Counter
                      initial={item.quantity}
                      stock={item.stock + item.quantity} // Stock total disponible
                      onUpdate={(newQty) => {
                        updateQuantity(item.id, newQty);
                      }}
                      showAddButton={false}
                    />
                    <p className="item-subtotal">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
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
            <Link to="/checkout" className="btn-checkout">
              Finalizar compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;