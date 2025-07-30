import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Configured" : "❌ Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Configured" : "❌ Missing",
    MONGODB_URI: process.env.MONGODB_URI ? "✅ Configured" : "❌ Missing",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Configured" : "❌ Missing",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Configured" : "❌ Missing",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Configured" : "❌ Missing",
    ADMIN_USERNAME: process.env.ADMIN_USERNAME ? "✅ Configured" : "❌ Missing",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ Configured" : "❌ Missing",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  // Test MongoDB connection
  let mongoStatus = "Not tested";
  if (process.env.MONGODB_URI) {
    try {
      const connectDB = (await import("@/libs/mongoose")).default;
      await connectDB();
      mongoStatus = "✅ Connected successfully";
    } catch (error) {
      mongoStatus = `❌ Connection failed: ${error.message}`;
    }
  }

  return NextResponse.json({
    envCheck,
    mongoStatus,
    timestamp: new Date().toISOString(),
  });
}