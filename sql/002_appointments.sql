-- ============================================
-- Nueva tabla para Citas de Pacientes
-- ============================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20),
  service_category VARCHAR(50),
  office_id UUID REFERENCES public.offices(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción pública (desde el formulario de la web)
CREATE POLICY "public_insert_appointments" ON public.appointments FOR INSERT
WITH CHECK (true);

-- Política para que admin pueda ver todo
CREATE POLICY "admin_select_appointments" ON public.appointments FOR SELECT
USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'super_admin')));

-- Trigger para updated_at
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índice para búsquedas rápidas
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
