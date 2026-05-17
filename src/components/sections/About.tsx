"use client";

import React, { useEffect, useRef } from 'react';

const stats = [
  { value: 98, suffix: "%", label: "Satisfacción" },
  { value: 15, suffix: "+", label: "Especialistas" },
  { value: 11, suffix: "k+", label: "Pacientes" },
];

export const About = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#nosotros .reveal, #nosotros .reveal-left, #nosotros .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="nosotros" className="py-32 lg:py-40 bg-slate-50/30 relative overflow-hidden">
      {/* Diagonal gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] via-transparent to-secondary/[0.02] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-20 lg:gap-32 items-center">
          {/* Left — Visual (hidden on mobile) */}
          <div className="hidden lg:block relative reveal-left">
            <div className="relative w-full max-w-sm mx-auto lg:mx-0">
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 rounded-[48px] shadow-2xl shadow-slate-200/30 overflow-hidden relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-8">
                    <svg className="w-12 h-12 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C9 2 7 4 7 7c0 2 1 3 1 5 0 3-1 5-2 7h2c1-2 2-4 2-7 0-2-1-3-1-5 0-2 2-3 3-3s3 1 3 3c0 2-1 3-1 5 0 3 1 5 2 7h2c-1-2-2-4-2-7 0-2 1-3 1-5 0-3-2-5-5-5z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse-soft" />
                    <span className="text-xs font-semibold text-text-main">Certificado</span>
                  </div>
                  <p className="text-text-muted/50 text-sm">COFEPRIS vigente</p>
                </div>
              </div>

              {/* Floating stats — mobile hidden */}
              <div className="hidden lg:block absolute -bottom-8 -right-12 glass rounded-3xl shadow-xl p-6 animate-float">
                <div className="text-3xl font-black font-outfit text-primary">98%</div>
                <div className="text-xs text-text-muted font-semibold mt-1 uppercase tracking-wider">Satisfacción</div>
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <div className="reveal-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-primary/60" />
                <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary/60">Nuestra trayectoria</span>
              </div>
            </div>

            <div className="reveal-right">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit mb-8 lg:mb-10">
              Más de una década<br />
              <span className="text-primary/15">cuidando</span> sonrisas
            </h2>
            </div>

            <div className="reveal-right">
              <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8 lg:mb-12 font-light max-w-lg">
                En ProDental combinamos experiencia clínica con tecnología de diagnóstico avanzada. Cada tratamiento se planifica con rigor científico y se ejecuta bajo estándares certificados por COFEPRIS.
              </p>
            </div>

            <div className="reveal-right flex flex-wrap gap-8 sm:gap-12 lg:gap-16 stagger">
              {stats.map((s, i) => (
                <div key={i} className="reveal-scale">
                  <div className="font-outfit font-black text-3xl sm:text-4xl lg:text-6xl text-primary mb-2">
                    {s.value}<span className="text-lg sm:text-2xl lg:text-3xl">{s.suffix}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
