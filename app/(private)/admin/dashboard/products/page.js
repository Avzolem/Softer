"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/libs/api";
import ProductImage from "@/components/ProductImage";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

  // Cargar productos
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/admin/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Eliminar producto
  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      await apiClient.delete(`/admin/products/${deleteModal.product.id}`);
      toast.success("Producto eliminado correctamente");
      fetchProducts();
      setDeleteModal({ show: false, product: null });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar producto");
    }
  };

  // Cambiar estado de stock
  const toggleStock = async (product) => {
    try {
      await apiClient.put(`/admin/products/${product.id}`, {
        inStock: !product.inStock
      });
      toast.success("Estado actualizado");
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error al actualizar estado");
    }
  };

  // Cambiar destacado
  const toggleFeatured = async (product) => {
    try {
      await apiClient.put(`/admin/products/${product.id}`, {
        featured: !product.featured
      });
      toast.success("Producto actualizado");
      fetchProducts();
    } catch (error) {
      console.error("Error updating featured:", error);
      toast.error("Error al actualizar producto");
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">Gestión de Productos</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard/products/import"
            className="btn btn-outline btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 001.728 3.272 4.01 4.01 0 002.572 1.004H16a5 5 0 000-10h-1.382a7 7 0 00-12.236 0H2a3 3 0 000 6h2.382z" />
            </svg>
            Importar Productos
          </Link>
          <Link
            href="/admin/dashboard/products/new"
            className="btn btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="glass-effect rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="relative w-16 h-16">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-bold">{product.name}</div>
                        <div className="text-sm opacity-50 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <div>
                        <div className="font-semibold text-pink-600">
                          ${product.price.toLocaleString('es-MX')}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm line-through opacity-50">
                            ${product.originalPrice.toLocaleString('es-MX')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <label className="swap">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() => toggleStock(product)}
                        />
                        <div className="swap-on badge badge-success">En stock</div>
                        <div className="swap-off badge badge-error">Agotado</div>
                      </label>
                    </td>
                    <td>
                      <label className="swap">
                        <input
                          type="checkbox"
                          checked={product.featured}
                          onChange={() => toggleFeatured(product)}
                        />
                        <div className="swap-on">⭐</div>
                        <div className="swap-off">☆</div>
                      </label>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/dashboard/products/edit/${product.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, product })}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteModal.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar eliminación</h3>
            <p className="py-4">
              ¿Estás seguro de que deseas eliminar el producto &quot;{deleteModal.product?.name}&quot;?
            </p>
            <div className="modal-action">
              <button
                onClick={() => setDeleteModal({ show: false, product: null })}
                className="btn"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}