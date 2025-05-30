import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '@services/products';
import { useCart } from '@context/CartContext';
import ItemDetail from '@components/Item/ItemDetail';
import Counter from '@components/Counter/Counter';
import Loader from '@containers/Loader';
import './ItemDetailContainer.css';

const ItemDetailContainer = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(itemId);
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        navigate("/not-found", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [itemId, navigate]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    navigate("/cart", { state: { addedItem: product.title, quantity } });
  };

  if (loading) return <Loader />;

  return (
    <div className="item-detail-page">
      {product && (
        <>
          <ItemDetail product={product} />
          <div className="purchase-section">
            <Counter
              stock={product.stock}
              initial={1}
              onQuantityChange={setQuantity}
            />
            <button
              onClick={handleAddToCart}
              disabled={quantity > product.stock}
              className="add-to-cart-btn"
            >
              {quantity > product.stock 
                ? "Sin stock suficiente" 
                : `Agregar ${quantity} al carrito`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemDetailContainer;