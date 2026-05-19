"use client";

import React, { useState, useEffect } from "react";

interface Reservation {
  id: string;
  doctor_name: string;
  doctor_email: string;
  doctor_specialty: string | null;
  office_id: string;
  office_name: string;
  office_type: string;
  dates: string[];
  shift: string;
  status: string;
  total_price: number;
  payment_status: string;
  notes: string | null;
  created_at: string;
}

interface ReservationsTableProps {
  searchQuery: string;
  onCountChange: (count: number) => void;
  onRevenueChange: (revenue: number) => void;
}

const SHIFT_LABELS: Record<string, string> = {
  morning: "Mañana",
  afternoon: "Tarde",
  full: "Día Completo",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Confirmado",
  rejected: "Rechazado",
  active: "Activo",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(245,158,11,0.08)", text: "#f59e0b" },
  approved: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  rejected: { bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
  active: { bg: "rgba(80,217,254,0.08)", text: "#50d9fe" },
  completed: { bg: "rgba(16,185,129,0.08)", text: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.08)", text: "#ef4444" },
};

export function ReservationsTable({ searchQuery, onCountChange, onRevenueChange }: ReservationsTableProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/rentals?limit=100", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        const mapped = (data.data || []).map((r: any) => ({
          ...r,
          office_name: r.office?.name || "Consultorio",
          office_type: r.office?.type || "",
        }));
        setReservations(mapped);
      }
    } catch (e) {
      console.error("Error fetching reservations:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeCount = reservations.filter((r) => r.status !== "cancelled" && r.status !== "rejected").length;
    onCountChange(activeCount);

    const totalRev = reservations
      .filter((r) => r.status === "approved" || r.status === "active" || r.status === "completed")
      .reduce((sum, r) => sum + r.total_price, 0);
    onRevenueChange(totalRev);
  }, [reservations, onCountChange, onRevenueChange]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const prev = reservations.find((r) => r.id === id);
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    try {
      const res = await fetch(`/api/rentals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: prev.find((p) => p.id === id)?.status || r.status } : r))
        );
      }

      if (newStatus === "approved") {
        const resData = reservations.find((r) => r.id === id);
        if (resData) {
          fetch("/api/google/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              summary: `Renta ProDental: ${resData.doctor_name}${resData.doctor_specialty ? ` (${resData.doctor_specialty})` : ""}`,
              description: `Confirmación de renta de consultorio.\nConsultorio: ${resData.office_name}\nTurno: ${SHIFT_LABELS[resData.shift] || resData.shift}\nContacto: ${resData.doctor_email}`,
              startDate: resData.dates[0],
            }),
          }).catch((e) => console.error("Error creating Google Calendar event:", e));
        }
      }
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.id === id && prev ? { ...r, status: r.status } : r))
      );
    }
  };

  const handleContact = (res: Reservation) => {
    const message = `Hola ${res.doctor_name}, le escribimos de ProDental Radiología para coordinar su renta de consultorio (${SHIFT_LABELS[res.shift] || res.shift}) programada para el ${res.dates[0]}.`;
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

  const formatDuration = (dates: string[], shift: string) => {
    const count = dates.length;
    if (shift === "morning" || shift === "afternoon") {
      return count === 1 ? "1 día" : `${count} días`;
    }
    return count === 1 ? "1 día" : `${count} días`;
  };

  const filteredReservations = reservations.filter((res) => {
    const label = STATUS_LABELS[res.status] || res.status;
    const matchesStatus = statusFilter === "Todos" || label === statusFilter;
    const matchesSearch =
      res.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.doctor_specialty || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.office_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterOptions = ["Todos", "Pendiente", "Confirmado", "Activo", "Completado", "Cancelado"];

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
      {/* Header Tabla */}
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div>
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            Solicitudes de Renta de Consultorio
          </h2>
          <p className="text-xs text-slate-400">
            Control de reservas realizadas por odontólogos en el portal público
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
              <th className="py-4 px-6">Profesional</th>
              <th className="py-4 px-6">Consultorio</th>
              <th className="py-4 px-6">Turno</th>
              <th className="py-4 px-6">Fecha Inicio</th>
              <th className="py-4 px-6">Costo Total</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-slate-300" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((res) => {
                const colors = STATUS_COLORS[res.status] || STATUS_COLORS.pending;
                const statusLabel = STATUS_LABELS[res.status] || res.status;
                return (
                  <tr
                    key={res.id}
                    className="transition-colors duration-150 hover:bg-white/[0.01]"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-semibold text-white block">{res.doctor_name}</span>
                        <span className="text-[10px] text-slate-500">{res.doctor_specialty || "Sin especialidad"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {res.office_name}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="px-2.5 py-0.5 rounded-full font-semibold text-[10px]"
                        style={{
                          background: res.shift === "full" ? "rgba(80,217,254,0.08)" : "rgba(15,118,110,0.08)",
                          color: res.shift === "full" ? "#50d9fe" : "#0f766e",
                        }}
                      >
                        {SHIFT_LABELS[res.shift] || res.shift}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {formatDate(res.dates[0])}
                      <span className="block text-[10px] text-slate-600">{formatDuration(res.dates, res.shift)}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      ${res.total_price.toLocaleString()} MXN
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
                        {res.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(res.id, "approved")}
                              className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                              title="Confirmar Reserva"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleStatusChange(res.id, "cancelled")}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                              title="Rechazar Reserva"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleContact(res)}
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
                <td colSpan={7} className="py-12 px-6 text-center text-slate-500 font-medium">
                  {loading ? "Cargando..." : "No se encontraron reservas que coincidan con los filtros."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}