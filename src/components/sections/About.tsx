import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <section className="py-24 bg-bg-light">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="w-full h-[460px] rounded-3xl bg-gradient-to-br from-blue-700 to-primary flex items-center justify-center shadow-2xl overflow-hidden">
               <svg className="w-24 h-24 fill-white/60" viewBox="0 0 24 24"><path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" /></svg>
            </div>
            <div className="absolute bottom-10 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100">
              <div className="w-12 h-12 bg-cta rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-white w-6 h-6" />
              </div>
              <div>
                <div className="font-outfit font-extrabold text-2xl text-text-main">11,000+</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Pacientes Felices</div>
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Nuestra Trayectoria</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mt-3 mb-6 font-outfit">Más de una década cuidando tu sonrisa</h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              En ProDental, no solo tratamos dientes; cuidamos personas. Desde hace 11 años, hemos sido referentes en odontología moderna en México, combinando calidez humana con los procesos clínicos más rigurosos.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Tecnología de diagnóstico 3D de última generación",
                "Especialistas certificados en constante actualización",
                "Instalaciones modernas y esterilización garantizada",
                "Atención personalizada y planes de pago flexibles"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-main font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary transition-colors">
                <div className="font-outfit font-extrabold text-3xl text-primary">98%</div>
                <div className="text-xs text-text-muted font-bold mt-1 uppercase">Satisfacción</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary transition-colors">
                <div className="font-outfit font-extrabold text-3xl text-primary">15+</div>
                <div className="text-xs text-text-muted font-bold mt-1 uppercase">Especialistas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
