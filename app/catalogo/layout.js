import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Catálogo - Softer | Lencería de Alta Calidad",
  description: "Explora nuestra colección completa de lencería premium. Conjuntos, brasieres, bodies y más. Diseños exclusivos con la mejor calidad y confort.",
  keywords: ["lencería", "ropa interior", "conjuntos", "brasieres", "bodies", "softer", "moda íntima"],
  canonicalUrlRelative: "/catalogo",
  openGraph: {
    title: "Catálogo Softer - Lencería Premium",
    description: "Descubre nuestra colección de lencería de alta calidad. Diseños elegantes y cómodos para cada ocasión.",
  }
});

export default function CatalogoLayout({ children }) {
  return children;
}