import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const validatedCart = parsedCart.map(item => ({
          ...item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          stock: Number(item.stock) || 0 
        }));
        setCart(validatedCart);
      } catch (error) {
        console.error('Error al parsear carrito:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  
  const getAvailableStock = (productId, productStock) => {
    const cartItem = cart.find(item => item.id === productId);
    return productStock - (cartItem?.quantity || 0);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + Number(quantity),
                price: Number(item.price),
                stock: Number(item.stock) 
              }
            : item
        );
      }
      
      return [
        ...prevCart, 
        { 
          ...product, 
          quantity: Number(quantity),
          price: Number(product.price),
          stock: Number(product.stock) 
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const maxAllowed = item.stock; 
          const finalQuantity = Math.min(newQuantity, maxAllowed);
          
          return { 
            ...item, 
            quantity: finalQuantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

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
        totalPrice,
        getAvailableStock 
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