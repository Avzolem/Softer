import { NextResponse } from "next/server";
import { requireAdmin } from "@/libs/admin-auth";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { authorized, response } = await requireAdmin();
    if (!authorized) return response;

    await connectDB();

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
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
