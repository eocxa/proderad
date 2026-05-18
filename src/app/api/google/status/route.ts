import { NextResponse } from "next/server";
import { getStoredTokens } from "@/lib/google-auth";

export async function GET() {
  try {
    const tokens = getStoredTokens();
    return NextResponse.json({
      connected: !!tokens?.access_token,
      calendarId: tokens?.calendar_id || "primary",
      clientId: tokens?.client_id || "",
      clientSecret: tokens?.client_secret || "",
      scope: tokens?.scope || "",
    });
  } catch (error) {
    return NextResponse.json({ connected: false, error: "Failed to read calendar status" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { calendarId, clientId, clientSecret } = body;

    const { getStoredTokens, saveTokens } = require("@/lib/google-auth");
    const tokens = getStoredTokens() || {
      access_token: "",
      scope: "",
      token_type: "",
      expiry_date: 0,
      calendar_id: "primary",
      client_id: "",
      client_secret: "",
    };

    if (calendarId !== undefined) tokens.calendar_id = calendarId;
    if (clientId !== undefined) tokens.client_id = clientId;
    if (clientSecret !== undefined) tokens.client_secret = clientSecret;

    saveTokens(tokens);

    return NextResponse.json({
      success: true,
      calendarId: tokens.calendar_id,
      clientId: tokens.client_id,
      clientSecret: tokens.client_secret,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update calendar configuration" }, { status: 500 });
  }
}
