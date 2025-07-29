import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function verifyCatalog() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Obtener todos los productos
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    console.log(`\n📦 Total de productos en catálogo: ${products.length}\n`);
    
    products.forEach((product, index) => {
      const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - Categoría: ${product.category}`);
      console.log(`   - Precio: $${product.price}`);
      console.log(`   - Stock: ${product.inStock ? '✅ Disponible' : '❌ Agotado'}`);
      console.log(`   - Destacado: ${product.featured ? '⭐ Sí' : 'No'}`);
      console.log(`   - Imagen: ${mainImage ? mainImage.url : 'Sin imagen'}`);
      console.log(`   - ID: ${product._id}`);
      console.log('---');
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

verifyCatalog();