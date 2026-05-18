"use client";

import React, { useState, useEffect } from "react";

interface Reservation {
  id: string;
  doctorName: string;
  specialty: string;
  license: string;
  phone: string;
  modality: "Hora" | "Día" | "Mes" | "Año";
  startDate: string;
  duration: string;
  totalPrice: number;
  status: "Pendiente" | "Confirmado" | "Cancelado";
}

interface ReservationsTableProps {
  searchQuery: string;
  onCountChange: (count: number) => void;
  onRevenueChange: (revenue: number) => void;
}

export function ReservationsTable({ searchQuery, onCountChange, onRevenueChange }: ReservationsTableProps) {
  // Datos mock realistas
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "RES-001",
      doctorName: "Dr. Carlos Gutiérrez",
      specialty: "Ortodoncia",
      license: "87654321",
      phone: "5512345678",
      modality: "Mes",
      startDate: "2026-05-20",
      duration: "1 mes",
      totalPrice: 12000,
      status: "Pendiente",
    },
    {
      id: "RES-002",
      doctorName: "Dra. Sofía Martínez",
      specialty: "Odontopediatría",
      license: "98765432",
      phone: "5523456789",
      modality: "Día",
      startDate: "2026-05-19",
      duration: "3 días",
      totalPrice: 3600,
      status: "Confirmado",
    },
    {
      id: "RES-003",
      doctorName: "Dr. Luis Fernando Gómez",
      specialty: "Endodoncia",
      license: "76543210",
      phone: "5534567890",
      modality: "Hora",
      startDate: "2026-05-18",
      duration: "4 horas",
      totalPrice: 1200,
      status: "Confirmado",
    },
    {
      id: "RES-004",
      doctorName: "Dra. Elena Ruiz",
      specialty: "Cirugía Maxilofacial",
      license: "65432109",
      phone: "5545678901",
      modality: "Año",
      startDate: "2026-06-01",
      duration: "1 año",
      totalPrice: 110000,
      status: "Pendiente",
    },
    {
      id: "RES-005",
      doctorName: "Dr. Ricardo Alarcón",
      specialty: "Periodoncia",
      license: "54321098",
      phone: "5556789012",
      modality: "Mes",
      startDate: "2026-05-15",
      duration: "2 meses",
      totalPrice: 24000,
      status: "Confirmado",
    },
    {
      id: "RES-006",
      doctorName: "Dra. Patricia Silva",
      specialty: "Odontología Estética",
      license: "43210987",
      phone: "5567890123",
      modality: "Día",
      startDate: "2026-05-22",
      duration: "1 día",
      totalPrice: 1500,
      status: "Cancelado",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  // Efecto para reportar cambios al padre
  useEffect(() => {
    // Reportar total de reservas activas (no canceladas)
    const activeCount = reservations.filter(r => r.status !== "Cancelado").length;
    onCountChange(activeCount);

    // Calcular ingresos estimados de reservas confirmadas
    const totalRev = reservations
      .filter(r => r.status === "Confirmado")
      .reduce((sum, r) => sum + r.totalPrice, 0);
    onRevenueChange(totalRev);
  }, [reservations, onCountChange, onRevenueChange]);

  const handleStatusChange = async (id: string, newStatus: "Confirmado" | "Cancelado") => {
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, status: newStatus } : res))
    );

    if (newStatus === "Confirmado") {
      const resData = reservations.find(r => r.id === id);
      if (resData) {
        try {
          await fetch("/api/google/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              summary: `Renta ProDental: ${resData.doctorName} (${resData.specialty})`,
              description: `Confirmación de renta de consultorio dental.\nModalidad: ${resData.modality}\nCédula: ${resData.license}\nContacto: ${resData.phone}`,
              startDate: resData.startDate,
            }),
          });
        } catch (e) {
          console.error("Error creating Google Calendar event:", e);
        }
      }
    }
  };

  const handleContact = (res: Reservation) => {
    // Simular redirección de WhatsApp o contacto
    const message = `Hola ${res.doctorName}, le escribimos de ProDental Radiología para coordinar su reserva de consultorio (${res.modality}) programada para el ${res.startDate}.`;
    const whatsappUrl = `https://wa.me/52${res.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Filtrado y Búsqueda
  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === "Todos" || res.status === statusFilter;
    const matchesSearch =
      res.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.license.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

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
          {["Todos", "Pendiente", "Confirmado", "Cancelado"].map((status) => (
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
              <th className="py-4 px-6">Cédula</th>
              <th className="py-4 px-6">Modalidad</th>
              <th className="py-4 px-6">Fecha Inicio</th>
              <th className="py-4 px-6">Costo Total</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-slate-300" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((res) => (
                <tr
                  key={res.id}
                  className="transition-colors duration-150 hover:bg-white/[0.01]"
                >
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-white block">{res.doctorName}</span>
                      <span className="text-[10px] text-slate-500">{res.specialty}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-400">
                    {res.license}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="px-2.5 py-0.5 rounded-full font-semibold text-[10px]"
                      style={{
                        background:
                          res.modality === "Mes" || res.modality === "Año"
                            ? "rgba(80,217,254,0.08)"
                            : "rgba(15,118,110,0.08)",
                        color:
                          res.modality === "Mes" || res.modality === "Año"
                            ? "#50d9fe"
                            : "#0f766e",
                      }}
                    >
                      {res.modality}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {res.startDate}
                    <span className="block text-[10px] text-slate-600">{res.duration}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-white">
                    ${res.totalPrice.toLocaleString()} MXN
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background:
                          res.status === "Confirmado"
                            ? "rgba(16,185,129,0.08)"
                            : res.status === "Cancelado"
                            ? "rgba(239,68,68,0.08)"
                            : "rgba(245,158,11,0.08)",
                        color:
                          res.status === "Confirmado"
                            ? "#10b981"
                            : res.status === "Cancelado"
                            ? "#ef4444"
                            : "#f59e0b",
                      }}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {res.status === "Pendiente" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(res.id, "Confirmado")}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                            title="Confirmar Reserva"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleStatusChange(res.id, "Cancelado")}
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
                        title="Contactar por WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.25 8.477 3.517 2.266 2.268 3.512 5.28 3.51 8.482-.004 6.657-5.34 11.997-11.953 12.003-2.003-.001-3.97-.502-5.717-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.41 5.35 1.412 5.46-.004 9.905-4.453 9.908-9.914.002-2.644-1.023-5.13-2.887-6.996C17.155 1.79 14.673.766 12.02.766 6.562.768 2.112 5.218 2.11 10.68c-.001 2.128.561 3.723 1.492 5.3l-.982 3.585 3.687-.967-.26.155z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 px-6 text-center text-slate-500 font-medium">
                  No se encontraron reservas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
