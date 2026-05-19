import { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    let response = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          response = NextResponse.next({ request })
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

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "No autenticado" } },
        { status: 401 }
      )
    }

    const role = user.user_metadata?.role || ""

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" } },
      { status: 500 }
    )
  }
}