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
    // Buscar el producto "Conjunto Elegance Negro"
    const product = await Product.findOne({ name: "Conjunto Elegance Negro" });
    
    if (!product) {
      return;
    }

    // Eliminar imágenes de Cloudinary
    for (const image of product.images) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (error) {
        }
    }
    
    // Eliminar producto de la base de datos
    await Product.findByIdAndDelete(product._id);
    
    // Verificar cuántos productos quedan
    const remaining = await Product.countDocuments();
    } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

deleteProduct();