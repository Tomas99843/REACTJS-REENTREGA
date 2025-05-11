import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Cargar carrito al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (error) {
      console.error("Error loading cart:", error);
      localStorage.removeItem('cart');
    }
  }, []);

  // 2. Guardar cambios
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Funciones del carrito
  const addToCart = (product, quantity) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists && exists.quantity + quantity > product.stock) {
        alert(`Stock insuficiente. Máximo: ${product.stock}`);
        return prev;
      }
      return exists
        ? prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        : [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // 4. Valores del contexto
  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems: cart.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};