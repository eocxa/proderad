"use client";
import { useState } from "react";
import { User, Phone, Mail, Contact, AlertCircle } from "lucide-react";

/* ── Sanitización anti SQL-injection ─────────────────────── */
const sanitize = (v: string) =>
  v.replace(/['";\\]/g, "")
   .replace(/--/g, "")
   .replace(/\/\*/g, "")
   .replace(/\*\//g, "")
   .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|SCRIPT)\b/gi, "");

/* ── Validadores ─────────────────────────────────────────── */
const BAD_DOMAINS = ["test.com","example.com","mail.com","fake.com","temp.com","correo.com","test.test"];

const vName   = (v:string) => !v.trim() ? "El nombre es requerido" : v.trim().length<3 ? "Nombre muy corto" : !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.]+$/.test(v) ? "Solo letras y espacios" : "";
const vPhone  = (v:string) => { const d=v.replace(/\D/g,""); return !d?"El teléfono es requerido":d.length!==10?"Debe tener exactamente 10 dígitos":""; };
const vEmail  = (v:string) => {
  if (!v) return "El correo es requerido";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Formato de correo inválido";
  if (BAD_DOMAINS.includes(v.split("@")[1]?.toLowerCase())) return "Usa un correo electrónico real";
  return "";
};
const vCedula = (v:string) => !v?"La cédula es requerida":/^\d{8}$/.test(v)?"":"Debe tener exactamente 8 dígitos numéricos";

export interface FormData { name:string; phone:string; email:string; cedula:string; }
export interface FormErrors { name:string; phone:string; email:string; cedula:string; }

interface Props {
  value: FormData;
  onChange: (data: FormData) => void;
  errors: FormErrors;
  onErrors: (e: FormErrors) => void;
}

export function isFormValid(data: FormData) {
  return !vName(data.name) && !vPhone(data.phone) && !vEmail(data.email) && !vCedula(data.cedula);
}

function Field({ label, icon: Icon, error, children }: { label:string; icon:React.ElementType; error:string; children:React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1 flex items-center gap-2">
        <Icon size={12} className="text-secondary"/> {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs font-medium ml-1">
          <AlertCircle size={12}/>{error}
        </p>
      )}
    </div>
  );
}

export default function BookingForm({ value, onChange, errors, onErrors }: Props) {
  const handle = (field: keyof FormData, raw: string) => {
    const v = sanitize(raw);
    const next = { ...value, [field]: v };
    onChange(next);
    const validators = { name: vName, phone: vPhone, email: vEmail, cedula: vCedula };
    onErrors({ ...errors, [field]: validators[field](v) });
  };

  const baseInput = "w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-semibold focus:border-secondary outline-none transition-all";
  const errInput  = "border-red-400 bg-red-50/50";

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-outline-variant/30 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
          <User size={20} className="text-primary"/>
        </div>
        <div>
          <h2 className="font-bold text-primary">Información del Profesional</h2>
          <p className="text-xs text-outline">Todos los campos son requeridos</p>
        </div>
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
        <span className="text-xs font-bold text-green-700">Formulario seguro — datos protegidos</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nombre Completo" icon={User} error={errors.name}>
          <input type="text" className={`${baseInput} ${errors.name?errInput:""}`}
            placeholder="Ej. Dr. Alex Rivera" value={value.name}
            onChange={e=>handle("name",e.target.value)}/>
        </Field>

        <Field label="Cédula Profesional (8 dígitos)" icon={Contact} error={errors.cedula}>
          <input type="text" inputMode="numeric" maxLength={8} className={`${baseInput} ${errors.cedula?errInput:""}`}
            placeholder="12345678" value={value.cedula}
            onChange={e=>handle("cedula",e.target.value.replace(/\D/g,""))}/>
        </Field>

        <Field label="Teléfono (10 dígitos)" icon={Phone} error={errors.phone}>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={`${baseInput} ${errors.phone ? errInput : ""}`}
            placeholder="5512345678"
            value={value.phone}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              handle("phone", digits);
            }}
          />
          {value.phone.length > 0 && value.phone.length < 10 && (
            <p className="text-[11px] text-outline ml-1">{value.phone.length}/10 dígitos</p>
          )}
        </Field>

        <Field label="Correo Electrónico" icon={Mail} error={errors.email}>
          <input type="email" className={`${baseInput} ${errors.email?errInput:""}`}
            placeholder="doctor@clinica.mx" value={value.email}
            onChange={e=>handle("email",e.target.value)}/>
        </Field>
      </div>

      <p className="text-[11px] text-outline/70 text-center">
        🔒 Tu información está protegida y no será compartida con terceros.
      </p>
    </div>
  );
}
