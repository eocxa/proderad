# Estructura de APIs - ProDental Radiología

## Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://tudominio.com/api
```

## Autenticación

Las rutas admin requieren header:
```
Authorization: Bearer <supabase_jwt_token>
```

---

## 1. Servicios (`/api/services`)

### GET `/api/services`
Catálogo público de servicios dentales. Sin auth.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Limpieza Dental",
      "description": "Limpieza profesional con ultrasonido",
      "duration_minutes": 45,
      "price": 500,
      "category": "preventivo",
      "is_active": true
    }
  ]
}
```

---

## 2. Consultorios (`/api/offices`)

### GET `/api/offices`
Consultorios disponibles para renta. Sin auth.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Consultorio 101",
      "type": "equipada-plus",
      "floor": 1,
      "equipment": ["Unidad dental", "Rayos X", "Esterilizador"],
      "price_per_hour": 150,
      "price_morning_shift": 500,
      "price_afternoon_shift": 500,
      "price_full_day": 900,
      "is_active": true,
      "photo_url": "https://..."
    }
  ]
}
```

### POST, PUT, DELETE `/api/offices`, `/api/offices/:id`
Gestión de consultorios (admin).

---

## 3. Rentas (`/api/rentals`)

### GET `/api/rentals`
Listar solicitudes de renta (admin). Público: solo POST permitido.

**Query Params:** `status`, `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "doctor_name": "Dr. Carlos Ruiz",
      "doctor_email": "carlos@email.com",
      "doctor_specialty": "Endodoncista",
      "office_id": "uuid",
      "dates": ["2025-05-20", "2025-05-21"],
      "shift": "morning",
      "status": "pending",
      "total_price": 1000,
      "payment_status": "pending",
      "office": { "name": "Consultorio 101", "type": "equipada-plus", "floor": 1 },
      "created_at": "2025-05-15T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 12 }
}
```

### POST `/api/rentals`
Solicitar renta de consultorio. Sin auth (público).

**Request Body:**
```json
{
  "office_id": "uuid",
  "doctor_name": "Dr. Carlos Ruiz",
  "doctor_email": "carlos@email.com",
  "doctor_specialty": "Endodoncista",
  "dates": ["2025-05-20", "2025-05-21"],
  "shift": "morning",
  "notes": "Necesito unidad de rayos X"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "office_id": "uuid",
    "doctor_name": "Dr. Carlos Ruiz",
    "dates": ["2025-05-20", "2025-05-21"],
    "shift": "morning",
    "status": "pending",
    "total_price": 1000
  }
}
```

### PUT `/api/rentals/:id`
Actualizar estado de renta (admin).

**Request Body:**
```json
{
  "status": "approved",
  "admin_notes": "Confirmado"
}
```

### DELETE `/api/rentals/:id`
Cancelar renta (admin).

---

## 4. Chatbot Web (`/api/chatbot`)

### POST `/api/chatbot`
Chatbot de la página web. Sin auth. Consulta Google Calendar para disponibilidad.

**Request Body:**
```json
{
  "message": "¿Qué servicios tienen?"
}
```

**Response 200 (servicios):**
```json
{
  "success": true,
  "data": {
    "reply": "Nuestros servicios:\n- Limpieza Dental: 45 min, $500\n- Ortodoncia: 60 min, $1500\n..."
  }
}
```

**Response 200 (disponibilidad):**
```json
{
  "success": true,
  "data": {
    "reply": "Citas ya programadas:\n- 2025-05-20 10:00 Ocupado\n- 2025-05-20 14:00 Ocupado\n\nLos demás horarios están disponibles.",
    "data": [
      {
        "id": "event123",
        "summary": "Limpieza - Juan Pérez",
        "start": { "dateTime": "2025-05-20T10:00:00-06:00" },
        "end": { "dateTime": "2025-05-20T10:45:00-06:00" }
      }
    ]
  }
}
```

**Intenciones detectadas:** servicios, precios, disponibilidad, ubicación, agendar (futuro).

---

## 5. WhatsApp Webhook (`/api/whatsapp/webhook`)

### GET `/api/whatsapp/webhook`
Verificación del webhook por Meta.

**Query Params:** `hub.mode`, `hub.verify_token`, `hub.challenge`

**Response 200:** `hub.challenge` (texto plano)

### POST `/api/whatsapp/webhook`
Recibir mensajes de WhatsApp y responder automáticamente. Sin auth (Meta envía el payload).

**Payload entrante (Meta):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5215512345678",
          "text": { "body": "¿Qué servicios tienen?" }
        }]
      }
    }]
  }]
}
```

**Comportamiento:**
1. Detecta intención del mensaje
2. Si es "disponibilidad" → consulta Google Calendar
3. Responde vía WhatsApp Cloud API
4. Registra mensaje inbound + outbound en `whatsapp_messages`

---

## 6. Webhooks n8n (`/api/webhooks/n8n`)

### POST `/api/webhooks/n8n`
Recibir eventos de n8n y registrarlos. Sin auth (interno).

**Request Body:**
```json
{
  "event": "appointment_created",
  "data": { "patient": "Juan Pérez", "date": "2025-05-20" },
  "timestamp": "2025-05-20T10:00:00Z"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { "processed": true }
}
```

### GET `/api/webhooks/n8n`
Ver flujos activos (admin).

---

## 7. Google Calendar API (consumo interno)

No tenemos endpoint propio. Se consume directamente desde:
- `/api/chatbot` (lee eventos para disponibilidad)
- `/api/whatsapp/webhook` (lee eventos para responder)
- n8n (lee y escribe eventos vía Google Calendar API)

**Variables de entorno requeridas:**
```
GOOGLE_CALENDAR_ID=calendario@group.calendar.google.com
GOOGLE_API_KEY=AIza...
```

---

## 8. Notificaciones (`/api/notifications`)

### GET `/api/notifications`
Notificaciones del admin logueado.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "rental_received",
      "title": "Nueva solicitud de renta",
      "message": "Dr. Carlos Ruiz solicita Consultorio 101",
      "is_read": false,
      "created_at": "2025-05-15T10:00:00Z"
    }
  ]
}
```

---

## Códigos de Error

| HTTP | Código | Descripción |
|------|--------|-------------|
| 400 | `VALIDATION_ERROR` | Request body inválido |
| 401 | `UNAUTHORIZED` | No autenticado |
| 403 | `FORBIDDEN` | Sin permisos |
| 404 | `NOT_FOUND` | Recurso no encontrado |
| 409 | `CONFLICT` | Conflicto (horario ya reservado) |
| 500 | `INTERNAL_ERROR` | Error interno |

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos inválidos",
    "details": [{ "field": "office_id", "message": "Requerido" }]
  }
}
```
