"use client";

import apiClient from "@/libs/api";
import { useState, useEffect } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: stats } = await apiClient.get("/admin/dashboard");
        setStats(stats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600">
            Bienvenido al centro de control de Softer
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingCircle />
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Productos */}
              <div className="glass-effect p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Productos
                    </p>
                    <p className="text-4xl font-bold text-black">
                      {stats?.productsCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Productos en catálogo
                    </p>
                  </div>
                  <div className="p-4 bg-black/10 rounded-lg">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Pedidos */}
              <div className="glass-effect p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Pedidos
                    </p>
                    <p className="text-4xl font-bold text-black">
                      {stats?.ordersCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pedidos realizados
                    </p>
                  </div>
                  <div className="p-4 bg-black/10 rounded-lg">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Usuarios */}
              <div className="glass-effect p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Usuarios
                    </p>
                    <p className="text-4xl font-bold text-black">
                      {stats?.usersCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Usuarios registrados
                    </p>
                  </div>
                  <div className="p-4 bg-black/10 rounded-lg">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acceso Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Botón Productos */}
              <Link href="/admin/dashboard/products">
                <div className="group glass-effect p-8 rounded-xl border border-gray-200 hover:border-black transition-all cursor-pointer hover:scale-[1.02] hover:shadow-xl">
                  <div className="flex items-center space-x-6">
                    <div className="p-6 bg-gradient-to-br from-black to-gray-700 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-gradient">
                        Gestionar Productos
                      </h3>
                      <p className="text-gray-600">
                        Administra tu catálogo de productos, agrega nuevos items y actualiza información
                      </p>
                      <div className="mt-4 flex items-center text-black group-hover:translate-x-2 transition-transform">
                        <span className="font-medium">Ir a Productos</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Botón Pedidos */}
              <Link href="/admin/dashboard/orders">
                <div className="group glass-effect p-8 rounded-xl border border-gray-200 hover:border-black transition-all cursor-pointer hover:scale-[1.02] hover:shadow-xl">
                  <div className="flex items-center space-x-6">
                    <div className="p-6 bg-gradient-to-br from-black to-gray-700 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-gradient">
                        Gestionar Pedidos
                      </h3>
                      <p className="text-gray-600">
                        Revisa y administra todos los pedidos, actualiza estados y gestiona envíos
                      </p>
                      <div className="mt-4 flex items-center text-black group-hover:translate-x-2 transition-transform">
                        <span className="font-medium">Ir a Pedidos</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Accesos Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Link href="/admin/dashboard/users">
                <div className="glass-effect p-4 rounded-lg border border-gray-200 hover:border-black transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium group-hover:text-gradient">Gestionar Usuarios</span>
                  </div>
                </div>
              </Link>

              <Link href="/admin/dashboard/products/new">
                <div className="glass-effect p-4 rounded-lg border border-gray-200 hover:border-black transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium group-hover:text-gradient">Nuevo Producto</span>
                  </div>
                </div>
              </Link>

              <Link href="/" target="_blank">
                <div className="glass-effect p-4 rounded-lg border border-gray-200 hover:border-black transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-medium group-hover:text-gradient">Ver Tienda</span>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}