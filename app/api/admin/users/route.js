import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import User from "@/models/User";

// GET all users with pagination
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      User.countDocuments()
    ]);
    
    return NextResponse.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST new user
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    const user = await User.create(data);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear usuario" },
      { status: 500 }
    );
  }
}