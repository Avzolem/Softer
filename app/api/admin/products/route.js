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
      console.log("Admin Products API: No session found");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("Admin Products API: Connecting to MongoDB...");
    await connectDB();
    
    console.log("Admin Products API: Fetching products...");
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    console.log(`Admin Products API: Found ${products.length} products`);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    console.error("Full error:", error);
    
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
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear producto" },
      { status: 500 }
    );
  }
}