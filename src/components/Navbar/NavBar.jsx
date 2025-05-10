import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartWidget from "../Cart/CartWidget";
import { Container, Nav, Navbar, Form, InputGroup, Button } from 'react-bootstrap';
import "./NavBar.css";

const NavBar = ({ products = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Memoiza las categorías para evitar recrearlas en cada render
  const categories = useMemo(() => [
    { id: "iphones", name: "iPhone" },
    { id: "macbooks", name: "Mac" },
    { id: "smartwatches", name: "Watch" }
  ], []);

  // Búsqueda predictiva optimizada
  useEffect(() => {
    if (searchTerm.length > 2) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const results = products.filter(product => 
        product.title.toLowerCase().startsWith(lowerCaseTerm) // Solo startsWith es más eficiente
      );
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]); // Dependencias claras

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/item/${productId}`);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <Navbar expand="lg" className="navbar-dark bg-dark">
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

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {categories.map((category) => (
              <Nav.Item key={category.id}>
                <NavLink 
                  to={`/category/${category.id}`}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {category.name}
                </NavLink>
              </Nav.Item>
            ))}
          </Nav>

          <Form onSubmit={handleSearch} className="d-flex mx-4" style={{ width: '300px', position: 'relative' }}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="outline-light">
                <i className="bi bi-search"></i>
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
                    {item.title} - ${item.price}
                  </div>
                ))}
              </div>
            )}
          </Form>

          <Nav>
            <Nav.Link as={Link} to="/account" className="px-2">
              <i className="bi bi-person"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/stores" className="px-2">
              <i className="bi bi-geo-alt"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="px-2">
              <i className="bi bi-headset"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="px-2">
              <CartWidget />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;