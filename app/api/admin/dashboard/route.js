import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  try {
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
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}