"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, Heart, MapPin,
  ChevronLeft, ChevronRight,
  Stethoscope, ShieldCheck, UserPlus,
  ArrowRight, Check
} from "lucide-react";

/* ─── Precios por modalidad ──────────────────────────────── */
const BASE_PRICES: Record<string, number> = {
  hora: 120, día: 1200, mes: 30000, anual: 300000,
};

const ADDON_PRICES: Record<string, Record<string, number>> = {
  hora:  { rayosx: 50,    autoclave: 30,    asistente: 100   },
  día:   { rayosx: 300,   autoclave: 200,   asistente: 600   },
  mes:   { rayosx: 1500,  autoclave: 1000,  asistente: 3000  },
  anual: { rayosx: 15000, autoclave: 10000, asistente: 30000 },
};

const ADDON_OPTIONS = [
  { id: "rayosx",    name: "Rayos X",    desc: "Digital Panorámico",    icon: Stethoscope },
  { id: "autoclave", name: "Autoclave",  desc: "Grado Médico N",        icon: ShieldCheck },
  { id: "asistente", name: "Asistente",  desc: "Personal Especializado", icon: UserPlus    },
];

const fmt = (n: number) => n.toLocaleString("es-MX");

export default function Details() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState("hora");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  /* ─── Datos del consultorio ─────────────────────────────── */
  const categoryNames: Record<string, string> = {
    general:     "Consultorio General",
    fisioterapia:"Espacio de Fisioterapia",
    pediatric:   "Consultorio de Odontopediatría",
    psicologia:  "Espacio de Psicología",
  };
  const categoryImages: Record<string, string> = {
    general:     "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
    fisioterapia:"https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1200",
    pediatric:   "https://images.unsplash.com/photo-1588776814222-2608d434af3e?auto=format&fit=crop&q=80&w=1200",
    psicologia:  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200",
  };
  const images = [
    categoryImages[(id as string) ?? ""] ?? "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
  ];
  const categoryName = categoryNames[(id as string) ?? ""] ?? "Consultorio Premium";

  /* ─── Cálculos ───────────────────────────────────────────── */
  const getAddonPrice = (addonId: string) => ADDON_PRICES[activeTab]?.[addonId] ?? 0;

  const calculateTotal = () =>
    (BASE_PRICES[activeTab] ?? 0) +
    selectedAddons.reduce((sum, aid) => sum + getAddonPrice(aid), 0);

  const toggleAddon = (addonId: string) =>
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(a => a !== addonId) : [...prev, addonId]
    );

  const getUnit = () =>
    ({ hora: "/ hora", día: "/ día", mes: "/ mes", anual: "/ año" }[activeTab] ?? "/ hora");

  /* ─── URL para booking ───────────────────────────────────── */
  const bookingHref = {
    pathname: `/renta-consultorios/booking/${id}`,
    query: {
      plan: activeTab,
      addons: selectedAddons.join(","),
      total: calculateTotal(),
      addonPrices: JSON.stringify(
        selectedAddons.reduce((acc, aid) => ({ ...acc, [aid]: getAddonPrice(aid) }), {})
      ),
      consultorio: categoryName,
    },
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Navbar />

      {/* ── Contenido principal ────────────────────────────── */}
      <div className="flex-1 pt-20 pb-28">

        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-4 h-16">
          <button onClick={() => router.back()} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-primary tracking-tight">ProDental</span>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <Heart size={24} />
          </button>
        </div>

        <main className="max-w-7xl mx-auto md:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 md:pt-12">

            {/* Galería */}
            <section className="relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[currentSlide]}
                alt="Listing"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  onClick={() => setCurrentSlide(p => (p > 0 ? p - 1 : images.length - 1))}
                  className="p-3 bg-black/30 backdrop-blur-md text-white rounded-full pointer-events-auto hover:bg-black/50 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentSlide(p => (p < images.length - 1 ? p + 1 : 0))}
                  className="p-3 bg-black/30 backdrop-blur-md text-white rounded-full pointer-events-auto hover:bg-black/50 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-xs font-bold border border-white/20">
                {currentSlide + 1} / {images.length}
              </div>
            </section>

            {/* Info */}
            <div className="px-4 md:px-0 space-y-8">

              {/* Título */}
              <div className="space-y-4">
                <span className="text-secondary font-bold text-xs uppercase tracking-widest px-3 py-1 bg-secondary-container/10 rounded-full border border-secondary-container/20">
                  Sede Central
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                  {categoryName}
                </h1>
                <div className="flex items-center gap-2 text-outline font-medium">
                  <MapPin size={18} className="text-secondary" />
                  <span>Paseo de la Reforma 483, CDMX</span>
                </div>
              </div>

              {/* Selector de modalidad */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">Modalidad de renta</p>
                <div className="flex p-1 bg-surface-container rounded-2xl gap-1">
                  {["Hora", "Día", "Mes", "Anual"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                        activeTab === tab.toLowerCase()
                          ? "bg-white text-primary shadow-lg shadow-primary/5 border border-outline-variant/30"
                          : "text-outline hover:bg-white/50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons con precios dinámicos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ADDON_OPTIONS.map(f => {
                  const price = getAddonPrice(f.id);
                  const isSelected = selectedAddons.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleAddon(f.id)}
                      className={`bg-white border text-left p-5 rounded-2xl shadow-sm transition-all relative ${
                        isSelected
                          ? "border-secondary ring-1 ring-secondary/20 scale-[1.02]"
                          : "border-outline-variant/30 hover:border-secondary/40"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        isSelected ? "bg-secondary text-white" : "bg-secondary-container/10 text-secondary"
                      }`}>
                        <f.icon size={22} />
                      </div>
                      <h4 className="font-bold text-primary text-sm mb-0.5">{f.name}</h4>
                      <p className="text-[10px] text-outline font-medium uppercase tracking-wider mb-2">{f.desc}</p>
                      <motion.span
                        key={`${f.id}-${activeTab}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-bold text-secondary block"
                      >
                        +${fmt(price)}<span className="font-normal text-outline ml-1">{getUnit()}</span>
                      </motion.span>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Descripción */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Sobre este espacio</h3>
                <p className="text-outline leading-relaxed text-sm">
                  Ubicado en el corazón corporativo de la Ciudad de México, este consultorio ofrece la mezcla perfecta
                  entre diseño contemporáneo y equipamiento de vanguardia. Ideal para especialistas que buscan brindar
                  una experiencia premium a sus pacientes con la mejor vista de la ciudad.
                </p>
              </div>

              {/* Disponibilidad */}
              <div className="bg-primary p-7 rounded-3xl shadow-xl shadow-primary/20 space-y-5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 blur-3xl rounded-full" />
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="font-bold text-white text-lg">Disponibilidad hoy</h3>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-2 border border-green-500/30 font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Disponible ahora
                  </span>
                </div>
                <div className="flex gap-2 relative z-10">
                  <div className="flex-1 h-2 bg-secondary-container rounded-full" />
                  <div className="flex-1 h-2 bg-secondary-container rounded-full" />
                  <div className="flex-1 h-2 bg-white/20 rounded-full" />
                  <div className="flex-1 h-2 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Barra de Total — FIJA, siempre visible ─────────── */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-outline-variant/30 px-4 py-4 md:py-5 z-50 shadow-2xl shadow-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] text-outline font-bold uppercase tracking-widest mb-0.5">Total</span>
            <motion.span
              key={calculateTotal()}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight"
            >
              ${fmt(calculateTotal())}{" "}
              <span className="text-sm font-normal text-outline">{getUnit()}</span>
            </motion.span>
          </div>

          <Link
            href={bookingHref}
            className="flex-1 min-w-[220px] h-14 md:h-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            <span>Reservar Ahora</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
