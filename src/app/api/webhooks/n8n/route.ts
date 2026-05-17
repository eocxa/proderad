import { NextRequest } from "next/server"
import { success, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    await supabaseServer.from("n8n_workflows").insert({
      workflow_name: body.workflow_name || body.event || "webhook_event",
      trigger_type: "webhook",
      description: JSON.stringify(body).slice(0, 500),
      last_triggered_at: new Date().toISOString(),
      last_status: "triggered",
    })

    return success({ processed: true })
  } catch {
    return serverError()
  }
}

export async function GET() {
  try {
    const { data } = await supabaseServer
      .from("n8n_workflows")
      .select("*")
      .eq("is_active", true)
      .order("last_triggered_at", { ascending: false })
      .limit(10)

    return success(data || [])
  } catch {
    return serverError()
  }
}
