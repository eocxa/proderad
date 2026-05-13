"use client";

import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';

const MOCK_RENTED_OFFICES = [
  { date: new Date(), time: 'mañana' },
  { date: new Date(), time: 'tarde' },
];

const RENTAL_SLOTS = [
  { id: 'mañana', label: 'Turno Mañana', time: '9:00 AM - 2:00 PM' },
  { id: 'tarde', label: 'Turno Tarde', time: '2:00 PM - 7:00 PM' },
  { id: 'completo', label: 'Día Completo', time: '9:00 AM - 7:00 PM' }
];

export const RentalBookingSystem = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ doctorName: '', email: '', specialty: '' });

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  const isSlotOccupied = (slotId: string) => {
    if (!selectedDate) return false;
    return MOCK_RENTED_OFFICES.some(rent => 
      isSameDay(rent.date, selectedDate) && rent.time === slotId
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedSlot) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <section id="renta-form" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cta font-bold tracking-widest uppercase text-xs">Gestión B2B</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mt-3 mb-4 font-outfit">Sistema de Renta Profesional</h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
            Reserva tu espacio clínico de forma flexible. Elige turnos o días completos según tu flujo de pacientes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:row min-h-[600px]">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-gradient-to-br from-cta to-cta-dark p-10 text-white flex flex-col">
            <h2 className="text-3xl font-extrabold font-outfit mb-6">Área de Doctores</h2>
            <p className="text-white/80 text-sm mb-10 leading-relaxed flex-1">
              Todos nuestros consultorios incluyen servicios, recepción y esterilización. Elige tu fecha para ver disponibilidad.
            </p>
            
            <div className="space-y-6 mt-auto">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/60">Estatus</p>
                  <p className="font-bold text-sm">Espacios Disponibles</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0"><CalendarIcon className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/60">Fecha Reserva</p>
                  <p className="font-bold text-sm">{selectedDate ? format(selectedDate, "PPPP", { locale: es }) : 'Pendiente'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Booking Area */}
          <div className="flex-1 p-8 md:p-12">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-1">
                    <h3 className="font-outfit font-bold text-lg mb-6 flex items-center gap-2 text-text-main">
                      <span className="w-7 h-7 rounded-full bg-cta/10 text-cta flex items-center justify-center text-xs">1</span>
                      Fecha de Renta
                    </h3>
                    <div className="flex justify-center">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={es}
                        disabled={{ before: new Date() }}
                        className="p-3 border rounded-2xl shadow-sm bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-outfit font-bold text-lg mb-6 flex items-center gap-2 text-text-main">
                      <span className="w-7 h-7 rounded-full bg-cta/10 text-cta flex items-center justify-center text-xs">2</span>
                      Turnos Disponibles
                    </h3>
                    <div className="space-y-4">
                      {RENTAL_SLOTS.map((slot) => {
                        const occupied = isSlotOccupied(slot.id);
                        return (
                          <button
                            key={slot.id}
                            disabled={occupied}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={cn(
                              "w-full p-4 rounded-2xl text-left transition-all border flex justify-between items-center",
                              occupied ? "bg-gray-50 border-transparent opacity-40 cursor-not-allowed" : 
                              selectedSlot === slot.id ? "bg-white border-cta ring-2 ring-cta shadow-lg" : 
                              "bg-white border-gray-100 hover:border-cta hover:bg-gray-50"
                            )}
                          >
                            <div>
                              <p className={cn("font-bold text-sm", selectedSlot === slot.id ? "text-cta" : "text-text-main")}>{slot.label}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">{slot.time}</p>
                            </div>
                            {selectedSlot === slot.id && <div className="w-2 h-2 bg-cta rounded-full" />}
                            {occupied && <span className="text-[10px] font-bold text-red-500 uppercase">Ocupado</span>}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      disabled={!selectedDate || !selectedSlot}
                      onClick={handleNext}
                      className="w-full mt-10 bg-cta text-white py-4 rounded-xl font-bold hover:bg-cta-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-cta/20"
                    >
                      Continuar Solicitud
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-5 duration-300 py-6">
                <div className="text-center mb-10">
                  <h3 className="font-outfit font-bold text-2xl text-text-main mb-2">Datos del Profesional</h3>
                  <p className="text-text-muted text-sm">Solo necesitamos unos datos para validar tu renta.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Nombre del Doctor/a</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-cta/20 text-sm" value={formData.doctorName} onChange={e => setFormData({...formData, doctorName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Email Profesional</label>
                    <input type="email" required className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-cta/20 text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Especialidad</label>
                    <input type="text" placeholder="Ej: Endodoncista" required className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white transition-all outline-hidden focus:ring-2 focus:ring-cta/20 text-sm" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-text-muted hover:text-text-main transition-colors text-sm">Volver</button>
                    <button type="submit" className="flex-2 bg-text-main text-white py-4 rounded-xl font-bold shadow-xl shadow-black/20 hover:bg-black transition-all text-sm">Confirmar Reserva</button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-cta/10 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-12 h-12 text-cta" />
                </div>
                <h3 className="font-outfit font-bold text-3xl text-text-main mb-4">Solicitud Enviada</h3>
                <p className="text-text-muted max-w-sm mb-10 text-sm leading-relaxed">
                  Doctor/a <span className="font-bold text-text-main">{formData.doctorName}</span>, hemos recibido su solicitud de renta. En breve nuestro equipo validará su perfil y confirmará su espacio.
                </p>
                <button onClick={() => setStep(1)} className="bg-gray-100 text-text-main px-10 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">Entendido</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};
