"use client";

import { Fragment } from 'react';
import { useCart } from '@/contexts/CartContext';
import ProductImage from './ProductImage';
import Link from 'next/link';

const Cart = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart,
    getCartTotals 
  } = useCart();

  const { subtotal, shipping, total, itemCount } = getCartTotals();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 fade-in"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="glass-effect p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gradient">
                Mi Carrito ({itemCount})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-circle btn-sm hover-lift"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 opacity-30">
                  <svg className="w-full h-full text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a1 1 0 00-1 1v11a3 3 0 003 3h10a3 3 0 003-3V8a1 1 0 00-1-1zM10 6a2 2 0 014 0v1h-4V6zm8 13a1 1 0 01-1 1H7a1 1 0 01-1-1V9h2v1a1 1 0 002 0V9h4v1a1 1 0 002 0V9h2v10z"/>
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn btn-primary"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cartKey} className="glass-effect p-4 rounded-lg fade-in">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Talla: {item.selectedSize} | Color: {item.selectedColor}
                        </p>
                        <p className="text-pink-600 font-bold mt-2">
                          ${item.price.toLocaleString('es-MX')}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-600">Cantidad:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="btn btn-circle btn-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="btn btn-circle btn-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with totals */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${shipping}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Envío gratis en compras mayores a $599
                  </p>
                )}
                <div className="divider my-2"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gradient">${total.toLocaleString('es-MX')}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn btn-block softer-gradient text-white border-0 hover-lift"
                onClick={() => setIsCartOpen(false)}
              >
                Proceder al pago
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;