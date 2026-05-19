import { NextRequest } from "next/server"
import { success, error, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    let query = supabaseServer
      .from("appointments")
      .select("*", { count: "exact" })

    if (status) query = query.eq("status", status)

    const { data, count, error: dbError } = await query
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false })
      .range(offset, offset + limit - 1)

    if (dbError) return serverError()
    return success(data, 200, { page, limit, total: count || 0 })
  } catch {
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patient_name,
      patient_email,
      patient_phone,
      service_category,
      office_id,
      appointment_date,
      appointment_time,
      notes,
    } = body

    if (!patient_name || !patient_email || !appointment_date || !appointment_time) {
      return error("VALIDATION_ERROR", "Nombre, email, fecha y hora requeridos", 400)
    }

    const { data: appointment, error: insertError } = await supabaseServer
      .from("appointments")
      .insert({
        patient_name,
        patient_email,
        patient_phone: patient_phone || null,
        service_category: service_category || null,
        office_id: office_id || null,
        appointment_date,
        appointment_time,
        status: "pending",
        notes: notes || null,
      })
      .select()
      .single()

    if (insertError) return error("INTERNAL_ERROR", insertError.message, 500)

    return success(appointment, 201)
  } catch {
    return serverError()
  }
}