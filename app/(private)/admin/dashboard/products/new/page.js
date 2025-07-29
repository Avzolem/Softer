"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/libs/api";
import ProductForm from "@/components/admin/products/ProductForm";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      // Convertir precios a números
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      };

      await apiClient.post("/admin/products", productData);
      toast.success("Producto creado correctamente");
      router.push("/admin/dashboard/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error al crear el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Nuevo Producto</h1>
      <ProductForm 
        onSubmit={handleSubmit} 
        loading={saving} 
      />
    </div>
  );
}