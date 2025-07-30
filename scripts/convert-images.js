const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../public/images/products');

async function convertImagesToWebP() {
  try {
    // Leer todos los archivos en el directorio
    const files = await fs.readdir(PRODUCTS_DIR);
    
    // Filtrar solo archivos JPG
    const jpgFiles = files.filter(file => file.toLowerCase().endsWith('.jpg'));
    
    let converted = 0;
    let errors = 0;
    
    for (const file of jpgFiles) {
      const inputPath = path.join(PRODUCTS_DIR, file);
      const outputPath = inputPath.replace(/\.jpg$/i, '.webp');
      
      try {
        // Convertir a WebP con calidad optimizada
        await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);
        
        // Eliminar el archivo JPG original
        await fs.unlink(inputPath);
        
        converted++;
        } catch (error) {
        errors++;
      }
    }
    
    } catch (error) {
    }
}

// Ejecutar el script
convertImagesToWebP();