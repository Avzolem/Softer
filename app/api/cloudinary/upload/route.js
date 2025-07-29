import { NextResponse } from "next/server";
import { uploadImage } from "@/libs/cloudinary";

export async function POST(req) {
  try {
    console.log("Cloudinary upload endpoint called");

    const formData = await req.formData();
    const file = formData.get("file");
    console.log("File received:", file ? { name: file.name, type: file.type, size: file.size } : "No file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG and WebP are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const result = await uploadImage(base64);
    console.log("Upload successful:", result);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}