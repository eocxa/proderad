"use client";

import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Calendar as CalendarIcon, ArrowRight, ArrowLeft } from 'lucide-react';

const MOCK_BOOKED = [
  { date: new Date(), time: '09:00' },
  { date: new Date(), time: '10:30' },
  { date: new Date(), time: '14:00' },
];

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'];

export const BookingSystem = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', service: 'limpieza' });

  useEffect(() => { setSelectedTime(null); }, [selectedDate]);

  const isSlotBooked = (time: string) => {
    if (!selectedDate) return false;
    return MOCK_BOOKED.some(apt => isSameDay(apt.date, selectedDate) && apt.time === time);
  };

  return (
    <section id="citas" className="py-32 lg:py-40 bg-slate-50/30 scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16 reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-primary/60" />
            <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary/60">Agenda en línea</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
            Reserva tu<span className="text-primary/15"> cita</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto reveal-scale">
          <div className="glass rounded-[40px] shadow-2xl shadow-slate-200/10 overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-[400px] w-full shrink-0 bg-gradient-to-br from-primary via-primary-dark to-secondary p-8 sm:p-10 lg:p-12 text-white flex flex-col">
              <h3 className="text-2xl font-bold font-outfit mb-2">Tu cita</h3>
              <p className="text-white/50 text-sm mb-10">Completa los datos y recibe confirmación inmediata.</p>
              <div className="space-y-6 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><CalendarIcon className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Fecha</p>
                    <p className="font-semibold text-sm truncate">{selectedDate ? format(selectedDate, "PPP", { locale: es }) : '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">Hora</p>
                    <p className="font-semibold text-sm">{selectedTime || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 sm:p-8 lg:p-12">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                  <div className="flex flex-col xl:flex-row gap-10">
                    <div className="flex-1">
                      <h4 className="font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                        Selecciona el día
                      </h4>
                      <div className="flex-1 overflow-x-auto">
                      <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={es} disabled={{ before: new Date() }} className="p-3 border rounded-2xl bg-white shadow-sm min-w-[280px] mx-auto" />
                    </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                        Elige la hora
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((time) => {
                          const booked = isSlotBooked(time);
                          return (
                            <button key={time} disabled={booked} onClick={() => setSelectedTime(time)}
                              className={cn("py-3 rounded-xl text-xs font-semibold transition-all border",
                                booked ? "bg-gray-50 text-gray-300 border-transparent cursor-not-allowed" :
                                selectedTime === time ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" :
                                "bg-white text-text-main border-gray-100 hover:border-primary hover:text-primary")}
                            >{time}</button>
                          );
                        })}
                      </div>
                      <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)}
                        className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/10 inline-flex items-center justify-center gap-2">
                        Continuar <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-5 duration-300 py-6">
                  <h4 className="font-outfit font-bold text-2xl text-text-main mb-2">Tus datos</h4>
                  <p className="text-text-muted text-sm mb-8">Confirmaremos tu cita por correo.</p>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-2">Nombre completo</label>
                      <input type="text" required className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 outline-hidden text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-2">Correo electrónico</label>
                      <input type="email" required className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 outline-hidden text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="correo@ejemplo.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-2">Servicio</label>
                      <select className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 outline-hidden text-sm text-text-main" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                        <option value="limpieza">Limpieza Dental</option>
                        <option value="ortodoncia">Ortodoncia</option>
                        <option value="implantes">Implantes</option>
                        <option value="estetica">Estética Dental</option>
                        <option value="endodoncia">Endodoncia</option>
                        <option value="periodoncia">Periodoncia</option>
                        <option value="pediatria">Odontopediatría</option>
                      </select>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 font-semibold text-text-muted hover:text-text-main transition-colors text-sm inline-flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Volver
                      </button>
                      <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-semibold shadow-lg shadow-primary/10 hover:bg-primary-dark transition-all text-sm">Confirmar reserva</button>
                    </div>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="font-outfit font-bold text-3xl text-text-main mb-3">¡Cita solicitada!</h3>
                  <p className="text-text-muted max-w-xs mb-10 text-sm leading-relaxed">
                    Enviamos la confirmación a <span className="font-bold text-text-main">{formData.email}</span>
                  </p>
                  <button onClick={() => setStep(1)} className="bg-slate-100 text-text-main px-8 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-all text-sm">Agendar otra cita</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
