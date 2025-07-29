import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // Necesario para el populate
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function verifyOrders() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Obtener todas las órdenes
    const orders = await Order.find({})
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    
    console.log(`\n🛒 Total de órdenes: ${orders.length}\n`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Orden #${order.orderNumber}`);
      console.log(`   📅 Fecha: ${order.createdAt.toLocaleString('es-MX')}`);
      console.log(`   👤 Cliente: ${order.customer.name} (${order.customer.email})`);
      console.log(`   📍 Dirección: ${order.shippingAddress.street} ${order.shippingAddress.number}, ${order.shippingAddress.city}`);
      console.log(`   📦 Productos:`);
      order.items.forEach(item => {
        console.log(`      - ${item.name} x${item.quantity} (${item.size}, ${item.color}) - $${item.price}`);
      });
      console.log(`   💰 Subtotal: $${order.subtotal}`);
      console.log(`   🚚 Envío: $${order.shippingCost}`);
      console.log(`   💳 Total: $${order.total}`);
      console.log(`   📊 Estado: ${order.status}`);
      console.log(`   💳 Pago: ${order.paymentStatus}`);
      if (order.notes) {
        console.log(`   📝 Notas: ${order.notes}`);
      }
      console.log(`   🆔 ID: ${order._id}`);
      console.log('---');
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

verifyOrders();