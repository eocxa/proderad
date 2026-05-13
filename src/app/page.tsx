import Link from "next/link";
import { ArrowRight, User, Building2 } from "lucide-react";

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-bg-light flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
             <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                <path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" />
             </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main font-outfit mb-4">Bienvenido a ProDental</h1>
          <p className="text-text-muted text-lg">Selecciona el portal que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient Portal */}
          <Link href="/consultorio" className="group bg-white p-10 rounded-[32px] border-2 border-transparent hover:border-primary transition-all shadow-xl hover:shadow-primary/20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
              <User className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-4 font-outfit">Agendar Cita (Pacientes)</h2>
            <p className="text-text-muted mb-8 leading-relaxed">Agenda una cita, conoce nuestros servicios y especialistas para cuidar tu sonrisa.</p>
            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
              Ir al Consultorio <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          {/* Doctor Portal */}
          <Link href="/renta-consultorios" className="group bg-white p-10 rounded-[32px] border-2 border-transparent hover:border-cta transition-all shadow-xl hover:shadow-cta/20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-cta/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-cta transition-colors">
              <Building2 className="w-10 h-10 text-cta group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-text-main mb-4 font-outfit">Soy Profesional (Renta)</h2>
            <p className="text-text-muted mb-8 leading-relaxed">Renta espacios dentales equipados y profesionales para atender a tus pacientes.</p>
            <div className="flex items-center gap-2 text-cta font-bold group-hover:gap-4 transition-all">
              Ver Consultorios <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
