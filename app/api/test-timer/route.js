import { NextResponse } from "next/server";

// GET - Test endpoint
export async function GET() {
  try {
    // Primero probar sin importar nada de MongoDB
    return NextResponse.json({ 
      status: "ok", 
      message: "API endpoint funcionando",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en test", details: error.message },
      { status: 500 }
    );
  }
}