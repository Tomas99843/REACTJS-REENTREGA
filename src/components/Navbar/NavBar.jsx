import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button } from 'react-bootstrap';
import { CATEGORIES, getFormattedCategories, searchProducts } from '@services/products';
import CartWidget from '../Cart/CartWidget';
import './NavBar.css';

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Cargar categorías al montar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await getFormattedCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Búsqueda predictiva
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchTerm);
          setSuggestions(results.slice(0, 5));
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  }, [searchTerm, navigate]);

  const handleSuggestionClick = useCallback((productId) => {
    navigate(`/item/${productId}`);
    setSearchTerm('');
    setSuggestions([]);
  }, [navigate]);

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark sticky-top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/images/appleLogo.webp"
            alt="Apple Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {categories.map((category) => (
              <Nav.Item key={category.id}>
                <NavLink 
                  to={`/category/${category.id}`}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? "active fw-bold" : ""}`
                  }
                >
                  {category.name} ({category.count})
                </NavLink>
              </Nav.Item>
            ))}
          </Nav>

          <Form onSubmit={handleSearch} className="search-form">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                variant="outline-light"
                disabled={isSearching || !searchTerm.trim()}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </InputGroup>

            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(item => (
                  <div 
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item.id)}
                  >
                    {item.title} (${item.price})
                  </div>
                ))}
              </div>
            )}
          </Form>

          <Nav>
            <Nav.Link as={Link} to="/cart">
              <CartWidget />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;