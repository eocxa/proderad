"use client";

import React, { useState } from 'react';
import { validateEmail, isNotEmpty } from '@/lib/forms/validation';

export const RentalForm = () => {
  const [formData, setFormData] = useState({
    doctorName: '',
    email: '',
    officeType: 'equipada-plus',
    dates: '',
    hours: 'mañana'
  });

  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNotEmpty(formData.doctorName) || !validateEmail(formData.email) || !isNotEmpty(formData.dates)) {
      alert("Por favor rellena todos los campos correctamente.");
      return;
    }

    setStatus('submitting');
    
    setTimeout(() => {
      alert("✅ Formulario de prueba enviado. Se conectará a Supabase en Fase 4");
      console.log("Datos de renta recibidos:", formData);
      setStatus('idle');
    }, 1000);
  };

  return (
    <section id="renta-form" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-text-main font-outfit mb-3 text-cta">Agendar Consultorio</h2>
            <p className="text-text-muted text-sm">Reserva tu espacio profesional hoy mismo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Nombre del Doctor</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-cta outline-hidden transition-all bg-white"
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Correo de Contacto</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-cta outline-hidden transition-all bg-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Tipo de Consultorio</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-cta outline-hidden transition-all bg-white"
                  value={formData.officeType}
                  onChange={(e) => setFormData({...formData, officeType: e.target.value})}
                >
                  <option value="equipada-plus">Equipada Plus</option>
                  <option value="estandar">Estándar</option>
                  <option value="quirofano">Quirófano Dental</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Horario Interés</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-cta outline-hidden transition-all bg-white"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                >
                  <option value="mañana">Turno Mañana (9am - 2pm)</option>
                  <option value="tarde">Turno Tarde (2pm - 7pm)</option>
                  <option value="completo">Día Completo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Fecha(s) solicitada(s)</label>
              <input 
                type="text" 
                placeholder="Ej: 15 y 16 de Mayo"
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-cta outline-hidden transition-all bg-white"
                value={formData.dates}
                onChange={(e) => setFormData({...formData, dates: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full bg-cta text-white py-5 rounded-2xl font-bold text-lg hover:bg-cta-dark transition-all shadow-lg shadow-cta/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Verificando...' : 'Solicitar Renta'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
