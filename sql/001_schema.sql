-- ============================================
-- ProDental Radiología — Schema v1.0
-- PostgreSQL + Supabase
-- ============================================

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS (admin / super_admin)
-- Nota: auth.users se gestiona vía Supabase Auth.
-- Esta tabla es para metadatos adicionales.
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. SERVICES
-- ============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'preventivo', 'ortodoncia', 'implantes', 'endodoncia', 'cirugia',
    'estetica', 'radiologia', 'pediatria', 'periodoncia'
  )),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_xray BOOLEAN NOT NULL DEFAULT false,
  requires_followup BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. OFFICES
-- ============================================
CREATE TABLE public.offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('equipada-plus', 'estandar', 'quirofano')),
  floor INTEGER NOT NULL CHECK (floor > 0),
  description TEXT,
  equipment TEXT[],
  photo_url VARCHAR(500),
  photo_gallery VARCHAR(500)[],
  price_per_hour DECIMAL(10,2) NOT NULL CHECK (price_per_hour >= 0),
  price_morning_shift DECIMAL(10,2) NOT NULL CHECK (price_morning_shift >= 0),
  price_afternoon_shift DECIMAL(10,2) NOT NULL CHECK (price_afternoon_shift >= 0),
  price_full_day DECIMAL(10,2) NOT NULL CHECK (price_full_day >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. RENTALS
-- ============================================
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_name VARCHAR(255) NOT NULL,
  doctor_email VARCHAR(255) NOT NULL,
  doctor_specialty VARCHAR(100),
  office_id UUID NOT NULL REFERENCES public.offices(id) ON DELETE RESTRICT,
  dates DATE[] NOT NULL,
  shift VARCHAR(20) NOT NULL CHECK (shift IN ('morning', 'afternoon', 'full')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'
  )),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method VARCHAR(30) CHECK (payment_method IN ('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'deposito')),
  payment_date TIMESTAMPTZ,
  notes TEXT,
  admin_notes TEXT,
  approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. WHATSAPP_MESSAGES
-- ============================================
CREATE TABLE public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_phone VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  message_type VARCHAR(30) NOT NULL,
  template_name VARCHAR(50),
  body TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
  whatsapp_id VARCHAR(100),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 6. N8N_WORKFLOWS
-- ============================================
CREATE TABLE public.n8n_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_name VARCHAR(100) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(30) NOT NULL CHECK (trigger_type IN ('webhook', 'cron', 'database_event', 'manual')),
  webhook_url VARCHAR(500),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  last_status VARCHAR(20),
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 7. NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_rentals_status ON public.rentals(status);
CREATE INDEX idx_rentals_office_id ON public.rentals(office_id);
CREATE INDEX idx_rentals_dates ON public.rentals USING GIN(dates);
CREATE INDEX idx_rentals_created_at ON public.rentals(created_at DESC);
CREATE INDEX idx_whatsapp_phone ON public.whatsapp_messages(to_phone);
CREATE INDEX idx_whatsapp_status ON public.whatsapp_messages(status);
CREATE INDEX idx_whatsapp_created ON public.whatsapp_messages(created_at DESC);
CREATE INDEX idx_n8n_active ON public.n8n_workflows(is_active);
CREATE INDEX idx_n8n_last_triggered ON public.n8n_workflows(last_triggered_at DESC);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_offices_type ON public.offices(type);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public: cualquiera puede leer servicios
CREATE POLICY "servicios_publicos" ON public.services FOR SELECT USING (is_active = true);

-- Public: cualquiera puede leer consultorios activos
CREATE POLICY "consultorios_publicos" ON public.offices FOR SELECT USING (is_active = true);

-- Admin: acceso total a rentals
CREATE POLICY "admin_rentals" ON public.rentals FOR ALL
USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'super_admin')));

-- Admin: acceso total a whatsapp_messages
CREATE POLICY "admin_whatsapp" ON public.whatsapp_messages FOR SELECT
USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'super_admin')));

-- Admin: acceso total a n8n_workflows
CREATE POLICY "admin_n8n" ON public.n8n_workflows FOR ALL
USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'super_admin')));

-- Admin: notificaciones propias
CREATE POLICY "admin_notifications" ON public.notifications FOR SELECT
USING (user_id = auth.uid());

-- Insert de rentals público (la web lo necesita para solicitar renta)
CREATE POLICY "public_insert_rentals" ON public.rentals FOR INSERT
WITH CHECK (true);

-- Insert de whatsapp público (webhook de Meta)
CREATE POLICY "public_insert_whatsapp" ON public.whatsapp_messages FOR INSERT
WITH CHECK (true);

-- Insert de n8n público (webhook)
CREATE POLICY "public_insert_n8n" ON public.n8n_workflows FOR INSERT
WITH CHECK (true);

-- ============================================
-- FUNCIONES
-- ============================================

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_offices_updated_at BEFORE UPDATE ON public.offices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_rentals_updated_at BEFORE UPDATE ON public.rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_n8n_updated_at BEFORE UPDATE ON public.n8n_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO public.services (name, description, category, duration_minutes, price) VALUES
  ('Limpieza Dental', 'Limpieza profesional con ultrasonido y profilaxis', 'preventivo', 45, 500),
  ('Ortodoncia', 'Colocación de brackets metálicos o estéticos', 'ortodoncia', 60, 1500),
  ('Implantes Dentales', 'Implante unitario de titanio con corona', 'implantes', 90, 8000),
  ('Endodoncia', 'Tratamiento de conductos radiculares', 'endodoncia', 60, 2500),
  ('Cirugía Dental', 'Extracciones y cirugía oral menor', 'cirugia', 60, 3000),
  ('Estética Dental', 'Blanqueamiento y carillas', 'estetica', 45, 1200),
  ('Radiología', 'Radiografías panorámicas y periapicales', 'radiologia', 30, 400),
  ('Odontopediatría', 'Atención dental para niños', 'pediatria', 45, 600),
  ('Periodoncia', 'Tratamiento de encías', 'periodoncia', 45, 1800);

INSERT INTO public.offices (name, type, floor, description, equipment, price_per_hour, price_morning_shift, price_afternoon_shift, price_full_day) VALUES
  ('Consultorio 101', 'equipada-plus', 1, 'Unidad dental completa con rayos X digital', ARRAY['Unidad dental', 'Rayos X', 'Esterilizador', 'Compresor'], 150, 500, 500, 900),
  ('Consultorio 102', 'estandar', 1, 'Unidad dental básica', ARRAY['Unidad dental', 'Esterilizador'], 100, 350, 350, 600),
  ('Quirófano Dental', 'quirofano', 2, 'Quirófano equipado para cirugías mayores', ARRAY['Unidad quirúrgica', 'Monitor de signos', 'Oxígeno', 'Succión'], 200, 700, 700, 1300);
