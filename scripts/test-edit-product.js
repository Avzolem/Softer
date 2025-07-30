import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function editProduct() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    // Buscar el producto "Conjunto Elegance Negro"
    const product = await Product.findOne({ name: "Conjunto Elegance Negro" });
    
    if (!product) {
      return;
    }

    // Actualizar el producto
    product.price = 799; // Cambiar precio
    product.description = product.description + " ¡OFERTA ESPECIAL!";
    product.colors.push("Blanco Perla");
    product.inStock = false; // Marcar como agotado
    
    await product.save();
    
    );

  } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

editProduct();