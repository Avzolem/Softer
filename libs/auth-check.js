import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function checkAdminAuth() {
  const adminToken = cookies().get("admin-token");
  
  if (!adminToken) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    };
  }
  
  return {
    authenticated: true,
    user: {
      username: process.env.ADMIN_USERNAME,
      role: "admin"
    }
  };
}