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
    console.log("🚀 Probando subida de imágenes a Cloudinary\n");
    
    // Verificar configuración
    console.log("✅ Cloudinary configurado:");
    console.log("   Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("   API Key:", process.env.CLOUDINARY_API_KEY ? "✓" : "✗");
    console.log("   API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓" : "✗");
    
    // Buscar imagen de prueba
    const testImagePath = path.join(__dirname, '../public/images/softer-logo.png');
    
    if (!fs.existsSync(testImagePath)) {
      console.log("\n⚠️ No se encontró la imagen de prueba en:", testImagePath);
      console.log("Creando una imagen de prueba temporal...");
      
      // Usar una imagen de prueba desde URL
      const testUrl = "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg";
      
      console.log("\n📸 Subiendo imagen desde URL a Cloudinary...");
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
      
      console.log("\n✅ Imagen subida exitosamente:");
      console.log("   URL:", uploadResult.secure_url);
      console.log("   Public ID:", uploadResult.public_id);
      console.log("   Formato:", uploadResult.format);
      console.log("   Tamaño:", uploadResult.width, "x", uploadResult.height);
      console.log("   Bytes:", uploadResult.bytes);
      
      // Limpiar imagen de prueba
      console.log("\n🗑️ Eliminando imagen de prueba...");
      await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log("✅ Imagen de prueba eliminada");
      
    } else {
      console.log("\n📸 Subiendo imagen local a Cloudinary...");
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
      
      console.log("\n✅ Imagen subida exitosamente:");
      console.log("   URL:", uploadResult.secure_url);
      console.log("   Public ID:", uploadResult.public_id);
      console.log("   Formato:", uploadResult.format);
      console.log("   Tamaño:", uploadResult.width, "x", uploadResult.height);
      console.log("   Bytes:", uploadResult.bytes);
      
      // Limpiar imagen de prueba
      console.log("\n🗑️ Eliminando imagen de prueba...");
      await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log("✅ Imagen de prueba eliminada");
    }
    
    console.log("\n🎉 ¡Prueba completada exitosamente!");
    console.log("\n💡 Notas:");
    console.log("- Las imágenes se convierten automáticamente a WebP");
    console.log("- Se aplican optimizaciones de calidad y tamaño");
    console.log("- Las imágenes se organizan en carpetas (softer/products)");
    console.log("- Cada imagen tiene un public_id único para gestión");

  } catch (error) {
    console.error("\n❌ Error durante la prueba:", error.message);
    console.error("Detalles:", error);
    
    if (error.message.includes("cloud_name")) {
      console.log("\n🔍 Verifica tus credenciales de Cloudinary en .env.local");
    }
  }
}

testImageUpload();