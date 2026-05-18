"use client";

import React, { useEffect } from 'react';
import { Star } from 'lucide-react';

const col1 = [
  { author: "Renata P.", text: "Súper recomendado, excelente servicio. La doctora Rocío es muy responsable.", rating: 5 },
  { author: "Leonardo M.", text: "Excelente atención. Me atendieron súper rápido y sin incomodidad.", rating: 5 },
  { author: "Anna Cortes", text: "Los doctores muy amables, atención personalizada, manos de Ángel.", rating: 5 },
  { author: "Mimysa Diaz", text: "Excelente atención y servicios muy recomendables.", rating: 5 },
  { author: "R Eduardo", text: "Eficientes, precios accesibles, calidad y profesionalismo.", rating: 5 },
  { author: "Julene G.", text: "Excelente servicio, todo en tiempo y precio accesible.", rating: 5 },
  { author: "Itzel D.", text: "Me encanta la atención y la calidad del trabajo.", rating: 5 },
  { author: "Emmanuel A.", text: "Excelente lugar, atención de primera.", rating: 5 },
];

const col2 = [
  { author: "Beatriz Luna", text: "100% recomendable, la doctora Rocío es muy profesional.", rating: 5 },
  { author: "Oscar Peña", text: "Excelente atención, radiografías al instante, buen precio.", rating: 5 },
  { author: "Roxy Mar", text: "Excelente servicio, súper rápido y buena actitud.", rating: 5 },
  { author: "Mary Millán", text: "Llevo años con la Dra. Rocío, ampliamente recomendada.", rating: 5 },
  { author: "Sof Miranda", text: "Muy amables y buen servicio a precios accesibles.", rating: 5 },
  { author: "Robert Lopez", text: "Buen servicio y muy eficiente.", rating: 5 },
  { author: "Manu Lepu", text: "Servicio rápido y bueno, buenos costos.", rating: 5 },
  { author: "Owen V.", text: "Son amables, buenos precios.", rating: 5 },
];

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 opacity-60" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Card = ({ r }: { r: typeof col1[0] }) => (
  <div className="bg-white p-2 sm:p-6 rounded-[14px] sm:rounded-[28px] border border-gray-50 transition-all mb-1.5 sm:mb-5">
    <div className="flex items-center justify-between mb-0.5 sm:mb-3">
      <div className="flex gap-px sm:gap-0.5">
        {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 fill-primary text-primary" />)}
      </div>
      <GoogleLogo />
    </div>
    <p className="text-text-muted text-[10px] sm:text-[13px] leading-tight sm:leading-relaxed mb-1 sm:mb-4 break-words">
      &quot;{r.text}&quot;
    </p>
    <span className="text-text-main font-semibold text-[10px] sm:text-sm">{r.author}</span>
  </div>
);

export const Reviews = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#testimonios .reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonios" className="bg-slate-50/30 py-10 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-24">
          <div className="lg:w-[380px] shrink-0">
            <div className="reveal">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                <div className="w-6 sm:w-12 h-[2px] bg-primary/60" />
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-primary/60">Testimonios</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit mb-3 lg:mb-10">
                Lo que dicen<br /><span className="text-primary/60">nuestros</span> pacientes
              </h2>
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 fill-primary text-primary" />)}
                  <div className="relative w-4 h-4 sm:w-6 sm:h-6">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                    <div className="absolute top-0 left-0 overflow-hidden w-[60%]">
                      <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-primary text-primary" />
                    </div>
                  </div>
                </div>
                <span className="font-outfit font-black text-xl sm:text-4xl text-primary">4.6</span>
              </div>
              <p className="text-text-muted font-light text-[11px] sm:text-base mt-1 sm:mt-4">Más de 30 recomendaciones Google</p>
            </div>
          </div>

          <div className="reviews-clip h-[450px] flex gap-2 sm:gap-5 relative scroll-mask">
            <div className="flex-1 min-w-0 will-change-transform animate-scroll-up">
              {[...col1, ...col1].map((r, i) => <Card key={`c1-${i}`} r={r} />)}
            </div>

            <div className="flex-1 min-w-0 will-change-transform animate-scroll-down">
              {[...col2, ...col2].map((r, i) => <Card key={`c2-${i}`} r={r} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
