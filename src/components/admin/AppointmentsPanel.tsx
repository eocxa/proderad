"use client";

import React, { useState, useEffect } from "react";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string | null;
  service_category: string | null;
  office_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface AppointmentsPanelProps {
  searchQuery: string;
  onCountChange: (count: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(245,158,11,0.08)", text: "#f59e0b" },
  confirmed: { bg: "rgba(80,217,254,0.08)", text: "#50d9fe" },
  cancelled: { bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
  completed: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
};

const CATEGORY_LABELS: Record<string, string> = {
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

export function AppointmentsPanel({ searchQuery, onCountChange }: AppointmentsPanelProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments?limit=100", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data || []);
      }
    } catch (e) {
      console.error("Error fetching appointments:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pendingCount = appointments.filter((a) => a.status === "pending").length;
    onCountChange(pendingCount);
  }, [appointments, onCountChange]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const prev = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? { ...apt, status: prev.find((p) => p.id === id)?.status || apt.status } : apt))
        );
      }
    } catch {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: apt.status } : apt))
      );
    }
  };

  const handleContact = (apt: Appointment) => {
    const message = `Hola ${apt.patient_name}, le escribimos de ProDental para coordinar su cita del ${formatDate(apt.appointment_date)} a las ${apt.appointment_time}.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const [h, m] = timeStr.split(":");
      const hour = parseInt(h);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const label = STATUS_LABELS[apt.status] || apt.status;
    const matchesStatus = statusFilter === "Todos" || label === statusFilter;
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.service_category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      CATEGORY_LABELS[apt.service_category || ""]?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterOptions = ["Todos", "Pendiente", "Confirmada", "Completada", "Cancelada"];

  if (loading) {
    return (
      <div className="rounded-2xl border animate-pulse" style={{ background: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="p-6"><div className="h-6 bg-slate-800 rounded w-64 mb-2"></div><div className="h-4 bg-slate-800 rounded w-96"></div></div>
        <div className="p-6 space-y-4">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-800/50 rounded"></div>)}</div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        borderColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header Panel */}
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div>
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            Agenda de Citas Clínicas
          </h2>
          <p className="text-xs text-slate-400">
            Control de citas agendadas por pacientes para radiología y servicios generales
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          {filterOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                statusFilter === status
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={{
                background: statusFilter === status ? "rgba(80,217,254,0.1)" : "transparent",
                color: statusFilter === status ? "#50d9fe" : "",
              }}
            >
              {status === "Todos" ? "Todos" : status + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-wider text-slate-500 font-bold" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
              <th className="py-4 px-6">Paciente</th>
              <th className="py-4 px-6">Servicio</th>
              <th className="py-4 px-6">Fecha / Hora</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-slate-300" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => {
                const colors = STATUS_COLORS[apt.status] || STATUS_COLORS.pending;
                const statusLabel = STATUS_LABELS[apt.status] || apt.status;
                const categoryLabel = CATEGORY_LABELS[apt.service_category || ""] || apt.service_category || "Sin categoría";
                const isRadiology = apt.service_category === "radiologia";
                return (
                  <tr
                    key={apt.id}
                    className="transition-colors duration-150 hover:bg-white/[0.01]"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-semibold text-white block">{apt.patient_name}</span>
                        <span className="text-[10px] text-slate-500">{apt.patient_email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="px-2.5 py-0.5 rounded-full font-semibold text-[10px]"
                        style={{
                          background: isRadiology ? "rgba(80,217,254,0.08)" : "rgba(15,118,110,0.08)",
                          color: isRadiology ? "#50d9fe" : "#0f766e",
                        }}
                      >
                        {categoryLabel}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {formatDate(apt.appointment_date)}
                      <span className="block text-[10px] text-slate-600">{formatTime(apt.appointment_time)}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.id, "confirmed")}
                              className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                              title="Confirmar Cita"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, "cancelled")}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                              title="Cancelar Cita"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "completed")}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                            title="Marcar como Completada"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleContact(apt)}
                          className="p-1.5 rounded-lg hover:bg-[#50d9fe]/10 text-[#50d9fe] transition-colors"
                          title="Enviar mensaje"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.25 8.477 3.517 2.266 2.268 3.512 5.28 3.51 8.482-.004 6.657-5.34 11.997-11.953 12.003-2.003-.001-3.97-.502-5.717-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.41 5.35 1.412 5.46-.004 9.905-4.453 9.908-9.914.002-2.644-1.023-5.13-2.887-6.996C17.155 1.79 14.673.766 12.02.766 6.562.768 2.112 5.218 2.11 10.68c-.001 2.128.561 3.723 1.492 5.3l-.982 3.585 3.687-.967-.26.155z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 px-6 text-center text-slate-500 font-medium">
                  {loading ? "Cargando..." : "No se encontraron citas que coincidan con los filtros."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}