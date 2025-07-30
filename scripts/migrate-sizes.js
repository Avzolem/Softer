// Script para migrar el formato de tallas antiguo al nuevo formato con medidas
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: '.env.local' });

async function migrateSizes() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los productos
    const products = await Product.find({});
    console.log(`📦 Encontrados ${products.length} productos para migrar`);

    let migrated = 0;
    let skipped = 0;

    for (const product of products) {
      // Verificar si el producto ya tiene el nuevo formato
      if (product.sizes && product.sizes.length > 0) {
        // Si el primer elemento es un string, necesita migración
        if (typeof product.sizes[0] === 'string') {
          // Convertir array de strings a array de objetos
          const newSizes = product.sizes.map(size => ({
            name: size,
            measurements: {}
          }));

          // Actualizar el producto
          product.sizes = newSizes;
          await product.save();
          
          console.log(`✅ Migrado: ${product.name}`);
          migrated++;
        } else {
          console.log(`⏭️  Omitido: ${product.name} (ya tiene el formato nuevo)`);
          skipped++;
        }
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`   - Productos migrados: ${migrated}`);
    console.log(`   - Productos omitidos: ${skipped}`);
    console.log(`   - Total procesados: ${products.length}`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar la migración
migrateSizes();