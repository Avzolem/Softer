import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Product from "@/models/Product";

// GET - Obtener todos los productos públicos
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const onSale = searchParams.get('onSale');
    
    // Conectar a MongoDB
    await connectMongo();
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
    
    if (onSale === 'true') {
      query.isOnSale = true;
    } else if (onSale !== 'true' && onSale !== null) {
      // Si no se especifica explícitamente que se quieren productos en oferta,
      // excluir productos en oferta del catálogo regular
      query.isOnSale = { $ne: true };
    }
    
    // Obtener productos de la base de datos
    const products = await Product.find(query)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 });
    
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
        isOnSale: productObj.isOnSale || false,
        sortOrder: productObj.sortOrder || 0
      };
    });
    
    return NextResponse.json(publicProducts);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}