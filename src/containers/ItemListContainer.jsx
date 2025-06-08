import React, { useEffect, useState } from 'react';
import { getProductsByCategory, getProducts, getCategoryName } from '@services/products';
import ItemList from '@components/Item/ItemList';
import './ItemListContainer.css';

const ItemListContainer = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = categoryId 
          ? await getProductsByCategory(categoryId)
          : await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Error al cargar productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="item-list-container">
      <h2>{categoryId ? getCategoryName(categoryId) : 'Todos los productos'}</h2>
      <ItemList products={products} />
    </div>
  );
};

export default ItemListContainer;