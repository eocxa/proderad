import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const MapSection = () => {
  return (
    <section id="ubicacion" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-text-main rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          {/* Info Card */}
          <div className="lg:w-1/3 p-10 md:p-16 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold font-outfit mb-8">Nuestra Clínica</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-wider text-primary">Dirección</p>
                  <p className="text-white/70 text-sm leading-relaxed">Av. Principal #123, Col. Polanco, CDMX, México.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-wider text-primary">Horario</p>
                  <p className="text-white/70 text-sm leading-relaxed">Lun - Vie: 9:00 - 20:00<br/>Sáb: 10:00 - 15:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1 uppercase tracking-wider text-primary">Teléfono</p>
                  <p className="text-white/70 text-sm">+52 55 1234 5678</p>
                </div>
              </div>
            </div>

            <button className="mt-12 bg-white text-text-main py-4 px-8 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20">
              Obtener indicaciones
            </button>
          </div>

          {/* Map iframe */}
          <div className="lg:w-2/3 h-[400px] lg:h-auto min-h-[400px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.539597363!2d-99.1912!3d19.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI1JzU3LjQiTiA5OcKwMTEnMjguMyJX!5e0!3m2!1ses!2smx!4v1620000000000!5m2!1ses!2smx" 
              className="absolute inset-0 w-full h-full border-0 grayscale invert contrast-75 brightness-125 opacity-80"
              allowFullScreen={true} 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
