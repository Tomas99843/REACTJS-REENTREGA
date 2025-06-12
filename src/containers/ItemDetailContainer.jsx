import React, { useState } from 'react';
import { useCart } from "@context/CartContext";
import ItemDetail from '@components/Item/ItemDetail';
import Counter from '@components/Counter/Counter';
import Swal from 'sweetalert2';
import './ItemDetailContainer.css';

const ItemDetailContainer = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  
  // Calcula el stock real restando lo ya agregado al carrito
  const cartItem = cart.find(item => item.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

  const handleAddToCart = () => {
    if (quantityToAdd > availableStock) {
      Swal.fire({
        title: '¡Stock insuficiente!',
        text: `Solo quedan ${availableStock} unidades disponibles`,
        icon: 'error'
      });
      return;
    }

    addToCart(product, quantityToAdd);
    
    Swal.fire({
      title: '¡Agregado!',
      text: `${quantityToAdd} ${product.title} añadido(s) al carrito (Quedan ${availableStock - quantityToAdd} disponibles)`,
      icon: 'success'
    });

    setQuantityToAdd(1); // Resetear contador
  };

  return (
    <div className="item-detail-container">
      <ItemDetail product={product} />
      <div className="stock-message">
        <p>Disponibles: {availableStock} unidades</p>
      </div>
      <Counter
        initial={1}
        stock={availableStock}
        onQuantityChange={setQuantityToAdd}
        onAdd={handleAddToCart}
        showAddButton={true}
      />
    </div>
  );
};

export default ItemDetailContainer;