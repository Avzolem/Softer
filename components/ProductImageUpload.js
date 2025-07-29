"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProductImageUpload({ images = [], onImagesChange }) {
  const [previews, setPreviews] = useState(() => {
    // Inicializar con imágenes existentes si las hay
    if (images.length > 0) {
      return images.map(img => ({
        url: img.url || img,
        isExisting: true,
        data: img,
        isMain: img.isMain || false
      }));
    }
    return [];
  });

  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    
    // Validar archivos
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} supera los 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Procesar archivos válidos
    const newPreviews = await Promise.all(
      validFiles.map((file, index) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result,
              file: file,
              isExisting: false,
              isMain: previews.length === 0 && index === 0 // Primera imagen es principal si no hay otras
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    
    // Notificar al padre después de actualizar el estado
    if (onImagesChange) {
      onImagesChange(updatedPreviews);
    }

    // Limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previews, onImagesChange]);

  const removeImage = useCallback((index) => {
    const newPreviews = [...previews];
    const removedImage = newPreviews.splice(index, 1)[0];
    
    // Si eliminamos la imagen principal, hacer principal la primera
    if (removedImage.isMain && newPreviews.length > 0) {
      newPreviews[0].isMain = true;
    }
    
    setPreviews(newPreviews);
    
    if (onImagesChange) {
      onImagesChange(newPreviews);
    }
  }, [previews, onImagesChange]);

  const setMainImage = useCallback((index) => {
    const newPreviews = previews.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    
    setPreviews(newPreviews);
    
    if (onImagesChange) {
      onImagesChange(newPreviews);
    }
  }, [previews, onImagesChange]);

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Imágenes del producto</span>
          <span className="label-text-alt">Máximo 5MB por imagen</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="file-input file-input-bordered w-full"
        />
      </div>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={`${preview.url}-${index}`} className="relative group">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={preview.url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {preview.isMain && (
                  <div className="absolute top-2 left-2 badge badge-primary badge-sm">
                    Principal
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!preview.isMain && (
                  <button
                    type="button"
                    onClick={() => setMainImage(index)}
                    className="btn btn-sm btn-primary"
                    title="Establecer como principal"
                  >
                    ⭐
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="btn btn-sm btn-error"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {previews.length > 0 && (
        <p className="text-sm text-gray-600">
          {previews.length} imagen{previews.length !== 1 ? 'es' : ''} seleccionada{previews.length !== 1 ? 's' : ''}. 
          {previews.some(p => !p.isMain) && 'Haz clic en ⭐ para establecer la imagen principal.'}
        </p>
      )}
    </div>
  );
}