import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { auth } from "@/auth";

// GET all products
export async function GET() {
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
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    if (error.message.includes("MONGODB_URI")) {
      return NextResponse.json(
        { error: "Error de configuración: Base de datos no configurada" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener productos: " + error.message },
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
    return NextResponse.json(
      { error: error.message || "Error al crear producto" },
      { status: 500 }
    );
  }
}