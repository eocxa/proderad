"use client";

import React, { useState, useEffect } from "react";

interface Appointment {
  id: string;
  patientName: string;
  service: string;
  assignedDoctor: string;
  phone: string;
  date: string;
  time: string;
  status: "Pendiente" | "Completada" | "Cancelada";
}

interface AppointmentsPanelProps {
  searchQuery: string;
  onCountChange: (count: number) => void;
}

export function AppointmentsPanel({ searchQuery, onCountChange }: AppointmentsPanelProps) {
  // Datos mock realistas
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT-001",
      patientName: "María José Beltrán",
      service: "Radiografía Panorámica",
      assignedDoctor: "Dra. Sofía Martínez",
      phone: "5587654321",
      date: "2026-05-18",
      time: "10:30 AM",
      status: "Pendiente",
    },
    {
      id: "APT-002",
      patientName: "Juan Pablo Hernández",
      service: "Tomografía Cone Beam",
      assignedDoctor: "Dr. Carlos Gutiérrez",
      phone: "5576543210",
      date: "2026-05-18",
      time: "11:45 AM",
      status: "Pendiente",
    },
    {
      id: "APT-003",
      patientName: "Ana Laura Torres",
      service: "Limpieza Dental Ultrasonido",
      assignedDoctor: "Dr. Luis Fernando Gómez",
      phone: "5565432109",
      date: "2026-05-18",
      time: "02:15 PM",
      status: "Completada",
    },
    {
      id: "APT-004",
      patientName: "Gabriel Montes",
      service: "Blanqueamiento LED",
      assignedDoctor: "Dra. Patricia Silva",
      phone: "5554321098",
      date: "2026-05-19",
      time: "09:00 AM",
      status: "Pendiente",
    },
    {
      id: "APT-005",
      patientName: "Diana Valeria Rivas",
      service: "Radiografía Panorámica",
      assignedDoctor: "Dra. Sofía Martínez",
      phone: "5543210987",
      date: "2026-05-17",
      time: "04:30 PM",
      status: "Completada",
    },
    {
      id: "APT-006",
      patientName: "Roberto Medina",
      service: "Tomografía Cone Beam",
      assignedDoctor: "Dr. Carlos Gutiérrez",
      phone: "5532109876",
      date: "2026-05-17",
      time: "01:00 PM",
      status: "Cancelada",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("Todos");

  // Efecto para reportar cambios al padre
  useEffect(() => {
    // Reportar citas pendientes de hoy/mañana
    const pendingCount = appointments.filter(a => a.status === "Pendiente").length;
    onCountChange(pendingCount);
  }, [appointments, onCountChange]);

  const handleStatusChange = (id: string, newStatus: "Completada" | "Cancelada") => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleContact = (apt: Appointment) => {
    const message = `Hola ${apt.patientName}, le escribimos de ProDental para coordinar su cita de ${apt.service} programada para el ${apt.date} a las ${apt.time}.`;
    const whatsappUrl = `https://wa.me/52${apt.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Filtrado y Búsqueda
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "Todos" || apt.status === statusFilter;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.assignedDoctor.toLowerCase().includes(searchQuery.toLowerCase());
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
          {["Todos", "Pendiente", "Completada", "Cancelada"].map((status) => (
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
              <th className="py-4 px-6">Servicio Solicitado</th>
              <th className="py-4 px-6">Médico Asignado</th>
              <th className="py-4 px-6">Fecha / Hora</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-slate-300" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="transition-colors duration-150 hover:bg-white/[0.01]"
                >
                  <td className="py-4 px-6 font-semibold text-white">
                    {apt.patientName}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="px-2.5 py-0.5 rounded-full font-semibold text-[10px]"
                      style={{
                        background: apt.service.includes("Radiografía") || apt.service.includes("Tomografía")
                          ? "rgba(80,217,254,0.08)"
                          : "rgba(15,118,110,0.08)",
                        color: apt.service.includes("Radiografía") || apt.service.includes("Tomografía")
                          ? "#50d9fe"
                          : "#0f766e",
                      }}
                    >
                      {apt.service}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {apt.assignedDoctor}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {apt.date}
                    <span className="block text-[10px] text-slate-600">{apt.time}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background:
                          apt.status === "Completada"
                            ? "rgba(16,185,129,0.08)"
                            : apt.status === "Cancelada"
                            ? "rgba(239,68,68,0.08)"
                            : "rgba(245,158,11,0.08)",
                        color:
                          apt.status === "Completada"
                            ? "#10b981"
                            : apt.status === "Cancelada"
                            ? "#ef4444"
                            : "#f59e0b",
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {apt.status === "Pendiente" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(apt.id, "Completada")}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                            title="Marcar como Completada"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt.id, "Cancelada")}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                            title="Cancelar Cita"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleContact(apt)}
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
                <td colSpan={6} className="py-12 px-6 text-center text-slate-500 font-medium">
                  No se encontraron citas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
