import { NextRequest } from "next/server"
import { success, serverError } from "@/lib/api-response"
import { supabaseServer } from "@/lib/supabase-server"

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ""
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || ""

async function sendWhatsAppMessage(to: string, text: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) return null

  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  })

  return res.json()
}

async function getCalendarEventsForDay(date: string) {
  const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3"
  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary"
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ""

  if (!GOOGLE_API_KEY) return []

  const timeMin = new Date(date + "T00:00:00").toISOString()
  const timeMax = new Date(date + "T23:59:59").toISOString()

  const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`

  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.items || []
}

function detectWhatsAppIntent(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes("agendar") || lower.includes("cita") || lower.includes("reservar")) return "book"
  if (lower.includes("cancelar") || lower.includes("cancel")) return "cancel"
  if (lower.includes("disponible") || lower.includes("horario")) return "availability"
  if (lower.includes("precio") || lower.includes("cuesta") || lower.includes("costo")) return "prices"
  if (lower.includes("servicio") || lower.includes("tratamiento")) return "services"
  if (lower.includes("ubicacion") || lower.includes("dirección") || lower.includes("donde")) return "location"
  return "greeting"
}

export async function GET(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get("hub.mode")
    const token = request.nextUrl.searchParams.get("hub.verify_token")
    const challenge = request.nextUrl.searchParams.get("hub.challenge")
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "prodental_webhook"

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 })
    }

    return new Response("Forbidden", { status: 403 })
  } catch {
    return new Response("Error", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.object !== "whatsapp_business_account") {
      return success({ received: true })
    }

    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]
    const message = change?.value?.messages?.[0]
    const contact = change?.value?.contacts?.[0]

    if (message?.type === "text" && message.text?.body) {
      const from = message.from
      const text = message.text.body
      const intent = detectWhatsAppIntent(text)

      let reply = ""

      switch (intent) {
        case "availability": {
          const today = new Date().toISOString().split("T")[0]
          const events = await getCalendarEventsForDay(today)
          reply = events.length > 0
            ? `Citas hoy:\n${events.map((e: { start?: { dateTime?: string }; summary?: string }) =>
                `- ${e.start?.dateTime?.split("T")[1]?.slice(0, 5) || "?"} ${e.summary || "Ocupado"}`).join("\n")}`
            : "No hay citas agendadas hoy. ¿Quieres programar una?"
          break
        }
        case "services": {
          reply = "Servicios: Limpieza ($500), Ortodoncia ($1500), Implantes ($8000), Endodoncia ($2500), Estética ($1200), Periodoncia ($1800), Pediatría ($600), Radiología ($400).\n\n¿Cuál te interesa?"
          break
        }
        case "location": {
          reply = "Estamos en CDMX. Consulta el mapa en nuestra página web."
          break
        }
        default: {
          reply = "¡Hola! Soy el asistente de ProDental. Puedo ayudarte con: servicios, precios, disponibilidad, ubicación. ¿Qué necesitas?"
        }
      }

      await sendWhatsAppMessage(from, reply)

      await supabaseServer.from("whatsapp_messages").insert([
        {
          to_phone: from,
          direction: "inbound",
          message_type: "manual",
          body: text,
          status: "delivered",
        },
        {
          to_phone: from,
          direction: "outbound",
          message_type: "manual",
          body: reply,
          status: "sent",
        },
      ])
    }

    return success({ received: true })
  } catch {
    return serverError()
  }
}
