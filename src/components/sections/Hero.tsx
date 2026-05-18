"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        const circles = parallaxRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
        circles.forEach(el => {
          const speed = parseFloat(el.dataset.parallax || '0.2');
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="inicio" className="relative flex items-center bg-white overflow-hidden pt-14 lg:pt-20" ref={parallaxRef}>
      {/* Decorative parallax shapes */}
      <div data-parallax="0.1" className="absolute top-0 right-0 w-[30vw] lg:w-[50vw] h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 -skew-x-3 translate-x-10 lg:translate-x-20 overflow-hidden" />
      <div data-parallax="0.3" className="hidden sm:block absolute top-24 right-[20vw] w-40 lg:w-80 h-40 lg:h-80 border-[2px] border-primary/[0.04] rounded-full" />
      <div data-parallax="0.2" className="hidden sm:block absolute bottom-20 right-[30vw] w-32 lg:w-48 h-32 lg:h-48 border-[2px] border-secondary/[0.05] rounded-full" />
      <div data-parallax="0.15" className="absolute top-1/2 left-0 w-32 lg:w-64 h-32 lg:h-64 bg-primary/[0.02] rounded-full -translate-x-1/2" />
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-[15%] animate-float-slow pointer-events-none">
        <div className="w-3 h-3 bg-primary/20 rounded-full" />
      </div>
      <div className="absolute top-[60%] right-[15%] animate-float-delayed pointer-events-none">
        <div className="w-2 h-2 bg-secondary/30 rounded-full" />
      </div>
      <div className="absolute bottom-1/4 left-[25%] animate-float pointer-events-none">
        <div className="w-4 h-4 border-2 border-primary/10 rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative">
<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0 items-center lg:min-h-screen py-4 lg:py-20">
           {/* Left column */}
           <div className="relative py-4 lg:py-20">
            <div className="reveal">
              <div className="inline-flex items-center gap-4 mb-4 lg:mb-8">
                <div className="w-16 h-[1px] bg-primary/40" />
                <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary/60">Clínica dental certificada</span>
              </div>
            </div>

            <div className="relative">
              {/* Big decorative number */}
              <div className="hidden lg:block absolute -top-16 -left-6 text-[180px] font-black text-primary/[0.03] select-none leading-none font-outfit pointer-events-none">
                11
              </div>
              
              <div className="reveal relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[88px] font-black text-text-main leading-[0.92] tracking-tighter font-outfit">
                  Sonrisas
                  <br />
                  <span className="relative inline-block">
                    que
                    <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-[4px] sm:h-[6px] lg:h-[8px] bg-primary/15" />
                  </span>
                  {' '}transforman
                </h1>
              </div>
            </div>

            <div className="reveal mt-6 lg:mt-10">
              <p className="text-base sm:text-lg lg:text-xl text-text-muted leading-relaxed max-w-lg font-light">
                Especialistas en ortodoncia, implantología y estética dental con más de una década de excelencia clínica en CDMX.
              </p>
            </div>

            <div className="reveal flex flex-wrap items-center gap-5 mt-6 lg:mt-10">
              <Link href="#citas" className="group bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/10 hover:shadow-primary/20 inline-flex items-center gap-3 hover:gap-4">
                Agendar consulta
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#servicios" className="text-sm font-semibold text-text-main hover:text-primary transition-colors border-b border-transparent hover:border-primary/30 pb-1">
                Explorar servicios
              </Link>
            </div>

            {/* Stats row */}
            <div className="reveal flex flex-wrap items-center gap-4 sm:gap-8 lg:gap-12 mt-6 lg:mt-14 pt-6 lg:pt-10 border-t border-gray-100">
              <div className="text-center lg:text-left min-w-0">
                <div className="font-outfit font-black text-2xl sm:text-3xl lg:text-4xl text-primary">4.6</div>
                <div className="text-[10px] sm:text-xs text-text-muted font-medium mt-1">Google Rating</div>
              </div>
              <div className="w-px h-8 lg:h-10 bg-gray-100 shrink-0" />
              <div className="text-center lg:text-left min-w-0">
                <div className="font-outfit font-black text-2xl sm:text-3xl lg:text-4xl text-primary">11k+</div>
                <div className="text-[10px] sm:text-xs text-text-muted font-medium mt-1">Pacientes</div>
              </div>
              <div className="w-px h-8 lg:h-10 bg-gray-100 shrink-0" />
              <div className="text-center lg:text-left min-w-0">
                <div className="font-outfit font-black text-2xl sm:text-3xl lg:text-4xl text-primary">15+</div>
                <div className="text-[10px] sm:text-xs text-text-muted font-medium mt-1">Especialistas</div>
              </div>
            </div>
          </div>

          {/* Right column — Visual (hidden on mobile) */}
          <div className="hidden lg:flex relative h-full items-center justify-center lg:justify-end">
            <div className="relative w-[340px] sm:w-[400px] lg:w-[440px] h-[480px] sm:h-[540px] lg:h-[600px]">
              {/* Main card */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-white rounded-[64px] shadow-2xl shadow-slate-200/50 overflow-hidden animate-border-glow border-2 border-transparent">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                  {/* Logo circle */}
                  <div className="w-36 h-36 rounded-full bg-white shadow-xl shadow-slate-200/30 flex items-center justify-center mb-10 animate-float-slow">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <svg className="w-14 h-14 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C9 2 7 4 7 7c0 2 1 3 1 5 0 3-1 5-2 7h2c1-2 2-4 2-7 0-2-1-3-1-5 0-2 2-3 3-3s3 1 3 3c0 2-1 3-1 5 0 3 1 5 2 7h2c-1-2-2-4-2-7 0-2 1-3 1-5 0-3-2-5-5-5z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="font-outfit font-bold text-2xl text-text-main tracking-tight">ProDental</p>
                  <p className="text-text-muted/50 text-sm mt-2 tracking-wide">Desde 2014</p>
                  <div className="w-12 h-[2px] bg-primary/20 rounded-full mt-6" />
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-12 -left-8 glass rounded-2xl shadow-xl p-4 animate-float">
                <div className="text-2xl font-black font-outfit text-primary">5.0</div>
                <div className="text-[11px] text-text-muted font-semibold mt-0.5">★★★★★</div>
              </div>

              <div className="absolute bottom-12 -right-6 glass rounded-2xl shadow-xl p-4 animate-float-delayed">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-text-main">Abierto hoy</span>
                </div>
                <div className="text-[11px] text-text-muted font-medium mt-0.5">9:00 — 20:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll reveal script */}
      <ScrollRevealScript />
    </section>
  );
};

function ScrollRevealScript() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
