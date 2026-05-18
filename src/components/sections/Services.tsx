"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/types';

const FALLBACK_SERVICES = [
  { id: "", name: "Ortodoncia", description: "Alineación invisible y brackets estéticos con tecnología 3D.", category: "ortodoncia" as const, duration_minutes: 60, price: 1500, is_active: true, requires_xray: false, requires_followup: false, created_at: "", updated_at: "" },
  { id: "", name: "Implantes", description: "Implantes de titanio con coronas de porcelana. Rehabilitación completa.", category: "implantes" as const, duration_minutes: 90, price: 8000, is_active: true, requires_xray: false, requires_followup: false, created_at: "", updated_at: "" },
  { id: "", name: "Estética Dental", description: "Carillas, blanqueamiento láser y diseño de sonrisa digital.", category: "estetica" as const, duration_minutes: 45, price: 1200, is_active: true, requires_xray: false, requires_followup: false, created_at: "", updated_at: "" },
  { id: "", name: "Endodoncia", description: "Tratamientos de conducto con microscopio. Técnicas sin dolor.", category: "endodoncia" as const, duration_minutes: 60, price: 2500, is_active: true, requires_xray: false, requires_followup: false, created_at: "", updated_at: "" },
  { id: "", name: "Periodoncia", description: "Cuidado de encías, limpieza profunda y prevención de enfermedades.", category: "periodoncia" as const, duration_minutes: 45, price: 1800, is_active: true, requires_xray: false, requires_followup: false, created_at: "", updated_at: "" },
  { id: "", name: "Odontopediatría", description: "Atención especializada para niños en un ambiente cálido y seguro.", category: "pediatria" as const, duration_minutes: 45, price: 600, is_active: true, requires_xray: false, requires_followup: false, created_at: "", updated_at: "" },
];

export const Services = () => {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(res => { if (res.success && res.data && res.data.length > 0) setServices(res.data); })
      .catch(() => {});

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#servicios .reveal, #servicios .reveal-left, #servicios .reveal-right, #servicios .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="py-16 lg:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] border-[40px] lg:border-[80px] border-slate-50/50 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] border-[20px] lg:border-[40px] border-slate-50/30 rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-10 lg:mb-20">
          <div className="reveal flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-secondary/60" />
              <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-secondary/60">Especialidades clínicas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
              Nuestros<br />
              <span className="text-primary/60">servicios</span>
            </h2>
          </div>
          <div className="reveal lg:pb-4">
            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-md font-light">
              Servicios odontológicos integrales con tecnología de diagnóstico 3D y protocolos certificados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div key={s.id || i} className={`reveal-scale group relative bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 border border-gray-50 hover:border-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/20 ${i % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-6'}`}>
              <div className="flex items-start justify-between mb-8">
                <span className="font-outfit font-black text-3xl sm:text-5xl text-primary/60 group-hover:text-primary/70 transition-colors duration-500 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-primary group-hover:scale-110 flex items-center justify-center transition-all duration-500 shadow-sm">
                  <ArrowRight className="w-5 h-5 text-primary/40 group-hover:text-white transition-colors group-hover:-rotate-45" />
                </div>
              </div>

              <h3 className="font-outfit font-bold text-xl text-text-main mb-3">{s.name}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">{s.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Desde</span>
                <span className="font-outfit font-black text-lg text-primary">${s.price.toLocaleString('es-MX')}</span>
              </div>

              <a href="#citas" className="absolute inset-0" aria-label={`Agendar ${s.name}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};