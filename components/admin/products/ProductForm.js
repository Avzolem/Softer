"use client";

import { useState } from "react";
import Link from "next/link";
import ProductImageUpload from "@/components/ProductImageUpload";
import toast from "react-hot-toast";

const CATEGORIES = ["Conjuntos", "Brasieres", "Bodies", "Básicos", "Premium"];
const COMMON_SIZES = ["32A", "32B", "34A", "34B", "34C", "36A", "36B", "36C", "38B", "S", "M", "L", "XL"];
const COMMON_COLORS = ["Negro", "Blanco", "Rosa", "Nude", "Rojo", "Azul", "Gris", "Rosa palo", "Champagne", "Lavanda"];

export default function ProductForm({ product, onSubmit, loading }) {
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    images: product?.images || [],
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    isNew: product?.isNew || false,
    featured: product?.featured || false,
    inStock: product?.inStock || true,
    isOnSale: product?.isOnSale || false,
  });

  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [pendingImages, setPendingImages] = useState([]);
  const [editingMeasurements, setEditingMeasurements] = useState(null);

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
    if (newSize && !formData.sizes.find(s => s.name === newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { name: newSize, measurements: {} }]
      }));
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeName) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s.name !== sizeName)
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

  const handleQuickAddSize = (sizeName) => {
    if (!formData.sizes.find(s => s.name === sizeName)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { name: sizeName, measurements: {} }]
      }));
    }
  };

  const handleImagesChange = (images) => {
    setPendingImages(images);
  };

  const handleSizeMeasurementChange = (sizeName, measurementType, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(size => 
        size.name === sizeName 
          ? { ...size, measurements: { ...size.measurements, [measurementType]: value } }
          : size
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que haya al menos una imagen
    if (pendingImages.length === 0 && formData.images.length === 0) {
      toast.error("Debes agregar al menos una imagen del producto");
      return;
    }
    
    // Iniciar estado de carga de imágenes
    setUploadingImages(true);
    
    // Subir las nuevas imágenes
    const uploadedImages = [];
    
    for (let i = 0; i < pendingImages.length; i++) {
      const img = pendingImages[i];
      
      // Si es una imagen existente, mantenerla
      if (img.isExisting) {
        uploadedImages.push(img.data);
        continue;
      }
      
      // Si es una nueva imagen, subirla a Cloudinary
      const formDataToUpload = new FormData();
      formDataToUpload.append("file", img.file);
      
      try {
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formDataToUpload,
          credentials: "include", // Incluir cookies de sesión
        });
        
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Error al subir imagen");
        }
        
        uploadedImages.push({
          ...result.data,
          isMain: img.isMain || (i === 0 && formData.images.length === 0)
        });
        
        toast.success(`Imagen ${img.file.name} subida correctamente`);
      } catch (error) {
        toast.error(`Error al subir imagen: ${error.message}`);
        setUploadingImages(false);
        return;
      }
    }
    
    // Finalizar estado de carga de imágenes
    setUploadingImages(false);
    
    // Combinar imágenes existentes con las nuevas
    const allImages = [...formData.images, ...uploadedImages];
    
    // Asegurar que haya una imagen principal
    const hasMainImage = allImages.some(img => img.isMain);
    if (!hasMainImage && allImages.length > 0) {
      allImages[0].isMain = true;
    }
    
    // Enviar el formulario con las imágenes subidas
    onSubmit({
      ...formData,
      images: allImages
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Imágenes */}
      <div className="glass-effect p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Imágenes del Producto</h2>
        <ProductImageUpload 
          images={formData.images}
          onImagesChange={handleImagesChange}
        />
        <p className="text-xs text-gray-600 mt-1">
          Las imágenes se subirán automáticamente al guardar el producto.
        </p>
      </div>

      {/* Información básica y Precios */}
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="glass-effect p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Información Básica</h2>
          <div className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre del producto *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered input-sm"
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
                className="select select-bordered select-sm"
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Descripción *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered textarea-sm"
                rows="2"
                required
              />
            </div>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Precios</h2>
          <div className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Precio actual *</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input input-bordered input-sm"
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
                className="input input-bordered input-sm"
                min="0"
                step="0.01"
              />
              <label className="label">
                <span className="label-text-alt text-xs">Se mostrará tachado si es mayor al precio actual</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Colores y Tallas */}
      <div className="grid lg:grid-cols-2 gap-3">
        {/* Colores */}
        <div className="glass-effect p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Colores disponibles</h2>
          
          {/* Colores actuales */}
          <div className="flex flex-wrap gap-1 mb-2">
            {formData.colors.map(color => (
              <div key={color} className="badge badge-sm gap-1">
                {color}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Agregar color */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="input input-bordered input-xs flex-1"
              placeholder="Nuevo color"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="btn btn-xs btn-primary"
            >
              +
            </button>
          </div>

          {/* Colores rápidos */}
          <div className="flex flex-wrap gap-1">
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
        <div className="glass-effect p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Tallas disponibles</h2>
          
          {/* Tallas actuales */}
          <div className="flex flex-wrap gap-1 mb-2">
            {formData.sizes.map(size => (
              <div key={size.name} className="flex items-center gap-1">
                <div className="badge badge-sm gap-1">
                  {size.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size.name)}
                    className="text-xs"
                  >
                    ×
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMeasurements(editingMeasurements === size.name ? null : size.name)}
                  className="btn btn-xs btn-outline"
                >
                  {editingMeasurements === size.name ? 'Ocultar' : 'Medidas'}
                </button>
              </div>
            ))}
          </div>

          {/* Agregar talla */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="input input-bordered input-xs flex-1"
              placeholder="Nueva talla"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="btn btn-xs btn-primary"
            >
              +
            </button>
          </div>

          {/* Tallas rápidas */}
          <div className="flex flex-wrap gap-1">
            {COMMON_SIZES.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleQuickAddSize(size)}
                className="btn btn-xs"
                disabled={formData.sizes.find(s => s.name === size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Editor de medidas */}
          {editingMeasurements && (
            <div className="bg-base-200 p-2 rounded-lg mt-3">
              <h4 className="font-medium mb-2 text-sm">Medidas para talla {editingMeasurements}:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label text-xs py-1">
                    <span className="label-text text-xs">Busto</span>
                  </label>
                  <input
                    type="text"
                    placeholder="82-86 cm"
                    value={formData.sizes.find(s => s.name === editingMeasurements)?.measurements?.busto || ''}
                    onChange={(e) => handleSizeMeasurementChange(editingMeasurements, 'busto', e.target.value)}
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div>
                  <label className="label text-xs py-1">
                    <span className="label-text text-xs">Bajo busto</span>
                  </label>
                  <input
                    type="text"
                    placeholder="68-72 cm"
                    value={formData.sizes.find(s => s.name === editingMeasurements)?.measurements?.bajoBusto || ''}
                    onChange={(e) => handleSizeMeasurementChange(editingMeasurements, 'bajoBusto', e.target.value)}
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div>
                  <label className="label text-xs py-1">
                    <span className="label-text text-xs">Cintura</span>
                  </label>
                  <input
                    type="text"
                    placeholder="64-68 cm"
                    value={formData.sizes.find(s => s.name === editingMeasurements)?.measurements?.cintura || ''}
                    onChange={(e) => handleSizeMeasurementChange(editingMeasurements, 'cintura', e.target.value)}
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div>
                  <label className="label text-xs py-1">
                    <span className="label-text text-xs">Cadera</span>
                  </label>
                  <input
                    type="text"
                    placeholder="88-92 cm"
                    value={formData.sizes.find(s => s.name === editingMeasurements)?.measurements?.cadera || ''}
                    onChange={(e) => handleSizeMeasurementChange(editingMeasurements, 'cadera', e.target.value)}
                    className="input input-bordered input-xs w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="label text-xs py-1">
                    <span className="label-text text-xs">Largo (opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="70-75 cm"
                    value={formData.sizes.find(s => s.name === editingMeasurements)?.measurements?.largo || ''}
                    onChange={(e) => handleSizeMeasurementChange(editingMeasurements, 'largo', e.target.value)}
                    className="input input-bordered input-xs w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estados */}
      <div className="glass-effect p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Estados</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="label-text">En stock</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="label-text">Producto destacado</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="label-text">Producto nuevo</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="label-text">En oferta</span>
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
          disabled={loading || uploadingImages}
          className="btn btn-primary"
        >
          {loading || uploadingImages ? (
            <>
              <span className="loading loading-spinner"></span>
              {uploadingImages ? 'Subiendo imágenes...' : 'Guardando...'}
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