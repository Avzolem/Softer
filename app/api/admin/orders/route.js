import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Order from "@/models/Order";
import { requireAdmin } from "@/libs/admin-auth";

// GET all orders with pagination
export async function GET(req) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Order.countDocuments()
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}
