import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from "@services/products";
import ItemDetailContainer from "@containers/ItemDetailContainer";
import Loader from '@containers/Loader';
import ErrorMessage from '@containers/ErrorMessage';
import './ItemDetailPage.css';

const ItemDetailPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        
        if (!itemId || typeof itemId !== 'string') {
          throw new Error('ID de producto no válido');
        }

        console.log("Cargando producto con ID:", itemId); 
        const productData = await getProductById(itemId);
        
        if (!isMounted) return;
        
        if (!productData) {
          throw new Error(`No se encontró el producto con ID: ${itemId}`);
        }

        setProduct(productData);
        setError(null);
      } catch (error) {
        if (isMounted) {
          console.error('Error al cargar producto:', error.message);
          setError(error.message);
          navigate('/404', { 
            replace: true,
            state: { 
              error: error.message,
              itemId: itemId 
            }
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [itemId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader />
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={`Error: ${error}`}
        onRetry={() => window.location.reload()}
        buttonText="Intentar nuevamente"
      />
    );
  }

  return (
    <main className="item-detail-page">
      {product && <ItemDetailContainer product={product} />}
    </main>
  );
};

export default ItemDetailPage;