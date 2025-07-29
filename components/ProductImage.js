"use client";

import Image from "next/image";
import { useState } from "react";

// Componente para manejar imágenes de productos con fallback elegante
const ProductImage = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  fallbackGradient = "from-pink-100 to-rose-100",
  fallbackText = "Imagen del producto",
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  // Si no hay src, mostrar placeholder elegante
  if (!src) {
    return (
      <div className={`bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center ${className} rounded-lg border border-gray-200`}>
        <div className="text-center p-6">
          <div className="w-24 h-24 mx-auto mb-3 opacity-30">
            {/* Logo Softer como placeholder */}
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="softerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* S elegante estilizada */}
              <path d="M30 35 Q30 20, 50 20 Q70 20, 70 35 Q70 50, 50 50 Q30 50, 30 65 Q30 80, 50 80 Q70 80, 70 65" 
                    stroke="url(#softerGradient)" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    fill="none" 
                    opacity="0.4"/>
              {/* Detalles decorativos */}
              <circle cx="35" cy="30" r="3" fill="url(#softerGradient)" opacity="0.3"/>
              <circle cx="65" cy="70" r="3" fill="url(#softerGradient)" opacity="0.3"/>
            </svg>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400 text-xs font-light tracking-wider uppercase">Softer</span>
            <div className="text-gray-500 text-sm">{fallbackText || "Imagen no disponible"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ objectFit: 'cover' }}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
        placeholder="empty"
      />
    </div>
  );
};

export default ProductImage;