import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@prodental.mx"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Contraseña requerida" } },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Contraseña incorrecta" } },
        { status: 401 }
      )
    }

    const role = data.user.user_metadata?.role || ""
    if (!["admin", "super_admin"].includes(role)) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Sin permisos de administrador" } },
        { status: 403 }
      )
    }

    const responseBody = {
      success: true,
      data: {
        user: { id: data.user.id, email: data.user.email!, role },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
    }

    const response = NextResponse.json(responseBody)

    const supabaseSSR = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, {
              ...options,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              path: "/",
            })
          }
        },
      },
    })

    await supabaseSSR.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" } },
      { status: 500 }
    )
  }
}