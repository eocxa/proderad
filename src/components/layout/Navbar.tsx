"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: "/consultorio#servicios", label: "Servicios", sectionId: "servicios" },
  { href: "/consultorio#equipo", label: "Equipo", sectionId: "equipo" },
  { href: "/consultorio#ubicacion", label: "Contáctanos", sectionId: "ubicacion" },
  { href: "/renta-consultorios", label: "Soy Profesional", sectionId: null },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS
      .filter(item => item.sectionId)
      .map(item => document.getElementById(item.sectionId!))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topMost.target.id);
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled
        ? "glass shadow-lg shadow-slate-200/20 py-2"
        : "bg-transparent py-4"
    )}>
      <div className={cn(
        "mx-auto transition-all duration-500 flex items-center justify-between",
        isScrolled ? "max-w-7xl px-4 sm:px-6" : "max-w-7xl px-4 sm:px-8"
      )}>
        <Link href="/consultorio" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-9 h-9 md:w-10 md:h-10">
            <div className="absolute inset-0 bg-primary rounded-xl group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-[3px] bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <svg className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] fill-white" viewBox="0 0 24 24">
                <path d="M12,2C10.89,2 10,2.89 10,4V5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5V4C14,2.89 13.11,2 12,2M16.5,10L14,8H10L7.5,10L6,12V19C6,20.11 6.89,21 8,21H16C17.11,21 18,20.11 18,19V12L16.5,10Z" />
              </svg>
            </div>
          </div>
          <span className="font-outfit font-bold text-lg md:text-xl text-text-main tracking-tight">
            Pro<span className="text-primary">Dental</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1 xl:gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item.sectionId ? activeSection === item.sectionId : false;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 xl:px-4 py-2 text-sm font-medium rounded-xl transition-all",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-text-muted hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2">
            <Link href="/consultorio#citas"
              className="bg-primary text-white px-4 xl:px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20">
              Agendar cita
            </Link>
          </li>
        </ul>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 shrink-0" aria-label="Menu">
          <div className="flex flex-col gap-1.5">
            <span className={cn("w-6 h-0.5 bg-text-main rounded-full transition-all", isMenuOpen && "rotate-45 translate-y-2")} />
            <span className={cn("w-6 h-0.5 bg-text-main rounded-full transition-all", isMenuOpen && "opacity-0")} />
            <span className={cn("w-6 h-0.5 bg-text-main rounded-full transition-all", isMenuOpen && "-rotate-45 -translate-y-2")} />
          </div>
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden glass mx-4 mt-2 rounded-2xl p-6 shadow-xl border border-white/30">
          <ul className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = item.sectionId ? activeSection === item.sectionId : false;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-text-main hover:bg-primary/5"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/consultorio#citas" onClick={() => setIsMenuOpen(false)}
                className="block bg-primary text-white text-center py-3 rounded-xl font-semibold text-sm">
                Agendar cita
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
