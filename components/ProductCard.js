"use client";

import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "./ProductImage";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ 
  product,
  className = "",
  showAddToCart = true,
  applyGrayscale = true,
  priority = false,
  showSaleTag = false,
  redirectToCatalog = false
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
    inStock = true,
    isOnSale = false
  } = product;
  
  // Asegurar que colors y sizes sean arrays válidos de strings
  const validColors = colors.filter(color => typeof color === 'string');
  const validSizes = sizes.map(size => {
    if (typeof size === 'string') return { name: size };
    if (typeof size === 'object' && size.name) return size;
    return null;
  }).filter(Boolean);
  
  // Obtener imagen principal o primera imagen
  const mainImage = images?.find(img => img.isMain)?.url || images?.[0]?.url || image;

  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  
  // Array de todas las imágenes disponibles
  const allImages = images?.length > 0 ? images : (image ? [{ url: image }] : []);

  return (
    <div className={`bg-white border border-gray-200 p-4 group transition-shadow duration-300 hover:shadow-lg ${className}`}>
      {/* Imagen del producto */}
      <div className="relative aspect-square mb-4 overflow-hidden">
        <ProductImage
          src={mainImage}
          alt={`${name} - ${category || 'Lencería'} Softer - ${description?.substring(0, 50) || 'Producto de alta calidad'}`}
          containerClassName="w-full h-full"
          className={`transition-all duration-1000 ease-in-out ${applyGrayscale ? 'grayscale hover:grayscale-0' : ''}`}
          fallbackGradient="from-gray-100 to-gray-200"
          priority={priority}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {(isOnSale || showSaleTag) && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium tracking-tight uppercase">
              Oferta
            </span>
          )}
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
            onClick={() => {
              if (redirectToCatalog) {
                router.push('/catalogo');
              } else {
                setShowQuickView(true);
              }
            }}
            className="px-6 py-2 bg-white text-black hover:bg-gray-100 font-medium tracking-tight uppercase text-sm transition-all duration-200 transform scale-95 group-hover:scale-100"
          >
            {redirectToCatalog ? 'Ver Catálogo' : 'Ver Detalles'}
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
            onClick={() => {
              if (redirectToCatalog) {
                router.push('/catalogo');
              } else {
                setShowQuickView(true);
              }
            }}
            className="w-full px-4 py-2 bg-black text-white hover:bg-gray-800 font-medium tracking-tight uppercase text-sm transition-all duration-200 disabled:bg-gray-300"
            disabled={!inStock && !redirectToCatalog}
          >
            {redirectToCatalog ? 'Ver en Catálogo' : (inStock ? 'Seleccionar' : 'Agotado')}
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
                    <div className="aspect-square cursor-pointer relative group" onClick={() => setShowImageZoom(true)}>
                      <ProductImage
                        src={allImages[selectedImageIndex]?.url || mainImage}
                        alt={`${name} - Vista ${selectedImageIndex + 1} - ${category || 'Lencería'} Softer`}
                        containerClassName="w-full h-full"
                        className="transition-transform duration-200 group-hover:scale-105"
                      />
                      {/* Icono de zoom que aparece en hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="bg-white/90 p-2 rounded-full">
                          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
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
                              alt={`${name} - Miniatura ${index + 1} - ${category || 'Lencería'} Softer`}
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
                    {validColors.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 apple-heading text-black tracking-tight uppercase text-sm">Color:</h3>
                        <div className="flex flex-wrap gap-2">
                          {validColors.map((color) => (
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
                    {validSizes.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 apple-heading text-black tracking-tight uppercase text-sm">Talla:</h3>
                        <div className="flex flex-wrap gap-2">
                          {validSizes.map((size, index) => {
                            const sizeName = typeof size === 'string' ? size : (size.name || size.toString());
                            return (
                              <button
                                key={`size-${index}-${sizeName}`}
                                onClick={() => setSelectedSize(sizeName)}
                                className={`px-4 py-2 text-sm font-medium tracking-tight transition-all duration-200 ${
                                  selectedSize === sizeName 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                                }`}
                              >
                                {sizeName}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Botón de guía de tallas si hay medidas disponibles */}
                        {validSizes.some(s => s.measurements && Object.values(s.measurements).some(m => m)) && (
                          <button
                            type="button"
                            onClick={() => setShowSizeGuide(!showSizeGuide)}
                            className="text-sm underline text-gray-600 hover:text-black mt-2 transition-colors"
                          >
                            {showSizeGuide ? 'Ocultar' : 'Ver'} guía de tallas
                          </button>
                        )}
                        
                        {/* Tabla de guía de tallas */}
                        {showSizeGuide && (
                          <div className="mt-4 overflow-x-auto">
                            <table className="table table-xs">
                              <thead>
                                <tr>
                                  <th>Talla</th>
                                  <th>Busto</th>
                                  <th>Bajo busto</th>
                                  <th>Cintura</th>
                                  <th>Cadera</th>
                                  {validSizes.some(s => s.measurements?.largo) && <th>Largo</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {validSizes
                                  .filter(s => s.measurements)
                                  .map((size, index) => (
                                    <tr key={`size-row-${index}-${size.name}`}>
                                      <td className="font-medium">{size.name}</td>
                                      <td>{size.measurements.busto || '-'}</td>
                                      <td>{size.measurements.bajoBusto || '-'}</td>
                                      <td>{size.measurements.cintura || '-'}</td>
                                      <td>{size.measurements.cadera || '-'}</td>
                                      {validSizes.some(s => s.measurements?.largo) && (
                                        <td>{size.measurements.largo || '-'}</td>
                                      )}
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-2">* Todas las medidas están en centímetros</p>
                          </div>
                        )}
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

      {/* Modal de zoom de imagen */}
      {showImageZoom && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 z-50 fade-in"
            onClick={() => setShowImageZoom(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Botón cerrar */}
              <button
                onClick={() => setShowImageZoom(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white text-black flex items-center justify-center transition-colors duration-200 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Imagen ampliada */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={allImages[selectedImageIndex]?.url || mainImage}
                  alt={`${name} - Vista ampliada ${selectedImageIndex + 1} - ${category || 'Lencería'} Softer`}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                />
              </div>

              {/* Navegación de imágenes si hay múltiples */}
              {allImages.length > 1 && (
                <>
                  {/* Flecha izquierda */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-black flex items-center justify-center transition-colors duration-200 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Flecha derecha */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-black flex items-center justify-center transition-colors duration-200 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicadores de imagen */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-4 py-2 rounded-full">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ProductCard);