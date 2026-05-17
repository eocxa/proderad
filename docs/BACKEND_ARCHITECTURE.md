# Arquitectura Backend - ProDental Radiología

## Stack Tecnológico

| Capa | Tecnología | Costo |
|------|------------|-------|
| Frontend | Next.js 16 + React 19 + TailwindCSS 4 | $0 |
| Backend | Next.js API Routes (App Router) | $0 |
| Base de Datos | PostgreSQL (vía Supabase) | $0 (free tier) |
| Autenticación Admin | Supabase Auth | $0 |
| Agenda de Citas | Google Calendar API (cliente ya lo usa) | $0 |
| Expedientes | DentalPro360 (software del cliente, no se toca) | — |
| Automatizaciones | n8n en Docker (Raspberry Pi 5) | $0 |
| WhatsApp | WhatsApp Business API (Meta) | $0 (<1000 conversas/mes) |
| Chatbot Web | API Route local + Google Calendar API | $0 |
| Despliegue | Vercel (frontend+backend) | $0 (free tier) |


## Realidad del Cliente

El cliente ya opera con:
- **DentalPro360**: software de gestión de expedientes electrónicos, reportes y notas médicas. **No se toca.**
- **Google Calendar**: agenda maestra de citas. **Es la fuente de verdad.** No almacenamos citas en nuestra DB.

Nosotros construimos **alrededor** de lo que ya tienen:
1. Página web moderna con catálogo de servicios y renta de consultorios
2. Chatbot en web que consulta Google Calendar para disponibilidad
3. Chatbot WhatsApp que consulta Google Calendar para disponibilidad
4. ~8 automatizaciones n8n para recordatorios, confirmaciones y seguimiento

## Estructura de Directorios

```
src/
├── app/
│   ├── api/
│   │   ├── services/route.ts         # GET catálogo de servicios
│   │   ├── offices/route.ts          # GET consultorios disponibles
│   │   ├── rentals/route.ts          # GET, POST solicitudes de renta
│   │   ├── chatbot/route.ts          # POST chatbot web (consulta Calendar)
│   │   ├── whatsapp/
│   │   │   └── webhook/route.ts      # GET, POST WhatsApp webhook
│   │   └── webhooks/
│   │       └── n8n/route.ts          # GET, POST webhooks n8n
│   ├── (web)/                        # Página pública
│   │   ├── page.tsx
│   │   └── renta-consultorios/
│   │       └── page.tsx
│   └── (admin)/                      # Panel admin (logueado)
│       └── page.tsx
├── lib/
│   ├── supabase.ts                   # Cliente Supabase (client-side)
│   ├── supabase-server.ts            # Cliente Supabase (server-side, service_role)
│   └── api-response.ts               # Helpers estandarizados de respuesta
├── types/
│   ├── database.ts                   # Tipos de las tablas
│   ├── api.ts                        # Tipos de request/response
│   └── index.ts
└── middleware.ts                      # Protección solo para rutas admin
```

## Arquitectura General

```
                    ┌──────────────────────────┐
                    │     Google Calendar       │  ← fuente de verdad (citas)
                    └───────────┬──────────────┘
                                │ API
                    ┌───────────▼──────────────┐
                    │       n8n (Raspberry Pi)  │
                    │  - Recordatorios 24h/2h   │
                    │  - Confirmación de cita   │
                    │  - Post-visita / encuesta │
                    │  - Reactivación pacientes │
                    │  - Cumpleaños              │
                    │  - No-show rescue         │
                    │  - WhatsApp API           │
                    └──────┬──────────┬─────────┘
                           │          │
              ┌────────────▼──┐  ┌───▼──────────────┐
              │ WhatsApp      │  │ Web (Next.js)     │
              │ Chatbot       │  │ - Página pública  │
              │ (consulta     │  │ - Renta consult.  │
              │  Calendar)    │  │ - Chatbot web     │
              └───────────────┘  │ - Panel admin     │
                                 └──────┬────────────┘
                                        │
                                 ┌──────▼────────────┐
                                 │    Supabase        │
                                 │ - offices          │
                                 │ - rentals          │
                                 │ - services         │
                                 │ - whatsapp_messages│
                                 │ - n8n_workflows    │
                                 │ - notifications    │
                                 └───────────────────┘
```

## Roles

| Rol | Acceso |
|-----|--------|
| `admin` | Panel admin: ver/gestionar rentas, ver logs WhatsApp, ver flujos n8n |
| `super_admin` | Nosotros: acceso total + configuración |

No hay roles de paciente/profesional/recepcionista. El cliente usa DentalPro360 y Google Calendar para eso.

## Flujo: Chatbot Web

```
Usuario → Página web → Chatbot (input texto)
                              ↓
                    POST /api/chatbot
                              ↓
                    Detecta intención (NLP simple)
                              ↓
              ┌─ servicios ─→ Responde con catálogo
              ├─ precios  ──→ Responde con precios
              ├─ disponib. ─→ GET Google Calendar API → Responde con slots
              ├─ ubicación ─→ Responde con dirección
              └─ default  ──→ Responde menú principal
```

## Flujo: WhatsApp

```
Paciente → WhatsApp → Meta API → POST /api/whatsapp/webhook
                                        ↓
                              Detecta intención
                                        ↓
                              GET Google Calendar (si aplica)
                                        ↓
                              Envía respuesta vía WhatsApp API
                                        ↓
                              Registra en whatsapp_messages
```

## Flujo: Automatizaciones n8n

```
Google Calendar (evento creado)
        ↓ webhook
      n8n
        ↓
  ┌─────┼─────┐
  │     │     │
  ▼     ▼     ▼
WApp   WApp   POST /api/webhooks/n8n
conf.  rec.   (registro en DB)
24h    2h
```

## Seguridad

- **Google Calendar**: API Key de solo lectura (salvo webhooks)
- **WhatsApp**: Token de acceso + verify token
- **Supabase**: RLS en tablas, service_role para server-side
- **Middleware**: Solo protege rutas admin (GET público, POST público en la mayoría)
- **Rate Limiting**: Vercel built-in

## Costo operativo mensual: $0 USD
