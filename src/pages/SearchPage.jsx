import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '@services/products';
import ItemList from '@components/Item/ItemList';
import Loader from '@containers/Loader';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const search = async () => {
      try {
        const data = await searchProducts(query);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="search-page">
      <h2>Resultados para: "{query}"</h2>
      {results.length > 0 ? (
        <ItemList products={results} />
      ) : (
        <p>No se encontraron productos</p>
      )}
    </div>
  );
};

export default SearchPage;