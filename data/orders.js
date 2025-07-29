// Datos simulados de órdenes para el panel de administración
export const orders = [
  {
    _id: "1",
    id: "1",
    orderNumber: "ORD-2025-001",
    customer: {
      name: "María García",
      email: "maria@example.com",
      phone: "+52 555 123 4567"
    },
    items: [
      {
        product: {
          _id: "1",
          name: "Conjunto Elegance",
          image: "/images/products/softer.mx_1668271582_2969999758907443127_35563853848.webp"
        },
        price: 899,
        quantity: 1,
        size: "34B",
        color: "Negro"
      }
    ],
    subtotal: 899,
    shipping: 99,
    total: 998,
    status: "pending",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingAddress: {
      street: "Calle Reforma 123",
      city: "Ciudad de México",
      state: "CDMX",
      postalCode: "06600",
      country: "México"
    },
    createdAt: new Date("2025-01-15").toISOString(),
    updatedAt: new Date("2025-01-15").toISOString()
  },
  {
    _id: "2",
    id: "2",
    orderNumber: "ORD-2025-002",
    customer: {
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "+52 555 987 6543"
    },
    items: [
      {
        product: {
          _id: "3",
          name: "Set Glamour",
          image: "/images/products/softer.mx_1631327165_2660087526797003755_35563853848.webp"
        },
        price: 1299,
        quantity: 1,
        size: "36C",
        color: "Rojo"
      },
      {
        product: {
          _id: "2",
          name: "Brasier Delicate",
          image: "/images/products/softer.mx_1654195579_2851921679582049036_35563853848.webp"
        },
        price: 649,
        quantity: 2,
        size: "36B",
        color: "Nude"
      }
    ],
    subtotal: 2597,
    shipping: 0,
    total: 2597,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingAddress: {
      street: "Av. Polanco 456",
      city: "Ciudad de México",
      state: "CDMX",
      postalCode: "11560",
      country: "México"
    },
    trackingNumber: "MX123456789",
    createdAt: new Date("2025-01-20").toISOString(),
    updatedAt: new Date("2025-01-22").toISOString()
  },
  {
    _id: "3",
    id: "3",
    orderNumber: "ORD-2025-003",
    customer: {
      name: "Laura Sánchez",
      email: "laura@example.com",
      phone: "+52 555 456 7890"
    },
    items: [
      {
        product: {
          _id: "20",
          name: "Conjunto Luxury Silk",
          image: "/images/products/softer.mx_1653650780_2847351576890171971_35563853848.webp"
        },
        price: 1899,
        quantity: 1,
        size: "34C",
        color: "Champagne"
      }
    ],
    subtotal: 1899,
    shipping: 0,
    total: 1899,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingAddress: {
      street: "Bosques de las Lomas 789",
      city: "Ciudad de México",
      state: "CDMX",
      postalCode: "05120",
      country: "México"
    },
    deliveredAt: new Date("2025-01-18").toISOString(),
    createdAt: new Date("2025-01-10").toISOString(),
    updatedAt: new Date("2025-01-18").toISOString()
  },
  {
    _id: "4",
    id: "4",
    orderNumber: "ORD-2025-004",
    customer: {
      name: "Sofía Hernández",
      email: "sofia@example.com",
      phone: "+52 555 321 6547"
    },
    items: [
      {
        product: {
          _id: "11",
          name: "Body Sensual Mesh",
          image: "/images/products/softer.mx_1647651661_2797027320897976675_35563853848.webp"
        },
        price: 1249,
        quantity: 1,
        size: "M",
        color: "Negro"
      }
    ],
    subtotal: 1249,
    shipping: 99,
    total: 1348,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingAddress: {
      street: "Santa Fe 321",
      city: "Ciudad de México",
      state: "CDMX",
      postalCode: "01219",
      country: "México"
    },
    createdAt: new Date("2025-01-25").toISOString(),
    updatedAt: new Date("2025-01-25").toISOString()
  },
  {
    _id: "5",
    id: "5",
    orderNumber: "ORD-2025-005",
    customer: {
      name: "Carmen López",
      email: "carmen@example.com",
      phone: "+52 555 654 3210"
    },
    items: [
      {
        product: {
          _id: "5",
          name: "Conjunto Cotton Soft",
          image: "/images/products/softer.mx_1617682452_2545627377446291988_35563853848.webp"
        },
        price: 599,
        quantity: 3,
        size: "36B",
        color: "Blanco"
      }
    ],
    subtotal: 1797,
    shipping: 0,
    total: 1797,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "card",
    shippingAddress: {
      street: "Roma Norte 654",
      city: "Ciudad de México",
      state: "CDMX",
      postalCode: "06700",
      country: "México"
    },
    cancelledAt: new Date("2025-01-24").toISOString(),
    cancelReason: "Cliente cambió de opinión",
    createdAt: new Date("2025-01-23").toISOString(),
    updatedAt: new Date("2025-01-24").toISOString()
  }
];

// Función para obtener estadísticas
export const getOrderStats = () => {
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === "pending").length,
    shippedOrders: orders.filter(o => o.status === "shipped").length,
    deliveredOrders: orders.filter(o => o.status === "delivered").length,
    cancelledOrders: orders.filter(o => o.status === "cancelled").length,
  };
  
  return stats;
};