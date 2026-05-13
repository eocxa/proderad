import React from 'react';

const doctors = [
  {
    name: "Dr. Roberto Méndez",
    role: "Ortodoncista Senior",
    desc: "Especialista en alineación invisible y casos complejos con más de 15 años de trayectoria.",
  },
  {
    name: "Dra. Elena Vargas",
    role: "Implantología & Estética",
    desc: "Experta en rehabilitación oral y diseño de sonrisa mediante tecnología digital 3D.",
  },
  {
    name: "Dr. Carlos Ruiz",
    role: "Endodoncista",
    desc: "Dedicado a la preservación dental mediante tratamientos de conductos sin dolor.",
  }
];

export const Team = () => {
  return (
    <section id="equipo" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">Nuestro Staff</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mt-3 mb-4 font-outfit">Especialistas de Confianza</h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
            Contamos con un equipo de profesionales apasionados por la salud dental y en constante formación académica.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc, idx) => (
            <div key={idx} className="group rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-72 bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                <svg className="w-24 h-24 fill-primary/30 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12,2A5,5 0 0,1 17,7A5,5 0 0,1 12,12A5,5 0 0,1 7,7A5,5 0 0,1 12,2M12,14C17.5,14 22,16.24 22,19V22H2V19C2,16.24 6.5,14 12,14Z" /></svg>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-text-main mb-1 font-outfit">{doc.name}</h3>
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-4">{doc.role}</div>
                <p className="text-text-muted text-sm leading-relaxed">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
