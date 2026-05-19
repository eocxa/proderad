"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function AdminSidebar({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.replace("/admin");
    }
  };

  const menuItems = [
    {
      id: "reservas",
      label: "Rentas Consultorio",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: "citas",
      label: "Citas Pacientes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "servicios",
      label: "Servicios Clínicos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: "automatizaciones",
      label: "Automatizaciones",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl lg:hidden text-slate-300 transition-colors"
        style={{
          background: "rgba(15, 31, 61, 0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        aria-label="Abrir menú"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#0f1f3d",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center gap-3 px-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #0f766e, #0a5b55)" }}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3C12.5 3 9 5.5 9 9C9 10.5 9.5 12 10 13.5C10.5 15 11 17 11 20C11 23 12 29 14 29C15.5 29 16 26 16 24C16 26 16.5 29 18 29C20 29 21 23 21 20C21 17 21.5 15 22 13.5C22.5 12 23 10.5 23 9C23 5.5 19.5 3 16 3Z" fill="white" fillOpacity="0.9" />
              </svg>
              <div className="absolute top-0.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                ProDental
              </h2>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSelected ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                  }`}
                  style={{
                    background: isSelected ? "rgba(80,217,254,0.08)" : "transparent",
                    border: isSelected ? "1px solid rgba(80,217,254,0.15)" : "1px solid transparent",
                  }}
                >
                  <span className={isSelected ? "text-[#50d9fe]" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
