import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-text-main text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" />
                </svg>
              </div>
              <span className="font-outfit font-bold text-xl">ProDental</span>
            </div>
            <p className="text-blue-100/60 text-sm leading-relaxed mb-6">
              Más de 11 años transformando sonrisas en México con la mejor tecnología y especialistas de confianza.
            </p>
          </div>
          
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6">Navegación</h4>
            <ul className="space-y-4 text-blue-100/60 text-sm">
              <li><Link href="#inicio" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="#servicios" className="hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="#equipo" className="hover:text-white transition-colors">Nuestro Equipo</Link></li>
              <li><Link href="/renta-consultorios" className="hover:text-white transition-colors font-bold text-primary">Renta de Consultorios</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6">Contacto</h4>
            <ul className="space-y-4 text-blue-100/60 text-sm">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +52 55 1234 5678
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                contacto@prodental.com.mx
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Av. Principal #123, CDMX
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6">Síguenos</h4>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <div className="w-5 h-5 bg-white/20 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-100/40 text-xs">© 2026 ProDental. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-blue-100/40 text-xs">
            <Link href="#" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
            <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
