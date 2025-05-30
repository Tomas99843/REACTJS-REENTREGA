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
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!formData.email.trim()) {
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
          quantity: item.quantity,
          image: item.image // Asegúrate de incluir la imagen para el resumen
        })),
        total: totalPrice,
        date: new Date().toISOString(),
        status: 'generada'
      };

      const orderId = await createOrder(order);
      clearCart();
      navigate(`/order/${orderId}`, { 
        state: { 
          success: true,
          order: order, // Envía toda la orden para mostrar detalles
          orderId 
        } 
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Ocurrió un error al procesar tu orden. Por favor, inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="checkout-container">
      <div className="order-summary">
        <h3>Resumen de tu orden</h3>
        <div className="order-items">
          {cart.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.image} alt={item.title} width="60" />
              <div>
                <p>{item.title}</p>
                <span>{item.quantity} x ${item.price.toFixed(2)}</span>
              </div>
              <strong>${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
        </div>
        <div className="order-total">
          <span>Total:</span>
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
            placeholder="Ej: Juan"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Apellido*</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className={errors.lastName ? 'error' : ''}
            placeholder="Ej: Pérez"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label>Teléfono*</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className={errors.phone ? 'error' : ''}
            placeholder="Ej: 1122334455"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={errors.email ? 'error' : ''}
            placeholder="Ej: email@ejemplo.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Confirmar Email*</label>
          <input
            type="email"
            value={formData.emailConfirmation}
            onChange={(e) => setFormData({...formData, emailConfirmation: e.target.value})}
            className={errors.emailConfirmation ? 'error' : ''}
            placeholder="Repite tu email"
          />
          {errors.emailConfirmation && (
            <span className="error-message">{errors.emailConfirmation}</span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Procesando...
            </>
          ) : (
            'Confirmar compra'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;