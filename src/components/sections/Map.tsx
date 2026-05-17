import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

export const MapSection = () => {
  return (
    <section id="ubicacion" className="py-32 lg:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] bg-primary/[0.01] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="max-w-xl mb-16 reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-primary/60" />
            <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-primary/60">Ubicación</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
            <span className="text-primary/15">Visita</span> nuestra clínica
          </h2>
        </div>

        <div className="reveal-scale">
          <div className="bg-text-main rounded-[48px] overflow-hidden shadow-2xl shadow-slate-300/20 flex flex-col lg:flex-row">
            <div className="lg:w-[420px] w-full shrink-0 p-8 sm:p-10 lg:p-14 text-white flex flex-col">
              <div className="space-y-10 flex-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/8 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1 tracking-wide text-secondary/80">Dirección</p>
                    <p className="text-white/50 text-sm leading-relaxed break-words">Av. la Teja 66, Coapa, Narciso Mendoza, Tlalpan, 14390 CDMX</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/8 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1 tracking-wide text-secondary/80">Horario</p>
                    <p className="text-white/50 text-sm leading-relaxed">Lun–Jue 9:00–20:00<br/>Vie 9:00–19:00<br/>Sáb 8:00–14:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/8 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1 tracking-wide text-secondary/80">Teléfono</p>
                    <p className="text-white/50 text-sm">+52 55 5673 9186</p>
                  </div>
                </div>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                className="mt-10 glass-dark text-white py-4 px-8 rounded-2xl font-semibold text-center hover:bg-white/10 transition-all text-sm border border-white/10">
                Cómo llegar →
              </a>
            </div>
            <div className="flex-1 h-[300px] lg:h-[550px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.345873289!2d-99.1311!3d19.2991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce013111111111%3A0x1111111111111111!2sAv.%20la%20Teja%2066%2C%20Coapa%2C%20Narciso%20Mendoza%2C%20Tlalpan%2C%2014390%20CDMX!5e0!3m2!1ses!2smx!4v1715690000000!5m2!1ses!2smx" 
                className="absolute inset-0 w-full h-full border-0 grayscale invert contrast-75 brightness-110 opacity-75"
                allowFullScreen loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
