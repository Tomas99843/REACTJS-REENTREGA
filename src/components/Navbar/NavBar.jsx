import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button } from 'react-bootstrap';
import { getFormattedCategories, searchProducts } from '@services/products';
import CartWidget from '../Cart/CartWidget';
import { useCart } from '../../context/CartContext';
import './NavBar.css';

const NavBar = () => {
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const loadCategories = useCallback(async () => {
    try {
      const loadedCategories = await getFormattedCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSearchChange = async (term) => {
    setSearchTerm(term);
    if (term.trim().length >= 1) {
      try {
        const results = await searchProducts(term);
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="navbar-main">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img src="/images/appleLogo.webp" alt="Apple" height="30" className="me-2"/>
          <span>Apple Store</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {categories.map((category) => (
              <Nav.Link 
                key={category.id} 
                as={NavLink} 
                to={`/category/${category.id}`}
              >
                {category.name}
              </Nav.Link>
            ))}
          </Nav>

          <div className="search-container">
            <Form className="search-box" onSubmit={handleSearchSubmit}>
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <Button variant="outline-light" type="submit">
                  Buscar
                </Button>
              </InputGroup>
            </Form>

            {suggestions.length > 0 && (
              <div className="search-suggestions-container">
                <div className="search-suggestions">
                  {suggestions.map(item => (
                    <div 
                      key={item.id} 
                      className="product-result"
                      onClick={() => {
                        navigate(`/item/${item.id}`);
                        setSearchTerm(''); // Limpia el input
                        setSuggestions([]); // Oculta el dropdown
                      }}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="result-image"
                      />
                      <div className="result-info">
                        <div className="product-name">{item.title}</div>
                        <div className="product-price">{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Nav.Link as={Link} to="/cart" className="cart-link">
            <CartWidget />
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;