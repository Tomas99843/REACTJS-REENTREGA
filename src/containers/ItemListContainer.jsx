import React, { useEffect, useState } from 'react';
import { getProductsByCategory, getProducts, getCategoryName } from '@services/products';
import ItemList from '@components/Item/ItemList';
import './ItemListContainer.css';

const ItemListContainer = ({ categoryId }) => { // Recibe categoryId como prop
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
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="item-list-container">
      <ItemList products={products} />
    </div>
  );
};

export default ItemListContainer;