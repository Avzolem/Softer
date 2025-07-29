import { LavaLamp } from "@/components/ui/fluid-blob";
import Link from "next/link";

export default function FluidBlobHero() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative">
      <LavaLamp/>
      <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-wider mix-blend-exclusion text-white whitespace-nowrap" style={{fontFamily: '"Times New Roman", "Times", serif', fontWeight: '300', letterSpacing: '0.02em'}}>
        SOFTER
      </h1>
      <p className="text-base md:text-lg text-center text-white mix-blend-exclusion max-w-lg leading-relaxed mb-12 apple-body">
        Elegancia esencial. Diseño atemporal.
      </p>
      
      <div className="flex flex-row gap-8 justify-center items-center">
        <Link href="#novedades">
          <button className="text-base md:text-lg text-center text-white mix-blend-exclusion leading-relaxed apple-body hover:opacity-70 transition-all duration-300 border border-white/50 hover:border-white px-6 py-2 rounded-none">
            Explorar Colección
          </button>
        </Link>
        
        <span className="text-white mix-blend-exclusion opacity-50">·</span>
        
        <Link href="/catalogo">
          <button className="text-base md:text-lg text-center text-white mix-blend-exclusion leading-relaxed apple-body hover:opacity-70 transition-all duration-300 border border-white/50 hover:border-white px-6 py-2 rounded-none">
            Ver Catálogo
          </button>
        </Link>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white/60 mix-blend-exclusion" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}