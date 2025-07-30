import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Softer - Lencería Premium | Elegancia y Confort",
  description: "Descubre la mejor lencería premium en México. Conjuntos, brasieres y bodies de alta calidad. Diseños exclusivos que combinan elegancia y confort.",
  keywords: ["lencería", "ropa interior", "lencería premium", "softer", "méxico", "conjuntos", "brasieres"],
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Softer - Lencería Premium en México",
    description: "Explora nuestra colección de lencería de alta calidad. Diseños únicos que fusionan elegancia, confort y estilo.",
  }
});

export default function HomeLayout({ children }) {
  return children;
}