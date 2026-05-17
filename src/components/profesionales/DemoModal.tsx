import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, MapPin, User, Mail, Phone } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string, name: string }[];
}

export default function DemoModal({ isOpen, onClose, categories }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const dates = Array.from({ length: 14 }, (_, i) => i + 1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isFormValid = formData.name && formData.email && formData.phone && selectedCategory && selectedDate;

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
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-surface-container rounded-full transition-colors text-outline"
              >
                <X size={20} />
              </button>

              {!submitted ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Agendar Visita</h2>
                    <p className="text-outline text-sm">Conoce nuestras instalaciones de primera mano.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Professional Info */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Información de contacto</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                          <input 
                            required 
                            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary transition-all" 
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                          <input 
                            required 
                            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary transition-all" 
                            placeholder="Teléfono"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                        <input 
                          required 
                          type="email"
                          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-secondary transition-all" 
                          placeholder="Correo electrónico profesional"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Office Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MapPin size={12} className="text-secondary" /> Especialidad de interés
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${
                              selectedCategory === cat.id
                                ? "bg-secondary-container text-on-secondary-container border-secondary-container shadow-lg shadow-secondary/10"
                                : "bg-surface-container-low border-outline-variant/30 text-outline hover:border-secondary/40"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simple Calendar */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1 flex items-center gap-2">
                          <CalendarIcon size={12} className="text-secondary" /> Seleccionar Fecha
                        </label>
                        <div className="flex gap-1">
                          <button type="button" className="p-1 rounded-full hover:bg-surface-container text-outline"><ChevronLeft size={16} /></button>
                          <button type="button" className="p-1 rounded-full hover:bg-surface-container text-outline"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {["D", "L", "M", "M", "J", "V", "S"].map(d => (
                          <span key={d} className="text-[9px] font-bold text-outline/40 uppercase">{d}</span>
                        ))}
                        <span className="aspect-square flex items-center justify-center text-xs text-outline/20">28</span>
                        <span className="aspect-square flex items-center justify-center text-xs text-outline/20">29</span>
                        <span className="aspect-square flex items-center justify-center text-xs text-outline/20">30</span>
                        {dates.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDate(d)}
                            className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                              selectedDate === d
                                ? "bg-primary text-white shadow-lg"
                                : "hover:bg-surface-container text-primary"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!isFormValid}
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                    >
                      Agendar Visita
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">¡Cita Solicitada!</h2>
                  <p className="text-outline leading-relaxed px-6">
                    Se te notificará para confirmar tu cita. ¡Estamos ansiosos por mostrarte nuestros espacios!
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
                  >
                    Cerrar
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
