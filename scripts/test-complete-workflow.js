import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testCompleteWorkflow() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    // 1. CREAR PRODUCTO
    // Buscar una imagen de prueba
    const imagePath = path.join(__dirname, '../public/images/softer-logo.png');
    let imageUrl = "https://via.placeholder.com/400x400";
    let imagePublicId = null;
    
    if (fs.existsSync(imagePath)) {
      try {
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
          folder: 'softer/products',
          format: 'webp',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:best' },
            { fetch_format: 'webp' }
          ]
        });
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
        } catch (error) {
        }
    }

    const newProduct = new Product({
      name: "Vestido Floral Primavera",
      description: "Hermoso vestido floral perfecto para la temporada de primavera. Confeccionado con tela ligera y cómoda.",
      price: 899,
      originalPrice: 1299,
      images: [{
        url: imageUrl,
        publicId: imagePublicId || 'placeholder',
        width: 1200,
        height: 1200,
        isMain: true
      }],
      category: "Conjuntos",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Rosa", "Azul", "Blanco"],
      inStock: true,
      featured: true
    });

    await newProduct.save();
    await sleep(2000);

    // 2. VERIFICAR EN CATÁLOGO
    const productInCatalog = await Product.findById(newProduct._id);
    );
    );
    
    await sleep(2000);

    // 3. EDITAR PRODUCTO
    productInCatalog.price = 799;
    productInCatalog.description += " ¡Ahora con 20% de descuento!";
    await productInCatalog.save();
    + "...");
    
    await sleep(2000);

    // 4. ELIMINAR PRODUCTO
    // Eliminar imagen de Cloudinary si se subió
    if (imagePublicId && imagePublicId !== 'placeholder') {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
        } catch (error) {
        }
    }
    
    await Product.findByIdAndDelete(productInCatalog._id);
    await sleep(2000);

    // 5. RECREAR PRODUCTO
    const recreatedProduct = new Product({
      name: "Conjunto Deportivo Premium",
      description: "Conjunto deportivo de alta calidad, ideal para entrenamientos intensos o uso casual.",
      price: 1299,
      originalPrice: 1599,
      images: [{
        url: "https://via.placeholder.com/400x400",
        publicId: "placeholder",
        width: 400,
        height: 400,
        isMain: true
      }],
      category: "Básicos",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Negro", "Gris", "Azul marino"],
      inStock: true,
      featured: false
    });
    
    await recreatedProduct.save();
    await sleep(2000);

    // 6. CREAR PEDIDO
    const orderNumber = await Order.generateOrderNumber();
    const testOrder = new Order({
      orderNumber,
      customer: {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "555-9876-5432"
      },
      shippingAddress: {
        street: "Calle Principal",
        number: "456",
        neighborhood: "Centro",
        city: "Guadalajara",
        state: "Jalisco",
        zipCode: "44100",
        references: "Frente al parque central"
      },
      items: [{
        product: recreatedProduct._id,
        name: recreatedProduct.name,
        price: recreatedProduct.price,
        quantity: 1,
        size: "L",
        color: "Negro",
        image: recreatedProduct.images[0].url
      }],
      subtotal: recreatedProduct.price,
      shippingCost: 0, // Envío gratis
      total: recreatedProduct.price,
      status: "processing",
      paymentStatus: "paid",
      paymentMethod: "stripe",
      notes: "Cliente frecuente - Tratar con prioridad"
    });
    
    await testOrder.save();
    await sleep(2000);

    // 7. VERIFICAR PEDIDO
    const orderInDB = await Order.findById(testOrder._id)
      .populate('items.product', 'name price');
    
    orderInDB.items.forEach(item => {
      `);
    });
    // RESUMEN FINAL
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

testCompleteWorkflow();