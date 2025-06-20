import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Inicializar el estado directamente desde localStorage al montar el componente
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          return parsedCart
            .filter(item => item && typeof item === 'object' && item.id && typeof item.title === 'string' && !isNaN(item.price) && !isNaN(item.quantity) && !isNaN(item.stock))
            .map(item => ({
              id: String(item.id),
              title: String(item.title),
              price: Number(item.price) || 0,
              quantity: Math.max(1, Number(item.quantity) || 1),
              stock: Number(item.stock) || 0,
              imageUrl: String(item.imageUrl || '/images/placeholder.jpg')
            }));
        }
      } catch (error) {
        console.error('Error al parsear carrito inicial:', error.message);
        localStorage.removeItem('cart');
      }
    }
    return [];
  });

  useEffect(() => {
    // Sincronizar localStorage solo cuando el carrito cambie
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getAvailableStock = (productId, productStock) => {
    const cartItem = cart.find(item => item.id === productId);
    return productStock - (cartItem?.quantity || 0);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id || !product.title || isNaN(product.price) || isNaN(product.stock)) {
      console.error('Producto inválido:', product);
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const validatedQuantity = Math.max(1, Number(quantity));
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + validatedQuantity, item.stock),
                price: Number(item.price),
                stock: Number(item.stock)
              }
            : item
        );
      }
      
      return [
        ...prevCart, 
        { 
          id: String(product.id),
          title: String(product.title),
          price: Number(product.price),
          quantity: Math.min(validatedQuantity, Number(product.stock)),
          stock: Number(product.stock),
          imageUrl: String(product.imageUrl || '/images/placeholder.jpg')
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
          const finalQuantity = Math.min(Math.max(0, Number(newQuantity)), maxAllowed);
          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
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