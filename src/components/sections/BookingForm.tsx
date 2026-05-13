"use client";

import React, { useState } from 'react';
import { validateEmail, isNotEmpty } from '@/lib/forms/validation';

export const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    service: 'limpieza'
  });

  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNotEmpty(formData.name) || !validateEmail(formData.email) || !isNotEmpty(formData.date)) {
      alert("Por favor rellena todos los campos correctamente.");
      return;
    }

    setStatus('submitting');
    
    setTimeout(() => {
      alert("✅ Formulario de prueba enviado. Se conectará a Supabase en Fase 4");
      console.log("Datos recibidos:", formData);
      setStatus('idle');
    }, 1000);
  };

  return (
    <section id="citas" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-text-main font-outfit mb-3">Agenda tu Cita</h2>
            <p className="text-text-muted text-sm">Reserva tu espacio en menos de 1 minuto.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary outline-hidden transition-all bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary outline-hidden transition-all bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Fecha</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary outline-hidden transition-all bg-white"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Hora</label>
                <input 
                  type="time" 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary outline-hidden transition-all bg-white"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Servicio</label>
              <select 
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary outline-hidden transition-all bg-white"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
              >
                <option value="limpieza">Limpieza Dental</option>
                <option value="ortodoncia">Ortodoncia</option>
                <option value="implantes">Implantes</option>
                <option value="otro">Otros</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full bg-cta text-white py-5 rounded-2xl font-bold text-lg hover:bg-cta-dark transition-all shadow-lg shadow-cta/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Enviando...' : 'Confirmar Cita'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
