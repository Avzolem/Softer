// Middleware desactivado - la protección se maneja en el layout del dashboard
export function middleware(request) {
  // No hacer nada, dejar que el layout maneje la autenticación
  return;
}

export const config = {
  matcher: [], // No interceptar ninguna ruta
};