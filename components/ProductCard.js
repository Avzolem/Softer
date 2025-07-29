"use client";

import { useState, memo } from "react";
import ProductImage from "./ProductImage";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ 
  product,
  className = "",
  showAddToCart = true,
  applyGrayscale = true,
  priority = false
}) => {
  const {
    id,
    name,
    description,
    price,
    originalPrice,
    image,
    images = [],
    category,
    colors = [],
    sizes = [],
    isNew = false,
    inStock = true
  } = product;
  
  // Obtener imagen principal o primera imagen
  const mainImage = images?.find(img => img.isMain)?.url || images?.[0]?.url || image;

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Array de todas las imágenes disponibles
  const allImages = images?.length > 0 ? images : (image ? [{ url: image }] : []);

  return (
    <div className={`bg-white border border-gray-200 p-4 group transition-shadow duration-300 hover:shadow-lg ${className}`}>
      {/* Imagen del producto */}
      <div className="relative aspect-square mb-4 overflow-hidden">
        <ProductImage
          src={mainImage}
          alt={name}
          containerClassName="w-full h-full"
          className={`transition-all duration-1000 ease-in-out ${applyGrayscale ? 'grayscale hover:grayscale-0' : ''}`}
          fallbackGradient="from-gray-100 to-gray-200"
          priority={priority}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="px-2 py-1 bg-black text-white text-xs font-medium tracking-tight uppercase">
              Nuevo
            </span>
          )}
          {!inStock && (
            <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium tracking-tight uppercase">
              Agotado
            </span>
          )}
        </div>

        {/* Overlay con botón rápido */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={() => setShowQuickView(true)}
            className="px-6 py-2 bg-white text-black hover:bg-gray-100 font-medium tracking-tight uppercase text-sm transition-all duration-200 transform scale-95 group-hover:scale-100"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="space-y-3">
        {/* Categoría */}
        {category && (
          <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">
            {category}
          </span>
        )}

        {/* Nombre */}
        <h3 className="font-light text-lg apple-heading text-black tracking-tight">
          {name}
        </h3>

        {/* Precio */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-black">
            ${price?.toLocaleString('es-MX')}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice?.toLocaleString('es-MX')}
            </span>
          )}
        </div>

        {/* Botón de agregar al carrito */}
        {showAddToCart && (
          <button 
            onClick={() => setShowQuickView(true)}
            className="w-full px-4 py-2 bg-black text-white hover:bg-gray-800 font-medium tracking-tight uppercase text-sm transition-all duration-200 disabled:bg-gray-300"
            disabled={!inStock}
          >
            {inStock ? 'Seleccionar' : 'Agotado'}
          </button>
        )}
      </div>

      {/* Modal de vista rápida */}
      {showQuickView && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 fade-in"
            onClick={() => setShowQuickView(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-up">
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-light apple-heading text-black tracking-tight">{name}</h2>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Galería de imágenes */}
                  <div className="space-y-4">
                    {/* Imagen principal */}
                    <div className="aspect-square">
                      <ProductImage
                        src={allImages[selectedImageIndex]?.url || mainImage}
                        alt={name}
                        containerClassName="w-full h-full"
                        className=""
                      />
                    </div>
                    
                    {/* Miniaturas */}
                    {allImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {allImages.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 border-2 transition-all duration-200 ${
                              selectedImageIndex === index 
                                ? 'border-black' 
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`${name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="space-y-6">
                    <p className="text-gray-700 apple-body font-light">{description}</p>
                    
                    {/* Precio */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-medium text-black">
                        ${price?.toLocaleString('es-MX')}
                      </span>
                      {originalPrice && originalPrice > price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${originalPrice?.toLocaleString('es-MX')}
                        </span>
                      )}
                    </div>

                    {/* Selector de color */}
                    {colors.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 apple-heading text-black tracking-tight uppercase text-sm">Color:</h3>
                        <div className="flex flex-wrap gap-2">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`px-4 py-2 text-sm font-medium tracking-tight transition-all duration-200 ${
                                selectedColor === color 
                                  ? 'bg-black text-white' 
                                  : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selector de talla */}
                    {sizes.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 apple-heading text-black tracking-tight uppercase text-sm">Talla:</h3>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 text-sm font-medium tracking-tight transition-all duration-200 ${
                                selectedSize === size 
                                  ? 'bg-black text-white' 
                                  : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botón de agregar */}
                    <button
                      onClick={() => {
                        addToCart(product, selectedSize, selectedColor);
                        setShowQuickView(false);
                        setSelectedSize(null);
                        setSelectedColor(null);
                      }}
                      className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 font-medium tracking-tight uppercase text-sm transition-all duration-200"
                      disabled={!inStock || !selectedSize || !selectedColor}
                    >
                      Agregar al carrito
                    </button>

                    {(!selectedSize || !selectedColor) && (
                      <p className="text-sm text-gray-600 text-center apple-body font-light">
                        Por favor selecciona talla y color
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ProductCard);