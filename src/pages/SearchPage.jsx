// En pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts } from '@services/products';
import ItemList from '@components/Item/ItemList';
import Loader from '@containers/Loader';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import './SearchPage.css';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const search = async () => {
      try {
        if (query && query.trim() !== '') {
          const data = await searchProducts(query);
          setResults(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query, navigate]);

  if (loading) return <Loader />;

  return (
    <Container className="search-page my-5">
      <Row className="mb-4">
        <Col>
          <h2>Resultados para: "{query}"</h2>
        </Col>
      </Row>
      
      {results.length > 0 ? (
        <ItemList products={results} />
      ) : (
        <Row>
          <Col>
            <Alert variant="light" className="text-center">
              <p>No se encontraron productos para "{query}"</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/')}
                className="mt-3"
              >
                Volver al inicio
              </Button>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SearchPage;