"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { AppointmentsPanel } from "@/components/admin/AppointmentsPanel";
import { AutomationsPanel } from "@/components/admin/AutomationsPanel";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reservas");
  const [searchQuery, setSearchQuery] = useState("");

  const [reservasCount, setReservasCount] = useState(0);
  const [citasCount, setCitasCount] = useState(0);
  const [ingresos, setIngresos] = useState(0);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    router.replace("/admin");
  }, [router]);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin");
          return;
        }
        setAuthorized(true);
      })
      .catch(() => {
        router.replace("/admin");
      })
      .finally(() => setAuthLoading(false));
  }, [router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#50d9fe]"></div>
      </div>
    );
  }

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
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

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
              type="revenue"
              color="#10b981"
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Servicios Activos"
              value={"—"}
              type="servicios"
              color="#f59e0b"
              icon={
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function ServicesPanel() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services?include_inactive=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setServices(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string, currentActive: boolean) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !currentActive } : s))
    );

    try {
      await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive }),
      });
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: currentActive } : s))
      );
    }
  };

  const categoryLabels: Record<string, string> = {
    preventivo: "Preventivo",
    ortodoncia: "Ortodoncia",
    implantes: "Implantes",
    endodoncia: "Endodoncia",
    cirugia: "Cirugía",
    estetica: "Estética",
    radiologia: "Radiología",
    pediatria: "Pediatría",
    periodoncia: "Periodoncia",
  };

  const categoryColors: Record<string, { bg: string; text: string }> = {
    radiologia: { bg: "rgba(80,217,254,0.1)", text: "#50d9fe" },
    preventivo: { bg: "rgba(15,118,110,0.1)", text: "#0f766e" },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border animate-pulse" style={{ background: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="p-6"><div className="h-6 bg-slate-800 rounded w-64 mb-2"></div><div className="h-4 bg-slate-800 rounded w-96"></div></div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="h-32 bg-slate-800/50 rounded-xl"></div>)}</div>
      </div>
    );
  }

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
        {services.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No hay servicios configurados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const colors = categoryColors[service.category] || categoryColors.preventivo;
              return (
                <div
                  key={service.id}
                  className="p-5 rounded-xl border flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderColor: service.is_active ? "rgba(80,217,254,0.15)" : "rgba(255,255,255,0.04)",
                  }}
                >
                  <div>
                    <span
                      className="inline-block text-[10px] px-2 py-0.5 rounded-full mb-1 font-semibold"
                      style={{
                        background: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {categoryLabels[service.category] || service.category}
                    </span>
                    <h3 className="font-semibold text-white text-sm">{service.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">${Number(service.price).toLocaleString()} MXN</p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleActive(service.id, service.is_active)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    style={{
                      background: service.is_active ? "#0f766e" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      style={{
                        transform: service.is_active ? "translateX(20px)" : "translateX(0px)",
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}