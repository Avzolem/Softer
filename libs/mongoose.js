import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  // Verificar MONGODB_URI en tiempo de ejecución
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    throw new Error(
      "Please define the MONGODB_URI environment variable"
    );
  }

  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Creating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("MongoDB connection error:", e.message);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectMongo;