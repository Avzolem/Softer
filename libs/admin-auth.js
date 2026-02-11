import { auth } from "@/libs/next-auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "admin") {
    return { authorized: false, response: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  return { authorized: true, session };
}
