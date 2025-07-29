"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/libs/api";
import config from "@/config";
import toast from "react-hot-toast";

const ORDER_STATUSES = [
  { value: "pending", label: "Pendiente", color: "badge-warning" },
  { value: "processing", label: "Procesando", color: "badge-info" },
  { value: "shipped", label: "Enviado", color: "badge-primary" },
  { value: "delivered", label: "Entregado", color: "badge-success" },
  { value: "cancelled", label: "Cancelado", color: "badge-error" }
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pendiente", color: "badge-warning" },
  { value: "paid", label: "Pagado", color: "badge-success" },
  { value: "failed", label: "Fallido", color: "badge-error" },
  { value: "refunded", label: "Reembolsado", color: "badge-ghost" }
];

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    notes: ""
  });

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/api/admin/orders/${params.id}`);
      setOrder(data);
      setFormData({
        status: data.status,
        paymentStatus: data.paymentStatus,
        trackingNumber: data.trackingNumber || "",
        notes: data.notes || ""
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Error al cargar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      await apiClient.put(`/api/admin/orders/${params.id}`, formData);
      toast.success("Pedido actualizado correctamente");
      fetchOrder();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error al actualizar el pedido");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status, statuses) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? (
      <span className={`badge ${statusObj.color}`}>
        {statusObj.label}
      </span>
    ) : status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Pedido no encontrado</p>
        <Link href="/admin/dashboard/orders" className="btn btn-primary">
          Volver a pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedido {order.orderNumber}</h1>
        <Link href="/admin/dashboard/orders" className="btn btn-ghost">
          ← Volver
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos del cliente */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Datos del Cliente</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-semibold">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-semibold">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha del pedido</p>
                  <p className="font-semibold">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Dirección de Envío</h2>
              <div className="space-y-1">
                <p>{order.shippingAddress.street} {order.shippingAddress.number}</p>
                <p>{order.shippingAddress.neighborhood}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>CP: {order.shippingAddress.zipCode}</p>
                {order.shippingAddress.references && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Referencias:</span> {order.shippingAddress.references}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Productos</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-base-200 rounded-lg">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded flex items-center justify-center">
                        <span className="text-gray-500">Sin imagen</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Talla: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm">
                        Cantidad: {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totales */}
              <div className="divider"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{order.shippingCost === 0 ? 'GRATIS' : `$${order.shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de control */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow sticky top-4">
            <div className="card-body">
              <h2 className="card-title">Estado del Pedido</h2>
              
              {/* Estado actual */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span>Estado:</span>
                  {getStatusBadge(order.status, ORDER_STATUSES)}
                </div>
                <div className="flex justify-between items-center">
                  <span>Pago:</span>
                  {getStatusBadge(order.paymentStatus, PAYMENT_STATUSES)}
                </div>
                <div className="flex justify-between items-center">
                  <span>Método:</span>
                  <span className="badge">
                    {order.paymentMethod === 'stripe' ? 'Tarjeta' : 'Efectivo'}
                  </span>
                </div>
              </div>
              
              <div className="divider"></div>
              
              {/* Formulario de actualización */}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Estado del pedido</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Estado del pago</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  >
                    {PAYMENT_STATUSES.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Número de rastreo</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Opcional"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notas internas</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    rows="3"
                    placeholder="Notas sobre el pedido..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar Pedido"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}