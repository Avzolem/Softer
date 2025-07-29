import { redirect } from "next/navigation";

// Esta ruta no se usa en el sistema actual
// Solo se usa /admin/dashboard para administración
export default async function LayoutPrivate({ children }) {
  // Redirigir siempre al home ya que no hay dashboard de usuarios
  redirect("/");
}