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
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

// Función principal para sembrar productos
const seedProducts = async () => {
  try {
    await connectDB();
    
    // Limpiar productos existentes
    console.log("Limpiando productos existentes...");
    await Product.deleteMany({});
    
    // Insertar nuevos productos
    console.log("Insertando productos mockup...");
    const createdProducts = await Product.insertMany(products);
    
    console.log(`✅ Se crearon ${createdProducts.length} productos exitosamente`);
    
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
    
    console.log("\n📊 Estadísticas:");
    console.log(`Total: ${stats.total}`);
    console.log(`Destacados: ${stats.featured}`);
    console.log(`Nuevos: ${stats.new}`);
    console.log(`En Stock: ${stats.inStock}`);
    console.log("Por categoría:");
    Object.entries(stats.categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error sembrando productos:", error);
    process.exit(1);
  }
};

// Ejecutar script
if (process.argv[2] === "run") {
  seedProducts();
}

export default seedProducts;