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
    // Buscar todos los usuarios directamente
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    users.forEach((user, index) => {
      : 'N/A'}`);
      });
    
    // Buscar administradores
    const admins = users.filter(u => u.role === 'admin');
    if (admins.length === 0) {
      // Si hay usuarios, sugerir hacer admin al primero
      if (users.length > 0) {
        }
    }

  } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

checkUserRoles();