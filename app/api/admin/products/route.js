import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Product from "@/models/Product";
import { requireAdmin } from "@/libs/admin-auth";

// GET all products
export async function GET() {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();

    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(req) {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response;

  try {
    await connectDB();
    const data = await req.json();

    // Asegurar que solo haya una imagen principal
    if (data.images && data.images.length > 0) {
      const mainImages = data.images.filter(img => img.isMain);
      if (mainImages.length > 1) {
        data.images = data.images.map((img, index) => ({
          ...img,
          isMain: index === data.images.length - 1
        }));
      } else if (mainImages.length === 0) {
        data.images[0].isMain = true;
      }
    }

    const product = await Product.create(data);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
