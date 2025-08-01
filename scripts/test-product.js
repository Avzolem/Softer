import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

async function createTestProduct() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    // Crear un producto de prueba
    const testProduct = new Product({
      name: "Conjunto de Prueba",
      description: "Este es un producto de prueba para verificar la conexión",
      price: 499,
      originalPrice: 699,
      category: "Conjuntos",
      images: [{
        url: "https://via.placeholder.com/500",
        publicId: "test-product-1",
        width: 500,
        height: 500,
        isMain: true
      }],
      colors: ["Negro", "Blanco"],
      sizes: ["S", "M", "L"],
      isNew: true,
      featured: true,
      inStock: true,
      sortOrder: 1
    });

    // Guardar el producto
    await testProduct.save();
    // Verificar que se puede leer
    const products = await Product.find({});
    } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

createTestProduct();