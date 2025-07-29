"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDebug() {
  const [status, setStatus] = useState({
    cookies: "Verificando...",
    authCheck: "Verificando...",
    middleware: "Verificando..."
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // 1. Verificar cookies del navegador
    const browserCookies = document.cookie;
    // La cookie admin-token es httpOnly, no será visible aquí
    
    setStatus(prev => ({
      ...prev,
      cookies: "Las cookies httpOnly no son visibles desde JavaScript (esto es correcto por seguridad)"
    }));

    // 2. Verificar API auth check
    try {
      const response = await fetch('/api/admin/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      
      setStatus(prev => ({
        ...prev,
        authCheck: data.authenticated ? "✅ Autenticado como admin" : "❌ No autenticado"
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        authCheck: "❌ Error al verificar: " + error.message
      }));
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: "solesuave",
          password: "kipo"
        }),
        credentials: "include"
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Login exitoso! Recarga la página para ver los cambios.");
        checkAuth();
      } else {
        alert("Error en login: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug de Autenticación Admin</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold mb-4">Estado Actual:</h2>
          
          <div className="space-y-2">
            <p><strong>Cookies del navegador:</strong> {status.cookies}</p>
            <p><strong>API Auth Check:</strong> {status.authCheck}</p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Información de Cookies:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {document.cookie || "No hay cookies"}
            </pre>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={testLogin}
              className="btn btn-primary"
            >
              Probar Login
            </button>
            
            <button
              onClick={checkAuth}
              className="btn btn-secondary"
            >
              Verificar Estado
            </button>
            
            <Link href="/admin/dashboard" className="btn">
              Ir al Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Pasos para depurar:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Verifica el estado actual arriba</li>
            <li>Si no hay cookie, presiona &quot;Probar Login&quot;</li>
            <li>Recarga la página después del login</li>
            <li>Intenta ir al dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
}