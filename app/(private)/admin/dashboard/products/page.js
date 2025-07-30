"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/libs/api";
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
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Obtener ID del producto (compatible con MongoDB)
  const getProductId = (product) => {
    return product._id || product.id;
  };

  // Eliminar producto
  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      await apiClient.delete(`/admin/products/${getProductId(deleteModal.product)}`);
      toast.success("Producto eliminado correctamente");
      fetchProducts();
      setDeleteModal({ show: false, product: null });
    } catch (error) {
      toast.error("Error al eliminar producto");
    }
  };

  // Cambiar estado de stock
  const toggleStock = async (product) => {
    try {
      await apiClient.put(`/admin/products/${getProductId(product)}`, {
        ...product,
        inStock: !product.inStock
      });
      toast.success("Estado actualizado");
      fetchProducts();
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  // Cambiar destacado
  const toggleFeatured = async (product) => {
    try {
      await apiClient.put(`/admin/products/${getProductId(product)}`, {
        ...product,
        featured: !product.featured
      });
      toast.success("Producto actualizado");
      fetchProducts();
    } catch (error) {
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
                products.map((product) => {
                  const productId = getProductId(product);
                  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
                  
                  return (
                    <tr key={productId}>
                      <td>
                        <div className="w-16 h-16">
                          {mainImage?.url || product.image ? (
                            <img
                              src={mainImage?.url || product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.colors?.length || 0} colores, {product.sizes?.length || 0} tallas
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">{product.category}</span>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">${product.price}</div>
                          {product.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              ${product.originalPrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleStock(product)}
                          className={`btn btn-xs ${product.inStock ? 'btn-success' : 'btn-error'}`}
                        >
                          {product.inStock ? 'En stock' : 'Agotado'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleFeatured(product)}
                          className={`btn btn-xs ${product.featured ? 'btn-warning' : 'btn-ghost'}`}
                        >
                          {product.featured ? '⭐' : '☆'}
                        </button>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <Link
                            href={`/admin/dashboard/products/edit/${productId}`}
                            className="btn btn-sm btn-ghost"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, product })}
                            className="btn btn-sm btn-error btn-ghost"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {deleteModal.show && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">¿Eliminar producto?</h3>
            <p className="py-4">
              ¿Estás seguro de que deseas eliminar &quot;{deleteModal.product?.name}&quot;?
              Esta acción no se puede deshacer.
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