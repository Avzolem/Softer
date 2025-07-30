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
    // Obtener el último pedido
    const order = await Order.findOne({})
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price images');
    
    if (!order) {
      return;
    }

    );
    if (order.shippingAddress.references) {
      }
    
    order.items.forEach((item, index) => {
      if (item.product && item.product.images && item.product.images.length > 0) {
        }
    });
    
    if (order.notes) {
      }
    
    if (order.trackingNumber) {
      }
    
    // Verificar estructura de datos para la página de detalles
    :", 
      order.subtotal !== undefined && order.shippingCost !== undefined && order.total !== undefined ? "✓" : "✗");
    
    } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

testOrderDetails();