import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(request) {
  try {
    console.log("Dashboard API: Iniciando...");
    
    // Verificar autenticación
    const session = await auth();
    console.log("Dashboard API: Sesión obtenida:", session ? "Sí" : "No");
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado - sesión no encontrada" },
        { status: 401 }
      );
    }
    
    // Verificar rol de admin
    if (!session.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado - se requiere rol de admin" },
        { status: 401 }
      );
    }

    console.log("Dashboard API: Conectando a MongoDB...");
    await connectDB();
    console.log("Dashboard API: Conectado a MongoDB");
    
    // Obtener estadísticas una por una para identificar cuál falla
    console.log("Dashboard API: Obteniendo productos...");
    let productsCount = 0;
    try {
      productsCount = await Product.countDocuments();
      console.log("Dashboard API: Productos:", productsCount);
    } catch (err) {
      console.error("Error contando productos:", err);
    }
    
    console.log("Dashboard API: Obteniendo órdenes...");
    let ordersCount = 0;
    try {
      ordersCount = await Order.countDocuments();
      console.log("Dashboard API: Órdenes:", ordersCount);
    } catch (err) {
      console.error("Error contando órdenes:", err);
    }
    
    console.log("Dashboard API: Obteniendo usuarios...");
    let usersCount = 0;
    try {
      usersCount = await User.countDocuments();
      console.log("Dashboard API: Usuarios:", usersCount);
    } catch (err) {
      console.error("Error contando usuarios:", err);
    }
    
    return NextResponse.json({
      productsCount,
      ordersCount,
      usersCount
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    console.error("Dashboard API Error Stack:", error.stack);
    
    // Devolver error más específico
    if (error.message && error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Error de configuración: Base de datos no configurada" },
        { status: 500 }
      );
    }
    
    if (error.message.includes("whitelist") || error.message.includes("Could not connect to any servers")) {
      return NextResponse.json(
        { 
          error: "Error de conexión a MongoDB Atlas. Por favor verifica que la IP de Vercel esté en la whitelist. Ve a MongoDB Atlas > Network Access > Add IP Address y agrega 0.0.0.0/0",
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener estadísticas: " + error.message },
      { status: 500 }
    );
  }
}