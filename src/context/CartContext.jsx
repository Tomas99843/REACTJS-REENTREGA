import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Error parsing cart:", error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product, quantity) => {
    setIsLoading(true);
    try {
      // Verificar stock en Firestore
      const productRef = doc(db, "products", product.id);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        alert("Producto no disponible");
        return;
      }

      const currentStock = productSnap.data().stock;
      const existingItem = cart.find(item => item.id === product.id);
      const requestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;

      if (requestedQuantity > currentStock) {
        alert(`Stock insuficiente. Máximo disponible: ${currentStock}`);
        return;
      }

      setCart(prev => 
        existingItem
          ? prev.map(item => 
              item.id === product.id 
                ? { ...item, quantity: requestedQuantity } 
                : item
            )
          : [...prev, { ...product, quantity }]
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Error al agregar al carrito");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Calcular totales
  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: cart.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }), [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
      isLoading,
      isInCart: (id) => cart.some(item => item.id === id)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};