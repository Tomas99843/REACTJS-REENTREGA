import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import CategoryPage from "./pages/CategoryPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage"; // 1. Importa el nuevo componente
import { getProducts } from "./services/products"; // 2. Importa la función para obtener productos
import "./styles/App.css";

function App() {
  const [products, setProducts] = useState([]);

  // 3. Carga los productos al iniciar
  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(error => console.error("Error loading products:", error));
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        {/* 4. Pasa los productos al NavBar */}
        <NavBar products={products} />
        
        <Routes>
          <Route path="/" element={<CategoryPage products={products} />} />
          <Route 
            path="/category/:categoryId" 
            element={<CategoryPage products={products} />} 
          />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* 5. Agrega la ruta de búsqueda */}
          <Route path="/search" element={<SearchPage products={products} />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;