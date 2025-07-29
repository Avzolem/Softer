import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Order from "@/models/Order";

// GET single order
export async function GET(req, { params }) {
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
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Error al obtener pedido" },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(req, { params }) {
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
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}