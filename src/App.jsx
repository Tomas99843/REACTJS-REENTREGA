import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import NavBar from "./components/NavBar/NavBar";
import CategoryPage from "./pages/CategoryPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage";
import { getProducts } from "./services/products";
import "./styles/App.css";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(error => console.error("Error cargando productos:",error));
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <NavBar products={products} />
        
        <Routes>
          <Route path="/" element={<CategoryPage products={products} />} />
          <Route 
            path="/category/:categoryId" 
            element={<CategoryPage products={products} />} 
          />       
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage products={products} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchPage products={products} />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;