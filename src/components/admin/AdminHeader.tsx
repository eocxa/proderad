"use client";

import React from "react";

interface AdminHeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function AdminHeader({ activeTab, searchQuery, setSearchQuery }: AdminHeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case "reservas":
        return "Rentas de Consultorios";
      case "citas":
        return "Citas de Pacientes";
      case "servicios":
        return "Servicios del Portal";
      default:
        return "Dashboard";
    }
  };

  return (
    <header
      className="h-20 flex items-center justify-between px-6 lg:px-8 border-b sticky top-0 z-30"
      style={{
        background: "rgba(10, 22, 40, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Title */}
      <div className="pl-12 lg:pl-0">
        <h1
          className="text-lg lg:text-xl font-bold text-white leading-none"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          {getTitle()}
        </h1>
        <p className="text-xs text-slate-400 mt-1 hidden sm:block">
          Monitoreo y administración en tiempo real
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Bar */}
        <div className="relative max-w-xs hidden sm:block">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 md:w-64 pl-10 pr-4 py-2 text-xs rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(80,217,254,0.3)";
              e.currentTarget.style.width = "280px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.width = "256px";
            }}
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-l pl-4 sm:pl-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-right hidden md:block">
            <span className="block text-xs font-semibold text-white">Dr. Alejandro M.</span>
            <span className="block text-[10px] text-slate-400 font-medium leading-none mt-0.5">Director Médico</span>
          </div>

          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-lg overflow-hidden border"
              style={{
                background: "linear-gradient(135deg, #0f766e, #50d9fe)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              AM
            </div>
            {/* Online Indicator Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a1628]" />
          </div>
        </div>
      </div>
    </header>
  );
}
