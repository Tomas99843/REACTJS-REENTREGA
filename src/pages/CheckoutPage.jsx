import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orders';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    emailConfirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nombre requerido';
    if (!formData.phone) newErrors.phone = 'Teléfono requerido';
    if (!formData.email) {
      newErrors.email = 'Email requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (formData.email !== formData.emailConfirmation) {
      newErrors.emailConfirmation = 'Los emails no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const order = {
        buyer: {
          name: `${formData.name} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email
        },
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalPrice,
        date: new Date().toISOString(),
        status: 'generada'
      };

      const orderId = await createOrder(order);
      clearCart();
      navigate(`/order/${orderId}`, { 
        state: { 
          orderSuccess: true,
          orderId 
        } 
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Ocurrió un error al procesar tu orden");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')}>Volver a la tienda</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="order-summary">
        <h3>Resumen de tu orden</h3>
        {cart.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.title} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total:</strong>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Datos de contacto</h2>
        
        <div className="form-group">
          <label>Nombre*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Repetir para lastName, phone, email y emailConfirmation */}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;