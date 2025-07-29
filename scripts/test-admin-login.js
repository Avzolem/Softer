import fetch from 'node-fetch';

async function testAdminLogin() {
  const baseUrl = 'http://localhost:3002';
  
  console.log("🔐 Probando login de admin...\n");
  
  try {
    // 1. Intentar login
    console.log("1. Enviando credenciales...");
    const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'solesuave',
        password: 'kipo'
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log("   Respuesta:", loginData);
    
    // Obtener cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log("   Cookies:", cookies ? "✓ Recibidas" : "✗ No recibidas");
    
    if (!loginResponse.ok) {
      console.error("❌ Error en login:", loginData.error);
      return;
    }
    
    console.log("✅ Login exitoso\n");
    
    // 2. Verificar acceso al dashboard
    console.log("2. Verificando acceso al dashboard...");
    const dashboardResponse = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: {
        'Cookie': cookies || ''
      },
      redirect: 'manual'
    });
    
    console.log("   Status:", dashboardResponse.status);
    console.log("   Location:", dashboardResponse.headers.get('location'));
    
    if (dashboardResponse.status === 200) {
      console.log("✅ Acceso al dashboard permitido");
    } else if (dashboardResponse.status === 302 || dashboardResponse.status === 307) {
      console.log("⚠️  Redirección detectada");
    } else {
      console.log("❌ No se pudo acceder al dashboard");
    }
    
    // 3. Verificar API check
    console.log("\n3. Verificando API check...");
    const checkResponse = await fetch(`${baseUrl}/api/admin/auth/check`, {
      headers: {
        'Cookie': cookies || ''
      }
    });
    
    const checkData = await checkResponse.json();
    console.log("   Respuesta:", checkData);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAdminLogin();