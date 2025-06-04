import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { getFormattedCategories, searchProducts } from '@services/products';
import CartWidget from '../Cart/CartWidget';
import { useCart } from '../../context/CartContext';
import './NavBar.css';

const NavBar = () => {
  const { cart, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const loadCategories = useCallback(async () => {
    try {
      const loadedCategories = await getFormattedCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  const handleSearchChange = async (term) => {
    setSearchTerm(term);
    if (term.trim().length > 1) {
      setIsSearching(true);
      try {
        const results = await searchProducts(term);
        setSuggestions(results.slice(0, 4)); // Mostrar solo 4 resultados
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" onClick={() => { clearCart(); setSearchTerm(''); }}>
          <img src="/images/appleLogo.webp" alt="Apple" height="24" className="me-2"/>
          <span>Apple Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {categories.map((category) => (
              <Nav.Link key={category.id} as={NavLink} to={`/category/${category.id}`}>
                {category.name}
              </Nav.Link>
            ))}
          </Nav>

          <Form className="d-flex position-relative" onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              />
              <Button variant="outline-light" type="submit" disabled={isSearching}>
                {isSearching ? <Spinner size="sm" /> : 'Buscar'}
              </Button>
            </InputGroup>

            {searchTerm && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(item => (
                  <div
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/item/${item.id}`);
                      setSearchTerm('');
                      setSuggestions([]);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="product-title">{item.title}</span>
                    <span className="product-price">${item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </Form>

          <Nav.Link as={Link} to="/cart" className="position-relative ms-3">
            <CartWidget />
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                {cartItemCount}
              </span>
            )}
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;