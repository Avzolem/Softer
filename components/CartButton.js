"use client";

import { useCart } from "@/contexts/CartContext";

const CartButton = ({ className = "" }) => {
  const { setIsCartOpen, getCartTotals } = useCart();
  const { itemCount } = getCartTotals();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className={`w-10 h-10 bg-transparent border border-black text-black hover:bg-black hover:text-white flex items-center justify-center transition-all duration-200 relative ${className}`}
      title="Ver carrito"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center font-medium">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;