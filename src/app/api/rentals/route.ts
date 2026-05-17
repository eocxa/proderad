import { NextRequest } from "next/server"
import { success, created, error, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"
import type { CreateRentalRequest } from "@/types"

function calcPrice(
  dates: string[],
  shift: string,
  office: { price_per_hour: number; price_morning_shift: number; price_afternoon_shift: number; price_full_day: number }
): number {
  const days = dates.length
  if (shift === "morning") return days * office.price_morning_shift
  if (shift === "afternoon") return days * office.price_afternoon_shift
  return days * office.price_full_day
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let query = supabaseServer
      .from("rentals")
      .select("*, office:offices(name, type, floor)", { count: "exact" })

    const status = searchParams.get("status")
    if (status) query = query.eq("status", status)

    const { data, count, error: dbError } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (dbError) return serverError()
    return success(data, 200, { page, limit, total: count || 0 })
  } catch {
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRentalRequest = await request.json()
    const { office_id, doctor_name, doctor_email, doctor_specialty, dates, shift, notes } = body

    if (!office_id || !doctor_name || !doctor_email || !dates?.length || !shift) {
      return error("VALIDATION_ERROR", "office_id, doctor_name, doctor_email, dates y shift requeridos", 400)
    }

    const { data: office, error: officeError } = await supabaseServer
      .from("offices")
      .select("*")
      .eq("id", office_id)
      .eq("is_active", true)
      .single()

    if (officeError || !office) {
      return error("NOT_FOUND", "Consultorio no encontrado o inactivo", 404)
    }

    const { data: conflicting, error: conflictError } = await supabaseServer
      .from("rentals")
      .select("id")
      .eq("office_id", office_id)
      .eq("shift", shift)
      .in("status", ["pending", "approved", "active"])
      .overlaps("dates", dates)

    if (conflictError) return serverError()
    if (conflicting && conflicting.length > 0) {
      return error("CONFLICT", "El consultorio ya está reservado para esas fechas y turno", 409)
    }

    const total_price = calcPrice(dates, shift, office)

    const { data: rental, error: insertError } = await supabaseServer
      .from("rentals")
      .insert({
        office_id,
        doctor_name,
        doctor_email,
        doctor_specialty: doctor_specialty || null,
        dates,
        shift,
        notes: notes || null,
        status: "pending",
        total_price,
        payment_status: "pending",
      })
      .select("*, office:offices(name, type, floor)")
      .single()

    if (insertError) return error("INTERNAL_ERROR", insertError.message, 500)

    return created(rental)
  } catch {
    return serverError()
  }
}
