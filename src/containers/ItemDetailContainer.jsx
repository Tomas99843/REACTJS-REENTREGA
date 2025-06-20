import React from 'react';
import { useCart } from '@context/CartContext';
import Counter from '@components/Counter/Counter';
import ItemDetail from '@components/Item/ItemDetail';
import Swal from 'sweetalert2';
import './ItemDetailContainer.css';

const ItemDetailContainer = ({ product }) => {
  const { cart, addToCart, getAvailableStock } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const availableStock = getAvailableStock(product.id, product.stock);

  const handleAddToCart = (quantity) => {
    if (!product || !product.id || !product.title || isNaN(product.price) || isNaN(product.stock)) {
      Swal.fire('Error', 'Datos del producto inválidos', 'error');
      return;
    }
    if (quantity > availableStock) {
      Swal.fire('Error', 'No hay suficiente stock disponible', 'error');
      return;
    }
    addToCart(
      {
        id: String(product.id),
        title: String(product.title),
        price: Number(product.price),
        stock: Number(product.stock),
        imageUrl: String(product.imageUrl || '/images/placeholder.jpg')
      },
      quantity
    );
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
          stock={availableStock}
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