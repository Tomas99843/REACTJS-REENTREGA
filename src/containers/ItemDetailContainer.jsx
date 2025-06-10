import React from 'react';
import { useCart } from "@context/CartContext";
import ItemDetail from '@components/Item/ItemDetail';
import Counter from '@components/Counter/Counter';
import './ItemDetailContainer.css';

const ItemDetailContainer = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (quantity) => {
    addToCart(product, quantity);
    Swal.fire({
      title: '¡Agregado!',
      text: `${quantity} ${product.title} añadido(s) al carrito`,
      icon: 'success',
      confirmButtonColor: '#0071e3'
    });
  };

  return (
    <div className="item-detail-container">
      <ItemDetail product={product} />
      <Counter 
        stock={product.stock} 
        onAdd={handleAddToCart} 
      />
    </div>
  );
};

export default ItemDetailContainer;