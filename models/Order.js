import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String }
});

const orderSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    shippingAddress: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      neighborhood: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      references: { type: String }
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash"],
      default: "stripe"
    },
    stripePaymentId: { type: String },
    notes: { type: String },
    trackingNumber: { type: String }
  },
  {
    timestamps: true
  }
);

// Generar número de orden único
orderSchema.statics.generateOrderNumber = async function() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Buscar el último pedido del día
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  const lastOrder = await this.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ createdAt: -1 });
  
  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
    sequence = lastSequence + 1;
  }
  
  return `ORD-${year}${month}${day}-${sequence.toString().padStart(3, '0')}`;
};

export default mongoose.models.Order || mongoose.model("Order", orderSchema);