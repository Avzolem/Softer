import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/libs/admin-auth";

// GET single user
export async function GET(req, { params }) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();
    const user = await User.findById(params.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(req, { params }) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();
    const data = await req.json();

    // Whitelist de campos permitidos
    const allowedFields = ['name', 'email', 'role'];
    const sanitizedData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        sanitizedData[field] = data[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      sanitizedData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}
