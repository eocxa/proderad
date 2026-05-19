import { NextRequest } from "next/server"
import { success, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("include_inactive") === "true"

    let query = supabaseServer
      .from("services")
      .select("*")

    if (!includeInactive) query = query.eq("is_active", true)

    const { data, error: dbError } = await query
      .order("category")
      .order("name")

    if (dbError) return serverError()
    return success(data)
  } catch {
    return serverError()
  }
}