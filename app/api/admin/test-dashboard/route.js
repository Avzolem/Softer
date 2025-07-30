import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";

export async function GET(request) {
  try {
    console.log("Test Dashboard API: Iniciando...");
    
    // Verificar autenticación
    const session = await auth();
    console.log("Test Dashboard API: Sesión:", session);
    
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado - sesión no encontrada" },
        { status: 401 }
      );
    }
    
    // Devolver datos de prueba sin conectar a MongoDB
    return NextResponse.json({
      productsCount: 0,
      ordersCount: 0,
      usersCount: 0,
      test: true,
      session: {
        user: {
          email: session.user?.email,
          role: session.user?.role
        }
      }
    });
  } catch (error) {
    console.error("Test Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Error en test dashboard: " + error.message },
      { status: 500 }
    );
  }
}