# Softer - E-commerce de Lencería Premium

## 🎯 Descripción del Proyecto

Softer es una plataforma de e-commerce especializada en lencería premium, construida con Next.js 14 y MongoDB. El proyecto ofrece una experiencia de compra elegante y minimalista con un catálogo de productos, carrito de compras y panel de administración completo.

## 🚀 Características Principales

### Para Clientes
- **Catálogo de Productos**: Navegación por categorías (Conjuntos, Brasieres, Bodies, etc.)
- **Filtros Avanzados**: Por precio, categoría y búsqueda
- **Carrito de Compras**: Gestión completa con selección de tallas y colores
- **Checkout Simplificado**: Proceso de compra sin fricción
- **Diseño Responsive**: Optimizado para móviles y desktop
- **Imágenes Optimizadas**: Lazy loading y formato WebP

### Para Administradores
- **Panel de Administración**: Gestión completa de productos, órdenes y usuarios
- **Gestión de Productos**: CRUD completo con múltiples imágenes
- **Gestión de Órdenes**: Visualización y actualización de estados
- **Gestión de Usuarios**: Control de roles y permisos
- **Upload de Imágenes**: Integración con Cloudinary

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: API Routes de Next.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: NextAuth.js con roles personalizados
- **Imágenes**: Cloudinary para almacenamiento
- **Deployment**: Optimizado para Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- MongoDB (local o Atlas)
- Cuenta de Cloudinary
- Variables de entorno configuradas

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/softer.git
cd softer
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/softer

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Admin inicial
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password-seguro
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
softer/
├── app/                    # App Router de Next.js
│   ├── (private)/         # Rutas protegidas
│   │   └── admin/         # Panel de administración
│   ├── api/               # API Routes
│   ├── catalogo/          # Página del catálogo
│   ├── checkout/          # Proceso de compra
│   └── layout.js          # Layout principal
├── components/            # Componentes React
│   ├── admin/            # Componentes del admin
│   ├── ProductCard.js    # Tarjeta de producto
│   └── Cart.js           # Carrito de compras
├── contexts/             # Context API
│   └── CartContext.js    # Estado del carrito
├── libs/                 # Utilidades
│   ├── mongoose.js       # Conexión a MongoDB
│   └── cloudinary.js     # Config de Cloudinary
├── models/               # Modelos de Mongoose
│   ├── Product.js        # Modelo de producto
│   ├── Order.js          # Modelo de orden
│   └── User.js           # Modelo de usuario
└── public/               # Archivos estáticos
    └── images/           # Imágenes del sitio
```

## 🔑 Funcionalidades Clave

### Sistema de Autenticación
- Login con username/password para administradores
- Protección de rutas con middleware
- Roles: admin, editor, moderator, user

### Gestión de Productos
- CRUD completo
- Múltiples imágenes por producto
- Categorización
- Control de stock
- Precios con descuento

### Sistema de Órdenes
- Captura de información del cliente
- Estados: pending, processing, shipped, delivered, cancelled
- Historial completo
- Detalles de productos ordenados

### Carrito de Compras
- Persistencia en localStorage
- Selección de tallas y colores
- Actualización en tiempo real
- Cálculo automático de totales

## 🚀 Deployment

### Vercel (Recomendado)

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configurar variables de entorno en el dashboard de Vercel

### Variables de Producción Necesarias
- `MONGODB_URI`: URI de MongoDB Atlas
- `NEXTAUTH_URL`: URL de producción
- `NEXTAUTH_SECRET`: Secret seguro generado
- Credenciales de Cloudinary

## 🧪 Testing

### Scripts de Prueba Disponibles
```bash
# Verificar catálogo
node scripts/verify-catalog.js

# Verificar órdenes
node scripts/verify-orders.js

# Crear usuario admin
node scripts/make-admin.js
```

## 📈 Optimizaciones Implementadas

- **Rendimiento**: 
  - Lazy loading de imágenes con next/image
  - Componentes memoizados
  - Virtual scrolling en catálogo
  
- **SEO**:
  - Meta tags dinámicos
  - Structured data para productos
  - Sitemap automático
  - Alt texts descriptivos

- **Seguridad**:
  - Autenticación con NextAuth
  - Validación de roles
  - Sanitización de inputs
  - HTTPS en producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es privado y propietario de Softer.

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

Desarrollado con ❤️ para Softer