import { auth } from "@/auth";

export default auth((req) => {
  // req.auth contiene la sesión del usuario
  const isLoggedIn = !!req.auth;
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin/dashboard");
  
  if (isAdminPage && !isLoggedIn) {
    const newUrl = new URL("/admin/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};