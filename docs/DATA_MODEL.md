# Modelo de Datos - ProDental Radiología

## Base de Datos: PostgreSQL (Supabase)

Solo almacenamos datos que no están en DentalPro360 ni Google Calendar.

---

## Tablas

### 1. `users`
Usuarios admin (autenticación vía Supabase Auth)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | ID del usuario |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'admin' | `admin` o `super_admin` |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

### 2. `services`
Catálogo de servicios (para mostrar en web)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK, default uuid_generate_v4() | ID |
| name | VARCHAR(100) | NOT NULL | Nombre del servicio |
| description | TEXT | NULLABLE | Descripción |
| category | VARCHAR(50) | NOT NULL | Categoría |
| duration_minutes | INTEGER | NOT NULL | Duración |
| price | DECIMAL(10,2) | NOT NULL | Precio |
| is_active | BOOLEAN | DEFAULT true | Visible en web |
| requires_xray | BOOLEAN | DEFAULT false | Requiere radiografía |
| requires_followup | BOOLEAN | DEFAULT false | Requiere seguimiento |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Categorías:** `preventivo`, `ortodoncia`, `implantes`, `endodoncia`, `cirugia`, `estetica`, `radiologia`, `pediatria`, `periodoncia`

---

### 3. `offices`
Consultorios disponibles para renta

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | ID |
| name | VARCHAR(100) | NOT NULL | Nombre/número |
| type | VARCHAR(30) | NOT NULL | `equipada-plus`, `estandar`, `quirofano` |
| floor | INTEGER | NOT NULL | Piso |
| description | TEXT | NULLABLE | Descripción |
| equipment | TEXT[] | NULLABLE | Equipos |
| photo_url | VARCHAR(500) | NULLABLE | Foto principal |
| photo_gallery | VARCHAR(500)[] | NULLABLE | Galería |
| price_per_hour | DECIMAL(10,2) | NOT NULL | Precio/hora |
| price_morning_shift | DECIMAL(10,2) | NOT NULL | Turno mañana |
| price_afternoon_shift | DECIMAL(10,2) | NOT NULL | Turno tarde |
| price_full_day | DECIMAL(10,2) | NOT NULL | Día completo |
| is_active | BOOLEAN | DEFAULT true | Disponible |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### 4. `rentals`
Solicitudes de renta

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | ID |
| doctor_name | VARCHAR(255) | NOT NULL | Nombre del doctor |
| doctor_email | VARCHAR(255) | NOT NULL | Email del doctor |
| doctor_specialty | VARCHAR(100) | NULLABLE | Especialidad |
| office_id | UUID | FK → offices.id, NOT NULL | Consultorio |
| dates | DATE[] | NOT NULL | Fechas reservadas |
| shift | VARCHAR(20) | NOT NULL | `morning`, `afternoon`, `full` |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Estado |
| total_price | DECIMAL(10,2) | NOT NULL | Precio total |
| payment_status | VARCHAR(20) | DEFAULT 'pending' | `pending`, `paid`, `refunded` |
| payment_method | VARCHAR(30) | NULLABLE | Método de pago |
| payment_date | TIMESTAMPTZ | NULLABLE | Fecha de pago |
| notes | TEXT | NULLABLE | Notas del doctor |
| admin_notes | TEXT | NULLABLE | Notas admin |
| approved_by | UUID | FK → users.id, NULLABLE | Admin que aprobó |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Estados:** `pending`, `approved`, `rejected`, `active`, `completed`, `cancelled`

---

### 5. `whatsapp_messages`
Log de mensajes WhatsApp

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | ID |
| to_phone | VARCHAR(20) | NOT NULL | Número destino |
| direction | VARCHAR(10) | NOT NULL | `outbound`, `inbound` |
| message_type | VARCHAR(30) | NOT NULL | Tipo |
| template_name | VARCHAR(50) | NULLABLE | Template |
| body | TEXT | NOT NULL | Contenido |
| status | VARCHAR(20) | NOT NULL | `queued`, `sent`, `delivered`, `read`, `failed` |
| whatsapp_id | VARCHAR(100) | NULLABLE | ID en Meta |
| error_message | TEXT | NULLABLE | Error |
| sent_at | TIMESTAMPTZ | NULLABLE | Fecha envío |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### 6. `n8n_workflows`
Registro de flujos n8n

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | ID |
| workflow_name | VARCHAR(100) | NOT NULL | Nombre del flujo |
| description | TEXT | NULLABLE | Descripción |
| trigger_type | VARCHAR(30) | NOT NULL | `webhook`, `cron`, `database_event`, `manual` |
| webhook_url | VARCHAR(500) | NULLABLE | URL del webhook |
| is_active | BOOLEAN | DEFAULT true | Activo |
| last_triggered_at | TIMESTAMPTZ | NULLABLE | Última ejecución |
| last_status | VARCHAR(20) | NULLABLE | Resultado |
| error_log | TEXT | NULLABLE | Log errores |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### 7. `notifications`
Notificaciones del sistema

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | ID |
| user_id | UUID | FK → users.id, NOT NULL | Destinatario |
| type | VARCHAR(30) | NOT NULL | Tipo |
| title | VARCHAR(255) | NOT NULL | Título |
| message | TEXT | NOT NULL | Mensaje |
| is_read | BOOLEAN | DEFAULT false | Leída |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## Relaciones

```
users (1) ─── (N) rentals (approved_by)
users (1) ─── (N) notifications

offices (1) ─── (N) rentals
```

---

## Índices

```sql
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_dates ON rentals USING GIN(dates);
CREATE INDEX idx_rentals_office_id ON rentals(office_id);
CREATE INDEX idx_whatsapp_status ON whatsapp_messages(status);
CREATE INDEX idx_whatsapp_to_phone ON whatsapp_messages(to_phone);
CREATE INDEX idx_n8n_workflows_active ON n8n_workflows(is_active);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

---

## Políticas RLS

```sql
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE n8n_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admins ven y gestionan todo
CREATE POLICY "Admins acceso total"
ON rentals FOR ALL
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Admins ven mensajes"
ON whatsapp_messages FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin'));
```
