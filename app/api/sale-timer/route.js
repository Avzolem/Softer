import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import SaleTimer from "@/models/SaleTimer";

// GET - Obtener el timer activo
export async function GET() {
  try {
    await connectMongo();

    const timer = await SaleTimer.findOne({ isActive: true }).lean();

    if (!timer) {
      return NextResponse.json(null);
    }

    return NextResponse.json(timer);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el timer" },
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

    if (isActive) {
      await SaleTimer.updateMany({}, { isActive: false });
    }

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
    return NextResponse.json(
      { error: "Error al guardar el timer" },
      { status: 500 }
    );
  }
}
