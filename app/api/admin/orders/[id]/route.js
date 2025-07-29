import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { orders } from "@/data/orders";

// GET - Obtener una orden por ID
export async function GET(req, { params }) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const order = orders.find(o => o.id === params.id || o._id === params.id);
    
    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
    
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error al obtener la orden" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar orden (simulado para demo)
export async function PUT(req, { params }) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { status, paymentStatus, trackingNumber, notes } = body;
    
    const orderIndex = orders.findIndex(o => o.id === params.id || o._id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    
    // Actualizar campos permitidos (simulado)
    const updatedOrder = {
      ...orders[orderIndex],
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(trackingNumber !== undefined && { trackingNumber }),
      ...(notes !== undefined && { notes }),
      updatedAt: new Date().toISOString()
    };
    
    // Nota: En un entorno real, aquí actualizarías en la base de datos
    
    return NextResponse.json(updatedOrder);
    
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error al actualizar la orden" },
      { status: 500 }
    );
  }
}