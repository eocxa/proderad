import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  try {
    const authUrl = getAuthUrl(request.url);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating OAuth URL:", error);
    return NextResponse.json({ error: "Failed to initialize Google OAuth" }, { status: 500 });
  }
}
