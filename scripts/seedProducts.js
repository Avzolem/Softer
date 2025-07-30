import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import { products } from "../data/products.js";

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

// Conectar a MongoDB usando la URI del environment
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
    process.exit(1);
  }
};

// Función principal para sembrar productos
const seedProducts = async () => {
  try {
    await connectDB();
    
    // Limpiar productos existentes
    await Product.deleteMany({});
    
    // Insertar nuevos productos
    const createdProducts = await Product.insertMany(products);
    
    // Mostrar estadísticas
    const stats = {
      total: createdProducts.length,
      featured: createdProducts.filter(p => p.featured).length,
      new: createdProducts.filter(p => p.isNew).length,
      inStock: createdProducts.filter(p => p.inStock).length,
      categories: {}
    };
    
    createdProducts.forEach(product => {
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
    });
    
    Object.entries(stats.categories).forEach(([category, count]) => {
      });
    
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

// Ejecutar script
if (process.argv[2] === "run") {
  seedProducts();
}

export default seedProducts;