import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative bg-text-main pt-28 pb-10 overflow-hidden">
      {/* Decorative diagonal */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <div className="absolute top-10 right-10 w-64 h-64 border border-white/[0.03] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 border border-white/[0.02] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr] gap-16 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" />
                </svg>
              </div>
              <span className="font-outfit font-bold text-xl text-white tracking-tight">ProDental</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Excelencia clínica desde 2014. Tecnología de vanguardia y especialistas certificados al servicio de tu sonrisa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-outfit font-bold text-white text-sm mb-6">Navegación</h4>
            <ul className="space-y-4">
              {[
                { href: "/consultorio#servicios", label: "Servicios" },
                { href: "/consultorio#equipo", label: "Equipo médico" },
                { href: "/consultorio#testimonios", label: "Testimonios" },
                { href: "/renta-consultorios", label: "Renta de consultorios" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 text-sm hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-outfit font-bold text-white text-sm mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span>Av. la Teja 66, Tlalpan, CDMX</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>+52 55 5673 9186</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span className="break-all">contacto@prodental.com.mx</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">© 2026 ProDental. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-500 text-xs hover:text-white transition-colors">Aviso de privacidad</Link>
            <Link href="#" className="text-slate-500 text-xs hover:text-white transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
