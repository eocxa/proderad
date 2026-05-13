"use client";

import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Calendar as CalendarIcon } from 'lucide-react';

// Mock de citas ya ocupadas para la demo
// En Fase 4, esto vendrá de Supabase
const MOCK_BOOKED_APPOINTMENTS = [
  { date: new Date(), time: '09:00' },
  { date: new Date(), time: '10:00' },
  { date: new Date(), time: '14:00' },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const BookingSystem = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Fecha/Hora, 2: Datos, 3: Confirmación
  const [formData, setFormData] = useState({ name: '', email: '', service: 'limpieza' });

  // Resetear hora si cambia el día
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  const isSlotBooked = (time: string) => {
    if (!selectedDate) return false;
    return MOCK_BOOKED_APPOINTMENTS.some(apt => 
      isSameDay(apt.date, selectedDate) && apt.time === time
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <section id="citas" className="py-24 bg-gray-50/50 scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">Sistema Inteligente</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mt-3 mb-4 font-outfit">Reserva tu cita en tiempo real</h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
            Nuestro calendario se sincroniza directamente con la agenda de los especialistas para evitar duplicidades.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-gradient-to-br from-primary to-secondary p-10 text-white flex flex-col">
            <h2 className="text-3xl font-extrabold font-outfit mb-6">Tu Espacio</h2>
            <p className="text-white/80 text-sm mb-10 leading-relaxed flex-1">
              Selecciona una fecha y hora disponible. Una vez confirmada, recibirás un recordatorio por correo electrónico.
            </p>
            
            <div className="space-y-6 mt-auto">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0"><CalendarIcon className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/60">Fecha</p>
                  <p className="font-bold text-sm">{selectedDate ? format(selectedDate, "PPPP", { locale: es }) : 'No elegida'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/60">Hora</p>
                  <p className="font-bold text-sm">{selectedTime || 'No elegida'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Booking Area */}
          <div className="flex-1 p-8 md:p-12">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="font-outfit font-bold text-lg mb-4 flex items-center gap-2 text-text-main">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                      Día de la Cita
                    </h3>
                    <div className="flex justify-center lg:justify-start">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={es}
                        disabled={{ before: new Date() }}
                        className="p-2 border rounded-2xl shadow-sm bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-outfit font-bold text-lg mb-4 flex items-center gap-2 text-text-main">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                      Horas Libres
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map((time) => {
                        const booked = isSlotBooked(time);
                        return (
                          <button
                            key={time}
                            disabled={booked}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "py-3 rounded-xl text-xs font-bold transition-all border",
                              booked ? "bg-gray-50 text-gray-300 border-transparent cursor-not-allowed line-through" : 
                              selectedTime === time ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105" : 
                              "bg-white text-text-main border-gray-100 hover:border-primary hover:text-primary hover:shadow-md"
                            )}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleNext}
                      className="w-full mt-8 bg-text-main text-white py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                    >
                      Continuar a tus datos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-5 duration-300 py-6">
                <div className="text-center mb-8">
                  <h3 className="font-outfit font-bold text-2xl text-text-main mb-2">Finalizar Reserva</h3>
                  <p className="text-text-muted text-sm">Necesitamos tu contacto para el recordatorio.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Tu Nombre Completo</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-primary/20 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Correo Electrónico</label>
                    <input type="email" required className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-primary/20 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Tipo de Servicio</label>
                    <select className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-primary/20 text-sm" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                      <option value="limpieza">Limpieza Dental</option>
                      <option value="ortodoncia">Ortodoncia</option>
                      <option value="implantes">Implantes</option>
                      <option value="estetica">Estética Dental</option>
                    </select>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-text-muted hover:text-text-main transition-colors text-sm">Atrás</button>
                    <button type="submit" className="flex-2 bg-cta text-white py-4 rounded-xl font-bold shadow-xl shadow-cta/30 hover:bg-cta-dark transition-all text-sm">Confirmar Reserva</button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-outfit font-bold text-3xl text-text-main mb-3">¡Cita Solicitada!</h3>
                <p className="text-text-muted max-w-xs mb-10 text-sm leading-relaxed">
                  Te hemos enviado un correo a <span className="font-bold text-text-main underline decoration-primary decoration-2">{formData.email}</span> con los detalles de tu cita.
                </p>
                <button onClick={() => setStep(1)} className="bg-primary/10 text-primary px-8 py-3 rounded-xl font-bold hover:bg-primary/20 transition-all text-sm">Hacer otra cita</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};
