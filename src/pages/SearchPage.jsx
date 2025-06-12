import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts } from '@services/products';
import ItemList from '@components/Item/ItemList';
import Loader from '@containers/Loader';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import './SearchPage.css';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setSearchTerm('');
        return;
      }

      setLoading(true);
      setSearchTerm(query);
      
      try {
        const data = await searchProducts(query);
        console.log("Resultados de búsqueda:", data); // Depuración
        setResults(data);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Container className="search-page my-5">
      <Row className="mb-4">
        <Col>
          <h2>{searchTerm ? `Resultados para: "${searchTerm}"` : 'Buscar productos'}</h2>
        </Col>
      </Row>
      
      {loading ? (
        <Loader />
      ) : results.length > 0 ? (
        <ItemList products={results} />
      ) : (
        <Row>
          <Col>
            <Alert variant="light" className="text-center">
              {searchTerm ? (
                <>
                  <p>No se encontraron productos para "{searchTerm}"</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/')}
                    className="mt-3"
                  >
                    Volver al inicio
                  </Button>
                </>
              ) : (
                <p>Ingresa un término de búsqueda en la barra superior</p>
              )}
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SearchPage;