import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const email = process.argv[2];

if (!email) {
  console.log("❌ Por favor proporciona un email");
  console.log("Uso: node scripts/make-admin.js usuario@ejemplo.com");
  process.exit(1);
}

async function makeAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Buscar usuario por email
    const user = await mongoose.connection.db.collection('users').findOne({ email });
    
    if (!user) {
      console.log("❌ Usuario no encontrado con email:", email);
      console.log("\nUsuarios disponibles:");
      const allUsers = await mongoose.connection.db.collection('users').find({}).toArray();
      allUsers.forEach(u => {
        console.log(`- ${u.email} (${u.role || 'user'})`);
      });
      return;
    }
    
    console.log("👤 Usuario encontrado:");
    console.log("   Nombre:", user.name || 'Sin nombre');
    console.log("   Email:", user.email);
    console.log("   Rol actual:", user.role || 'user');
    
    // Actualizar rol a admin
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log("\n✅ Usuario actualizado exitosamente");
      console.log("👑 El usuario ahora es administrador");
    } else {
      console.log("\n⚠️ El usuario ya era administrador");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

makeAdmin();