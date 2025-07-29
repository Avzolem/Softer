import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Solo procesar rutas de admin
  if (pathname.startsWith("/admin")) {
    // Obtener el token JWT
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    const isAuth = !!token;
    const isAdmin = token?.role === "admin";

    if (!isAuth) {
      // Redirigir a login personalizado si no está autenticado
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      // Redirigir a home si no es admin
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Solo proteger rutas admin
    "/admin/((?!login).*)",
  ],
};