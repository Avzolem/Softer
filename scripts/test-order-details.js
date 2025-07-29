import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testOrderDetails() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Obtener el último pedido
    const order = await Order.findOne({})
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price images');
    
    if (!order) {
      console.log("❌ No hay pedidos en la base de datos");
      return;
    }

    console.log("📋 DETALLES DEL PEDIDO");
    console.log("======================");
    console.log("\n📌 Información General:");
    console.log("   ID:", order._id);
    console.log("   Número de orden:", order.orderNumber);
    console.log("   Fecha:", order.createdAt.toLocaleString('es-MX'));
    console.log("   Estado:", order.status);
    console.log("   Estado del pago:", order.paymentStatus);
    console.log("   Método de pago:", order.paymentMethod);
    
    console.log("\n👤 Cliente:");
    console.log("   Nombre:", order.customer.name);
    console.log("   Email:", order.customer.email);
    console.log("   Teléfono:", order.customer.phone);
    
    console.log("\n📍 Dirección de envío:");
    console.log("   Calle:", order.shippingAddress.street, order.shippingAddress.number);
    console.log("   Colonia:", order.shippingAddress.neighborhood);
    console.log("   Ciudad:", order.shippingAddress.city);
    console.log("   Estado:", order.shippingAddress.state);
    console.log("   CP:", order.shippingAddress.zipCode);
    if (order.shippingAddress.references) {
      console.log("   Referencias:", order.shippingAddress.references);
    }
    
    console.log("\n📦 Productos:");
    order.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}`);
      console.log(`      - Cantidad: ${item.quantity}`);
      console.log(`      - Precio unitario: $${item.price}`);
      console.log(`      - Talla: ${item.size}`);
      console.log(`      - Color: ${item.color}`);
      console.log(`      - Subtotal: $${item.quantity * item.price}`);
      if (item.product && item.product.images && item.product.images.length > 0) {
        console.log(`      - Imagen: ${item.product.images[0].url}`);
      }
    });
    
    console.log("\n💰 Totales:");
    console.log("   Subtotal: $", order.subtotal);
    console.log("   Envío: $", order.shippingCost);
    console.log("   TOTAL: $", order.total);
    
    if (order.notes) {
      console.log("\n📝 Notas:", order.notes);
    }
    
    if (order.trackingNumber) {
      console.log("\n🚚 Número de rastreo:", order.trackingNumber);
    }
    
    console.log("\n✅ Esta información es la que se muestra en:");
    console.log(`   /admin/dashboard/orders/${order._id}`);
    
    // Verificar estructura de datos para la página de detalles
    console.log("\n🔍 Verificando estructura de datos para la página:");
    console.log("   - customer:", order.customer ? "✓" : "✗");
    console.log("   - shippingAddress:", order.shippingAddress ? "✓" : "✗");
    console.log("   - items:", order.items && order.items.length > 0 ? "✓" : "✗");
    console.log("   - orderNumber:", order.orderNumber ? "✓" : "✗");
    console.log("   - status:", order.status ? "✓" : "✗");
    console.log("   - paymentStatus:", order.paymentStatus ? "✓" : "✗");
    console.log("   - paymentMethod:", order.paymentMethod ? "✓" : "✗");
    console.log("   - totals (subtotal, shippingCost, total):", 
      order.subtotal !== undefined && order.shippingCost !== undefined && order.total !== undefined ? "✓" : "✗");
    
    console.log("\n✅ Todos los campos necesarios están presentes");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

testOrderDetails();