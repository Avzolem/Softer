import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    const product = await Product.create(data);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear producto" },
      { status: 500 }
    );
  }
}