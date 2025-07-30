import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import SaleTimer from "@/models/SaleTimer";

// GET - Obtener el timer activo
export async function GET() {
  try {
    // Conectar a MongoDB
    await connectMongo();
    
    // Buscar timer activo
    const timer = await SaleTimer.findOne({ isActive: true }).lean();
    
    // Si no hay timer, devolver null (no es un error)
    if (!timer) {
      return NextResponse.json(null);
    }
    
    // Devolver el timer encontrado
    return NextResponse.json(timer);
  } catch (error) {
    console.error("Error en GET /api/sale-timer:", error);
    // Verificar si es un error de conexión a MongoDB
    if (error.name === 'MongooseError' || error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        { error: "Error de conexión a la base de datos", details: "Verifica MONGODB_URI en .env.local" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Error al obtener el timer", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar timer (solo admin)
export async function POST(req) {
  try {
    const session = await auth();
    
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectMongo();
    
    const { endDate, isActive, message } = await req.json();
    
    // Si se está activando un timer, desactivar todos los demás
    if (isActive) {
      await SaleTimer.updateMany({}, { isActive: false });
    }
    
    // Crear o actualizar el timer
    const timer = await SaleTimer.findOneAndUpdate(
      {},
      {
        endDate: new Date(endDate),
        isActive,
        message
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    
    return NextResponse.json(timer);
  } catch (error) {
    console.error("Error en POST /api/sale-timer:", error);
    return NextResponse.json(
      { error: "Error al guardar el timer", details: error.message },
      { status: 500 }
    );
  }
}