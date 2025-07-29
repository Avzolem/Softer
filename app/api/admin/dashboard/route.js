import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { products } from "@/data/products";
import { orders, getOrderStats } from "@/data/orders";

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

// This route is used to get data for the admin dashboard
export async function GET(req) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener estadísticas
    const orderStats = getOrderStats();
    
    // Calcular estadísticas de productos
    const productStats = {
      totalProducts: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      featured: products.filter(p => p.featured).length,
      newProducts: products.filter(p => p.isNew).length,
      byCategory: {
        conjuntos: products.filter(p => p.category === "Conjuntos").length,
        brasieres: products.filter(p => p.category === "Brasieres").length,
        bodies: products.filter(p => p.category === "Bodies").length,
        basicos: products.filter(p => p.category === "Básicos").length,
        premium: products.filter(p => p.category === "Premium").length,
      }
    };
    
    // Órdenes recientes
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    const stats = {
      usersCount: 42, // Simulado
      ...orderStats,
      productStats,
      recentOrders,
      revenue: {
        today: 1348,
        week: 7445,
        month: 32847,
        year: 384920
      }
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
