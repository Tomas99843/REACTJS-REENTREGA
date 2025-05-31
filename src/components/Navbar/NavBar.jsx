import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { CATEGORIES, getFormattedCategories, searchProducts } from '@services/products';
import CartWidget from '../Cart/CartWidget';
import './NavBar.css';

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const loadedCategories = await getFormattedCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategoriesError("Error al cargar categorías");
        // Mostrar categorías por defecto si falla la carga
        setCategories(Object.keys(CATEGORIES).map(id => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          count: 0
        })));
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Búsqueda predictiva con debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchTerm);
          setSuggestions(results.slice(0, 5));
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
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
        {/* Logo */}
        <Navbar.Brand as={Link} to="/">
          <img
            src="/images/appleLogo.webp"
            alt="Apple Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
            loading="lazy"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          {/* Menú de categorías */}
          <Nav className="me-auto">
            {categoriesLoading ? (
              <Spinner animation="border" size="sm" variant="light" />
            ) : categoriesError ? (
              <span className="text-warning">{categoriesError}</span>
            ) : (
              categories.map((category) => (
                <Nav.Item key={category.id}>
                  <NavLink 
                    to={`/category/${category.id}`}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? "active fw-bold" : ""}`
                    }
                  >
                    {category.name} {category.count > 0 && `(${category.count})`}
                  </NavLink>
                </Nav.Item>
              ))
            )}
          </Nav>

          {/* Barra de búsqueda */}
          <Form onSubmit={handleSearch} className="search-form position-relative">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
                aria-label="Buscar productos"
              />
              <Button 
                type="submit" 
                variant="outline-light"
                disabled={isSearching || !searchTerm.trim()}
                aria-label="Buscar"
              >
                {isSearching ? (
                  <>
                    <Spinner animation="border" size="sm" /> Buscando...
                  </>
                ) : 'Buscar'}
              </Button>
            </InputGroup>

            {/* Sugerencias de búsqueda */}
            {suggestions.length > 0 && (
              <div className="search-suggestions shadow">
                {suggestions.map(item => (
                  <div 
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(item.id)}
                  >
                    <span className="suggestion-title">{item.title}</span>
                    <span className="suggestion-price">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </Form>

          {/* Carrito */}
          <Nav>
            <Nav.Link as={Link} to="/cart" aria-label="Carrito de compras">
              <CartWidget />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;