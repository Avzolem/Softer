"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const CATEGORIES = [
  { id: 'todos', name: 'Todos' },
  { id: 'Conjuntos', name: 'Conjuntos' },
  { id: 'Brasieres', name: 'Brasieres' },
  { id: 'Bodies', name: 'Bodies' },
  { id: 'Básicos', name: 'Básicos' },
  { id: 'Premium', name: 'Premium' }
];

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [displayCount, setDisplayCount] = useState(12); // Mostrar 12 productos inicialmente

  // Obtener productos de la API
  const { products, loading } = useProducts({ 
    category: selectedCategory === 'todos' ? undefined : selectedCategory 
  });

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchTerm, sortBy, priceRange]);

  // Contar productos por categoría
  const getCategoryCount = useCallback((categoryId) => {
    if (categoryId === 'todos') return products.length;
    return products.filter(p => p.category === categoryId).length;
  }, [products]);

  // Productos visibles con lazy loading
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  // Cargar más productos
  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  // Resetear display count cuando cambian los filtros
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategory, searchTerm, sortBy, priceRange]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section del catálogo */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image with Grayscale Filter */}
          <div 
            className="absolute inset-0 bg-no-repeat filter grayscale"
            style={{
              backgroundImage: 'url(/images/catalogobackground.webp)',
              backgroundSize: '100% auto',
              backgroundPosition: 'center center',
            }}
          ></div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="container mx-auto px-6 text-center text-white relative z-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-4 fade-in tracking-wider" style={{fontFamily: '"Times New Roman", "Times", serif', fontWeight: '300', letterSpacing: '0.02em'}}>
              COLECCIÓN COMPLETA
            </h1>
            <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto slide-up font-light tracking-wide" style={{fontFamily: '"Times New Roman", "Times", serif'}}>
              Explora nuestra selección de piezas esenciales
            </p>
          </div>
        </section>

        {/* Filtros y búsqueda */}
        <section className="py-8 bg-white sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Búsqueda */}
              <div className="w-full lg:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Ordenar */}
              <div className="flex gap-4 items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>

                <span className="text-sm text-gray-600">
                  {filteredProducts.length} productos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido principal */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar de filtros */}
              <aside className="lg:col-span-1">
                <div className="glass-effect p-6 rounded-lg sticky top-40">
                  <h3 className="font-bold text-lg mb-4 text-gradient">Filtros</h3>
                  
                  {/* Categorías */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Categorías</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center justify-between cursor-pointer hover:text-black transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="category"
                              value={category.id}
                              checked={selectedCategory === category.id}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="radio radio-sm" style={{accentColor: '#000000'}}
                            />
                            {category.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({getCategoryCount(category.id)})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rango de precio */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Precio</h4>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="range range-sm" style={{accentColor: '#000000'}}
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>$0</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de limpiar filtros */}
                  <button
                    onClick={() => {
                      setSelectedCategory("todos");
                      setSearchTerm("");
                      setPriceRange([0, 2000]);
                      setSortBy("featured");
                    }}
                    className="btn btn-outline btn-sm w-full"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </aside>

              {/* Grid de productos */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <span className="loading loading-spinner loading-lg text-black"></span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 opacity-30">
                      <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">No se encontraron productos</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("todos");
                        setSearchTerm("");
                        setPriceRange([0, 2000]);
                      }}
                      className="btn bg-black text-white hover:bg-gray-800 border-black"
                    >
                      Ver todos los productos
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {visibleProducts.map((product, index) => (
                        <div
                          key={product.id || product._id}
                          className="fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <ProductCard product={product} applyGrayscale={false} />
                        </div>
                      ))}
                    </div>
                    {displayCount < filteredProducts.length && (
                      <div className="text-center mt-8">
                        <button
                          onClick={loadMore}
                          className="btn bg-black text-white hover:bg-gray-800 border-black px-8 py-3"
                        >
                          Cargar más productos ({filteredProducts.length - displayCount} restantes)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}