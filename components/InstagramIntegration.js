// Componente para integrar imágenes reales del Instagram de Softer
// Este componente te permitirá agregar fácilmente las imágenes reales

const InstagramIntegration = () => {
  // URLs de imágenes reales del Instagram de Softer
  // INSTRUCCIONES: Reemplaza estas URLs con las imágenes reales del Instagram
  const instagramImages = {
    // Logo de la marca
    logo: "/images/softer-logo.png", // Agregar logo real aquí
    
    // Imágenes de productos (reemplazar con URLs reales)
    products: {
      elegance: "/images/products/conjunto-elegance.jpg",
      delicate: "/images/products/brasier-delicate.jpg",
      glamour: "/images/products/set-glamour.jpg",
      seduction: "/images/products/body-seduction.jpg",
      cotton: "/images/products/conjunto-cotton.jpg",
      romantic: "/images/products/brasier-romantic.jpg",
      mesh: "/images/products/conjunto-mesh.jpg",
      pack: "/images/products/pack-confort.jpg"
    },
    
    // Imágenes de ambiente y lifestyle
    lifestyle: {
      hero: "/images/lifestyle/hero-main.jpg",
      about: "/images/lifestyle/about-section.jpg",
      banner1: "/images/lifestyle/banner-1.jpg",
      banner2: "/images/lifestyle/banner-2.jpg"
    }
  };

  return {
    // Función para obtener imagen de producto
    getProductImage: (productId) => {
      const imageMap = {
        1: instagramImages.products.elegance,
        2: instagramImages.products.delicate,
        3: instagramImages.products.glamour,
        4: instagramImages.products.seduction,
        5: instagramImages.products.cotton,
        6: instagramImages.products.romantic,
        7: instagramImages.products.mesh,
        8: instagramImages.products.pack
      };
      return imageMap[productId] || null;
    },
    
    // Función para obtener logo
    getLogo: () => instagramImages.logo,
    
    // Función para obtener imágenes de lifestyle
    getLifestyleImage: (type) => instagramImages.lifestyle[type] || null,
    
    // Todas las imágenes
    images: instagramImages
  };
};

// Instrucciones para agregar imágenes reales:
// 1. Descarga las imágenes del Instagram @softer.mx
// 2. Guárdalas en la carpeta /public/images/ con la estructura mostrada arriba
// 3. Actualiza las URLs en el objeto instagramImages
// 4. Las imágenes se mostrarán automáticamente en el sitio

export default InstagramIntegration;