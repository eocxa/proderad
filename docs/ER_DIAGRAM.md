# Diagrama Entidad-Relación - ProDental Radiología

## Diagrama ER (Mermaid)

```mermaid
erDiagram
    USERS {
        UUID id PK
        VARCHAR email UK
        VARCHAR role
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    SERVICES {
        UUID id PK
        VARCHAR name
        VARCHAR category
        INTEGER duration_minutes
        DECIMAL price
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    OFFICES {
        UUID id PK
        VARCHAR name
        VARCHAR type
        INTEGER floor
        TEXT[] equipment
        DECIMAL price_per_hour
        DECIMAL price_morning_shift
        DECIMAL price_afternoon_shift
        DECIMAL price_full_day
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    RENTALS {
        UUID id PK
        VARCHAR doctor_name
        VARCHAR doctor_email
        VARCHAR doctor_specialty
        UUID office_id FK
        DATE[] dates
        VARCHAR shift
        VARCHAR status
        DECIMAL total_price
        VARCHAR payment_status
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    WHATSAPP_MESSAGES {
        UUID id PK
        VARCHAR to_phone
        VARCHAR direction
        VARCHAR message_type
        TEXT body
        VARCHAR status
        TIMESTAMPTZ sent_at
        TIMESTAMPTZ created_at
    }

    N8N_WORKFLOWS {
        UUID id PK
        VARCHAR workflow_name
        VARCHAR trigger_type
        BOOLEAN is_active
        TIMESTAMPTZ last_triggered_at
        VARCHAR last_status
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    NOTIFICATIONS {
        UUID id PK
        UUID user_id FK
        VARCHAR type
        VARCHAR title
        TEXT message
        BOOLEAN is_read
        TIMESTAMPTZ created_at
    }

    USERS ||--o{ RENTALS : "aprueba"
    USERS ||--o{ NOTIFICATIONS : "recibe"
    OFFICES ||--o{ RENTALS : "1:N"
```

---

## Sistema externo: Google Calendar
```
┌──────────────────────────────┐
│      Google Calendar          │
│  (fuente de verdad - citas)   │
│                               │
│  API consumida por:           │
│  - /api/chatbot               │
│  - /api/whatsapp/webhook      │
│  - n8n (recordatorios, etc.)  │
└──────────────────────────────┘
```

---

## Diagrama de Flujo: Chatbot Web

```mermaid
flowchart TD
    A[Usuario escribe mensaje] --> B[POST /api/chatbot]
    B --> C{Detectar intención}
    C -->|servicios| D[Responder catálogo]
    C -->|precios| E[Responder precios]
    C -->|disponibilidad| F[GET Google Calendar API]
    C -->|ubicación| G[Responder dirección]
    C -->|info| H[Responder menú]
    F --> I[Responder slots disponibles]
```

## Diagrama de Flujo: Renta de Consultorio

```mermaid
flowchart TD
    A[Doctor visita web] --> B[Ve consultorios GET /api/offices]
    B --> C[Selecciona consultorio, fechas, turno]
    C --> D[POST /api/rentals]
    D --> E{Conflicto de fechas?}
    E -->|Sí| F[Error 409: ya reservado]
    E -->|No| G[Crear rental → pending]
    G --> H[Admin recibe notificación]
    H --> I{Admin aprueba?}
    I -->|Sí| J[PUT /api/rentals/:id → approved]
    I -->|No| K[PUT → rejected]
```

## Diagrama de Flujo: WhatsApp

```mermaid
flowchart TD
    A[Paciente envía WhatsApp] --> B[Meta API → POST /api/whatsapp/webhook]
    B --> C{Detectar intención}
    C -->|disponibilidad| D[GET Google Calendar]
    C -->|servicios| E[Responder catálogo]
    C -->|otro| F[Responder menú]
    D --> G[Enviar respuesta vía WhatsApp API]
    E --> G
    F --> G
    G --> H[Registrar en whatsapp_messages]
```

---

## Visualización con dbdiagram.io

```
Table users {
  id uuid [pk]
  email varchar [unique]
  role varchar
  created_at timestamp
  updated_at timestamp
}

Table services {
  id uuid [pk]
  name varchar
  description text
  category varchar
  duration_minutes int
  price decimal
  is_active boolean
  requires_xray boolean
  requires_followup boolean
  created_at timestamp
  updated_at timestamp
}

Table offices {
  id uuid [pk]
  name varchar
  type varchar
  floor int
  description text
  equipment text[]
  photo_url varchar
  photo_gallery varchar[]
  price_per_hour decimal
  price_morning_shift decimal
  price_afternoon_shift decimal
  price_full_day decimal
  is_active boolean
  created_at timestamp
  updated_at timestamp
}

Table rentals {
  id uuid [pk]
  doctor_name varchar
  doctor_email varchar
  doctor_specialty varchar
  office_id uuid [ref: > offices.id]
  dates date[]
  shift varchar
  status varchar
  total_price decimal
  payment_status varchar
  payment_method varchar
  payment_date timestamp
  notes text
  admin_notes text
  approved_by uuid [ref: > users.id]
  created_at timestamp
  updated_at timestamp
}

Table whatsapp_messages {
  id uuid [pk]
  to_phone varchar
  direction varchar
  message_type varchar
  template_name varchar
  body text
  status varchar
  whatsapp_id varchar
  error_message text
  sent_at timestamp
  created_at timestamp
}

Table n8n_workflows {
  id uuid [pk]
  workflow_name varchar
  description text
  trigger_type varchar
  webhook_url varchar
  is_active boolean
  last_triggered_at timestamp
  last_status varchar
  error_log text
  created_at timestamp
  updated_at timestamp
}

Table notifications {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  type varchar
  title varchar
  message text
  is_read boolean
  created_at timestamp
}
```
