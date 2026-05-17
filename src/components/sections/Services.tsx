"use client";

import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const SERVICES = [
  { num: "01", title: "Ortodoncia", desc: "Alineación invisible y brackets estéticos con tecnología 3D.", stat: "1,500+" },
  { num: "02", title: "Implantes", desc: "Implantes de titanio con coronas de porcelana. Rehabilitación completa.", stat: "800+" },
  { num: "03", title: "Estética Dental", desc: "Carillas, blanqueamiento láser y diseño de sonrisa digital.", stat: "3,200+" },
  { num: "04", title: "Endodoncia", desc: "Tratamientos de conducto con microscopio. Técnicas sin dolor.", stat: "1,100+" },
  { num: "05", title: "Periodoncia", desc: "Cuidado de encías, limpieza profunda y prevención de enfermedades.", stat: "2,000+" },
  { num: "06", title: "Odontopediatría", desc: "Atención especializada para niños en un ambiente cálido y seguro.", stat: "900+" },
];

export const Services = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#servicios .reveal, #servicios .reveal-left, #servicios .reveal-right, #servicios .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="py-32 lg:py-40 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] border-[40px] lg:border-[80px] border-slate-50/50 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] border-[20px] lg:border-[40px] border-slate-50/30 rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-20">
          <div className="reveal flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-secondary/60" />
              <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-secondary/60">Especialidades clínicas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
              Nuestros<br />
              <span className="text-primary/15">servicios</span>
            </h2>
          </div>
          <div className="reveal lg:pb-4">
            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-md font-light">
              Servicios odontológicos integrales con tecnología de diagnóstico 3D y protocolos certificados.
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <div key={i} className={`reveal-scale group relative bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 border border-gray-50 hover:border-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/20 ${i % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-6'}`}>
              {/* Number */}
              <div className="flex items-start justify-between mb-8">
                <span className="font-outfit font-black text-3xl sm:text-5xl text-primary/[0.06] group-hover:text-primary/[0.12] transition-colors duration-500 select-none">
                  {s.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-primary group-hover:scale-110 flex items-center justify-center transition-all duration-500 shadow-sm">
                  <ArrowRight className="w-5 h-5 text-primary/40 group-hover:text-white transition-colors group-hover:-rotate-45" />
                </div>
              </div>

              <h3 className="font-outfit font-bold text-xl text-text-main mb-3">{s.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">{s.desc}</p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Casos tratados</span>
                <span className="font-outfit font-black text-lg text-primary">{s.stat}</span>
              </div>

              <a href="#citas" className="absolute inset-0" aria-label={`Agendar ${s.title}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
