"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Cache para almacenar resultados de productos
const productsCache = new Map();

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Generar clave de caché basada en filtros
  const getCacheKey = useCallback(() => {
    return JSON.stringify({
      category: filters.category || '',
      featured: filters.featured || '',
      inStock: filters.inStock || '',
      onSale: filters.onSale || ''
    });
  }, [filters.category, filters.featured, filters.inStock, filters.onSale]);

  useEffect(() => {
    // Verificar caché primero
    const cacheKey = getCacheKey();
    const cachedData = productsCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < 60000) { // Cache válido por 1 minuto
      setProducts(cachedData.data);
      setLoading(false);
      return;
    }

    fetchProducts();
    
    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters.category, filters.featured, filters.inStock, filters.onSale]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();
      
      // Construir query params
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.featured !== undefined) params.append('featured', filters.featured);
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
      if (filters.onSale !== undefined) params.append('onSale', filters.onSale);
      
      const response = await fetch(`/api/products?${params}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Guardar en caché
      const cacheKey = getCacheKey();
      productsCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      setProducts(data);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
};