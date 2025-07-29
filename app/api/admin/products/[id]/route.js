import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { products } from "@/data/products";

// GET - Obtener un producto por ID
export async function GET(req, { params }) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const product = products.find(p => p.id.toString() === params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    // Formato para admin
    const adminProduct = {
      ...product,
      _id: product.id.toString(),
      id: product.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(adminProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto (simulado para demo)
export async function PUT(req, { params }) {
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
    const productIndex = products.findIndex(p => p.id.toString() === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    // Actualizar producto simulado
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id: products[productIndex].id,
      _id: products[productIndex].id.toString(),
      updatedAt: new Date().toISOString()
    };
    
    // Nota: En un entorno real, aquí actualizarías en la base de datos
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto (simulado para demo)
export async function DELETE(req, { params }) {
  try {
    // Verificar autenticación de admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const productExists = products.find(p => p.id.toString() === params.id);
    
    if (!productExists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    // Nota: En un entorno real, aquí eliminarías de la base de datos
    // Por ahora, solo confirmamos la eliminación
    
    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}