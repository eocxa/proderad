import { NextRequest, NextResponse } from "next/server";
import { createGoogleCalendarEvent, getStoredTokens } from "@/lib/google-auth";

export async function POST(request: NextRequest) {
  try {
    const tokens = getStoredTokens();
    if (!tokens) {
      return NextResponse.json({ success: false, error: "Google Calendar not connected" }, { status: 400 });
    }

    const body = await request.json();
    const { summary, description, startDate, endDate, startTime, endTime } = body;

    if (!summary || !startDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await createGoogleCalendarEvent({
      summary,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
    });

    if (!result) {
      return NextResponse.json({ success: false, error: "Failed to create calendar event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: result });
  } catch (error: any) {
    console.error("Error in create-event endpoint:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
