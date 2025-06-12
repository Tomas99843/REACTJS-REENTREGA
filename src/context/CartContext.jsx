import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validar que los items tengan quantity y price como números
        const validatedCart = parsedCart.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        }));
        setCart(validatedCart);
      } catch (error) {
        console.error('Error al parsear carrito:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + Number(quantity),
                price: Number(item.price) // Asegurar que price sea número
              }
            : item
        );
      }
      
      return [
        ...prevCart, 
        { 
          ...product, 
          quantity: Number(quantity),
          price: Number(product.price) // Asegurar que price sea número
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
  setCart(prevCart => 
    prevCart.map(item =>
      item.id === productId 
        ? { ...item, quantity: Math.min(newQuantity, item.stock + item.quantity) }
        : item
    )
  );
};

  const clearCart = () => {
    setCart([]);
  };

  // Calcular totales (con validación numérica)
const totalItems = cart.reduce(
  (sum, item) => sum + (Number(item.quantity) || 0),
  0
);

const totalPrice = cart.reduce(
  (sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)),
  0
);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};