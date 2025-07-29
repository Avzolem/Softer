"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/libs/api";
import config from "@/config";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    search: "",
    page: 1
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.paymentStatus, filters.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      
      const { data } = await apiClient.get(`/admin/orders?${params}`);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchOrders();
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedidos</h1>
      </div>

      {/* Filtros */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Buscar por número, nombre o email..."
              className="input input-bordered flex-1 min-w-[300px]"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            
            <select
              className="select select-bordered"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">Todos los estados</option>
              {ORDER_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <select
              className="select select-bordered"
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
            >
              <option value="">Todos los pagos</option>
              {PAYMENT_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No se encontraron pedidos
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Pago</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover">
                      <td className="font-mono font-semibold">
                        {order.orderNumber}
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </div>
                      </td>
                      <td className="text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td>
                        {getStatusBadge(order.status, ORDER_STATUSES)}
                      </td>
                      <td>
                        {getStatusBadge(order.paymentStatus, PAYMENT_STATUSES)}
                      </td>
                      <td>
                        <Link
                          href={`/admin/dashboard/orders/${order._id}`}
                          className="btn btn-sm btn-ghost"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex justify-center py-4">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                >
                  «
                </button>
                <button className="join-item btn btn-sm">
                  Página {filters.page} de {pagination.pages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  disabled={filters.page === pagination.pages}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}