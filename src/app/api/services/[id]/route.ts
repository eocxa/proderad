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

    const { data: existing } = await supabaseServer
      .from("services")
      .select("id")
      .eq("id", id)
      .single()

    if (!existing) return notFound("Servicio no encontrado")

    const allowedFields = ["name", "description", "category", "duration_minutes", "price", "is_active", "requires_xray", "requires_followup"]
    const updateData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    if (Object.keys(updateData).length === 0) {
      return error("VALIDATION_ERROR", "No se enviaron campos para actualizar", 400)
    }

    const { data, error: dbError } = await supabaseServer
      .from("services")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (dbError) return error("INTERNAL_ERROR", dbError.message, 500)

    return success(data)
  } catch {
    return serverError()
  }
}