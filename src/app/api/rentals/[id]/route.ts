import { NextRequest } from "next/server"
import { success, error, notFound, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"
import type { UpdateRentalRequest } from "@/types"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateRentalRequest = await request.json()

    if (body.status && !["pending", "approved", "rejected", "active", "completed", "cancelled"].includes(body.status)) {
      return error("VALIDATION_ERROR", "Estado inválido", 400)
    }

    const { data: existing } = await supabaseServer
      .from("rentals")
      .select("id")
      .eq("id", id)
      .single()

    if (!existing) return notFound("Renta no encontrada")

    const { data, error: dbError } = await supabaseServer
      .from("rentals")
      .update(body)
      .eq("id", id)
      .select("*, office:offices(name, type, floor)")
      .single()

    if (dbError) return error("INTERNAL_ERROR", dbError.message, 500)

    return success(data)
  } catch {
    return serverError()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: existing } = await supabaseServer
      .from("rentals")
      .select("id, status")
      .eq("id", id)
      .single()

    if (!existing) return notFound("Renta no encontrada")

    const { data, error: dbError } = await supabaseServer
      .from("rentals")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select("*, office:offices(name, type, floor)")
      .single()

    if (dbError) return error("INTERNAL_ERROR", dbError.message, 500)

    return success(data)
  } catch {
    return serverError()
  }
}
