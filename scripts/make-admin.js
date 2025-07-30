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
  process.exit(1);
}

async function makeAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    // Buscar usuario por email
    const user = await mongoose.connection.db.collection('users').findOne({ email });
    
    if (!user) {
      const allUsers = await mongoose.connection.db.collection('users').find({}).toArray();
      allUsers.forEach(u => {
        `);
      });
      return;
    }
    
    // Actualizar rol a admin
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      } else {
      }

  } catch (error) {
    } finally {
    await mongoose.connection.close();
    }
}

makeAdmin();