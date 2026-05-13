import React from 'react';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section id="inicio" className="min-h-screen bg-gradient-to-br from-bg-light via-blue-50 to-blue-200 flex items-center pt-32 pb-16 relative overflow-hidden">
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-radial-gradient from-primary/15 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Más de 11 años transformando sonrisas
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-main mb-6 leading-tight tracking-tight font-outfit">
              Vuelve a sonreír con <span className="text-primary">Confianza</span> y Seguridad
            </h1>
            <p className="text-lg text-text-muted mb-10 leading-relaxed max-w-lg">
              Expertos en salud dental con tecnología de punta y un equipo humano dedicado a tu bienestar. Primera consulta sin costo.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="#citas" className="bg-cta text-white px-8 py-4 rounded-full font-bold text-base hover:bg-cta-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-cta/35 flex items-center gap-2">
                Agendar Mi Cita
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link href="#servicios" className="bg-white text-text-main border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-base hover:border-primary hover:text-primary transition-all transform hover:-translate-y-1 shadow-md">
                Ver Servicios
              </Link>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-outfit text-3xl font-extrabold text-text-main">11+</div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">Años exp.</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="font-outfit text-3xl font-extrabold text-text-main">5.0</div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-bold">Google Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-[500px] rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-secondary shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
               <svg className="w-32 h-32 fill-white/70 mb-4" viewBox="0 0 24 24"><path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" /></svg>
               <p className="text-white/80 font-medium font-outfit">Visualizing your future smile</p>
               <div className="absolute top-10 right-[-20px] bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce">
                 <div className="w-10 h-10 bg-cta/10 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                 <div>
                   <div className="font-bold text-sm text-text-main">Citas Hoy</div>
                   <div className="text-[10px] text-text-muted">3 espacios libres</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
