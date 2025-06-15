import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar/NavBar";
import CategoryPage from "./pages/CategoryPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import "./styles/App.css";


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <ScrollToTop /> 
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/item/:itemId" element={<ItemDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;