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
      <div className={`bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${className} rounded-lg`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-3 opacity-40">
            {/* Icono elegante de lencería */}
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-pink-400">
              <defs>
                <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e91e63" />
                  <stop offset="100%" stopColor="#f48fb1" />
                </linearGradient>
              </defs>
              {/* Diseño abstracto de lencería */}
              <ellipse cx="50" cy="30" rx="20" ry="15" fill="url(#iconGradient)" opacity="0.6"/>
              <ellipse cx="35" cy="55" rx="15" ry="12" fill="url(#iconGradient)" opacity="0.4"/>
              <ellipse cx="65" cy="55" rx="15" ry="12" fill="url(#iconGradient)" opacity="0.4"/>
              <path d="M30 40 Q50 30 70 40 Q50 50 30 40" fill="url(#iconGradient)" opacity="0.3"/>
              <circle cx="50" cy="75" r="8" fill="url(#iconGradient)" opacity="0.2"/>
            </svg>
          </div>
          <span className="text-pink-500 text-sm font-medium opacity-70">{fallbackText}</span>
          <div className="mt-2 text-xs text-pink-400 opacity-50">
            Próximamente imagen real
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