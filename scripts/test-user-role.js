import mongoose from "mongoose";
// import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkUserRoles() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Buscar todos los usuarios directamente
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log("👥 Usuarios encontrados:", users.length);
    console.log("========================\n");
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Sin nombre'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role || 'user'} ${user.role === 'admin' ? '👑' : ''}◀`);
      console.log(`   Creado: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}`);
      console.log(`   ID: ${user._id}`);
      console.log('---');
    });
    
    // Buscar administradores
    const admins = users.filter(u => u.role === 'admin');
    console.log(`\n👑 Total de administradores: ${admins.length}`);
    
    if (admins.length === 0) {
      console.log("\n⚠️ No hay usuarios administradores.");
      console.log("Para hacer a un usuario administrador, actualiza su rol a 'admin' en la base de datos.");
      
      // Si hay usuarios, sugerir hacer admin al primero
      if (users.length > 0) {
        console.log("\nPara hacer administrador al primer usuario, ejecuta:");
        console.log(`node scripts/make-admin.js ${users[0].email}`);
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

checkUserRoles();