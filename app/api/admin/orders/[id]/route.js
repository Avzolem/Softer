import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Order from "@/models/Order";
import { requireAdmin } from "@/libs/admin-auth";

// GET single order
export async function GET(req, { params }) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();
    const order = await Order.findById(params.id).populate('user', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener pedido" },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(req, { params }) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();
    const data = await req.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}
