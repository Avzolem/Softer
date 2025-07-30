import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

// POST - Crear nueva orden
export async function POST(req) {
  try {
    await connectMongo();
    
    const body = await req.json();
    const { customer, shippingAddress, items, paymentMethod } = body;
    
    // Validar que hay productos en el carrito
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }
    
    // Calcular totales y verificar stock
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${item.name}` },
          { status: 404 }
        );
      }
      
      if (!product.inStock) {
        return NextResponse.json(
          { error: `Producto sin stock: ${product.name}` },
          { status: 400 }
        );
      }
      
      subtotal += item.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.image
      });
    }
    
    // Calcular envío (gratis arriba de $999)
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shippingCost;
    
    // Generar número de orden
    const orderNumber = await Order.generateOrderNumber();
    
    // Crear la orden
    const order = await Order.create({
      orderNumber,
      customer,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      status: "pending",
      paymentStatus: paymentMethod === "cash" ? "pending" : "pending"
    });
    
    // Si es pago con Stripe, devolver la orden para procesar el pago
    // Si es contra entrega, la orden ya está creada
    
    return NextResponse.json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      paymentMethod: order.paymentMethod
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear la orden" },
      { status: 500 }
    );
  }
}

// GET - Obtener orden por ID o número (para confirmación)
export async function GET(req) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');
    const orderNumber = searchParams.get('orderNumber');
    
    let order;
    
    if (orderId) {
      order = await Order.findById(orderId).populate('items.product');
    } else if (orderNumber) {
      order = await Order.findOne({ orderNumber }).populate('items.product');
    } else {
      return NextResponse.json(
        { error: "Debe proporcionar ID o número de orden" },
        { status: 400 }
      );
    }
    
    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener la orden" },
      { status: 500 }
    );
  }
}