import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Counter from '../components/Counter/Counter';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout'); 
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Tu carrito está vacío</h2>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Tu Carrito ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
      
      <ul className="cart-items">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="cart-item-image"
              onClick={() => navigate(`/product/${item.id}`)}
            />
            <div className="cart-item-details">
              <h3 onClick={() => navigate(`/product/${item.id}`)}>
                {item.title}
              </h3>
              <p className="item-price">${item.price.toFixed(2)} c/u</p>
              
              <div className="item-controls">
                <Counter
                  initial={item.quantity}
                  stock={item.stock + item.quantity}
                  onUpdate={(newQty) => updateQuantity(item.id, newQty)}
                  showAddButton={false}
                />
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="btn-remove"
                >
                  Eliminar
                </button>
              </div>
              
              <p className="item-subtotal">
                Subtotal: <span>${(item.price * item.quantity).toFixed(2)}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="total-container">
          <span>Total:</span>
          <span className="total-price">${totalPrice.toFixed(2)}</span>
        </div>
        <button 
          onClick={handleCheckout}
          className="btn-checkout"
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
};

export default CartPage;