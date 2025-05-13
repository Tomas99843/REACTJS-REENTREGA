import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartWidget from "../Cart/CartWidget";
import { Container, Nav, Navbar, Form, InputGroup, Button } from 'react-bootstrap';
import { CATEGORIES, getFormattedCategories } from "../../services/products";
import "./NavBar.css";

const NavBar = ({ products = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Categorías dinámicas usando la función centralizada
  const categories = useMemo(() => getFormattedCategories(), []);

  // Búsqueda predictiva con debounce mejorado
  useEffect(() => {
    let isMounted = true;
    const searchDelay = 300;

    const timer = setTimeout(() => {
      if (searchTerm.trim().length > 1 && isMounted) {
        setIsSearching(true);
        try {
          const lowerCaseTerm = searchTerm.toLowerCase();
          const results = products.filter(product => 
            product.title.toLowerCase().includes(lowerCaseTerm)
          );
          if (isMounted) {
            setSuggestions(results.slice(0, 5));
          }
        } catch (error) {
          console.error("Error en búsqueda:", error);
        } finally {
          if (isMounted) setIsSearching(false);
        }
      } else if (isMounted) {
        setSuggestions([]);
      }
    }, searchDelay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, products]);

  // Handlers optimizados
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

  // Renderizado optimizado
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
                  state={{ categoryName: category.name }}
                >
                  {category.name}
                </NavLink>
              </Nav.Item>
            ))}
          </Nav>

          {/* Sistema de búsqueda */}
          <Form onSubmit={handleSearch} className="search-form">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                variant="outline-light"
                disabled={isSearching || !searchTerm.trim()}
                aria-label="Buscar"
              >
                {isSearching ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <i className="bi bi-search" />
                )}
              </Button>
            </InputGroup>

            {suggestions.length > 0 && (
              <div className="search-suggestions">
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
                    <span className="suggestion-price">${item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </Form>

          {/* Menú secundario */}
          <Nav className="secondary-nav">
            <Nav.Link as={Link} to="/account" className="nav-icon">
              <i className="bi bi-person" aria-hidden="true" />
              <span className="visually-hidden">Cuenta</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/stores" className="nav-icon">
              <i className="bi bi-geo-alt" aria-hidden="true" />
              <span className="visually-hidden">Tiendas</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-icon">
              <i className="bi bi-headset" aria-hidden="true" />
              <span className="visually-hidden">Contacto</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="nav-icon cart-link">
              <CartWidget />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;