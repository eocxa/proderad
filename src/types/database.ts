export type UserRole = "admin" | "super_admin"

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed"
export type RentalStatus = "pending" | "approved" | "rejected" | "active" | "completed" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "refunded"
export type Shift = "morning" | "afternoon" | "full"
export type OfficeType = "equipada-plus" | "estandar" | "quirofano"

export type ServiceCategory =
  | "preventivo"
  | "ortodoncia"
  | "implantes"
  | "endodoncia"
  | "cirugia"
  | "estetica"
  | "radiologia"
  | "pediatria"
  | "periodoncia"

export type WhatsAppMessageType =
  | "confirmation"
  | "reminder_24h"
  | "reminder_2h"
  | "no_show"
  | "post_visit"
  | "birthday"
  | "inactive"
  | "manual"

export type WhatsAppStatus = "queued" | "sent" | "delivered" | "read" | "failed"
export type WhatsAppDirection = "outbound" | "inbound"

export type N8nTriggerType = "webhook" | "cron" | "database_event" | "manual"

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description?: string | null
  category: ServiceCategory
  duration_minutes: number
  price: number
  is_active: boolean
  requires_xray: boolean
  requires_followup: boolean
  created_at: string
  updated_at: string
}

export interface Office {
  id: string
  name: string
  type: OfficeType
  floor: number
  description?: string | null
  equipment?: string[] | null
  photo_url?: string | null
  photo_gallery?: string[] | null
  price_per_hour: number
  price_morning_shift: number
  price_afternoon_shift: number
  price_full_day: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Rental {
  id: string
  doctor_id?: string | null
  doctor_name: string
  doctor_email: string
  doctor_specialty?: string | null
  office_id: string
  dates: string[]
  shift: Shift
  status: RentalStatus
  total_price: number
  payment_status: PaymentStatus
  payment_method?: string | null
  payment_date?: string | null
  notes?: string | null
  admin_notes?: string | null
  approved_by?: string | null
  created_at: string
  updated_at: string
  office?: Pick<Office, "name" | "type" | "floor">
}

export interface Appointment {
  id: string
  patient_name: string
  patient_email: string
  patient_phone?: string | null
  service_category?: string | null
  office_id?: string | null
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface WhatsAppMessage {
  id: string
  to_phone: string
  direction: WhatsAppDirection
  message_type: WhatsAppMessageType
  template_name?: string | null
  body: string
  status: WhatsAppStatus
  whatsapp_id?: string | null
  error_message?: string | null
  sent_at?: string | null
  created_at: string
}

export interface N8nWorkflow {
  id: string
  workflow_name: string
  description?: string | null
  trigger_type: N8nTriggerType
  webhook_url?: string | null
  is_active: boolean
  last_triggered_at?: string | null
  last_status?: string | null
  error_log?: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}
