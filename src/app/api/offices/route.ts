import { NextRequest } from "next/server"
import { success, created, error, notFound, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    const { data, error: dbError } = await supabaseServer
      .from("offices")
      .select("*")
      .eq("is_active", true)
      .order("floor")
      .order("name")

    if (dbError) return serverError()
    return success(data)
  } catch {
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, floor, description, equipment, price_per_hour, price_morning_shift, price_afternoon_shift, price_full_day, photo_url } = body

    if (!name || !type || !floor || price_per_hour == null) {
      return error("VALIDATION_ERROR", "name, type, floor y price_per_hour requeridos", 400)
    }

    const { data, error: dbError } = await supabaseServer
      .from("offices")
      .insert({
        name,
        type,
        floor,
        description: description || null,
        equipment: equipment || null,
        photo_url: photo_url || null,
        price_per_hour,
        price_morning_shift: price_morning_shift || price_per_hour * 3,
        price_afternoon_shift: price_afternoon_shift || price_per_hour * 3,
        price_full_day: price_full_day || price_per_hour * 6,
        is_active: true,
      })
      .select()
      .single()

    if (dbError) return error("INTERNAL_ERROR", dbError.message, 500)

    return created(data)
  } catch {
    return serverError()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) return error("VALIDATION_ERROR", "id requerido", 400)

    const { data, error: dbError } = await supabaseServer
      .from("offices")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      if (dbError.code === "PGRST116") return notFound("Consultorio no encontrado")
      return error("INTERNAL_ERROR", dbError.message, 500)
    }

    return success(data)
  } catch {
    return serverError()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) return error("VALIDATION_ERROR", "id requerido", 400)

    const { data, error: dbError } = await supabaseServer
      .from("offices")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      if (dbError.code === "PGRST116") return notFound("Consultorio no encontrado")
      return error("INTERNAL_ERROR", dbError.message, 500)
    }

    return success(data)
  } catch {
    return serverError()
  }
}
