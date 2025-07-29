"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TestDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Test Dashboard (Sin Layout)</h1>
      
      <div className="space-y-4">
        <p className="text-green-600 font-semibold">✅ Estás autenticado como admin</p>
        
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <Link href="/admin/dashboard/products" className="btn btn-primary">
            Gestión de Productos
          </Link>
          <Link href="/admin/dashboard/orders" className="btn btn-secondary">
            Gestión de Pedidos
          </Link>
        </div>
        
        <div className="mt-8">
          <Link href="/admin/dashboard" className="text-blue-600 underline">
            Intentar acceder al dashboard normal
          </Link>
        </div>
      </div>
    </div>
  );
}