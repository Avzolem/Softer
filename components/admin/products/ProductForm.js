"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";

const CATEGORIES = ["Conjuntos", "Brasieres", "Bodies", "Básicos", "Premium"];
const COMMON_SIZES = ["32A", "32B", "34A", "34B", "34C", "36A", "36B", "36C", "38B", "S", "M", "L", "XL"];
const COMMON_COLORS = ["Negro", "Blanco", "Rosa", "Nude", "Rojo", "Azul", "Gris", "Rosa palo", "Champagne", "Lavanda"];

export default function ProductForm({ product, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    image: product?.image || "",
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    isNew: product?.isNew || false,
    featured: product?.featured || false,
    inStock: product?.inStock || true,
  });

  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor("");
    }
  };

  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const handleAddSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize("");
    }
  };

  const handleRemoveSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const handleQuickAddColor = (color) => {
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
  };

  const handleQuickAddSize = (size) => {
    if (!formData.sizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre del producto *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Categoría *</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text">Descripción *</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered"
              rows="3"
              required
            />
          </div>
        </div>
      </div>

      {/* Precios */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Precios</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Precio actual *</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input input-bordered"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Precio original (opcional)</span>
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              className="input input-bordered"
              min="0"
              step="0.01"
            />
            <label className="label">
              <span className="label-text-alt">Se mostrará tachado si es mayor al precio actual</span>
            </label>
          </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Imagen</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">URL de la imagen</span>
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <label className="label">
              <span className="label-text-alt">Deja vacío para usar placeholder</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Vista previa</span>
            </label>
            <div className="relative w-32 h-32">
              <ProductImage
                src={formData.image}
                alt="Vista previa"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Colores */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Colores disponibles</h2>
        
        {/* Colores actuales */}
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.colors.map(color => (
            <div key={color} className="badge badge-lg gap-2">
              {color}
              <button
                type="button"
                onClick={() => handleRemoveColor(color)}
                className="btn btn-ghost btn-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Agregar color */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="input input-bordered input-sm flex-1"
            placeholder="Agregar color personalizado"
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="btn btn-sm btn-primary"
          >
            Agregar
          </button>
        </div>

        {/* Colores rápidos */}
        <div className="flex flex-wrap gap-2">
          {COMMON_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => handleQuickAddColor(color)}
              className="btn btn-xs"
              disabled={formData.colors.includes(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Tallas */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tallas disponibles</h2>
        
        {/* Tallas actuales */}
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.sizes.map(size => (
            <div key={size} className="badge badge-lg gap-2">
              {size}
              <button
                type="button"
                onClick={() => handleRemoveSize(size)}
                className="btn btn-ghost btn-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Agregar talla */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            className="input input-bordered input-sm flex-1"
            placeholder="Agregar talla personalizada"
          />
          <button
            type="button"
            onClick={handleAddSize}
            className="btn btn-sm btn-primary"
          >
            Agregar
          </button>
        </div>

        {/* Tallas rápidas */}
        <div className="flex flex-wrap gap-2">
          {COMMON_SIZES.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => handleQuickAddSize(size)}
              className="btn btn-xs"
              disabled={formData.sizes.includes(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Estados */}
      <div className="glass-effect p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Estados</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">En stock</span>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Producto destacado</span>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Producto nuevo</span>
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <Link
          href="/admin/dashboard/products"
          className="btn btn-outline"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Guardando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar Producto
            </>
          )}
        </button>
      </div>
    </form>
  );
}