"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronRight, Star, Loader2 } from "lucide-react";
import { MapSection } from "@/components/sections/Map";
import RegistrationModal from "@/components/profesionales/RegistrationModal";
import DemoModal from "@/components/profesionales/DemoModal";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Office } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  "equipada-plus": "Equipada Plus",
  "estandar": "Estándar",
  "quirofano": "Quirófano",
};

const PLACEHOLDER_IMGS: Record<string, string> = {
  "equipada-plus": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
  "estandar": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400",
  "quirofano": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
};

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offices')
      .then(r => r.json())
      .then(res => { if (res.success && res.data) setOffices(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = offices.length > 0 ? offices.map((o, i) => ({
    id: o.id,
    name: o.name,
    type: TYPE_LABELS[o.type] || o.type,
    price: o.price_per_hour,
    img: o.photo_url || PLACEHOLDER_IMGS[o.type] || PLACEHOLDER_IMGS["estandar"],
    equipment: o.equipment || [],
  })) : [];

  return (
    <main className="bg-surface min-h-screen">
      <Navbar />
      <div className="pb-20 pt-20">
      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1600"
            alt="Luxury Office"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
              Eleva tu Práctica en Espacios de Élite
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-12 max-w-lg font-medium leading-relaxed">
              Consultorios dentales premium equipados con tecnología de vanguardia, diseñados para especialistas exigentes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("categorias");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-secondary-container/20"
              >
                Explorar Espacios
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-32">
        {/* Categories */}
        <section id="categorias">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] block mb-3">Especialidades</span>
              <h2 className="text-4xl font-bold text-primary tracking-tight">Categorías</h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex-none w-72 group cursor-pointer"
                onClick={() => {
                  const el = document.getElementById("nuestros-espacios");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="relative h-80 rounded-3xl overflow-hidden mb-6 bg-surface-container">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">{cat.name}</h3>
                <p className="text-outline font-medium text-sm">{cat.type} · ${cat.price.toLocaleString('es-MX')}/hr</p>
              </motion.div>
            ))}
          </div>
          )}
        </section>

        {/* Mosaic Listings */}
        <section id="nuestros-espacios">
          <div className="max-w-xl mb-16">
            <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] block mb-3">Tu Próximo Consultorio</span>
            <h2 className="text-5xl font-bold text-primary tracking-tight mb-6">Nuestros Espacios</h2>
            <p className="text-outline text-lg font-medium leading-relaxed">
              Descubre espacios diseñados específicamente para tu especialidad. Elige una categoría y reserva hoy mismo.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2.5rem] overflow-hidden border border-outline-variant/30 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <Link href={`/renta-consultorios/details/${cat.id}`} className="flex-1 flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-primary tracking-tight">{cat.name}</h3>
                      <div className="flex items-center gap-1 text-secondary">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold">4.9</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-outline-variant/20 flex items-center justify-between">
                      <p className="text-primary font-bold">
                        ${cat.price.toLocaleString('es-MX')} <span className="text-xs font-normal text-outline">/ hora</span>
                      </p>
                      <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:bg-secondary transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          )}
        </section>

        {/* CTA / Membership Section */}
        <section className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,#50d9fe_0,transparent_50%)]" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
              Únete a nosotros para poder acceder a nuestros consultorios profesionales
            </h2>
            <p className="text-white/70 text-lg mb-12 leading-relaxed font-bold italic">
              Registro necesario para poder reservar un consultorio
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="bg-secondary-container text-on-secondary-container px-12 py-5 rounded-2xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-black/20"
              >
                Registrarme
              </button>
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-12 py-5 rounded-2xl font-bold hover:bg-white/20 active:scale-95 transition-all"
              >
                Agendar Demo
              </button>
            </div>
          </motion.div>
        </section>

      </main>

      <MapSection />

      <RegistrationModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} offices={offices} />
      </div>
      <Footer />
    </main>
  );
}

