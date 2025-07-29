import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { products } from "@/data/products";

// GET - Obtener todos los productos
export async function GET(req) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    // Devolver productos con formato adecuado para admin
    const adminProducts = products.map(product => ({
      ...product,
      _id: product.id.toString(),
      id: product.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    return NextResponse.json(adminProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto (simulado para demo)
export async function POST(req) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Verificar si el producto ya existe
    const existingProduct = products.find(p => p.name === body.name);
    if (existingProduct) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese nombre" },
        { status: 409 }
      );
    }
    
    // Crear producto simulado (en producción esto guardaría en DB)
    const newProduct = {
      ...body,
      id: Date.now(),
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Nota: En un entorno real, aquí guardarías en la base de datos
    // Por ahora, solo devolvemos el producto creado
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}