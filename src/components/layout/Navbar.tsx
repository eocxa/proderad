"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-4 left-4 right-4 z-50 transition-all duration-300",
      "flex items-center justify-between px-6 py-3 rounded-[18px] border",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-gray-200" : "bg-white/80 backdrop-blur-sm border-white/20"
    )}>
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" />
          </svg>
        </div>
        <span className="font-outfit font-bold text-xl text-text-main">ProDental</span>
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        <li><Link href="/consultorio#inicio" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Inicio</Link></li>
        <li><Link href="/consultorio#servicios" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Servicios</Link></li>
        <li><Link href="/consultorio#equipo" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Equipo</Link></li>
        <li><Link href="/renta-consultorios" className="text-sm font-bold text-primary hover:text-primary-dark">Para Doctores</Link></li>
        <li>
          <Link href="/consultorio#citas" className="bg-cta text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-cta-dark transition-all transform hover:-translate-y-px">
            Agendar Cita
          </Link>
        </li>
      </ul>

      <button 
        className="md:hidden flex flex-col gap-1.5 p-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span className={cn("w-6 h-0.5 bg-text-main rounded-sm transition-all", isMenuOpen && "rotate-45 translate-y-2")} />
        <span className={cn("w-6 h-0.5 bg-text-main rounded-sm transition-all", isMenuOpen && "opacity-0")} />
        <span className={cn("w-6 h-0.5 bg-text-main rounded-sm transition-all", isMenuOpen && "-rotate-45 -translate-y-2")} />
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:hidden">
           <ul className="flex flex-col gap-4">
            <li><Link href="/consultorio#inicio" onClick={() => setIsMenuOpen(false)} className="block font-medium">Inicio</Link></li>
            <li><Link href="/consultorio#servicios" onClick={() => setIsMenuOpen(false)} className="block font-medium">Servicios</Link></li>
            <li><Link href="/renta-consultorios" onClick={() => setIsMenuOpen(false)} className="block font-medium text-primary">Renta de Consultorios</Link></li>
            <li><Link href="/consultorio#citas" onClick={() => setIsMenuOpen(false)} className="bg-cta text-white block text-center py-3 rounded-xl font-bold">Agendar Cita</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};
