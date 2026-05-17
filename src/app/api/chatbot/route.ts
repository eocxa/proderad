import { NextRequest } from "next/server"
import { success, error, serverError } from "@/lib/api-response"
import type { ChatbotRequest } from "@/types"

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3"
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary"
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ""

const SERVICES_INFO = {
  limpieza: { name: "Limpieza Dental", duration: 45, price: 500 },
  ortodoncia: { name: "Ortodoncia", duration: 60, price: 1500 },
  implantes: { name: "Implantes Dentales", duration: 90, price: 8000 },
  endodoncia: { name: "Endodoncia", duration: 60, price: 2500 },
  estetica: { name: "Estética Dental", duration: 45, price: 1200 },
  periodoncia: { name: "Periodoncia", duration: 45, price: 1800 },
  pediatria: { name: "Odontopediatría", duration: 45, price: 600 },
  radiologia: { name: "Radiología", duration: 30, price: 400 },
}

function detectIntent(message: string): { intent: string; service?: string; date?: string } {
  const lower = message.toLowerCase()

  if (lower.includes("agendar") || lower.includes("cita") || lower.includes("reservar")) {
    for (const [key, info] of Object.entries(SERVICES_INFO)) {
      if (lower.includes(key)) return { intent: "book", service: key }
    }
    return { intent: "book" }
  }

  if (lower.includes("cancelar") || lower.includes("cancel")) {
    return { intent: "cancel" }
  }

  if (lower.includes("disponible") || lower.includes("horario") || lower.includes("horarios")) {
    return { intent: "availability" }
  }

  if (lower.includes("precio") || lower.includes("cuesta") || lower.includes("costo")) {
    for (const [key, info] of Object.entries(SERVICES_INFO)) {
      if (lower.includes(key)) return { intent: "price", service: key }
    }
    return { intent: "prices" }
  }

  if (lower.includes("servicio") || lower.includes("servicios") || lower.includes("tratamiento")) {
    return { intent: "services" }
  }

  if (lower.includes("ubicacion") || lower.includes("dirección") || lower.includes("donde")) {
    return { intent: "location" }
  }

  return { intent: "info" }
}

async function getCalendarEvents(dateFrom?: string) {
  if (!GOOGLE_API_KEY) return []

  const timeMin = dateFrom ? new Date(dateFrom).toISOString() : new Date().toISOString()
  const timeMax = dateFrom
    ? new Date(new Date(dateFrom).getTime() + 86400000).toISOString()
    : new Date(Date.now() + 7 * 86400000).toISOString()

  const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`

  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.items || []
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatbotRequest = await request.json()
    const { message } = body

    if (!message?.trim()) return error("VALIDATION_ERROR", "Mensaje requerido", 400)

    const { intent, service } = detectIntent(message)

    switch (intent) {
      case "services": {
        const list = Object.entries(SERVICES_INFO)
          .map(([_, info]) => `- ${info.name}: ${info.duration} min, $${info.price}`)
          .join("\n")
        return success({
          reply: `Nuestros servicios:\n${list}\n\n¿Te interesa agendar alguno?`,
        })
      }

      case "price": {
        const info = service ? SERVICES_INFO[service as keyof typeof SERVICES_INFO] : null
        if (info) {
          return success({
            reply: `${info.name} cuesta $${info.price} MXN (${info.duration} minutos). ¿Quieres agendar una cita?`,
          })
        }
        const list = Object.entries(SERVICES_INFO)
          .map(([_, info]) => `- ${info.name}: $${info.price} MXN`)
          .join("\n")
        return success({ reply: `Precios aproximados:\n${list}\n\nLos precios pueden variar según el caso.` })
      }

      case "availability": {
        const events = await getCalendarEvents()
        if (events.length === 0) {
          return success({ reply: "No encontré citas programadas. Hay disponibilidad. ¿Qué servicio buscas?" })
        }
        const slots = events.map((e: { start?: { dateTime?: string }; end?: { dateTime?: string }; summary?: string }) =>
          `- ${e.start?.dateTime?.split("T")[0]} ${e.start?.dateTime?.split("T")[1]?.slice(0, 5)} - ${e.summary || "Ocupado"}`
        ).join("\n")
        return success({
          reply: `Citas ya programadas:\n${slots}\n\nLos demás horarios están disponibles. ¿Qué día te gustaría?`,
          data: events,
        })
      }

      case "location": {
        return success({
          reply: "Estamos en CDMX. Encuentra la ubicación exacta en el mapa de nuestra página principal.",
        })
      }

      default: {
        return success({
          reply: "¡Hola! Soy el asistente de ProDental. Puedo ayudarte con:\n- Ver servicios y precios\n- Consultar disponibilidad\n- Información de la clínica\n- Agendar una cita\n\n¿Qué necesitas?",
        })
      }
    }
  } catch {
    return serverError()
  }
}
