import mongoose from "mongoose";
import Product from "../models/Product.js";
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

async function testImageUpload() {
  try {
    // Verificar configuración
    // Buscar imagen de prueba
    const testImagePath = path.join(__dirname, '../public/images/softer-logo.png');
    
    if (!fs.existsSync(testImagePath)) {
      // Usar una imagen de prueba desde URL
      const testUrl = "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg";
      
      const uploadResult = await cloudinary.uploader.upload(testUrl, {
        folder: 'softer/test',
        public_id: `test-${Date.now()}`,
        format: 'webp',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:best' },
          { fetch_format: 'webp' }
        ]
      });
      
      // Limpiar imagen de prueba
      await cloudinary.uploader.destroy(uploadResult.public_id);
      } else {
      const uploadResult = await cloudinary.uploader.upload(testImagePath, {
        folder: 'softer/test',
        public_id: `test-local-${Date.now()}`,
        format: 'webp',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:best' },
          { fetch_format: 'webp' }
        ]
      });
      
      // Limpiar imagen de prueba
      await cloudinary.uploader.destroy(uploadResult.public_id);
      }
    
    ");
    } catch (error) {
    if (error.message.includes("cloud_name")) {
      }
  }
}

testImageUpload();