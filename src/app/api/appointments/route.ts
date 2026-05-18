import { NextRequest } from "next/server"
import { created, error, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

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
      notes 
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
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single()

    if (insertError) return error("INTERNAL_ERROR", insertError.message, 500)

    return created(appointment)
  } catch {
    return serverError()
  }
}
