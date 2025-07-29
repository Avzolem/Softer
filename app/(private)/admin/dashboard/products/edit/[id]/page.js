"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import apiClient from "@/libs/api";
import ProductForm from "@/components/admin/products/ProductForm";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data } = await apiClient.get(`/admin/products/${params.id}`);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Error al cargar el producto");
      router.push("/admin/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      // Convertir precios a números
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      };

      await apiClient.put(`/admin/products/${params.id}`, productData);
      toast.success("Producto actualizado correctamente");
      router.push("/admin/dashboard/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Editar Producto</h1>
      <ProductForm 
        product={product} 
        onSubmit={handleSubmit} 
        loading={saving} 
      />
    </div>
  );
}