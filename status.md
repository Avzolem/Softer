# Status del Proyecto — Softer

## Estado actual: En desarrollo

## Última actualización: 2026-02-11

---

## Seguridad (Completado)

Se implementó una auditoría completa de seguridad con las siguientes correcciones:

### Autenticación admin
- Creado helper reutilizable `libs/admin-auth.js` con función `requireAdmin()`
- Todas las rutas `/api/admin/*` protegidas con verificación de sesión + rol admin
- Middleware reactivado como capa adicional de defensa en `/api/admin/:path*`
- Endpoint `/api/cloudinary/upload` protegido (solo admin)

### Protección de datos
- Endpoint público `/api/orders` GET limitado a campos mínimos de confirmación (sin PII: teléfono, dirección)
- Verificación de precios server-side en creación de órdenes (usa `product.price` de DB, no del cliente)
- Whitelist de campos en actualización de usuarios: solo `name`, `email`, `role`

### Hardening
- Security headers agregados: X-Frame-Options, HSTS, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- Endpoints de debug eliminados: `/api/test-env`, `/api/test-timer`
- Console.logs de producción eliminados del dashboard API y login
- Mensajes de error genéricos (sin exponer `error.message` ni detalles de infraestructura)

---

## Funcionalidades implementadas

- Tienda e-commerce con catálogo de productos
- Carrito de compras con zoom de imágenes
- Sistema de órdenes (contra entrega y Stripe)
- Panel de administración (productos, órdenes, usuarios, timer de ofertas)
- Login admin con credenciales
- Upload de imágenes a Cloudinary
- Sistema de ofertas con timer configurable
