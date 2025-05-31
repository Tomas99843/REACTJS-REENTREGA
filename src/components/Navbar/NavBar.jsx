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

  // Búsqueda predictiva optimizada
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
    <Navbar expand="lg" className="custom-navbar" expanded={true}>
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/images/appleLogo.webp"
            alt="Apple Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
            loading="lazy"
          />
          <span className="brand-text">Apple Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="d-lg-none" />
        
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav className="mx-auto">
            {categoriesLoading ? (
              <Spinner animation="border" size="sm" variant="light" />
            ) : categoriesError ? (
              <span className="text-warning">{categoriesError}</span>
            ) : (
              categories.map((category) => (
                <Nav.Item key={category.id} className="mx-2">
                  <NavLink 
                    to={`/category/${category.id}`}
                    className={({ isActive }) => 
                      `nav-link px-3 ${isActive ? "active fw-bold" : ""}`
                    }
                  >
                    {category.name}
                  </NavLink>
                </Nav.Item>
              ))
            )}
          </Nav>

          <div className="d-flex align-items-center">
            <Form onSubmit={handleSearch} className="search-form me-3">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isSearching}
                  aria-label="Buscar productos"
                  className="search-input"
                />
                <Button 
                  type="submit" 
                  variant="outline-light"
                  disabled={isSearching || !searchTerm.trim()}
                  aria-label="Buscar"
                >
                  {isSearching ? <Spinner animation="border" size="sm" /> : 'Buscar'}
                </Button>
              </InputGroup>

              {suggestions.length > 0 && (
                <div className="search-suggestions shadow">
                  {suggestions.map(item => (
                    <div 
                      key={item.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="suggestion-title">{item.title}</span>
                      <span className="suggestion-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Form>

            <Nav.Link as={Link} to="/cart" className="cart-link">
              <CartWidget />
            </Nav.Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;