"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente virtual de ProDental. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simular respuesta del bot
    setTimeout(() => {
      const botMsg = { 
        role: 'bot', 
        text: 'Gracias por tu mensaje. Un asesor humano se conectará pronto si necesitas asistencia específica. ¿Te gustaría conocer nuestros horarios o agendar una cita?' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95",
          isOpen ? "bg-white text-text-main rotate-90" : "bg-primary text-white"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cta rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[520px] bg-white rounded-[32px] shadow-3xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg leading-tight">Asistente ProDental</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80 font-medium">En línea ahora</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-text-main border border-gray-100 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm outline-hidden focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
