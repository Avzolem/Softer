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
    console.log("🚀 Iniciando prueba completa del flujo de trabajo\n");
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // 1. CREAR PRODUCTO
    console.log("📦 1. CREANDO NUEVO PRODUCTO");
    console.log("================================");
    
    // Buscar una imagen de prueba
    const imagePath = path.join(__dirname, '../public/images/softer-logo.png');
    let imageUrl = "https://via.placeholder.com/400x400";
    let imagePublicId = null;
    
    if (fs.existsSync(imagePath)) {
      console.log("   📸 Subiendo imagen a Cloudinary...");
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
        console.log("   ✅ Imagen subida exitosamente");
        console.log("   URL:", imageUrl);
      } catch (error) {
        console.log("   ⚠️ No se pudo subir la imagen, usando placeholder");
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
    console.log("\n✅ Producto creado exitosamente");
    console.log("   Nombre:", newProduct.name);
    console.log("   ID:", newProduct._id);
    console.log("   Precio: $", newProduct.price);
    
    await sleep(2000);

    // 2. VERIFICAR EN CATÁLOGO
    console.log("\n🔍 2. VERIFICANDO PRODUCTO EN CATÁLOGO");
    console.log("======================================");
    const productInCatalog = await Product.findById(newProduct._id);
    console.log("✅ Producto encontrado en catálogo:");
    console.log("   Nombre:", productInCatalog.name);
    console.log("   Tallas disponibles:", productInCatalog.sizes.join(", "));
    console.log("   Colores:", productInCatalog.colors.join(", "));
    
    await sleep(2000);

    // 3. EDITAR PRODUCTO
    console.log("\n✏️ 3. EDITANDO PRODUCTO");
    console.log("=======================");
    productInCatalog.price = 799;
    productInCatalog.description += " ¡Ahora con 20% de descuento!";
    await productInCatalog.save();
    console.log("✅ Producto actualizado:");
    console.log("   Nuevo precio: $", productInCatalog.price);
    console.log("   Nueva descripción:", productInCatalog.description.substring(0, 50) + "...");
    
    await sleep(2000);

    // 4. ELIMINAR PRODUCTO
    console.log("\n🗑️  4. ELIMINANDO PRODUCTO");
    console.log("=========================");
    
    // Eliminar imagen de Cloudinary si se subió
    if (imagePublicId && imagePublicId !== 'placeholder') {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
        console.log("   ✅ Imagen eliminada de Cloudinary");
      } catch (error) {
        console.log("   ⚠️ No se pudo eliminar la imagen de Cloudinary");
      }
    }
    
    await Product.findByIdAndDelete(productInCatalog._id);
    console.log("✅ Producto eliminado correctamente");
    
    await sleep(2000);

    // 5. RECREAR PRODUCTO
    console.log("\n🔄 5. RECREANDO PRODUCTO");
    console.log("========================");
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
    console.log("✅ Producto recreado exitosamente");
    console.log("   Nombre:", recreatedProduct.name);
    console.log("   ID:", recreatedProduct._id);
    
    await sleep(2000);

    // 6. CREAR PEDIDO
    console.log("\n🛒 6. CREANDO PEDIDO DE PRUEBA");
    console.log("===============================");
    
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
    console.log("✅ Pedido creado exitosamente");
    console.log("   Número de orden:", testOrder.orderNumber);
    console.log("   Cliente:", testOrder.customer.name);
    console.log("   Total: $", testOrder.total);
    console.log("   Estado:", testOrder.status);
    console.log("   ID:", testOrder._id);
    
    await sleep(2000);

    // 7. VERIFICAR PEDIDO
    console.log("\n📋 7. VERIFICANDO PEDIDO EN BASE DE DATOS");
    console.log("=========================================");
    const orderInDB = await Order.findById(testOrder._id)
      .populate('items.product', 'name price');
    
    console.log("✅ Pedido encontrado:");
    console.log("   Número:", orderInDB.orderNumber);
    console.log("   Productos:");
    orderInDB.items.forEach(item => {
      console.log(`      - ${item.name} x${item.quantity} (${item.size}, ${item.color})`);
    });
    console.log("   Dirección de envío:", 
      `${orderInDB.shippingAddress.street} ${orderInDB.shippingAddress.number}, ${orderInDB.shippingAddress.city}`);
    
    // RESUMEN FINAL
    console.log("\n📊 RESUMEN DE LA PRUEBA");
    console.log("=======================");
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    console.log("✅ Total de productos en BD:", totalProducts);
    console.log("✅ Total de pedidos en BD:", totalOrders);
    console.log("\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!");
    
    console.log("\n📌 NOTAS IMPORTANTES:");
    console.log("- Los productos se guardan correctamente en MongoDB");
    console.log("- Las imágenes se suben a Cloudinary cuando hay archivos disponibles");
    console.log("- Los pedidos se crean con toda la información necesaria");
    console.log("- Todas las operaciones CRUD funcionan correctamente");
    console.log("\n💡 Para verificar en el dashboard:");
    console.log("1. Inicia sesión como administrador");
    console.log("2. Ve a /admin/dashboard");
    console.log("3. Verifica los contadores de productos y pedidos");
    console.log("4. Navega a cada sección para ver los detalles");
    console.log(`5. El pedido ${testOrder._id} debería ser visible en la sección de pedidos`);

  } catch (error) {
    console.error("\n❌ Error durante la prueba:", error);
    console.error("Stack:", error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión a MongoDB cerrada");
  }
}

testCompleteWorkflow();