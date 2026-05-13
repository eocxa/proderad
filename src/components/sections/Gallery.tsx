import React from 'react';

const cases = [
  {
    title: "Ortodoncia Invisible",
    desc: "Alineación completa en 12 meses.",
    before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400",
    after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Diseño de Sonrisa",
    desc: "Carillas de porcelana de alta estética.",
    before: "https://images.unsplash.com/photo-1593054941142-574cc0a586bc?auto=format&fit=crop&q=80&w=400",
    after: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Blanqueamiento Láser",
    desc: "3 tonos más claros en una sesión.",
    before: "https://images.unsplash.com/photo-1560311463-04988775f0f3?auto=format&fit=crop&q=80&w=400",
    after: "https://images.unsplash.com/photo-1445510491599-c391e8046a68?auto=format&fit=crop&q=80&w=400"
  }
];

export const Gallery = () => {
  return (
    <section id="galeria" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">Resultados Reales</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mt-3 mb-4 font-outfit">Casos de Éxito</h2>
          <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
            Mira la transformación de nuestros pacientes y convéncete de la calidad de nuestro trabajo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cases.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 group">
              <div className="grid grid-cols-2 gap-1 p-2">
                <div className="relative">
                  <img src={item.before} alt="Antes" className="w-full h-48 object-cover rounded-2xl" />
                  <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Antes</span>
                </div>
                <div className="relative">
                  <img src={item.after} alt="Después" className="w-full h-48 object-cover rounded-2xl" />
                  <span className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">Después</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-outfit font-bold text-xl text-text-main mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
