// Structured data for product pages
export const getProductStructuredData = (product) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => img.url) || [product.image],
    "description": product.description,
    "sku": product._id || product.id,
    "brand": {
      "@type": "Brand",
      "name": "Softer"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://softer.mx/producto/${product.slug || product._id}`,
      "priceCurrency": "MXN",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Softer"
      }
    },
    "category": product.category || "Lencería",
    "material": product.material || "Tejido premium",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
};

// Render structured data script tag
export const renderProductSchema = (product) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getProductStructuredData(product))
      }}
    />
  );
};