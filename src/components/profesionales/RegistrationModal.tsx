import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Contact, Phone, Mail, CheckCircle2 } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-surface-container rounded-full transition-colors text-outline"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Crear Cuenta</h2>
                    <p className="text-outline text-sm">Ingresa tus datos para iniciar el proceso de verificación.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Nombre(s)</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                          <input required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all" placeholder="Ej. Alex" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Apellidos</label>
                        <input required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all" placeholder="Ej. Rivera" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Cédula Profesional</label>
                      <div className="relative">
                        <Contact className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                        <input required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all" placeholder="Número de registro" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                        <input required type="email" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all" placeholder="doctor@ejemplo.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                        <input required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all" placeholder="+52 55..." />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                      Enviar Solicitud
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">¡Solicitud Enviada!</h2>
                  <p className="text-outline leading-relaxed px-6">
                    Gracias, validaremos la información y te avisaremos cuando estés verificado.
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
                  >
                    Entendido
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
