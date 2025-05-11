import React from 'react';
import { useLocation } from 'react-router-dom';
import ItemList from '../components/Item/ItemList';
import { products } from '../services/products';
import './SearchPage.css'; 

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.trim() || ''; // Limpia espacios

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results">
      <h2>Resultados para: "{query}"</h2>
      {query ? (
        filteredProducts.length > 0 ? (
          <ItemList products={filteredProducts} />
        ) : (
          <p className="no-results">No hay productos que coincidan con "{query}"</p>
        )
      ) : (
        <p className="no-query">Ingresa un término de búsqueda</p>
      )}
    </div>
  );
};

export default SearchPage;