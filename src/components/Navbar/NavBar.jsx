import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button, Spinner, Badge } from 'react-bootstrap';
import { CATEGORIES, getFormattedCategories, searchProducts, getCategoryName } from '@services/products';
import CartWidget from '../Cart/CartWidget';
import { useCart } from '../../context/CartContext';
import './NavBar.css';

const NavBar = () => {
  const { cart, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    clearCart(); // Limpia el carrito
    setSearchTerm(''); // Limpia la búsqueda
    setSuggestions([]); // Limpia sugerencias
  };

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const loadedCategories = await getFormattedCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories(Object.values(CATEGORIES).map(id => ({
        id,
        name: getCategoryName(id),
        count: 0
      })));
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  }, [searchTerm, navigate]);

  const handleSearchChange = useCallback(async (term) => {
    setSearchTerm(term);
    if (term.trim().length > 1) {
      setIsSearching(true);
      try {
        const results = await searchProducts(term);
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
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          onClick={handleLogoClick} 
          className="d-flex align-items-center"
        >
          <img
            src="/images/appleLogo.webp"
            alt="Apple Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          <span className="brand-text">Apple Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {categoriesLoading ? (
              <Spinner animation="border" size="sm" variant="light" />
            ) : (
              categories.map((category) => (
                <Nav.Link 
                  key={category.id} 
                  as={NavLink} 
                  to={`/category/${category.id}`}
                  className="mx-2"
                >
                  {category.name} {/* Usa el name ya formateado */}
                </Nav.Link>
              ))
            )}
          </Nav>

          <Form className="d-flex mx-3" onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search"
              />
              <Button variant="outline-light" type="submit" disabled={isSearching}>
                {isSearching ? <Spinner size="sm" /> : 'Buscar'}
              </Button>
            </InputGroup>

            {suggestions.length > 0 && (
              <div className="search-suggestions shadow">
                {suggestions.map(item => (
                  <div 
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => navigate(`/item/${item.id}`)}
                  >
                    <span>{item.title}</span>
                    <Badge bg="primary">${item.price}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Form>

          <Nav.Link as={Link} to="/cart" className="position-relative">
            <CartWidget />
            {cartItemCount > 0 && (
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                {cartItemCount}
              </Badge>
            )}
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;