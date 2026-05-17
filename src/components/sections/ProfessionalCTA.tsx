"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

export const ProfessionalCTA = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('#soy-profesional .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="soy-profesional" className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="reveal-scale">
          <Link href="/renta-consultorios" className="group relative block bg-gradient-to-br from-slate-50 to-slate-100 rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 lg:p-16 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/30 transition-all duration-500">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.02] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cta/[0.02] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-cta/[0.06] rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-cta group-hover:scale-110 transition-all duration-500 shadow-sm">
                <Building2 className="w-8 sm:w-10 h-8 sm:h-10 text-cta group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-main font-outfit mb-2">¿Eres profesional dental?</h3>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">Renta consultorios equipados por hora o día. Recepción, esterilización y todos los servicios incluidos.</p>
              </div>
              <span className="inline-flex items-center gap-2 bg-cta text-white px-5 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold text-sm group-hover:bg-cta-dark transition-all shadow-lg shadow-cta/10 group-hover:gap-3 shrink-0">
                Ver consultorios <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
