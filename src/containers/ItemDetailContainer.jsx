import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@services/products'; 
import { useCart } from '@context/CartContext';      
import ItemDetail from '@components/Item/ItemDetail'; 
import Counter from '@components/Counter/Counter';   
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
        
      }
    };

    loadProduct();
  }, [itemId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
   
    alert(`${quantity} ${product.title} agregado(s) al carrito!`);
  };

  if (!product) {
    return (
      <div className="loading-spinner">
       
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