"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

// Componente del Timer
const SaleTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return (
      <div className="text-center py-16">
        <h2 className="text-4xl md:text-6xl font-light apple-heading text-black tracking-tight">
          Temporada de Ofertas terminada
        </h2>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <h2 className="text-2xl md:text-3xl font-light apple-heading text-black mb-8 tracking-tight">
        OFERTAS POR TIEMPO LIMITADO
      </h2>
      <div className="flex justify-center gap-4 md:gap-8">
        <div className="text-center">
          <div className="text-5xl md:text-7xl font-light apple-heading text-black">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base apple-body text-gray-600 mt-2">
            {timeLeft.days === 1 ? 'DÍA' : 'DÍAS'}
          </div>
        </div>
        <div className="text-5xl md:text-7xl font-light apple-heading text-black">:</div>
        <div className="text-center">
          <div className="text-5xl md:text-7xl font-light apple-heading text-black">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base apple-body text-gray-600 mt-2">
            {timeLeft.hours === 1 ? 'HORA' : 'HORAS'}
          </div>
        </div>
        <div className="text-5xl md:text-7xl font-light apple-heading text-black">:</div>
        <div className="text-center">
          <div className="text-5xl md:text-7xl font-light apple-heading text-black">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base apple-body text-gray-600 mt-2">
            {timeLeft.minutes === 1 ? 'MINUTO' : 'MINUTOS'}
          </div>
        </div>
        <div className="text-5xl md:text-7xl font-light apple-heading text-black">:</div>
        <div className="text-center">
          <div className="text-5xl md:text-7xl font-light apple-heading text-black">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base apple-body text-gray-600 mt-2">
            {timeLeft.seconds === 1 ? 'SEGUNDO' : 'SEGUNDOS'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OfertasPage() {
  const [timer, setTimer] = useState(null);
  const [loadingTimer, setLoadingTimer] = useState(true);
  
  // Obtener productos en oferta
  const { products, loading } = useProducts({ onSale: true });

  // Obtener configuración del timer
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const response = await fetch('/api/sale-timer');
        if (response.ok) {
          const data = await response.json();
          setTimer(data);
        }
      } catch (error) {
        console.error('Error fetching timer:', error);
      } finally {
        setLoadingTimer(false);
      }
    };

    fetchTimer();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Timer Section */}
        <section className="bg-gray-50 border-b">
          <div className="container mx-auto px-6">
            {loadingTimer ? (
              <div className="flex justify-center items-center py-16">
                <span className="loading loading-spinner loading-lg text-black"></span>
              </div>
            ) : timer && timer.isActive ? (
              <SaleTimer endDate={timer.endDate} />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-4xl md:text-6xl font-light apple-heading text-black tracking-tight">
                  OFERTAS ESPECIALES
                </h2>
              </div>
            )}
          </div>
        </section>

        {/* Productos en oferta */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-black"></span>
              </div>
            ) : products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div key={product.id || product._id} className="fade-in">
                    <ProductCard 
                      product={product} 
                      priority={index < 4}
                      showSaleTag={true}
                      applyGrayscale={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <h3 className="text-2xl font-light apple-heading text-gray-600 mb-4">
                  No hay productos en oferta en este momento
                </h3>
                <p className="text-base apple-body text-gray-500">
                  Vuelve pronto para descubrir nuevas ofertas especiales
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}