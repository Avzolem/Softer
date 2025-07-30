"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FluidBlobHero from "@/components/FluidBlobHero";
import { useProducts } from "@/hooks/useProducts";

// Componente para la sección de novedades
const NovedadesSection = () => {
  const { products: featuredProducts, loading } = useProducts({ featured: true });
  
  return (
    <section id="novedades" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 fade-in">
          <h2 className="text-5xl font-light apple-heading text-black mb-6 tracking-tight">NUEVAS PIEZAS</h2>
          <p className="text-base apple-body text-gray-800 max-w-lg mx-auto font-light">
            Diseños esenciales que definen la elegancia contemporánea
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg text-black"></span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <div key={product.id || product._id} className="slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <ProductCard product={product} priority={index < 3} redirectToCatalog={true} />
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <Link 
            href="/catalogo" 
            className="px-12 py-4 bg-black text-white hover:bg-gray-800 font-medium tracking-tight uppercase text-sm transition-all duration-200"
          >
            Ver Colección Completa
          </Link>
        </div>
      </div>
    </section>
  );
};

// Componente para la sección about
const AboutSection = () => (
  <section id="about" className="py-24 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="fade-in">
          <h2 className="text-5xl font-light apple-heading text-black mb-8 tracking-tight">
            ABRAZA EL HEDONISMO QUE LLEVAS DENTRO
          </h2>
          <p className="text-base apple-body text-gray-700 mb-6 font-light leading-relaxed">
            Despierta tus sentidos y libera tu sensualidad más profunda. 
            Cada pieza abraza las curvas naturales con delicadeza y elegancia.
          </p>
          <p className="text-base apple-body text-gray-700 mb-10 font-light leading-relaxed">
            Lencería que inspira confianza, realza la belleza natural y despierta la sensualidad interior.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.instagram.com/softer.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 font-medium tracking-tight uppercase text-sm transition-all duration-200"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/5215591684946"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black border border-black hover:bg-black hover:text-white font-medium tracking-tight uppercase text-sm transition-all duration-200"
            >
              Contacto
            </a>
          </div>
        </div>
        <div className="slide-up">
          <div className="bg-white border border-gray-200 p-2">
            <div className="aspect-square mb-6 overflow-hidden">
              <img 
                src="/images/products/softer.mx_1668272626_2970008508670381662_35563853848.webp" 
                alt="Softer - Lencería elegante"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
            </div>
            <div className="text-center px-4 pb-4">
              <h3 className="text-lg font-light apple-heading text-black mb-2 tracking-tight uppercase">
                Calidad Esencial
              </h3>
              <p className="text-sm apple-body text-gray-600 font-light">
                Materiales selectos, diseño atemporal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Botón flotante de WhatsApp
const WhatsAppFloat = () => (
  <div className="fixed bottom-6 right-6 z-50">
    <a
      href="https://wa.me/5215591684946"
      target="_blank"
      rel="noopener noreferrer"
      className="w-14 h-14 bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
      title="Contáctanos por WhatsApp"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.700"/>
      </svg>
    </a>
  </div>
);

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <FluidBlobHero />
        <NovedadesSection />
        <AboutSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}