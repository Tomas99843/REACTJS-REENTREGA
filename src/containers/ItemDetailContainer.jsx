import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@services/products';  // Usando alias configurado en vite.config.js
import { useCart } from '@context/CartContext';       // Modificado para usar alias
import ItemDetail from '@components/Item/ItemDetail'; // Usando alias
import Counter from '@components/Counter/Counter';    // Usando alias
import './ItemDetailContainer.css';

const ItemDetailContainer = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(itemId);
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        // Puedes agregar un estado de error aquí si lo necesitas
      }
    };

    loadProduct();
  }, [itemId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    // Considera usar react-toastify en lugar de alert
    alert(`${quantity} ${product.title} agregado(s) al carrito!`);
  };

  if (!product) {
    return (
      <div className="loading-spinner">
        {/* Agrega aquí un spinner de carga si lo tienes */}
        Cargando producto...
      </div>
    );
  }

  return (
    <div className="item-detail-container">
      <ItemDetail product={product} />
      
      <div className="cart-actions">
        <Counter 
          stock={product.stock}
          initial={1}
          onQuantityChange={setQuantity}
          showAddButton={false}
        />
        <button 
          onClick={handleAddToCart}
          className={`add-to-cart-btn ${quantity > product.stock ? 'disabled' : ''}`}
          disabled={quantity > product.stock}
          aria-label="Agregar al carrito"
        >
          Agregar al carrito {quantity > 1 && `(${quantity})`}
        </button>
      </div>
    </div>
  );
};

export default ItemDetailContainer;