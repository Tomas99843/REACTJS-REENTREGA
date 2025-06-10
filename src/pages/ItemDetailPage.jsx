import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from "@services/products";
import ItemDetailContainer from "../containers/ItemDetailContainer";
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
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!itemId) throw new Error('ID de producto inválido');  // ← Eliminada validación de length

        const productData = await getProductById(itemId);
        if (!productData) throw new Error('Producto no encontrado');

        setProduct(productData);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setError(error.message);
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemId, navigate]);

  if (loading) return <div className="loading-container"><Loader /><p>Cargando detalles...</p></div>;
  if (error) return <ErrorMessage message={`Error: ${error}`} onRetry={() => window.location.reload()} />;

  return (
    <main className="item-detail-page">
      {product ? <ItemDetailContainer product={product} /> : <ErrorMessage message="Producto no existe" />}
    </main>
  );
};

export default ItemDetailPage;