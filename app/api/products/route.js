import { NextResponse } from "next/server";
import { products } from "@/data/products";

// GET - Obtener todos los productos públicos
export async function GET(req) {
  try {
    console.log("API /products called");
    console.log("Products array length:", products?.length || 0);
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    
    // Filtrar productos según los parámetros
    let filteredProducts = [...products];
    
    if (category && category !== 'todos') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured === true);
    }
    
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.inStock === true);
    }
    
    // Ordenar productos (featured primero, luego por orden)
    filteredProducts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
    
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}