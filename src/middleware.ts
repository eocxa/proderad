import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { UserRole } from "@/types"

const adminRoutes = [
  { path: "/api/rentals", methods: ["GET", "PUT", "DELETE"] },
  { path: "/api/offices", methods: ["POST", "PUT", "DELETE"] },
  { path: "/api/whatsapp", methods: ["GET"] },
  { path: "/api/webhooks/n8n", methods: ["GET"] },
]

const publicRoutes = [
  "/api/services",
  "/api/offices",
  "/api/chatbot",
  "/api/whatsapp/webhook",
  "/api/webhooks/n8n",
  "/api/rentals",
  "/api/appointments",
]

function matchesPath(requestPath: string, configPath: string): boolean {
  const normRequest = requestPath.endsWith('/') ? requestPath.slice(0, -1) : requestPath
  const normConfig = configPath.endsWith('/') ? configPath.slice(0, -1) : configPath
  
  if (normRequest === normConfig) return true
  return normRequest.startsWith(normConfig + '/')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (method === "OPTIONS") {
    return NextResponse.json({}, { status: 200 })
  }

  if (!pathname.startsWith("/api/")) return NextResponse.next()

  if (pathname.startsWith("/api/google") || pathname.startsWith("/api/auth/google")) {
    return NextResponse.next()
  }

  const isPublicGet = publicRoutes.some((r) => matchesPath(pathname, r)) && method === "GET"
  const isPublicPost =
    publicRoutes.some((r) => matchesPath(pathname, r)) && method === "POST"
  if (isPublicGet || isPublicPost) return NextResponse.next()

  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "No autenticado" } },
      { status: 401 }
    )
  }

  const role = (user.user_metadata?.role as UserRole) || "admin"

  const needsAdmin = adminRoutes.some(
    (r) => matchesPath(pathname, r.path) && r.methods.includes(method)
  )

  if (needsAdmin && !["admin", "super_admin"].includes(role)) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Rol mínimo: admin" } },
      { status: 403 }
    )
  }

  return response
}

export const config = { matcher: ["/api/:path*"] }
