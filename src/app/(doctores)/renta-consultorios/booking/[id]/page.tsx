"use client";
import { Suspense, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, Check, ArrowRight, MessageCircle, Loader2 } from "lucide-react";

import CalendarPicker from "@/components/booking/CalendarPicker";
import BookingForm, { isFormValid, type FormData, type FormErrors } from "@/components/booking/BookingForm";
import BookingSummary from "@/components/booking/BookingSummary";

const SHIFT_MAP: Record<string, string> = { hora: "morning", "día": "afternoon", mes: "full", anual: "full" };

const STEP_TITLES = ["Seleccionar Fecha", "Información del Profesional", "Resumen y Pago"];

function BookingContent() {
  const { id } = useParams();
  const router = useRouter();
  const sp = useSearchParams();

  /* ── Parámetros desde details page ─────────────────────── */
  const plan          = sp.get("plan") || "hora";
  const addonIds      = (sp.get("addons") || "").split(",").filter(Boolean);
  const total         = Number(sp.get("total")) || 120;
  const consultorio   = sp.get("consultorio") || "Consultorio Premium";
  let addonPrices: Record<string, number> = {};
  try { addonPrices = JSON.parse(sp.get("addonPrices") || "{}"); } catch {}

  /* ── Estado ─────────────────────────────────────────────── */
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [selection, setSelection] = useState<{
    dates: Date[]; startDate: Date | null; endDate: Date | null; time: string;
  }>({ dates: [], startDate: null, endDate: null, time: "" });

  const [formData, setFormData] = useState<FormData>({ name: "", phone: "", email: "", cedula: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: "", phone: "", email: "", cedula: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  /* ── Validación por paso ─────────────────────────────────── */
  const isStep1Valid = () => {
    if (plan === "hora") return !!selection.startDate && !!selection.time;
    if (plan === "día")  return selection.dates.length > 0;
    return !!selection.startDate;
  };

  const isStepValid = () => {
    if (step === 1) return isStep1Valid();
    if (step === 2) return isFormValid(formData);
    if (step === 3) return !!paymentMethod;
    return false;
  };

  const handleNext = async () => {
    if (step === 3) {
      if (paymentMethod === "whatsapp") {
        setShowWhatsApp(true);
        return;
      }
      setSubmitting(true);
      setSubmitError("");
      try {
        const dateStr = selection.startDate ? selection.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const res = await fetch('/api/rentals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            office_id: (id as string) || '',
            doctor_name: formData.name,
            doctor_email: formData.email,
            doctor_specialty: `Cédula: ${formData.cedula}`,
            dates: [dateStr],
            shift: SHIFT_MAP[plan] || 'morning',
            notes: `Plan: ${plan}, Teléfono: ${formData.phone}, Método de pago: ${paymentMethod}`,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setShowWhatsApp(true);
        } else {
          setSubmitError(data.error?.message || 'Error al procesar la reserva.');
        }
      } catch {
        setSubmitError('Error de conexión. Intenta de nuevo.');
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep(s => s + 1);
  };

  /* ── Total dinámico para días múltiples ─────────────────── */
  const displayTotal = plan === "día" && selection.dates.length > 1
    ? total * selection.dates.length
    : total;

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      {/* Header fijo */}
      <header className="bg-white border-b border-outline-variant/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()}
              className="p-2 hover:bg-surface-container rounded-lg transition-all">
              <ChevronLeft size={24}/>
            </button>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">{STEP_TITLES[step - 1]}</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-[10px] font-bold text-outline">SESIÓN SEGURA</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 pb-40">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 max-w-xs mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant/20 -translate-y-1/2 z-0"/>
          {[1, 2, 3].map(n => (
            <div key={n} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all border-4
                ${step >= n ? "bg-primary text-white border-primary" : "bg-white text-outline border-surface-container-high"}`}>
                {step > n ? <Check size={20}/> : n}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <CalendarPicker plan={plan} onSelectionChange={setSelection}/>
              {plan === "día" && selection.dates.length > 1 && (
                <div className="mt-4 bg-white border border-outline-variant/20 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-outline">{selection.dates.length} días × ${total.toLocaleString("es-MX")}</span>
                  <span className="text-lg font-extrabold text-primary">${displayTotal.toLocaleString("es-MX")}</span>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <BookingForm
                value={formData}
                onChange={setFormData}
                errors={formErrors}
                onErrors={setFormErrors}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <BookingSummary
                plan={plan}
                consultorio={consultorio}
                addonIds={addonIds}
                addonPrices={addonPrices}
                total={displayTotal}
                formData={formData}
                selection={selection}
                paymentMethod={paymentMethod}
                onPaymentChange={setPaymentMethod}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Barra de acción fija */}
      {submitError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 rounded-xl px-6 py-3 text-red-700 text-sm font-medium max-w-md">
          {submitError}
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-outline-variant/30 px-4 py-5 z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={!isStepValid() || submitting}
            className="w-full h-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-40 disabled:grayscale disabled:scale-100"
          >
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</> : <><span>{step === 3 ? "Confirmar Reserva" : "Siguiente Paso"}</span><ArrowRight size={20}/></>}
          </button>
        </div>
      </div>

      {/* Modal WhatsApp */}
      <AnimatePresence>
        {showWhatsApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowWhatsApp(false)}/>
            <motion.div initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0, y:20 }}
              className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative z-10 max-w-lg w-full text-center space-y-8">
              <div className="w-24 h-24 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto text-[#25D366]">
                <MessageCircle size={56}/>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">¡Excelente elección!</h2>
                <p className="text-outline leading-relaxed">
                  En breve nos contactaremos contigo vía <span className="font-bold text-[#25D366]">WhatsApp</span> para
                  enviarte la información de pago y confirmar los detalles finales.
                </p>
              </div>
              <button onClick={() => router.push("/renta-consultorios")}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-xl shadow-primary/10">
                Volver al inicio
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer/>
    </div>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-outline">Cargando...</p></div>}>
      <BookingContent/>
    </Suspense>
  );
}
