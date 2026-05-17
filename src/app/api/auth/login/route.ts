import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { success, error } from "@/lib/api-response"
import type { AuthResponse } from "@/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const ALLOWED_ROLES = ["admin", "super_admin"]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return error("VALIDATION_ERROR", "Email y contraseña requeridos", 400)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      return error("UNAUTHORIZED", "Credenciales inválidas", 401)
    }

    const role = data.user.user_metadata?.role || ""

    if (!ALLOWED_ROLES.includes(role)) {
      await supabase.auth.signOut()
      return error("FORBIDDEN", "Solo administradores pueden acceder al panel", 403)
    }

    const response: AuthResponse = {
      user: { id: data.user.id, email: data.user.email!, role },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    }

    return success(response)
  } catch {
    return error("INTERNAL_ERROR", "Error interno del servidor", 500)
  }
}
