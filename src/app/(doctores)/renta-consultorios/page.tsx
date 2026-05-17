"use client";

import React, { useEffect } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Building2, Clock, Shield } from "lucide-react";
import { RentalBookingSystem } from "@/components/sections/RentalBookingSystem";
import Link from "next/link";

const FEATURES = [
  { icon: Building2, title: "Totalmente Equipados", desc: "Unidades dentales modernas, rayos X digital y equipo de esterilización de primer nivel." },
  { icon: Clock, title: "Flexibilidad de Horario", desc: "Renta por hora, medio turno o día completo según las necesidades de tu práctica." },
  { icon: Shield, title: "Ubicación & Seguridad", desc: "Zona de alta plusvalía con seguridad 24/7, recepción y estacionamiento para tus pacientes." },
];

export default function RentaPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#renta-hero .reveal, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Navbar />
      
      {/* Hero */}
      <section id="renta-hero" className="pt-32 pb-20 lg:pb-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border-[60px] border-slate-50/50 rounded-full translate-x-1/4 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 border-[2px] border-primary/[0.03] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="max-w-3xl">
            <div className="reveal">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-16 h-[1px] bg-cta/40" />
                <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-cta/60">Portal profesional</span>
              </div>
            </div>
            <div className="reveal">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit mb-8">
                El espacio perfecto<br />
                para tu <span className="text-cta/80">práctica</span>
              </h1>
            </div>
            <div className="reveal">
              <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8 lg:mb-10 font-light max-w-xl">
                Consultorios dentales de alta gama totalmente equipados. Recepción, esterilización y todos los servicios incluidos para que te enfoques únicamente en tus pacientes.
              </p>
            </div>
            <div className="reveal">
              <Link href="#renta-form" className="bg-cta text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-cta-dark transition-all shadow-xl shadow-cta/10 inline-flex items-center gap-2">
                Consultar disponibilidad
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {FEATURES.map((feat, i) => (
              <div key={i} className="reveal-scale bg-white p-8 rounded-[36px] border border-gray-50 hover:border-cta/5 hover:shadow-2xl hover:shadow-slate-200/10 hover:-translate-y-2 transition-all duration-500">
                <div className="w-14 h-14 bg-cta/[0.06] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cta transition-colors">
                  <feat.icon className="text-cta w-7 h-7" />
                </div>
                <h3 className="font-outfit font-bold text-xl mb-4 text-text-main">{feat.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="reveal-scale">
        <RentalBookingSystem />
      </div>
      <Footer />
    </main>
  );
}
