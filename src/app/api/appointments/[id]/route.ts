import { NextRequest } from "next/server"
import { success, notFound, error, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (body.status && !["pending", "confirmed", "cancelled", "completed"].includes(body.status)) {
      return error("VALIDATION_ERROR", "Estado inválido. Valores permitidos: pending, confirmed, cancelled, completed", 400)
    }

    const { data: existing } = await supabaseServer
      .from("appointments")
      .select("id")
      .eq("id", id)
      .single()

    if (!existing) return notFound("Cita no encontrada")

    const { data, error: dbError } = await supabaseServer
      .from("appointments")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (dbError) return error("INTERNAL_ERROR", dbError.message, 500)

    return success(data)
  } catch {
    return serverError()
  }
}