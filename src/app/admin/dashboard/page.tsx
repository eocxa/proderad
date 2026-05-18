"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { AppointmentsPanel } from "@/components/admin/AppointmentsPanel";
import { AutomationsPanel } from "@/components/admin/AutomationsPanel";

const SESSION_KEY = "prodental_admin_auth";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("reservas"); // reservas, citas, servicios
  const [searchQuery, setSearchQuery] = useState("");

  // Datos mock iniciales para métricas y estado
  const [reservasCount, setReservasCount] = useState(12);
  const [citasCount, setCitasCount] = useState(8);
  const [ingresos, setIngresos] = useState(48500);

  useEffect(() => {
    const auth = sessionStorage.getItem(SESSION_KEY);
    if (auth !== "true") {
      router.replace("/admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#50d9fe]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100 flex font-work-sans">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
        {/* Header */}
        <AdminHeader activeTab={activeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dashboard Body */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Métricas / KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Citas de Pacientes"
              value={citasCount}
              change="+2 hoy"
              type="citas"
              color="#50d9fe"
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              title="Consultorios Rentados"
              value={reservasCount}
              change="4 activos"
              type="reservas"
              color="#0f766e"
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatCard
              title="Ingresos Estimados"
              value={`$${ingresos.toLocaleString()}`}
              change="+15% este mes"
              type="revenue"
              color="#10b981"
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Nuevos Profesionales"
              value="8"
              change="Este mes"
              type="doctors"
              color="#f59e0b"
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>

          {/* Secciones dinámicas según el tab activo */}
          <div className="transition-all duration-300">
            {activeTab === "reservas" && (
              <ReservationsTable
                searchQuery={searchQuery}
                onCountChange={(count) => setReservasCount(count)}
                onRevenueChange={(rev) => setIngresos(rev)}
              />
            )}
            {activeTab === "citas" && (
              <AppointmentsPanel
                searchQuery={searchQuery}
                onCountChange={(count) => setCitasCount(count)}
              />
            )}
            {activeTab === "servicios" && (
              <ServicesPanel />
            )}
            {activeTab === "automatizaciones" && (
              <AutomationsPanel />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Subcomponente de Servicios en línea
function ServicesPanel() {
  const [services, setServices] = useState([
    { id: 1, name: "Radiografía Panorámica", category: "Radiología", price: 650, active: true },
    { id: 2, name: "Tomografía Computarizada Cone Beam", category: "Radiología", price: 2100, active: true },
    { id: 3, name: "Limpieza Dental Ultrasonido", category: "Clínica", price: 800, active: true },
    { id: 4, name: "Blanqueamiento Dental LED", category: "Clínica", price: 3200, active: true },
    { id: 5, name: "Radiografía Cefalométrica", category: "Radiología", price: 650, active: false },
    { id: 6, name: "Guardas Oclusales", category: "Clínica", price: 1800, active: true },
  ]);

  const toggleActive = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="rounded-2xl border" style={{ background: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
      <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          Gestión de Servicios
        </h2>
        <p className="text-sm text-slate-400">
          Activa o desactiva los servicios ofrecidos en el portal de pacientes
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-5 rounded-xl border flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: service.active ? "rgba(80,217,254,0.15)" : "rgba(255,255,255,0.04)",
              }}
            >
              <div>
                <span
                  className="inline-block text-[10px] px-2 py-0.5 rounded-full mb-1 font-semibold"
                  style={{
                    background: service.category === "Radiología" ? "rgba(80,217,254,0.1)" : "rgba(15,118,110,0.1)",
                    color: service.category === "Radiología" ? "#50d9fe" : "#0f766e",
                  }}
                >
                  {service.category}
                </span>
                <h3 className="font-semibold text-white text-sm">{service.name}</h3>
                <p className="text-xs text-slate-400 mt-1">${service.price.toLocaleString()} MXN</p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleActive(service.id)}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                style={{
                  background: service.active ? "#0f766e" : "rgba(255,255,255,0.1)",
                }}
              >
                <span
                  className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  style={{
                    transform: service.active ? "translateX(20px)" : "translateX(0px)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
