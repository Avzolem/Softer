import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Obtener estadísticas
    const [productsCount, ordersCount, usersCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments()
    ]);
    
    return NextResponse.json({
      productsCount,
      ordersCount,
      usersCount
    });
  } catch (error) {
    // Devolver error más específico
    if (error.message.includes("MONGODB_URI")) {
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