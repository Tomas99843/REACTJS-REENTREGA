import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getProductsByCategory } from '@services/products';
import ItemList from '@components/Item/ItemList';
import './ItemListContainer.css'; // Asegúrate de crear este CSS

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchProducts = categoryId 
      ? getProductsByCategory(categoryId)
      : getProducts();

    fetchProducts
      .then(data => setProducts(data))
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Error al cargar productos. Intente recargar la página.");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="skeleton-container">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="skeleton-item">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="item-list-container">
      {categoryId && <h2>{categoryId.replace('-', ' ')}</h2>}
      <ItemList products={products} />
    </div>
  );
};

export default ItemListContainer;