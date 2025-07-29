"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import toast from "react-hot-toast";
import apiClient from "@/libs/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotals, clearCart } = useCart();
  const { subtotal, shipping, total } = getCartTotals();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [formData, setFormData] = useState({
    // Datos personales
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Dirección de envío
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    references: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación básica
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'number', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para la orden
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood || "",
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          references: formData.references || ""
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          image: item.image
        })),
        paymentMethod: paymentMethod
      };

      // Crear la orden
      const { data } = await apiClient.post('/api/orders', orderData);
      
      // Si es pago con tarjeta, aquí se procesaría con Stripe
      if (paymentMethod === 'stripe') {
        // Simulación de pago exitoso
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('¡Pago procesado con éxito!');
      } else {
        toast.success('¡Pedido realizado! Paga al recibir tu pedido.');
      }
      
      // Guardar número de orden para la página de confirmación
      localStorage.setItem('softer-last-order', JSON.stringify({
        orderNumber: data.orderNumber,
        orderId: data.orderId
      }));
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a confirmación
      router.push('/confirmacion');
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 opacity-30">
              <svg className="w-full h-full text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a1 1 0 00-1 1v11a3 3 0 003 3h10a3 3 0 003-3V8a1 1 0 00-1-1zM10 6a2 2 0 014 0v1h-4V6zm8 13a1 1 0 01-1 1H7a1 1 0 01-1-1V9h2v1a1 1 0 002 0V9h4v1a1 1 0 002 0V9h2v10z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
            <Link href="/catalogo" className="btn btn-primary">
              Ir al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient">Finalizar Compra</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario de checkout */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Datos personales */}
                <div className="glass-effect p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nombre *</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Apellido *</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Teléfono *</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="55 1234 5678"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dirección de envío */}
                <div className="glass-effect p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Calle *</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Número *</span>
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Colonia</span>
                      </label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        className="input input-bordered"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Ciudad *</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Estado *</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Código Postal *</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text">Referencias</span>
                      </label>
                      <textarea
                        name="references"
                        value={formData.references}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered"
                        rows="2"
                        placeholder="Entre calles, color de casa, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Información de pago */}
                <div className="glass-effect p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
                  
                  <div className="space-y-4">
                    {/* Opción de pago con tarjeta */}
                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-base-200"
                      style={{ borderColor: paymentMethod === 'stripe' ? '#e91e63' : 'transparent' }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="radio radio-primary"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Pago con Tarjeta
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Pago seguro procesado por Stripe. Aceptamos todas las tarjetas.
                        </p>
                        {paymentMethod === 'stripe' && (
                          <div className="mt-4 p-4 bg-base-200 rounded-lg">
                            <p className="text-sm text-gray-600">
                              En producción, aquí aparecería el formulario seguro de Stripe
                            </p>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Opción de pago contra entrega */}
                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-base-200"
                      style={{ borderColor: paymentMethod === 'cash' ? '#e91e63' : 'transparent' }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="radio radio-primary"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Pago Contra Entrega
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Paga en efectivo cuando recibas tu pedido
                        </p>
                        {paymentMethod === 'cash' && (
                          <div className="mt-3 alert alert-warning">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm">Se cobrará una comisión adicional de $50 por pago contra entrega</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-lg softer-gradient text-white border-0 hover-lift"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Pagar ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`
                  )}
                </button>
              </form>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="glass-effect p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.cartKey} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.selectedSize} / {item.selectedColor} x {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-pink-600">
                          ${(item.price * item.quantity).toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="divider"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">GRATIS</span>
                      ) : (
                        `$${shipping}`
                      )}
                    </span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-gradient">${total.toLocaleString('es-MX')}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs text-gray-600">
                  <p>✓ Envío seguro y rastreado</p>
                  <p>✓ Pago 100% seguro con Stripe</p>
                  <p>✓ Garantía de satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}