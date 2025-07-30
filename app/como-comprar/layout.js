import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Cómo Comprar - Softer | Guía de Compra",
  description: "Aprende cómo realizar tu compra en Softer. Guía paso a paso para adquirir nuestros productos de lencería premium.",
  keywords: ["como comprar", "guía de compra", "proceso de compra", "softer", "ayuda"],
  canonicalUrlRelative: "/como-comprar",
});

export default function ComoComprarLayout({ children }) {
  return children;
}