import React from 'react';

const cases = [
  { title: "Ortodoncia Invisible", desc: "Alineación completa en 12 meses.", before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400", after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400" },
  { title: "Diseño de Sonrisa", desc: "Carillas de porcelana de alta estética.", before: "https://images.unsplash.com/photo-1593054941142-574cc0a586bc?auto=format&fit=crop&q=80&w=400", after: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400" },
  { title: "Blanqueamiento Láser", desc: "3 tonos más claros en una sesión.", before: "https://images.unsplash.com/photo-1560311463-04988775f0f3?auto=format&fit=crop&q=80&w=400", after: "https://images.unsplash.com/photo-1445510491599-c391e8046a68?auto=format&fit=crop&q=80&w=400" },
];

export const Gallery = () => {
  return (
    <section id="galeria" className="py-32 lg:py-40 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-xl mb-16 reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-secondary/60" />
            <span className="text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-secondary/60">Casos reales</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-text-main leading-[0.95] tracking-tight font-outfit">
            Resultados que<span className="text-primary/15"> transforman</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <div key={i} className="group bg-slate-50 rounded-[28px] sm:rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/20 transition-all duration-500">
              <div className="grid grid-cols-2 gap-1 p-2">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100">
                  <img src={item.before} alt="Antes" className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">Antes</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-100">
                  <img src={item.after} alt="Después" className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <span className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">Después</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-outfit font-bold text-lg text-text-main mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
