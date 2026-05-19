import { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    let response = NextResponse.json({ success: true })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          response = NextResponse.json({ success: true })
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

    await supabase.auth.signOut()

    const cookieNames = ["sb-access-token", "sb-refresh-token"]
    for (const name of cookieNames) {
      response.cookies.delete(name)
    }

    return response
  } catch {
    return NextResponse.json({ success: true })
  }
}