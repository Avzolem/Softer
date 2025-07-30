import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Checkout - Softer | Finalizar Compra",
  description: "Completa tu compra de manera segura. Envío a todo México. Pago seguro garantizado.",
  canonicalUrlRelative: "/checkout",
  robots: "noindex, nofollow" // Checkout pages shouldn't be indexed
});

export default function CheckoutLayout({ children }) {
  return children;
}