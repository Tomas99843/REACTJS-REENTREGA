import React from 'react';
import { useCart } from '@context/CartContext';
import Counter from '@components/Counter/Counter';
import ItemDetail from '@components/Item/ItemDetail';
import Swal from 'sweetalert2';
import './ItemDetailContainer.css';

const ItemDetailContainer = ({ product }) => {
  const { cart, addToCart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  const handleAddToCart = (quantity) => {
    if (quantity > availableStock) {
      Swal.fire('Error', 'No hay suficiente stock disponible', 'error');
      return;
    }
    addToCart(product, quantity);
    Swal.fire({
      title: '¡Agregado!',
      text: `Agregaste ${quantity} ${product.title} al carrito`,
      icon: 'success'
    });
  };

  return (
    <div className="item-detail-container">
      <ItemDetail product={product} />
      <div className="counter-and-stock">
        <Counter 
          stock={product.stock}
          onAdd={handleAddToCart}
          showAddButton={true}
          currentCartQuantity={cartItem?.quantity || 0}
        />
        <div className="stock-message">
          {availableStock > 0 
            ? `${availableStock} unidades disponibles` 
            : 'Producto agotado'}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailContainer;