import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem('cart');
      }
    };

    loadCart();
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product, quantity) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      const newQuantity = exists ? exists.quantity + quantity : quantity;
      
      if (newQuantity > product.stock) {
        alert(`Stock máximo: ${product.stock} unidades disponibles`);
        return prev;
      }

      alert(`${quantity} ${product.title} agregado al carrito`);
      
      return exists
        ? prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: newQuantity }
              : item
          )
        : [...prev, { ...product, quantity }];
    });
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    alert('Producto removido del carrito');
  };

  // Vaciar carrito completamente
  const clearCart = () => {
    setCart([]);
    alert('Carrito vaciado');
  };

  // Calcular totales
  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: cart.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }), [cart]);

  // Valor del contexto
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};