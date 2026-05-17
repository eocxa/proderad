import type { Office, Rental, Service, User, WhatsAppMessage } from "./database"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string>[]
}

export interface ApiMeta {
  page?: number
  limit?: number
  total?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: Pick<User, "id" | "email" | "role">
  session: { access_token: string; refresh_token: string }
}

export interface CreateRentalRequest {
  office_id: string
  doctor_name: string
  doctor_email: string
  doctor_specialty?: string
  dates: string[]
  shift: string
  notes?: string
}

export interface UpdateRentalRequest {
  status?: string
  admin_notes?: string
  payment_status?: string
}

export type RentalResponse = Rental & {
  office?: Pick<Office, "name" | "type" | "floor">
}

export interface ChatbotRequest {
  message: string
}

export interface ChatbotResponse {
  reply: string
  action?: "book_appointment" | "check_availability" | "cancel_appointment" | "info" | null
  data?: CalendarEvent[]
}

export interface CalendarEvent {
  id: string
  summary: string
  start: { dateTime: string }
  end: { dateTime: string }
  status: string
  description?: string
}

export interface WhatsAppWebhookBody {
  object: string
  entry: {
    id: string
    changes: {
      value: {
        messaging_product: string
        metadata: { display_phone_number: string; phone_number_id: string }
        contacts?: { profile: { name: string }; wa_id: string }[]
        messages?: {
          from: string
          id: string
          timestamp: string
          text?: { body: string }
          type: string
        }[]
      }
      field: string
    }[]
  }[]
}

export interface N8nWebhookRequest {
  event: string
  data: Record<string, unknown>
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: { page: number; limit: number; total: number }
}

export type ServiceResponse = Service

export type OfficeResponse = Office

export type WhatsAppMessageResponse = WhatsAppMessage
