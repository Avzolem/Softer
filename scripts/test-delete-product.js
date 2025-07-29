import mongoose from "mongoose";
import Product from "../models/Product.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function deleteProduct() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Buscar el producto "Conjunto Elegance Negro"
    const product = await Product.findOne({ name: "Conjunto Elegance Negro" });
    
    if (!product) {
      console.log("❌ Producto no encontrado");
      return;
    }

    console.log("🗑️  Eliminando producto:", product.name);
    console.log("   ID:", product._id);
    
    // Eliminar imágenes de Cloudinary
    for (const image of product.images) {
      try {
        console.log("   Eliminando imagen de Cloudinary:", image.publicId);
        await cloudinary.uploader.destroy(image.publicId);
      } catch (error) {
        console.error("   Error eliminando imagen:", error.message);
      }
    }
    
    // Eliminar producto de la base de datos
    await Product.findByIdAndDelete(product._id);
    
    console.log("✅ Producto eliminado correctamente");
    
    // Verificar cuántos productos quedan
    const remaining = await Product.countDocuments();
    console.log(`📊 Productos restantes en la base de datos: ${remaining}`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

deleteProduct();