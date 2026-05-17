import { success, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    const { data, error: dbError } = await supabaseServer
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("name")

    if (dbError) return serverError()
    return success(data)
  } catch {
    return serverError()
  }
}
