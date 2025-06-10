import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts, getProducts } from '@services/products';
import ItemList from '@components/Item/ItemList';
import Loader from '@containers/Loader';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import './SearchPage.css';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    setSearchTerm(query); 
    const fetchResults = async () => {
      try {
        setLoading(true);
        let data = [];
        
        if (query.trim()) {
          data = await searchProducts(query);
          
          if (data.length === 0) {
            const allProducts = await getProducts();
            data = allProducts
              .filter(p => 
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                (p.keywords || []).some(k => k.toLowerCase().includes(query.toLowerCase()))
              )
              .map(p => ({
                ...p,
                firestoreId: p.firestoreId // Asegurar que tenga firestoreId
              }));
          }
        }
        
        setResults(data);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <Container className="search-page my-5">
      <Row className="mb-4">
        <Col>
          <h2>Resultados para: "{searchTerm}"</h2>
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
              <p>No se encontraron productos exactos para "{searchTerm}"</p>
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