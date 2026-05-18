import { NextRequest, NextResponse } from "next/server";
import { getTokensFromCode } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    // Intercambiar código por tokens y guardar en caché local
    await getTokensFromCode(code, request.url);

    // Redirigir de regreso al panel con parámetro de éxito
    const isLocal = request.url.includes("localhost");
    const baseUrl = isLocal ? "http://localhost:3000" : "https://demoprodentalradiologia.vercel.app";
    
    return NextResponse.redirect(`${baseUrl}/admin/dashboard?calendar=connected`);
  } catch (error: any) {
    console.error("Error in Google OAuth Callback:", error);
    return NextResponse.json({ error: "Failed to connect to Google Calendar", details: error.message }, { status: 500 });
  }
}
