import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 4);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    deliveryDate: today.toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!/^[0-9]{8,15}$/.test(formData.phone)) errors.phone = 'Teléfono inválido';
    if (!formData.address.trim()) errors.address = 'Dirección requerida';
    if (!/^[0-9]{4,8}$/.test(formData.postalCode)) errors.postalCode = 'Código postal inválido';

    if (Object.keys(errors).length > 0) {
      Swal.fire('Error', Object.values(errors).join('<br>'), 'error');
      return;
    }

    
    Swal.fire({
      title: '¿Confirmar compra?',
      html: `
        <div style="text-align:left;">
          <p><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
          <p><strong>Enviar a:</strong> ${formData.address}, CP: ${formData.postalCode}</p>
          <p><strong>Fecha estimada:</strong> ${new Date(formData.deliveryDate).toLocaleDateString()}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Revisar datos'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: '¡Compra exitosa!',
          html: `
            <div style="text-align:center;">
              <p>Gracias por tu compra, ${formData.name}.</p>
              <p>Recibirás un correo en ${formData.email}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Volver al inicio',
          willClose: () => navigate('/')
        });
      }
    });
  };

  return (
    <div className="checkout-page">
      <h1>Finalizar compra</h1>
      
      <div className="checkout-container">
        
        <div className="order-summary">
          <h3>Tu pedido</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id} className="order-item">
                <span>{item.title} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Datos de envío</h3>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre completo: John Doe *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email: JohnDoe@gmail.com *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              placeholder="Teléfono: 1234567890 *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Dirección completa: Calle Libertad 123, Buenos Aires, Argentina *"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Código postal: 7600 *"
              value={formData.postalCode}
              onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Fecha de entrega *</label>
            <input
              type="date"
              min={formData.deliveryDate}
              max={maxDate.toISOString().split('T')[0]}
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
            />
            <small>Llegara al domicilio el dia: {maxDate.toLocaleDateString()}</small>
          </div>
          
          <button type="submit" className="btn-checkout">
            Confirmar compra
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;