import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Building2, Clock, Shield } from "lucide-react";
import { RentalBookingSystem } from "@/components/sections/RentalBookingSystem";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renta de Consultorios Dentales — Espacios para Doctores",
  description: "Renta consultorios totalmente equipados por hora o día. Ubicación privilegiada y todos los servicios incluidos.",
};

export default function RentaPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <span className="text-cta font-bold tracking-widest uppercase text-xs">Portal B2B</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-main mt-4 mb-6 font-outfit">
              El espacio perfecto para tu <span className="text-cta">Práctica Profesional</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed mb-10">
              Ofrecemos consultorios dentales de alta gama, equipados con la última tecnología y servicios compartidos para que te enfoques únicamente en tus pacientes.
            </p>
            <Link href="#renta-form" className="bg-cta text-white px-8 py-4 rounded-full font-bold text-base hover:bg-cta-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-cta/35 inline-block">
              Consultar Disponibilidad
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100">
               <div className="w-12 h-12 bg-cta/10 rounded-xl flex items-center justify-center mb-6"><Building2 className="text-cta" /></div>
               <h3 className="font-outfit font-bold text-xl mb-4">Totalmente Equipados</h3>
               <p className="text-text-muted text-sm leading-relaxed">Unidades dentales modernas, rayos X y equipo de esterilización de primer nivel.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100">
               <div className="w-12 h-12 bg-cta/10 rounded-xl flex items-center justify-center mb-6"><Clock className="text-cta" /></div>
               <h3 className="font-outfit font-bold text-xl mb-4">Flexibilidad de Horario</h3>
               <p className="text-text-muted text-sm leading-relaxed">Renta por hora, medio turno o día completo según tus necesidades.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100">
               <div className="w-12 h-12 bg-cta/10 rounded-xl flex items-center justify-center mb-6"><Shield className="text-cta" /></div>
               <h3 className="font-outfit font-bold text-xl mb-4">Ubicación & Seguridad</h3>
               <p className="text-text-muted text-sm leading-relaxed">Zona de alta plusvalía con seguridad 24/7 y recepción para tus pacientes.</p>
            </div>
          </div>
        </div>
      </section>

      <RentalBookingSystem />
      
      <Footer />
    </main>
  );
}
