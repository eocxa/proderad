"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Calendar, MapPin, Building2, User, Sparkles, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROCESS_DOCS, EXTENDED_KB } from '@/lib/dentibot-kb';

// --- CONFIGURACIÓN DEL MOTOR DE IA LOCAL ---

type ChatState = 'START' | 'SERVICE_EXPLORATION' | 'BOOKING_INTENT' | 'RENTAL_EXPLORATION' | 'LOCATION_INTENT' | 'DOCS_HELP';

interface Message {
  role: 'bot' | 'user';
  text: string;
  type?: 'text' | 'options';
  options?: { label: string; action: string }[];
}

const KNOWLEDGE_BASE = {
  greetings: ['hola', 'que tal', 'buen dia', 'buenas tardes', 'que onda', 'hey', 'hi'],
  booking: ['cita', 'agendar', 'turno', 'reservar', 'espacio', 'limpieza', 'ortodoncia', 'dentista', 'urge', 'duele', 'dolor', 'revisar'],
  location: ['donde', 'ubicacion', 'mapa', 'llegar', 'direccion', 'estan', 'sucursal', 'cerquita', 'lejos'],
  rental: ['renta', 'alquiler', 'rentar', 'doctor', 'profesional', 'consultorio', 'espacio dental', 'trabajar', 'chamba', 'ocupo', 'rentame'],
  affirmation: ['si', 'va', 'arre', 'vale', 'simon', 'dale', 'porfa', 'okay', 'ok', 'estaria bien'],
  negation: ['no', 'despues', 'luego', 'paso', 'nada', 'ninguno'],
  human: ['asesor', 'humano', 'persona', 'operador', 'alguien', 'contacto', 'telefono', 'llamar']
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentState, setCurrentState] = useState<ChatState>('START');
  const [fallbackCount, setFallbackCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShowChat(true), 50);
      return () => clearTimeout(t);
    } else {
      setShowChat(false);
    }
  }, [isOpen]);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      text: '¡Hola! Qué gusto saludarte. Soy el asistente de ProDental. ¿En qué te puedo apoyar hoy?',
      type: 'options',
      options: [
        { label: 'Agendar una Cita', action: 'INTENT_BOOKING' },
        { label: 'Ver Ubicación', action: 'INTENT_LOCATION' },
        { label: 'Precios y Servicios', action: 'INTENT_SERVICES' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Normalizador de texto para entender modismos y errores ortográficos
  const normalizeText = (text: string) => {
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[?¿!¡.,]/g, "") // Quitar puntuación
      .trim();
  };

  const addBotMessage = (text: string, options?: Message['options'], newState?: ChatState) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text, options, type: options ? 'options' : 'text' }]);
      if (newState) setCurrentState(newState);
    }, 1200);
  };

  // --- MOTOR DE LÓGICA DE FLUJOS ---
  
  // --- MOTOR DE INTELIGENCIA AVANZADA (FUZZY LOGIC) ---

  // Normalizador fonético para modismos y errores ortográficos comunes
  const advancedNormalize = (text: string) => {
    let normalized = text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[?¿!¡.,]/g, "") // Quitar puntuación
      .replace(/\s+/g, ' ') // Quitar espacios extra
      .trim();

    // Reemplazos fonéticos comunes en español/slang
    normalized = normalized.replace(/k/g, 'qu')
      .replace(/z/g, 's')
      .replace(/v/g, 'b')
      .replace(/y/g, 'i')
      .replace(/h/g, ''); // El h es muda y a veces se olvida

    return normalized;
  };

  // Algoritmo de Levenshtein para medir similitud entre palabras
  const getSimilarity = (s1: string, s2: string) => {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return 1 - matrix[len1][len2] / Math.max(len1, len2);
  };

  const handleBotLogic = (userInput: string) => {
    const rawText = userInput.trim();
    const cleanText = advancedNormalize(rawText);
    const words = cleanText.split(' ');

    const hasIntent = (category: keyof typeof KNOWLEDGE_BASE) => {
      return words.some(word => 
        KNOWLEDGE_BASE[category].some(keyword => {
          const normKeyword = advancedNormalize(keyword);
          return word.includes(normKeyword) || getSimilarity(word, normKeyword) > 0.8;
        })
      );
    };

    const hasExtendedIntent = (category: keyof typeof EXTENDED_KB) => {
      return words.some(word => 
        EXTENDED_KB[category].some(keyword => {
          const normKeyword = advancedNormalize(keyword);
          return word.includes(normKeyword) || getSimilarity(word, normKeyword) > 0.8;
        })
      );
    };

    // 1. Detección de Intenciones Globales
    const isBooking = hasIntent('booking') || cleanText.includes('blanqueamiento') || cleanText.includes('blaquiamiento');
    const isLocation = hasIntent('location');
    const isRental = hasIntent('rental');
    const isGreeting = hasIntent('greetings');
    const isYes = hasIntent('affirmation');
    const isPrice = cleanText.includes('precio') || cleanText.includes('costo') || cleanText.includes('cuanto') || cleanText.includes('vale');
    const isHuman = hasIntent('human');

    const isProcessHelp = hasExtendedIntent('process_help');
    const isErrorHelp = hasExtendedIntent('error_help') || cleanText.includes('falla') || cleanText.includes('no avanza') || cleanText.includes('invalido');

    // 2. Lógica Basada en Estado Actual
    if (currentState === 'RENTAL_EXPLORATION' && isYes) {
      setFallbackCount(0);
      handleAction('ACTION_RENTAL');
      return;
    }
    if (currentState === 'LOCATION_INTENT' && isYes) {
      setFallbackCount(0);
      handleAction('INTENT_LOCATION');
      return;
    }
    if (currentState === 'BOOKING_INTENT' && isYes) {
      setFallbackCount(0);
      handleAction('INTENT_BOOKING');
      return;
    }

    // 3. Resolución de Intenciones
    if (isHuman) {
      setFallbackCount(0);
      handleAction('INTENT_HUMAN');
      return;
    }

    // A) AYUDA DE PROCESOS / PASO A PASO
    if (isProcessHelp) {
      setFallbackCount(0);
      
      // ¿Es sobre rentar consultorios?
      if (words.some(w => EXTENDED_KB.rental_help.includes(w)) || cleanText.includes('rent')) {
        addBotMessage(
          `🏢 **Proceso para Rentar un Consultorio:**\n\n` +
          `1. Ve a **'Soy Profesional'** en el menú.\n` +
          `2. Elige tu tipo de espacio y pulsa en su ficha.\n` +
          `3. Elige plan (**Hora, Día, Mes, Año**) y servicios adicionales (Rayos X, Asistente, Autoclave).\n` +
          `4. Pulsa **'Reservar Ahora'** y completa los 3 pasos del formulario (Días/Horas, tus datos, y método de pago).`,
          [
            { label: 'Ir a Renta de Consultorios', action: 'ACTION_RENTAL' },
            { label: 'Ayuda con errores de formulario', action: 'HELP_ERRORS' }
          ],
          'DOCS_HELP'
        );
        return;
      }
      
      // ¿Es sobre agendar citas de pacientes?
      if (words.some(w => EXTENDED_KB.booking_help.includes(w)) || cleanText.includes('cita')) {
        addBotMessage(
          `🦷 **Proceso para Agendar una Cita Dental:**\n\n` +
          `1. Entra a la sección de citas (inicio de la web).\n` +
          `2. Selecciona el servicio (Limpieza, Valoración, Ortodoncia, etc.).\n` +
          `3. Selecciona tu día y hora disponibles en el calendario.\n` +
          `4. Llena tus datos de contacto y pulsa en 'Agendar'.`,
          [
            { label: 'Ir a Agendar Cita', action: 'INTENT_BOOKING' },
            { label: 'Ver Precios de Servicios', action: 'INTENT_SERVICES' }
          ],
          'DOCS_HELP'
        );
        return;
      }
      
      // Ayuda genérica de procesos
      addBotMessage(
        "¿De qué proceso necesitas ayuda o documentación?",
        [
          { label: 'Rentar Consultorio (Doctores)', action: 'HELP_RENT_PROCESS' },
          { label: 'Agendar Cita (Pacientes)', action: 'HELP_BOOK_PROCESS' }
        ],
        'DOCS_HELP'
      );
      return;
    }

    // B) AYUDA CON ERRORES O DIFICULTADES
    if (isErrorHelp) {
      setFallbackCount(0);
      
      let errorDetail = PROCESS_DOCS.errores.no_avanza_formulario;
      if (cleanText.includes('telefono') || cleanText.includes('celular') || cleanText.includes('tel')) {
        errorDetail = PROCESS_DOCS.errores.telefono_invalido;
      } else if (cleanText.includes('cedula') || cleanText.includes('identificacion') || cleanText.includes('id')) {
        errorDetail = PROCESS_DOCS.errores.cedula_invalida;
      } else if (cleanText.includes('correo') || cleanText.includes('email') || cleanText.includes('mail')) {
        errorDetail = PROCESS_DOCS.errores.correo_invalido;
      } else if (cleanText.includes('mapa') || cleanText.includes('map')) {
        errorDetail = PROCESS_DOCS.errores.mapa_no_carga;
      }
      
      addBotMessage(
        `🛠️ **Guía de Solución de Problemas:**\n\n${errorDetail}\n\n*Recuerda que el formulario cuenta con sanitización estricta de seguridad anti-hackeos.*`,
        [
          { label: 'Volver a intentar', action: 'ACTION_RENTAL' },
          { label: 'Hablar con un asesor', action: 'INTENT_HUMAN' }
        ],
        'DOCS_HELP'
      );
      return;
    }

    if (isBooking) {
      setFallbackCount(0);
      addBotMessage("¡Claro! Entiendo que quieres mejorar tu sonrisa. La valoración inicial es gratuita. ¿Te gustaría ver los horarios disponibles?", [
        { label: 'Ver horarios', action: 'INTENT_BOOKING' },
        { label: 'Ver precios', action: 'INTENT_SERVICES' }
      ], 'BOOKING_INTENT');
      return;
    }

    if (isRental) {
      setFallbackCount(0);
      addBotMessage("Contamos con consultorios equipados en Polanco, ideales para especialistas. La renta incluye recepción y servicios. ¿Deseas ir a la sección de profesionales?", [
        { label: 'Ver disponibilidad', action: 'ACTION_RENTAL' },
        { label: 'Contacto directo', action: 'INTENT_HUMAN' }
      ], 'RENTAL_EXPLORATION');
      return;
    }

    if (isLocation) {
      setFallbackCount(0);
      addBotMessage("Estamos en Av. la Teja 66, Coapa, Narciso Mendoza, Tlalpan, 14390 CDMX. ¿Quieres que te abra el mapa para ver cómo llegar?", [
        { label: 'Abrir Mapa', action: 'INTENT_LOCATION' }
      ], 'LOCATION_INTENT');
      return;
    }

    if (isPrice) {
      setFallbackCount(0);
      addBotMessage(
        `💰 **Nuestras tarifas:**\n\n` +
        `🦷 **Clínica:** Limpieza ($600), Valoración (Gratis), Blanqueamiento ($2,500).\n` +
        `🏢 **Renta:** Hora ($120), Día ($1,200), Mes ($30,000), Anual ($300,000).\n` +
        `➕ **Servicios Extra:** Desde $30/hora (Autoclave) hasta $100/hora (Asistente).`,
        [
          { label: 'Ver Renta Consultorios', action: 'ACTION_RENTAL' },
          { label: 'Agendar Cita Dental', action: 'INTENT_BOOKING' }
        ],
        'SERVICE_EXPLORATION'
      );
      return;
    }

    if (isGreeting) {
      setFallbackCount(0);
      addBotMessage("¡Hola! Soy DentiBot. Puedo ayudarte con citas, precios, nuestra ubicación o renta de consultorios. ¿Qué necesitas?");
      return;
    }

    // Fallback Inteligente
    if (fallbackCount >= 1) {
      setFallbackCount(0);
      handleAction('INTENT_HUMAN');
    } else {
      setFallbackCount(prev => prev + 1);
      addBotMessage("Mmm, no estoy seguro de haber entendido eso último, pero puedo ayudarte con citas, precios o nuestra ubicación. ¿Cuál de estos te interesa?", [
        { label: 'Agendar Cita', action: 'INTENT_BOOKING' },
        { label: 'Ubicación', action: 'INTENT_LOCATION' },
        { label: 'Precios', action: 'INTENT_SERVICES' }
      ]);
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'INTENT_BOOKING':
        addBotMessage("Excelente. Te estoy llevando al calendario de citas...");
        setTimeout(() => { window.location.href = '/consultorio#citas'; }, 1000);
        break;
      case 'INTENT_LOCATION':
        addBotMessage("Generando ruta en el mapa... Un momento.");
        setTimeout(() => { window.location.href = '/consultorio#ubicacion'; }, 1000);
        break;
      case 'ACTION_RENTAL':
        addBotMessage("Cargando portal de profesionales y calendario de renta...");
        setTimeout(() => { window.location.href = '/renta-consultorios'; }, 1000);
        break;
      case 'INTENT_SERVICES':
        addBotMessage("Nuestros precios son competitivos: Limpieza $600, Ortodoncia desde $12,000. ¿Agendamos una valoración gratuita?", [
          { label: 'Sí, agendar', action: 'INTENT_BOOKING' }
        ], 'BOOKING_INTENT');
        break;
      case 'INTENT_HUMAN':
        addBotMessage("Por favor, espera un momento para que un asesor te conecte, o si lo prefieres, comunícate a nuestro número de contacto: +52 55 5673 9186.");
        break;
      case 'HELP_RENT_PROCESS':
        addBotMessage(
          `🏢 **Proceso para Rentar un Consultorio:**\n\n` +
          `1. Ve a **'Soy Profesional'** en el menú.\n` +
          `2. Elige tu tipo de espacio y pulsa en su ficha.\n` +
          `3. Elige plan (**Hora, Día, Mes, Año**) y adicionales.\n` +
          `4. Pulsa **'Reservar Ahora'** y completa los 3 pasos del formulario.`,
          [
            { label: 'Ir a Renta de Consultorios', action: 'ACTION_RENTAL' }
          ]
        );
        break;
      case 'HELP_BOOK_PROCESS':
        addBotMessage(
          `🦷 **Proceso para Agendar una Cita Dental:**\n\n` +
          `1. Entra a la sección de citas (inicio de la web).\n` +
          `2. Selecciona el servicio (Limpieza, Valoración, Ortodoncia, etc.).\n` +
          `3. Selecciona tu día y hora disponibles.\n` +
          `4. Llena tus datos de contacto y pulsa en 'Agendar'.`,
          [
            { label: 'Ir a Agendar Cita', action: 'INTENT_BOOKING' }
          ]
        );
        break;
      case 'HELP_ERRORS':
        addBotMessage(
          `🛠️ **Dificultades comunes:**\n\n` +
          `- **Teléfono:** Solo escribe 10 números sin espacios ni guiones.\n` +
          `- **Cédula:** Debe tener exactamente 8 números.\n` +
          `- **Correo:** No acepta correos de prueba falsos.\n` +
          `- **Botón Siguiente deshabilitado:** Revisa que ningún campo falte ni tenga un formato inválido.`,
          [
            { label: 'Hablar con un asesor', action: 'INTENT_HUMAN' }
          ]
        );
        break;
      default:
        addBotMessage("Ocurrió un error en la navegación. ¿Deseas que intente llevarte al inicio?", [
          { label: 'Volver al inicio', action: 'GO_HOME' }
        ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Tooltip Indicador */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="absolute -top-12 right-2 animate-bounce cursor-pointer flex flex-col items-center group"
        >
          <div className="bg-white text-primary text-[13px] font-bold px-4 py-2 rounded-2xl shadow-xl border border-primary/10 whitespace-nowrap group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            ¡Hazme una pregunta!
          </div>
          <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white border-b border-r border-primary/10 transform rotate-45 group-hover:bg-primary transition-colors duration-300"></div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center relative z-10 overflow-hidden",
          "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "hover:scale-110 active:scale-95",
          isOpen
            ? "w-16 h-16 rounded-full bg-white text-text-main shadow-2xl shadow-primary/20"
            : "w-[120px] h-auto bg-transparent outline-none border-none shadow-none"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-full h-full transition-all duration-300",
          isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90 absolute inset-0"
        )}>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <X className="w-8 h-8 relative z-10" />
        </div>
        <div className={cn(
          "flex items-center justify-center w-full h-full transition-all duration-300",
          isOpen ? "opacity-0 -rotate-90 absolute inset-0" : "opacity-100 rotate-0"
        )}>
          <img 
            src="/chatbot-icon.png" 
            alt="Abrir chat" 
            className="w-full h-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] object-contain"
          />
        </div>
      </button>

      {/* Chat Window */}
      {(isOpen || showChat) && (
        <div className={cn(
          "absolute bottom-20 right-0 w-[calc(100vw-32px)] max-w-[420px] h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          showChat ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}>
          {/* Header */}
          <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary p-6 text-white relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white/50">
                <img src="/chatbot-icon.png" alt="DentiBot" className="w-10 h-10 object-contain drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg leading-tight tracking-tight">DentiBot</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Asistente IA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-linear-to-b from-gray-50/50 to-white">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20" 
                    : "bg-white text-text-main border border-gray-100 rounded-tl-none shadow-xs"
                )}>
                  {msg.text}
                </div>
                
                {msg.type === 'options' && msg.options && (
                  <div className="flex flex-col gap-2 mt-4 w-full max-w-[80%]">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAction(opt.action)}
                        className="bg-white border border-gray-200 text-text-main hover:border-primary hover:text-primary p-3 rounded-xl text-xs font-bold transition-all text-left flex justify-between items-center group/opt"
                      >
                        {opt.label}
                        <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2 animate-pulse">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-xs flex gap-1">
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={(e) => { e.preventDefault(); if(input.trim()) { setMessages(p => [...p, {role:'user', text: input}]); handleBotLogic(input); setInput(''); } }} className="p-6 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Pregúntame lo que sea..."
                className="w-full pl-5 pr-12 py-4 bg-gray-50/50 rounded-2xl text-sm outline-hidden focus:ring-2 focus:ring-primary/10 transition-all text-text-main border border-gray-100 focus:border-primary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-4">
               <span className="text-[9px] text-gray-400 font-medium">Sincronizado con Clínica</span>
               <span className="text-[9px] text-gray-400 font-medium">•</span>
               <span className="text-[9px] text-gray-400 font-medium">Privacidad Cifrada</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
