import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function createTestOrder() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    // Obtener un producto para el pedido
    const product = await Product.findOne({ inStock: true });
    
    if (!product) {
      return;
    }

    // Generar número de orden
    const orderNumber = await Order.generateOrderNumber();
    
    // Crear el pedido
    const order = new Order({
      orderNumber,
      customer: {
        name: "María García",
        email: "maria.garcia@example.com",
        phone: "555-1234-5678"
      },
      shippingAddress: {
        street: "Av. Reforma",
        number: "123",
        neighborhood: "Polanco",
        city: "Ciudad de México",
        state: "CDMX",
        zipCode: "11560",
        references: "Casa blanca con portón negro"
      },
      items: [{
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 2,
        size: product.sizes[0] || "M",
        color: product.colors[0] || "Negro",
        image: product.images?.[0]?.url || product.image
      }],
      subtotal: product.price * 2,
      shippingCost: 99,
      total: (product.price * 2) + 99,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "stripe",
      notes: "Por favor manejar con cuidado - Regalo"
    });

    await order.save();
    
    // Verificar total de órdenes
    const totalOrders = await Order.countDocuments();
    } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

createTestOrder();