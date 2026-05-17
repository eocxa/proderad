// ─── BASE DE CONOCIMIENTO DENTIBOT ───────────────────────────────────────────
// Documentación interna de procesos para que DentiBot guíe a usuarios con dudas.

export const PROCESS_DOCS = {

  // ── PROCESO: AGENDAR CITA (PACIENTES) ────────────────────────────────────
  agendar_cita: {
    titulo: "Cómo agendar una cita",
    pasos: [
      "Entra a la sección principal de la clínica.",
      "Haz clic en 'Agendar cita' en el menú superior o en el botón del hero.",
      "Selecciona el tipo de servicio que necesitas (limpieza, ortodoncia, implante, etc.).",
      "Elige el día y el horario que mejor te convenga.",
      "Llena tus datos: nombre, teléfono y correo.",
      "Confirma tu reserva. Recibirás un aviso de confirmación.",
    ],
    resumen: "Para agendar tu cita ve al inicio y usa el botón 'Agendar cita'. Selecciona servicio, fecha y llena tus datos.",
    ruta: "/consultorio#citas",
  },

  // ── PROCESO: RENTA DE CONSULTORIO (PROFESIONALES) ────────────────────────
  renta_consultorio: {
    titulo: "Cómo rentar un consultorio",
    pasos: [
      "Ingresa a la sección 'Soy Profesional' desde el menú.",
      "Explora los espacios disponibles y elige una categoría (General, Fisioterapia, Odontopediatría, Psicología).",
      "Haz clic en un consultorio para ver su detalle.",
      "Selecciona la modalidad de renta: Hora ($120), Día ($1,200), Mes ($30,000) o Anual ($300,000).",
      "Si deseas, agrega servicios extra: Rayos X, Autoclave o Asistente.",
      "Revisa el total en la barra inferior y haz clic en 'Reservar Ahora'.",
      "Paso 1: Elige tu fecha. Si es por hora, selecciona también el horario. Si es por días, puedes elegir varios días.",
      "Paso 2: Llena tus datos profesionales (nombre, cédula de 8 dígitos, teléfono de 10 dígitos, correo).",
      "Paso 3: Revisa el resumen completo y elige tu método de pago (tarjeta o WhatsApp).",
      "¡Listo! Tu reserva quedará confirmada.",
    ],
    resumen: "Ve a 'Soy Profesional', elige un espacio, selecciona la modalidad y completa los 3 pasos del formulario.",
    ruta: "/renta-consultorios",
  },

  // ── ERRORES COMUNES Y SOLUCIONES ─────────────────────────────────────────
  errores: {
    no_avanza_formulario: "Si el botón 'Siguiente' está deshabilitado, revisa que todos los campos estén completos y correctos. El teléfono debe tener exactamente 10 dígitos, la cédula exactamente 8, y el correo debe ser válido.",
    telefono_invalido: "El campo de teléfono solo acepta números (sin espacios ni guiones). Escribe los 10 dígitos seguidos, por ejemplo: 5512345678.",
    cedula_invalida: "La cédula profesional debe tener exactamente 8 dígitos numéricos. Verifica tu documento oficial.",
    correo_invalido: "El correo debe tener formato válido: usuario@dominio.com. No se aceptan correos de prueba como test@test.com.",
    mapa_no_carga: "Si el mapa no se muestra, verifica tu conexión a internet. También puedes hacer clic en 'Cómo llegar' para abrir Google Maps directamente.",
    no_encuentro_citas: "El formulario de citas está al final de la página de inicio. Haz scroll hacia abajo o usa el botón 'Agendar cita' del menú.",
    no_encuentro_reservar: "El botón 'Reservar Ahora' aparece en la barra inferior de la página del consultorio. Si no lo ves, intenta hacer scroll para que aparezca o recarga la página.",
    precio_cambia: "Es normal que el precio cambie al seleccionar modalidad (Hora/Día/Mes/Año) y al agregar servicios como Rayos X o Asistente. El total se actualiza automáticamente.",
    como_elegir_plan: "Si usas el espacio esporádicamente, elige 'Hora' o 'Día'. Si lo usas regularmente, 'Mes' o 'Anual' te da mejor precio. El plan mensual equivale a 25 horas al precio de hora.",
    calendario_dias: "Para el plan 'Día', puedes seleccionar varios días en el calendario. El precio se multiplicará por la cantidad de días elegidos.",
    calendario_mes: "Al elegir plan mensual, selecciona el día de inicio y el sistema calculará automáticamente tu estancia de 30 días.",
  },

  // ── PRECIOS ───────────────────────────────────────────────────────────────
  precios: {
    consulta: "Limpieza: $600 · Valoración: Gratis · Blanqueamiento: $2,500 · Ortodoncia: desde $12,000",
    renta_base: "Hora: $120 · Día: $1,200 · Mes: $30,000 · Año: $300,000",
    addons_hora: "Con plan Hora — Rayos X: +$50 · Autoclave: +$30 · Asistente: +$100",
    addons_dia:  "Con plan Día — Rayos X: +$300 · Autoclave: +$200 · Asistente: +$600",
    addons_mes:  "Con plan Mes — Rayos X: +$1,500 · Autoclave: +$1,000 · Asistente: +$3,000",
    addons_anual:"Con plan Anual — Rayos X: +$15,000 · Autoclave: +$10,000 · Asistente: +$30,000",
  },

  // ── SERVICIOS MÉDICOS ─────────────────────────────────────────────────────
  servicios: {
    limpieza: "Limpieza dental profunda con ultrasonido. Duración: ~45 min. Precio: $600.",
    ortodoncia: "Brackets metálicos, cerámicos y Invisalign. Consulta inicial gratuita.",
    implantes: "Implantes de titanio con garantía. Consulta y plan de tratamiento gratuitos.",
    blanqueamiento: "Blanqueamiento LED en consultorio. Resultado en 1 sesión. Precio: $2,500.",
    radiologia: "Radiografía panorámica digital y tomografía 3D disponible en clínica.",
    pediatria: "Odontología pediátrica con ambiente amigable para niños.",
  },

  // ── UBICACIÓN ─────────────────────────────────────────────────────────────
  ubicacion: {
    direccion: "Av. la Teja 66, Coapa, Narciso Mendoza, Tlalpan, 14390 CDMX",
    horario: "Lun–Jue 9:00–20:00 · Vie 9:00–19:00 · Sáb 8:00–14:00",
    telefono: "+52 55 5673 9186",
    como_llegar: "Puedes llegar en Metro a estación Perisur (L1) o en Metrobús Coapa. Hay estacionamiento disponible.",
  },
};

// ─── PALABRAS CLAVE AMPLIADAS ─────────────────────────────────────────────────
export const EXTENDED_KB = {
  process_help: [
    'como', 'ayuda', 'ayudame', 'no entiendo', 'no puedo', 'no se',
    'como funciona', 'pasos', 'proceso', 'instrucciones', 'guia',
    'explica', 'explicame', 'no sé', 'duda', 'confused', 'perdido',
    'no encuentro', 'donde esta', 'no veo', 'no aparece',
  ],
  booking_help: [
    'cita', 'agendar', 'reservar', 'turno', 'calendario', 'fecha',
    'horario', 'dentista', 'limpieza', 'ortodoncia', 'implante',
    'blanqueamiento', 'radiografia', 'rx', 'duele', 'urgente',
    'consulta', 'valoracion', 'revision', 'cuando', 'puedo ir',
  ],
  rental_help: [
    'renta', 'rentar', 'alquilar', 'consultorio', 'profesional',
    'doctor', 'espacio', 'hora', 'dia', 'mes', 'anual', 'plan',
    'precio renta', 'cuanto cuesta renta', 'rayos x', 'autoclave',
    'asistente', 'reservar espacio', 'soy doctor', 'soy dentista',
    'trabajo', 'practicar', 'usar consultorio',
  ],
  error_help: [
    'error', 'no funciona', 'problema', 'falla', 'no me deja',
    'no avanza', 'trabado', 'atorado', 'bloqueado', 'no carga',
    'no puedo continuar', 'siguiente deshabilitado', 'telefono no',
    'cedula no', 'correo invalido', 'no acepta', 'que pasa',
    'por que no', 'bug', 'roto', 'no jala',
  ],
  pricing_help: [
    'precio', 'costo', 'cuanto', 'cuanto cuesta', 'cuanto vale',
    'tarifa', 'cobran', 'barato', 'caro', 'descuento', 'oferta',
    'gratis', 'gratuito', 'plan', 'diferencia entre',
  ],
  services_info: [
    'servicio', 'tratamiento', 'limpieza', 'ortodoncia', 'implante',
    'blanqueamiento', 'radiografia', 'panoramica', 'tomografia',
    'pediatria', 'ninos', 'endodoncia', 'corona', 'protesis',
  ],
  schedule_info: [
    'horario', 'abierto', 'abren', 'cierran', 'cuando', 'atienden',
    'dias', 'sabado', 'domingo', 'festivo', 'disponible',
  ],
};
