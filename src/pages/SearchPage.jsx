import React from 'react';
import { useLocation } from 'react-router-dom';
import ItemList from '../components/Item/ItemList';
import { products } from '../services/products';
import './SearchPage.css'; 

const SearchPage = ({ products }) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query") || "";

  const searchResults = products.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-results">
      <h2>Resultados para: "{query}"</h2>
      {query ? (
        searchResults.length > 0 ? (
          <ItemList products={searchResults} />
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