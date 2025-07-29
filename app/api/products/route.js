import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Product from "@/models/Product";

// GET - Obtener todos los productos públicos
export async function GET(req) {
  try {
    console.log("API /products - Starting request");
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    
    console.log("Query params:", { category, featured, inStock });
    
    // Conectar a MongoDB
    await connectMongo();
    console.log("MongoDB connected successfully");
    
    // Construir query
    let query = {};
    
    if (category && category !== 'todos') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (inStock === 'true') {
      query.inStock = true;
    }
    
    // Obtener productos de la base de datos
    console.log("Fetching products with query:", query);
    const products = await Product.find(query)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 });
    
    console.log(`Found ${products.length} products`);
    
    // Transformar productos para incluir solo la imagen principal
    const publicProducts = products.map(product => {
      const productObj = product.toObject ? product.toObject() : product;
      const images = productObj.images || [];
      const mainImage = images.find(img => img.isMain) || images[0];
      
      return {
        _id: productObj._id,
        id: productObj._id.toString(),
        name: productObj.name,
        description: productObj.description,
        price: productObj.price,
        originalPrice: productObj.originalPrice,
        category: productObj.category,
        image: mainImage?.url || null,
        images: images,
        colors: productObj.colors || [],
        sizes: productObj.sizes || [],
        isNew: productObj.isNew || false,
        featured: productObj.featured || false,
        inStock: productObj.inStock !== undefined ? productObj.inStock : true,
        sortOrder: productObj.sortOrder || 0
      };
    });
    
    return NextResponse.json(publicProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}