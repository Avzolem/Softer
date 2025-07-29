import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { orders } from "@/data/orders";

// GET - Obtener todas las órdenes (Admin)
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
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    
    // Filtrar órdenes
    let filteredOrders = [...orders];
    
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customer.name.toLowerCase().includes(searchLower) ||
        o.customer.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenar por fecha (más recientes primero)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Calcular paginación
    const skip = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(skip, skip + limit);
    
    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error al obtener órdenes" },
      { status: 500 }
    );
  }
}