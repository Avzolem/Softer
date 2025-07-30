import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { deleteMultipleImages } from "@/libs/cloudinary-delete";

// GET single product
export async function GET(req, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    // Primero buscar el producto para obtener las imágenes
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    
    // Eliminar imágenes de Cloudinary si existen
    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map(img => img.publicId).filter(Boolean);
      if (publicIds.length > 0) {
        try {
          await deleteMultipleImages(publicIds);
          } catch (cloudinaryError) {
          // Continuar con la eliminación del producto aunque falle Cloudinary
        }
      }
    }
    
    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(params.id);
    
    return NextResponse.json({ 
      message: "Producto y sus imágenes eliminados exitosamente" 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}