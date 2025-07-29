"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import apiClient from "@/libs/api";

export default function ConfirmacionPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      // Obtener la orden del localStorage
      const savedOrderData = localStorage.getItem('softer-last-order');
      if (!savedOrderData) {
        router.push('/catalogo');
        return;
      }

      const { orderNumber, orderId } = JSON.parse(savedOrderData);
      
      // Obtener la orden completa de la API
      const { data } = await apiClient.get(`/api/orders?id=${orderId}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/catalogo');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-pink-500"></div>
        </main>
        <Footer />
      </>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Éxito */}
          <div className="text-center mb-8 fade-in">
            <div className="w-24 h-24 mx-auto mb-4 text-green-500">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Gracias por tu compra!</h1>
            <p className="text-lg text-gray-600">Tu pedido ha sido confirmado</p>
            <p className="text-sm text-gray-500 mt-2">
              Orden {order.orderNumber}
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Detalles del pedido */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Información de envío */}
            <div className="glass-effect p-6 rounded-lg slide-up">
              <h2 className="text-xl font-semibold mb-4 text-gradient">
                Información de Envío
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Nombre:</span>{' '}
                  {order.customer.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{' '}
                  {order.customer.email}
                </p>
                <p>
                  <span className="font-semibold">Teléfono:</span>{' '}
                  {order.customer.phone}
                </p>
                <div className="divider my-2"></div>
                <p>
                  <span className="font-semibold">Dirección:</span><br/>
                  {order.shippingAddress.street} {order.shippingAddress.number}<br/>
                  {order.shippingAddress.neighborhood && `${order.shippingAddress.neighborhood}, `}
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br/>
                  C.P. {order.shippingAddress.zipCode}
                </p>
                {order.shippingAddress.references && (
                  <p className="text-gray-600 italic">
                    Referencias: {order.shippingAddress.references}
                  </p>
                )}
              </div>
              
              <div className="divider"></div>
              
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Método de pago:</span>{' '}
                  {order.paymentMethod === 'stripe' ? 'Tarjeta' : 'Efectivo contra entrega'}
                </p>
                <p>
                  <span className="font-semibold">Estado del pago:</span>{' '}
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </p>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="glass-effect p-6 rounded-lg slide-up" style={{animationDelay: '0.1s'}}>
              <h2 className="text-xl font-semibold mb-4 text-gradient">
                Resumen del Pedido
              </h2>
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
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
                        {item.size} / {item.color} x {item.quantity}
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
                  <span>${order.subtotal.toLocaleString('es-MX')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {order.shippingCost === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${order.shippingCost}`
                    )}
                  </span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gradient">
                    ${order.total.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="glass-effect p-6 rounded-lg mb-8 text-center">
            <h3 className="text-lg font-semibold mb-3">¿Qué sigue?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto text-pink-500">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold">Confirmación por email</h4>
                <p className="text-gray-600">
                  Recibirás un correo con los detalles de tu pedido
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto text-pink-500">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold">Preparación del envío</h4>
                <p className="text-gray-600">
                  Tu pedido será preparado en 1-2 días hábiles
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto text-pink-500">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h4 className="font-semibold">Entrega</h4>
                <p className="text-gray-600">
                  Recibirás tu pedido en 3-5 días hábiles
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/catalogo" 
              className="btn btn-outline border-pink-500 text-pink-600 hover:bg-pink-50"
            >
              Seguir comprando
            </Link>
            <a
              href="https://wa.me/5215512345678"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-green-500 hover:bg-green-600 text-white border-0"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.700"/>
              </svg>
              Contactar por WhatsApp
            </a>
            <Link 
              href="/" 
              className="btn softer-gradient text-white border-0"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}