import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { auth } from "@/libs/next-auth";

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
    
    // Asegurar que solo haya una imagen principal
    if (data.images && data.images.length > 0) {
      const mainImages = data.images.filter(img => img.isMain);
      if (mainImages.length > 1) {
        // Si hay más de una imagen principal, dejar solo la última
        data.images = data.images.map((img, index) => ({
          ...img,
          isMain: index === data.images.length - 1
        }));
      } else if (mainImages.length === 0) {
        // Si no hay imagen principal, marcar la primera
        data.images[0].isMain = true;
      }
    }
    
    const product = await Product.create(data);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error al crear producto" },
      { status: 500 }
    );
  }
}