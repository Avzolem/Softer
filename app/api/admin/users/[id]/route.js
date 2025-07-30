import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import User from "@/models/User";

// GET single user
export async function GET(req, { params }) {
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
  try {
    await connectDB();
    const data = await req.json();
    
    // Remove password from update if present
    delete data.password;
    
    const user = await User.findByIdAndUpdate(
      params.id,
      data,
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
      { error: error.message || "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}