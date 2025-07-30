import fetch from 'node-fetch';

async function testAdminLogin() {
  const baseUrl = 'http://localhost:3002';
  
  try {
    // 1. Intentar login
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
    // Obtener cookies
    const cookies = loginResponse.headers.get('set-cookie');
    if (!loginResponse.ok) {
      return;
    }
    
    // 2. Verificar acceso al dashboard
    const dashboardResponse = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: {
        'Cookie': cookies || ''
      },
      redirect: 'manual'
    });
    
    );
    
    if (dashboardResponse.status === 200) {
      } else if (dashboardResponse.status === 302 || dashboardResponse.status === 307) {
      } else {
      }
    
    // 3. Verificar API check
    const checkResponse = await fetch(`${baseUrl}/api/admin/auth/check`, {
      headers: {
        'Cookie': cookies || ''
      }
    });
    
    const checkData = await checkResponse.json();
    } catch (error) {
    }
}

testAdminLogin();