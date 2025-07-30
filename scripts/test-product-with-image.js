import mongoose from "mongoose";
import Product from "../models/Product.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Configurar Cloudinary directamente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function createProductWithImage() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    // Buscar una imagen de prueba
    const imagePath = path.join(process.cwd(), "public/images/products/softer.mx_1590984365_2321667591510357441_35563853848.webp");
    
    if (!fs.existsSync(imagePath)) {
      return;
    }

    // Convertir imagen a base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/webp;base64,${imageBuffer.toString('base64')}`;
    
    // Subir a Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'softer/products',
      format: 'webp',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:best' }
      ]
    });
    // Crear producto con la imagen
    const newProduct = new Product({
      name: "Conjunto Elegance Negro",
      description: "Conjunto de lencería premium con encaje francés y detalles dorados. Incluye brassiere con push-up y panty brasileña.",
      price: 899,
      originalPrice: 1299,
      category: "Conjuntos",
      images: [{
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        isMain: true
      }],
      colors: ["Negro", "Rojo Vino", "Nude"],
      sizes: ["32B", "34B", "34C", "36B", "36C"],
      isNew: true,
      featured: true,
      inStock: true,
      sortOrder: 1
    });

    await newProduct.save();
    // Verificar en la base de datos
    const totalProducts = await Product.countDocuments();
    } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

createProductWithImage();