"use client";

import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import { CheckCircle2, Calendar as CalendarIcon, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const MOCK_RENTED = [
  { date: new Date(), time: 'mañana' },
  { date: new Date(), time: 'tarde' },
];

const RENTAL_SLOTS = [
  { id: 'mañana', label: 'Turno Mañana', time: '9:00 AM – 2:00 PM' },
  { id: 'tarde', label: 'Turno Tarde', time: '2:00 PM – 7:00 PM' },
  { id: 'completo', label: 'Día Completo', time: '9:00 AM – 7:00 PM' },
];

export const RentalBookingSystem = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ doctorName: '', email: '', specialty: '' });

  useEffect(() => { setSelectedSlot(null); }, [selectedDate]);

  const isSlotOccupied = (slotId: string) => {
    if (!selectedDate) return false;
    return MOCK_RENTED.some(rent => isSameDay(rent.date, selectedDate) && rent.time === slotId);
  };

  return (
    <section id="renta-form" className="py-28 lg:py-36 bg-white scroll-mt-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-cta/60" />
            <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-cta/60">Reserva de espacio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
            Solicitar<span className="text-cta/15"> renta</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-[40px] shadow-2xl shadow-slate-200/10 overflow-hidden flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-[400px] w-full shrink-0 bg-gradient-to-br from-cta to-cta-dark p-8 sm:p-10 lg:p-12 text-white flex flex-col">
              <h3 className="text-2xl font-bold font-outfit mb-2">Área de doctores</h3>
              <p className="text-white/50 text-sm mb-10">Consultorios equipados con recepción, esterilización y todos los servicios incluidos.</p>
              <div className="space-y-6 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Estatus</p>
                    <p className="font-semibold text-sm">Espacios disponibles</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><CalendarIcon className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Fecha</p>
                    <p className="font-semibold text-sm truncate">{selectedDate ? format(selectedDate, "PPP", { locale: es }) : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 sm:p-8 lg:p-12">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                  <div className="flex flex-col xl:flex-row gap-10">
                    <div className="flex-1">
                      <h4 className="font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-cta/10 text-cta flex items-center justify-center text-xs font-bold">1</span>
                        Fecha de renta
                      </h4>
                      <div className="flex-1 overflow-x-auto">
                      <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={es} disabled={{ before: new Date() }} className="p-3 border rounded-2xl bg-white shadow-sm min-w-[280px] mx-auto" />
                    </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-cta/10 text-cta flex items-center justify-center text-xs font-bold">2</span>
                        Turno
                      </h4>
                      <div className="space-y-3">
                        {RENTAL_SLOTS.map((slot) => {
                          const occupied = isSlotOccupied(slot.id);
                          return (
                            <button key={slot.id} disabled={occupied} onClick={() => setSelectedSlot(slot.id)}
                              className={cn("w-full p-4 rounded-2xl text-left transition-all border flex justify-between items-center",
                                occupied ? "bg-gray-50 border-transparent opacity-40 cursor-not-allowed" :
                                selectedSlot === slot.id ? "bg-white border-cta shadow-lg shadow-cta/10" :
                                "bg-white border-gray-100 hover:border-cta hover:bg-gray-50")}>
                              <div>
                                <p className={cn("font-semibold text-sm", selectedSlot === slot.id ? "text-cta" : "text-text-main")}>{slot.label}</p>
                                <p className="text-[10px] text-text-muted mt-0.5">{slot.time}</p>
                              </div>
                              {selectedSlot === slot.id && <div className="w-2 h-2 bg-cta rounded-full" />}
                            </button>
                          );
                        })}
                      </div>
                      <button disabled={!selectedDate || !selectedSlot} onClick={() => setStep(2)}
                        className="w-full mt-8 bg-cta text-white py-4 rounded-2xl font-semibold hover:bg-cta-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cta/10 inline-flex items-center justify-center gap-2">
                        Continuar <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-5 duration-300 py-6">
                  <h4 className="font-outfit font-bold text-2xl text-text-main mb-2">Tus datos</h4>
                  <p className="text-text-muted text-sm mb-8">Validaremos tu perfil y confirmaremos la renta.</p>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-2">Nombre del doctor</label>
                      <input type="text" required className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cta/10 outline-hidden text-sm" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} placeholder="Dr. Nombre" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-2">Correo profesional</label>
                      <input type="email" required className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cta/10 outline-hidden text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="doctor@email.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-2">Especialidad</label>
                      <input type="text" required className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cta/10 outline-hidden text-sm" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="Ej: Endodoncista" />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 font-semibold text-text-muted hover:text-text-main transition-colors text-sm inline-flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Volver
                      </button>
                      <button type="submit" className="flex-[2] bg-cta text-white py-4 rounded-2xl font-semibold shadow-lg shadow-cta/10 hover:bg-cta-dark transition-all text-sm">Confirmar reserva</button>
                    </div>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="font-outfit font-bold text-3xl text-text-main mb-3">¡Solicitud enviada!</h3>
                  <p className="text-text-muted max-w-xs mb-10 text-sm leading-relaxed">
                    Dr/a. <span className="font-bold text-text-main">{formData.doctorName}</span>, validaremos su perfil y confirmaremos su espacio.
                  </p>
                  <button onClick={() => setStep(1)} className="bg-slate-100 text-text-main px-8 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-all text-sm">Nueva solicitud</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
