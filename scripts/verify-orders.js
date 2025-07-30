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
    // Obtener todas las órdenes
    const orders = await Order.find({})
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    
    orders.forEach((order, index) => {
      }`);
      `);
      order.items.forEach(item => {
        - $${item.price}`);
      });
      if (order.notes) {
        }
      });

  } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

verifyOrders();