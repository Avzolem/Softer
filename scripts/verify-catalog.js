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
    // Obtener todos los productos
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    products.forEach((product, index) => {
      const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
      });

  } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

verifyCatalog();