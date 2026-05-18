"use client";

import React, { useState, useEffect, useRef } from "react";

interface Automation {
  id: string;
  name: string;
  description: string;
  active: boolean;
  channel: "WhatsApp" | "Email";
  template: string;
  defaultTemplate: string;
  variables: string[];
}

export function AutomationsPanel() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "auto-001",
      name: "Confirmación de Cita (Pacientes)",
      description: "Se envía de forma automática en el instante en que el paciente agenda una cita en el portal.",
      active: true,
      channel: "WhatsApp",
      template: "¡Hola *{{paciente}}*! 👋 Confirmamos tu cita para *{{servicio}}* con *{{doctor}}* el día *{{fecha}}* a las *{{hora}}* en ProDental Radiología. 📍 Ubicación: Av. Universidad 1200, CDMX. Si requieres reagendar, ingresa aquí: {{link}} ¡Te esperamos!",
      defaultTemplate: "¡Hola *{{paciente}}*! 👋 Confirmamos tu cita para *{{servicio}}* con *{{doctor}}* el día *{{fecha}}* a las *{{hora}}* en ProDental Radiología. 📍 Ubicación: Av. Universidad 1200, CDMX. Si requieres reagendar, ingresa aquí: {{link}} ¡Te esperamos!",
      variables: ["paciente", "servicio", "doctor", "fecha", "hora", "link"],
    },
    {
      id: "auto-002",
      name: "Recordatorio de Cita (24h Antes)",
      description: "Recordatorio preventivo enviado 24 horas antes de la cita para reducir inasistencias.",
      active: true,
      channel: "WhatsApp",
      template: "Hola *{{paciente}}*, te recordamos tu cita de mañana *{{fecha}}* a las *{{hora}}* para tu estudio de *{{servicio}}* con *{{doctor}}*. Por favor llega 10 minutos antes con tu orden de estudio. 🦷 ProDental",
      defaultTemplate: "Hola *{{paciente}}*, te recordamos tu cita de mañana *{{fecha}}* a las *{{hora}}* para tu estudio de *{{servicio}}* con *{{doctor}}*. Por favor llega 10 minutos antes con tu orden de estudio. 🦷 ProDental",
      variables: ["paciente", "fecha", "hora", "servicio", "doctor"],
    },
    {
      id: "auto-003",
      name: "Confirmación de Renta (Doctores)",
      description: "Se envía automáticamente al odontólogo una vez que el administrador aprueba su reserva de consultorio.",
      active: true,
      channel: "WhatsApp",
      template: "Estimado(a) *{{doctor}}*, nos alegra informarle que su reserva del consultorio ProDental en la modalidad *{{modalidad}}* ha sido confirmada. 📅 Fecha inicio: *{{fecha}}*. Su espacio estará listo y equipado con todos los insumos solicitados. ¡Mucho éxito en su consulta!",
      defaultTemplate: "Estimado(a) *{{doctor}}*, nos alegra informarle que su reserva del consultorio ProDental en la modalidad *{{modalidad}}* ha sido confirmada. 📅 Fecha inicio: *{{fecha}}*. Su espacio estará listo y equipado con todos los insumos solicitados. ¡Mucho éxito en su consulta!",
      variables: ["doctor", "modalidad", "fecha"],
    },
    {
      id: "auto-004",
      name: "Encuesta de Satisfacción",
      description: "Enviado 2 horas después de completar la cita del paciente para evaluar la calidad del servicio.",
      active: false,
      channel: "WhatsApp",
      template: "Hola *{{paciente}}*, gracias por confiar tu sonrisa en ProDental. 😊 Nos encantaría saber cómo fue tu experiencia en tu estudio de *{{servicio}}*. Te tomará solo 1 minuto evaluar nuestro servicio aquí: {{link}} ¡Gracias por tu valioso feedback!",
      defaultTemplate: "Hola *{{paciente}}*, gracias por confiar tu sonrisa en ProDental. 😊 Nos encantaría saber cómo fue tu experiencia en tu estudio de *{{servicio}}*. Te tomará solo 1 minuto evaluar nuestro servicio aquí: {{link}} ¡Gracias por tu valioso feedback!",
      variables: ["paciente", "servicio", "link"],
    },
  ]);

  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarId, setCalendarId] = useState("primary");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [updatingCalendar, setUpdatingCalendar] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    fetch("/api/google/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setCalendarConnected(true);
        }
        setCalendarId(data.calendarId || "primary");
        setClientId(data.clientId || "");
        setClientSecret(data.clientSecret || "");
        setLoadingCalendar(false);
      })
      .catch(() => setLoadingCalendar(false));
  }, []);

  const handleConnectCalendar = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSaveCalendarConfig = async () => {
    setUpdatingCalendar(true);
    try {
      const res = await fetch("/api/google/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarId, clientId, clientSecret }),
      });
      if (res.ok) {
        alert("¡Configuración de Google Calendar guardada con éxito!");
      }
    } catch (e) {
      console.error(e);
      alert("Error al guardar la configuración");
    }
    setUpdatingCalendar(false);
  };

  const [selectedAutoId, setSelectedAutoId] = useState<string>("auto-001");
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [isSavedNotify, setIsSavedNotify] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedAuto = automations.find((a) => a.id === selectedAutoId) || automations[0];

  // Sincronizar editor cuando cambia la automatización seleccionada
  useEffect(() => {
    setCurrentTemplate(selectedAuto.template);
  }, [selectedAutoId, selectedAuto]);

  const toggleAutomation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se seleccione para edición al hacer toggle
    setAutomations(
      automations.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleSave = () => {
    setAutomations(
      automations.map((a) => (a.id === selectedAutoId ? { ...a, template: currentTemplate } : a))
    );
    setIsSavedNotify(true);
    setTimeout(() => setIsSavedNotify(false), 2500);
  };

  const handleRestoreDefault = () => {
    setCurrentTemplate(selectedAuto.defaultTemplate);
  };

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = currentTemplate;
    const placeholder = `{{${variable}}}`;

    const newTemplate = text.substring(0, startPos) + placeholder + text.substring(endPos);
    setCurrentTemplate(newTemplate);

    // Reposicionar el cursor después de la variable insertada
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = startPos + placeholder.length;
    }, 50);
  };

  // Función para parsear el template con datos mock realistas para la vista previa de WhatsApp
  const parseTemplate = (templateText: string) => {
    const mockData: Record<string, string> = {
      paciente: "María José Beltrán",
      servicio: "Radiografía Panorámica",
      doctor: "Dra. Sofía Martínez",
      fecha: "20 de Mayo, 2026",
      hora: "10:30 AM",
      link: "prodental.mx/c/res38v",
      modalidad: "Mensual (Mes)",
    };

    let parsed = templateText;
    Object.entries(mockData).forEach(([key, val]) => {
      // Reemplazar {{variable}} por el valor mock
      parsed = parsed.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), val);
    });

    // Formatear negritas de WhatsApp: *texto* -> <strong>texto</strong>
    parsed = parsed.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    
    // Saltos de línea
    parsed = parsed.replace(/\n/g, "<br />");

    return parsed;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Columna Izquierda: Lista de Automatizaciones y Editor */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Card: Lista de Automatizaciones */}
        <div
          className="rounded-2xl border"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              Automatizaciones Activas
            </h2>
            <p className="text-xs text-slate-400">
              Configura y edita los flujos automáticos de confirmaciones y recordatorios
            </p>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {automations.map((auto) => {
              const isSelected = selectedAutoId === auto.id;
              return (
                <div
                  key={auto.id}
                  onClick={() => setSelectedAutoId(auto.id)}
                  className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-all duration-200 ${
                    isSelected ? "bg-white/[0.02]" : "hover:bg-white/[0.005]"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{
                          background: auto.channel === "WhatsApp" ? "rgba(16,185,129,0.1)" : "rgba(80,217,254,0.1)",
                          color: auto.channel === "WhatsApp" ? "#10b981" : "#50d9fe",
                        }}
                      >
                        {auto.channel}
                      </span>
                      <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {auto.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {auto.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Botón de estado Switch */}
                    <button
                      onClick={(e) => toggleAutomation(auto.id, e)}
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      style={{
                        background: auto.active ? "#10b981" : "rgba(255,255,255,0.1)",
                      }}
                      aria-label={`Activar/Desactivar ${auto.name}`}
                    >
                      <span
                        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        style={{
                          transform: auto.active ? "translateX(20px)" : "translateX(0px)",
                        }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card: Editor de Plantilla */}
        <div
          className="rounded-2xl border p-6 space-y-6"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                Editor de Plantilla: <span className="text-[#50d9fe]">{selectedAuto.name}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Personaliza el contenido del mensaje y las variables dinámicas
              </p>
            </div>
            <button
              onClick={handleRestoreDefault}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
            >
              Restaurar predeterminado
            </button>
          </div>

          {/* Variables de plantilla */}
          <div className="space-y-2">
            <span className="block text-[11px] font-semibold text-slate-400">
              Variables disponibles (Haz clic para insertar):
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedAuto.variables.map((variable) => (
                <button
                  key={variable}
                  onClick={() => insertVariable(variable)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono text-slate-300 border transition-all duration-150 hover:bg-[#50d9fe]/10 hover:text-[#50d9fe] hover:border-[#50d9fe]/30"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  {"{{" + variable + "}}"}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Input Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={currentTemplate}
              onChange={(e) => setCurrentTemplate(e.target.value)}
              className="w-full h-40 p-4 rounded-xl text-xs text-white placeholder-slate-500 border outline-none resize-none transition-all duration-200 leading-relaxed font-work-sans"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(80,217,254,0.3)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(80,217,254,0.05)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {/* Variable insertion hint */}
            <span className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-medium select-none pointer-events-none">
              Usa asteriscos * para negritas en WhatsApp
            </span>
          </div>

          {/* Editor Action Buttons */}
          <div className="flex items-center gap-4 justify-end">
            {isSavedNotify && (
              <span
                className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-pulse"
                style={{ animationDuration: "1s" }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Plantilla guardada!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl font-semibold text-white text-xs transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #0f766e, #0a5b55)",
                boxShadow: "0 4px 12px rgba(15,118,110,0.2)",
              }}
            >
              Guardar Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Integración y Vista Previa */}
      <div className="xl:col-span-4 space-y-6">
        {/* Card: Google Calendar Integration */}
        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                Integración Google Calendar
              </h3>
              <p className="text-[10px] text-slate-400">Automatiza la agenda en tu calendario real</p>
            </div>
          </div>

          {loadingCalendar ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#50d9fe]"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Estado de conexión */}
              <div className="flex items-center justify-between p-2.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-slate-400">Estado:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide flex items-center gap-1.5 ${
                    calendarConnected
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${calendarConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  {calendarConnected ? "Conectado" : "Desconectado"}
                </span>
              </div>

              {/* Formulario de Configuración de Credenciales */}
              <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  1. Configurar Credenciales de Google OAuth
                </span>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400">Google Client ID:</label>
                  <input
                    type="text"
                    placeholder="Pega tu Client ID aquí..."
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-[#50d9fe]/40 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400">Google Client Secret:</label>
                  <div className="relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      placeholder="Pega tu Client Secret aquí..."
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-[#50d9fe]/40 font-mono pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showSecret ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400">URI de redirección autorizada:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value="http://localhost:3000/api/auth/google/callback"
                      className="w-full px-3 py-1.5 rounded-lg text-[10px] text-slate-400 bg-white/5 border border-white/10 outline-none font-mono cursor-default select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("http://localhost:3000/api/auth/google/callback");
                        alert("¡URI de redirección copiada al portapapeles!");
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      title="Copiar URI"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {calendarConnected && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Calendar ID:</label>
                    <input
                      type="text"
                      value={calendarId}
                      onChange={(e) => setCalendarId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-[#50d9fe]/40 font-mono"
                    />
                  </div>
                )}

                <button
                  onClick={handleSaveCalendarConfig}
                  disabled={updatingCalendar}
                  className="w-full py-2 mt-1 rounded-lg font-semibold text-xs text-slate-100 bg-[#0f766e] hover:bg-[#0c5c56] transition-colors shadow-lg"
                >
                  {updatingCalendar ? "Guardando..." : "Guardar Configuración"}
                </button>
              </div>

              {/* Botón de conexión OAuth */}
              <div className="space-y-2.5 pt-3 border-t border-white/[0.04]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  2. Vincular cuenta de Google
                </span>
                
                {calendarConnected ? (
                  <button
                    onClick={handleConnectCalendar}
                    className="w-full py-2 rounded-lg font-semibold text-xs text-slate-100 bg-[#0a5b55]/40 hover:bg-[#0f766e] border border-[#0f766e]/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.324 0-6.023-2.699-6.023-6.023 0-3.324 2.699-6.023 6.023-6.023 1.49 0 2.859.547 3.916 1.455l3.122-3.122C19.125 1.79 15.932 1 12.24 1 6.033 1 12 6.033 12 12.24s5.033 11.24 11.24 11.24c5.897 0 10.748-4.258 10.748-10.748 0-.497-.047-.98-.124-1.447H12.24z" />
                    </svg>
                    Re-conectar cuenta de Google
                  </button>
                ) : (
                  <>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Una vez guardadas tus credenciales, haz clic abajo para vincular tu cuenta de Google. DentiBot podrá buscar disponibilidad en tu agenda real y programar citas automáticamente.
                    </p>
                    <button
                      onClick={handleConnectCalendar}
                      className="w-full py-2 rounded-lg font-semibold text-xs text-slate-900 bg-white hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.324 0-6.023-2.699-6.023-6.023 0-3.324 2.699-6.023 6.023-6.023 1.49 0 2.859.547 3.916 1.455l3.122-3.122C19.125 1.79 15.932 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.748-4.258 10.748-10.748 0-.497-.047-.98-.124-1.447H12.24z" />
                      </svg>
                      Conectar Google Calendar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Teléfono Mockup */}
        <div
          className="rounded-[36px] p-3 border-4 mx-auto w-full max-w-[320px] aspect-[9/18] relative flex flex-col overflow-hidden shadow-2xl"
          style={{
            background: "#080f1a",
            borderColor: "#1e293b",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.05)",
          }}
        >
          {/* Top Speaker / Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full bg-slate-900 z-50 flex items-center justify-center gap-1.5">
            <div className="w-12 h-1 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-850" />
          </div>

          {/* WhatsApp Header bar */}
          <div className="bg-[#075e54] pt-8 pb-3 px-4 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-2">
              {/* Back Arrow icon */}
              <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#128c7e] flex items-center justify-center font-bold text-[10px] text-white/90 shadow">
                PD
              </div>
              <div>
                <span className="block text-xs font-bold leading-none">ProDental</span>
                <span className="text-[8px] text-white/70 font-medium">en línea</span>
              </div>
            </div>
            {/* Call icons */}
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.3 14.3c-.6-.2-1.3-.5-1.9-.8-.3-.1-.6 0-.8.2l-1.1 1.4c-2.3-1.1-4.2-3-5.3-5.3l1.4-1.1c.2-.2.3-.5.2-.8-.3-.6-.6-1.3-.8-1.9-.1-.3-.4-.5-.7-.5H6.2c-.4 0-.8.3-.8.7 0 9.2 7.5 16.7 16.7 16.7.4 0 .7-.4.7-.8v-2.1c0-.3-.2-.6-.5-.7z" />
              </svg>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
          </div>

          {/* WhatsApp Chat Background (Simulado) */}
          <div
            className="flex-1 p-3 overflow-y-auto relative flex flex-col justify-end"
            style={{
              backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
              backgroundSize: "cover",
              backgroundBlendMode: "overlay",
              backgroundColor: "#efeae2",
            }}
          >
            {/* Info Badge */}
            <div className="bg-white/80 backdrop-blur-[2px] rounded-lg p-2 text-center text-[9px] text-slate-600 font-medium mb-4 max-w-[220px] mx-auto shadow-sm select-none">
              🔒 Los mensajes y llamadas están cifrados de extremo a extremo.
            </div>

            {/* Message Bubble */}
            <div
              className={`rounded-xl p-2.5 max-w-[230px] self-start relative shadow-sm border ${
                selectedAuto.active ? "bg-[#d9fdd3] text-[#111b21] border-[#c0ebd0]" : "bg-white text-slate-400 border-slate-200/60"
              }`}
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                lineHeight: "1.35",
              }}
            >
              {/* WhatsApp message text parsed */}
              <div
                className="text-[10.5px]"
                dangerouslySetInnerHTML={{
                  __html: parseTemplate(currentTemplate),
                }}
              />
              
              {/* Time indicator */}
              <div className="text-right text-[8px] text-[#667781] mt-1 select-none font-medium flex items-center justify-end gap-1">
                <span>14:41 PM</span>
                {selectedAuto.active && (
                  <svg className="w-3.5 h-3.5 text-[#53bdeb]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7m-5 6l1-1 4 4" />
                  </svg>
                )}
              </div>

              {/* Speech bubble small triangle pointer */}
              <div
                className="absolute top-0 -left-1.5 w-0 h-0"
                style={{
                  borderStyle: "solid",
                  borderWidth: "0 8px 8px 0",
                  borderColor: `transparent ${selectedAuto.active ? "#d9fdd3" : "#ffffff"} transparent transparent`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Info Card de ayuda de Demo */}
        <div
          className="rounded-2xl border p-4 space-y-2 text-xs"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <span className="text-[#50d9fe] font-semibold flex items-center gap-1.5">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Modo Demo Activo
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            La vista previa en el teléfono simula el parseo real usando datos de ejemplo (*María José Beltrán*, *Radiografía Panorámica*, etc). Al editar el texto, verás los cambios en tiempo real en la pantalla del celular.
          </p>
        </div>
      </div>
    </div>
  );
}
