import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";
import { BookingSystem } from "@/components/sections/BookingSystem";
import { Gallery } from "@/components/sections/Gallery";
import { MapSection } from "@/components/sections/Map";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clínica Dental ProDental — Dentistas en CDMX",
  description: "Clínica dental líder con especialistas en ortodoncia e implantes. Agenda tu primera consulta hoy.",
};

export default function ConsultorioPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Gallery />
      <Team />
      <BookingSystem />
      <MapSection />
      <Footer />
    </main>
  );
}
