"use client";

import React, { useEffect } from 'react';

const DOCTORS = [
  { name: "Dr. Roberto Méndez", role: "Ortodoncista", exp: "15+ años de experiencia", desc: "Especialista en alineación invisible y tratamientos complejos con tecnología 3D." },
  { name: "Dra. Elena Vargas", role: "Implantología & Estética", exp: "12+ años de experiencia", desc: "Rehabilitación oral y diseño de sonrisa mediante planificación digital." },
  { name: "Dr. Carlos Ruiz", role: "Endodoncista", exp: "10+ años de experiencia", desc: "Preservación dental con técnicas de conducto sin dolor y microscopio." },
];

export const Team = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#equipo .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="equipo" className="py-32 lg:py-40 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-20 reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-primary/60" />
            <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary/60">Equipo médico</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
            Especialistas<br />
            <span className="text-primary/15">certificados</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
          {DOCTORS.map((doc, i) => (
            <div key={i} className="reveal-scale group relative pt-20">
              {/* Avatar circle overlapping top of card */}
              <div className="absolute top-0 left-6 z-10 w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-[5px] border-white shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500">
                <span className="font-outfit font-black text-2xl text-primary/30 group-hover:text-primary/50 transition-colors">
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 pt-16 sm:pt-20 border border-gray-50 hover:shadow-2xl hover:shadow-slate-200/20 hover:-translate-y-2 transition-all duration-500 h-full">
                <h3 className="font-outfit font-bold text-xl text-text-main mb-1">{doc.name}</h3>
                <p className="text-primary font-semibold text-sm mb-2">{doc.role}</p>
                <p className="text-xs text-text-muted font-medium mb-4">{doc.exp}</p>
                <p className="text-text-muted text-sm leading-relaxed border-t border-gray-50 pt-4">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
