import { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { success, error, unauthorized, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorized()

    const { data: notifications, error: dbError } = await supabaseServer
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (dbError) return error("INTERNAL_ERROR", dbError.message, 500)

    return success(notifications || [])
  } catch {
    return serverError()
  }
}
