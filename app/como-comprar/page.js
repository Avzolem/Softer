"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Explora Nuestro Catálogo",
    description: "Navega por nuestra colección exclusiva de lencería. Utiliza los filtros para encontrar tu estilo perfecto: por categoría, talla o color. Cada pieza está diseñada para realzar tu belleza natural.",
    image: "/images/products/softer.mx_1668271582_2969999758907443127_35563853848.webp",
    alt: "Catálogo de lencería Softer"
  },
  {
    number: "02", 
    title: "Añade al Carrito",
    description: "Selecciona tu talla y color preferido. Añade las piezas que más te gusten a tu carrito de compras. No hay límite mínimo de compra, pero aprovecha el envío gratis en pedidos mayores a $999.",
    image: "/images/products/softer.mx_1664142934_2935366146748992419_35563853848.webp",
    alt: "Selección de productos Softer"
  },
  {
    number: "03",
    title: "Completa tu Pedido",
    description: "Ingresa tus datos de envío y realiza tu pago de forma segura. Aceptamos todas las tarjetas de crédito y débito. Tu información está protegida con encriptación SSL.",
    image: "/images/products/softer.mx_1653892487_2849379165562149188_35563853848.webp",
    alt: "Proceso de pago seguro"
  },
  {
    number: "04",
    title: "Recibe en Casa",
    description: "Tu pedido llegará en un empaque discreto y elegante en 1-2 semanas. Incluimos una guía de cuidados para que tus piezas se mantengan perfectas por más tiempo.",
    image: "/images/products/softer.mx_1644277198_2768720275276009026_35563853848.webp",
    alt: "Empaque elegante Softer"
  }
];

export default function ComoComprarPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-light apple-heading text-black mb-6 tracking-tight">
              ¿CÓMO COMPRAR?
            </h1>
            <p className="text-lg md:text-xl apple-body text-gray-700 max-w-2xl mx-auto">
              Comprar en Softer es fácil y seguro. Sigue estos simples pasos para recibir 
              tus piezas favoritas directamente en tu hogar.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="space-y-32">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-6xl font-light text-gray-300 apple-heading">
                        {step.number}
                      </span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light apple-heading text-black tracking-tight">
                      {step.number === "01" ? (
                        <>
                          Explora Nuestro{" "}
                          <Link 
                            href="/catalogo" 
                            className="inline-flex items-center gap-1 text-black underline underline-offset-4 hover:text-gray-700 transition-colors"
                          >
                            Catálogo
                            <svg 
                              className="w-5 h-5 animate-bounce-horizontal" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17 8l4 4m0 0l-4 4m4-4H3" 
                              />
                            </svg>
                          </Link>
                        </>
                      ) : (
                        step.title
                      )}
                    </h2>
                    <p className="text-lg apple-body text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className={`relative aspect-[4/3] overflow-hidden ${
                    index % 2 === 1 ? 'lg:col-start-1' : ''
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out transform hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light apple-heading mb-6 tracking-tight">
              ¿Lista para empezar?
            </h2>
            <p className="text-lg apple-body mb-8 opacity-90 max-w-2xl mx-auto">
              Descubre piezas que celebran tu feminidad y realzan tu confianza. 
              Cada diseño está pensado para hacerte sentir única y especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/catalogo"
                className="px-8 py-3 bg-white text-black hover:bg-gray-100 font-medium tracking-tight uppercase text-sm transition-all duration-200 apple-body"
              >
                Ver Catálogo
              </a>
              <a
                href="https://wa.me/5215591684946?text=Hola!%20Tengo%20una%20pregunta%20sobre%20mi%20pedido"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-transparent text-white border border-white hover:bg-white hover:text-black font-medium tracking-tight uppercase text-sm transition-all duration-200 apple-body"
              >
                ¿Necesitas Ayuda?
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-light apple-heading text-black text-center mb-12 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-medium apple-heading text-black">
                  ¿Cuánto tarda mi pedido?
                </h3>
                <p className="apple-body text-gray-700">
                  Los pedidos se entregan entre 1 a 2 semanas después de confirmar tu compra. 
                  Te enviaremos un número de seguimiento para que puedas rastrear tu paquete.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium apple-heading text-black">
                  ¿Los envíos son discretos?
                </h3>
                <p className="apple-body text-gray-700">
                  Sí, todos nuestros envíos se realizan en empaques neutros y discretos. 
                  Tu privacidad es nuestra prioridad.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium apple-heading text-black">
                  ¿Qué métodos de pago aceptan?
                </h3>
                <p className="apple-body text-gray-700">
                  Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express) y pagos en OXXO. 
                  Todos los pagos son procesados de forma segura a través de Stripe.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium apple-heading text-black">
                  ¿Puedo cambiar o devolver mi pedido?
                </h3>
                <p className="apple-body text-gray-700">
                  Por razones de higiene, no aceptamos devoluciones en lencería. 
                  Sin embargo, si hay algún defecto de fábrica, contáctanos dentro de las primeras 48 horas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}