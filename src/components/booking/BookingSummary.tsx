"use client";
import { Receipt, MapPin, Calendar, Clock, Stethoscope, ShieldCheck, UserPlus, User, Phone, Mail, CreditCard, MessageCircle } from "lucide-react";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const fmtDate = (d:Date) => `${d.getDate()} de ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmt = (n:number) => n.toLocaleString("es-MX");

const ADDON_META: Record<string,{name:string;icon:React.ElementType}> = {
  rayosx:    { name:"Rayos X",    icon:Stethoscope },
  autoclave: { name:"Autoclave",  icon:ShieldCheck  },
  asistente: { name:"Asistente",  icon:UserPlus     },
};

interface Props {
  plan: string;
  consultorio: string;
  addonIds: string[];
  addonPrices: Record<string,number>;
  total: number;
  formData: { name:string; phone:string; email:string; cedula:string };
  selection: { dates:Date[]; startDate:Date|null; endDate:Date|null; time:string };
  paymentMethod: string;
  onPaymentChange: (p:string) => void;
}

function Row({ label, value }: { label:string; value:string }) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-white/60 font-medium">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

function getStayDescription(plan:string, sel:Props["selection"]) {
  const { dates, startDate, endDate, time } = sel;
  if (plan === "hora") {
    if (!startDate) return "Sin fecha seleccionada";
    return `${fmtDate(startDate)}${time ? ` · ${time} (1 hora)` : ""}`;
  }
  if (plan === "día") {
    if (!dates.length) return "Sin días seleccionados";
    const sorted = [...dates].sort((a,b)=>a.getTime()-b.getTime());
    const nums = sorted.map(d=>d.getDate()).join(", ");
    return `${dates.length} día${dates.length>1?"s":""}: ${nums} de ${MONTHS[sorted[0].getMonth()]} ${sorted[0].getFullYear()}`;
  }
  if (plan === "mes" && startDate && endDate) {
    return `${fmtDate(startDate)} → ${fmtDate(endDate)} (30 días)`;
  }
  if (plan === "anual" && startDate && endDate) {
    return `${fmtDate(startDate)} → ${fmtDate(endDate)} (365 días)`;
  }
  return "Sin fecha seleccionada";
}

const PLAN_LABEL: Record<string,string> = { hora:"Por Hora", día:"Por Día", mes:"Mensual", anual:"Anual" };

export default function BookingSummary({ plan, consultorio, addonIds, addonPrices, total, formData, selection, paymentMethod, onPaymentChange }: Props) {
  const baseTotal = total - addonIds.reduce((s,id)=>s+(addonPrices[id]??0),0);
  const stayDesc = getStayDescription(plan, selection);

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-primary p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16"/>
        <div className="relative z-10 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Receipt size={20}/>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Resumen de Reserva</p>
              <p className="font-bold text-lg">{consultorio}</p>
            </div>
          </div>

          {/* Estancia */}
          <div className="bg-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-secondary-container"/>
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">Estancia</span>
            </div>
            <p className="font-bold text-lg leading-snug">{stayDesc}</p>
            <span className="text-xs bg-secondary/20 text-secondary-container px-3 py-1 rounded-full font-bold">
              {PLAN_LABEL[plan]}
            </span>
          </div>

          {/* Desglose */}
          <div className="space-y-2">
            <Row label="Consultorio base" value={`$${fmt(baseTotal)}`}/>
            {addonIds.map(id => (
              <div key={id} className="flex justify-between items-center text-sm py-1">
                <span className="flex items-center gap-2 text-white/60 font-medium">
                  {(() => { const M = ADDON_META[id]; return M ? <><M.icon size={13}/>{M.name}</> : id; })()}
                </span>
                <span className="font-bold text-secondary-container">+${fmt(addonPrices[id]??0)}</span>
              </div>
            ))}
            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider text-sm">Total</span>
              <span className="text-3xl font-extrabold text-secondary-container">${fmt(total)}</span>
            </div>
          </div>

          {/* Profesional */}
          <div className="bg-white/5 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2"><User size={12}/>Profesional</p>
            {formData.name && <p className="font-bold text-base">{formData.name}</p>}
            {formData.cedula && <p className="text-xs opacity-60">Cédula: {formData.cedula}</p>}
            {formData.phone && <p className="text-xs opacity-70 flex items-center gap-1"><Phone size={11}/>{formData.phone}</p>}
            {formData.email && <p className="text-xs opacity-70 flex items-center gap-1"><Mail size={11}/>{formData.email}</p>}
          </div>

          {/* Sede */}
          <div className="flex items-center gap-2 opacity-60 text-sm">
            <MapPin size={14}/>
            <span>Paseo de la Reforma 483, CDMX</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest ml-2">Método de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id:"online",    label:"Pago Seguro",  sub:"Tarjeta Débito / Crédito", icon:CreditCard,      color:"secondary" },
            { id:"whatsapp",  label:"WhatsApp",     sub:"Pago offline / Transferencia", icon:MessageCircle, color:"green" },
          ].map(pm => (
            <button key={pm.id} onClick={() => onPaymentChange(pm.id)}
              className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4
                ${paymentMethod===pm.id ? "bg-white border-secondary shadow-lg" : "bg-surface-container border-transparent hover:border-outline-variant/40"}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                ${paymentMethod===pm.id ? "bg-secondary text-white" : "bg-primary/5 text-primary"}`}>
                <pm.icon size={24}/>
              </div>
              <div className="text-left">
                <p className="font-bold text-primary">{pm.label}</p>
                <p className="text-[10px] text-outline uppercase tracking-wider">{pm.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
