# Guía de Deployment en Vercel

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en producción, debes configurar las siguientes variables de entorno en Vercel:

### 1. NextAuth
- **NEXTAUTH_URL**: La URL completa de tu sitio en producción
  - Ejemplo: `https://softer.vercel.app` o `https://softer.mx`
  - NO incluyas la barra diagonal al final
  
- **NEXTAUTH_SECRET**: String secreto para encriptar las sesiones
  - Genera uno con: `openssl rand -base64 32`
  - Ejemplo: `AbCdEfGhIjKlMnOpQrStUvWxYz1234567890+/=`

### 2. Base de Datos
- **MONGODB_URI**: String de conexión a MongoDB
  - Ejemplo: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/softer?retryWrites=true&w=majority`

### 3. Cloudinary
- **CLOUDINARY_CLOUD_NAME**: Tu cloud name de Cloudinary
  - Ejemplo: `dnfihxtxr`
  
- **CLOUDINARY_API_KEY**: Tu API key
  - Ejemplo: `896354562541775`
  
- **CLOUDINARY_API_SECRET**: Tu API secret
  - Ejemplo: `ACbRJW1EhX1azMMwEkKjUbpieS0`

### 4. Credenciales de Admin
- **ADMIN_USERNAME**: `solesuave`
- **ADMIN_PASSWORD**: `kipo`

## Pasos para configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Click en "Settings"
3. Click en "Environment Variables"
4. Agrega cada variable con su valor correspondiente
5. Asegúrate de que estén disponibles para "Production", "Preview" y "Development"
6. Click en "Save"
7. Redeploy tu aplicación para que tome los cambios

## Verificación

Después de configurar las variables y redesplegar:

1. **Prueba el login de admin**: Ve a `/admin/login` e intenta iniciar sesión
2. **Verifica el dashboard**: Después del login, deberías poder ver `/admin/dashboard`
3. **Revisa los productos**: Tanto en el catálogo público como en el admin
4. **Prueba subir imágenes**: Crea o edita un producto y sube imágenes

## Solución de problemas comunes

### "Error al obtener productos" en el catálogo
- Verifica que MONGODB_URI esté correctamente configurado
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas

### No puedes iniciar sesión en admin
- Verifica NEXTAUTH_URL (debe ser la URL exacta sin barra final)
- Verifica NEXTAUTH_SECRET
- Verifica ADMIN_USERNAME y ADMIN_PASSWORD

### Las imágenes no se suben
- Verifica las credenciales de Cloudinary
- Asegúrate de que los valores no tengan espacios extras

### El dashboard muestra 0 en todos los contadores
- Verifica la conexión a MongoDB
- Revisa los logs en Vercel para ver errores específicos