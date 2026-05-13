import React from 'react';
import { Sparkles, ShieldCheck, Microscope, HeartPulse, Smile, Activity } from 'lucide-react';

const services = [
  {
    title: "Ortodoncia Avanzada",
    desc: "Alineamos tu sonrisa con las técnicas más modernas, desde brackets estéticos hasta alineadores invisibles.",
    icon: Sparkles,
  },
  {
    title: "Implantes Dentales",
    desc: "Recupera la funcionalidad y estética de tu boca con implantes de alta durabilidad y apariencia natural.",
    icon: ShieldCheck,
  },
  {
    title: "Diseño de Sonrisa",
    desc: "Transformamos tu expresión facial mediante carillas y blanqueamiento dental de última generación.",
    icon: Smile,
  },
  {
    title: "Endodoncia",
    desc: "Salvaguardamos tus piezas dentales naturales eliminando infecciones y dolor de forma segura.",
    icon: HeartPulse,
  },
  {
    title: "Periodoncia",
    desc: "Cuidado especializado de tus encías para prevenir la pérdida de piezas y asegurar una base sólida.",
    icon: Activity,
  },
  {
    title: "Odontopediatría",
    desc: "Atención cálida y profesional para los más pequeños, creando una base positiva para su salud dental.",
    icon: Microscope,
  }
];

export const Services = () => {
  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">Excelencia Médica</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mt-3 mb-4 font-outfit">Tratamientos Especializados</h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
            Ofrecemos una gama completa de servicios odontológicos utilizando tecnología de vanguardia para garantizar los mejores resultados.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary transition-all">
                <service.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3 font-outfit">{service.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">{service.desc}</p>
              <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                Saber más <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
