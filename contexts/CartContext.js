"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('softer-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('softer-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product, selectedSize = null, selectedColor = null) => {
    if (!selectedSize || !selectedColor) {
      toast.error('Por favor selecciona talla y color');
      return;
    }

    const cartKey = `${product.id}-${selectedSize}-${selectedColor}`;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartKey === cartKey);
      
      if (existingItem) {
        // Si ya existe, aumentar cantidad
        toast.success('Cantidad actualizada en el carrito');
        return prevItems.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo
        toast.success('Producto agregado al carrito');
        return [...prevItems, {
          ...product,
          cartKey,
          selectedSize,
          selectedColor,
          quantity: 1
        }];
      }
    });
    
    // Abrir carrito automáticamente
    setIsCartOpen(true);
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const removeFromCart = (cartKey) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartKey !== cartKey));
    toast.success('Producto eliminado del carrito');
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('softer-cart');
    toast.success('Carrito vaciado');
  };

  // Calcular totales
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 599 ? 0 : 99; // Envío gratis arriba de $599
    const total = subtotal + shipping;
    
    return {
      subtotal,
      shipping,
      total,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    };
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};