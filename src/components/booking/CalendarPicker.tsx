"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function toKey(y:number,m:number,d:number){ return `${y}-${m}-${d}`; }
function fmtDate(d:Date){ return `${d.getDate()} de ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; }

interface Props {
  plan: string;
  onSelectionChange: (data: { dates: Date[]; startDate: Date|null; endDate: Date|null; time: string }) => void;
}

const TIMES = ["09:00 AM","10:30 AM","12:00 PM","02:30 PM","04:00 PM","05:30 PM"];

export default function CalendarPicker({ plan, onSelectionChange }: Props) {
  const now = new Date(2026, 4, 17);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);
  const [multiDates, setMultiDates] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<Date|null>(null);
  const [time, setTime] = useState("");

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const getRangeSet = (): Set<string> => {
    if (!startDate) return new Set();
    const s = new Set<string>();
    const count = plan === "mes" ? 30 : plan === "anual" ? 365 : 0;
    for (let i=0; i<count; i++) {
      const d = addDays(startDate, i);
      s.add(toKey(d.getFullYear(), d.getMonth(), d.getDate()));
    }
    return s;
  };

  const rangeSet = (plan === "mes" || plan === "anual") ? getRangeSet() : new Set<string>();

  const notify = (newMulti: Set<string>, newStart: Date|null, newTime: string) => {
    if (plan === "día") {
      const dates = Array.from(newMulti).map(k => {
        const [y,m,d] = k.split("-").map(Number);
        return new Date(y,m,d);
      }).sort((a,b)=>a.getTime()-b.getTime());
      onSelectionChange({ dates, startDate: null, endDate: null, time: "" });
    } else if (plan === "mes" && newStart) {
      onSelectionChange({ dates: [], startDate: newStart, endDate: addDays(newStart, 30), time: "" });
    } else if (plan === "anual" && newStart) {
      onSelectionChange({ dates: [], startDate: newStart, endDate: addDays(newStart, 365), time: "" });
    } else if (plan === "hora") {
      const [y,m,d] = (Array.from(newMulti)[0] ?? "").split("-").map(Number);
      const date = newMulti.size ? new Date(y,m,d) : null;
      onSelectionChange({ dates: date ? [date] : [], startDate: date, endDate: null, time: newTime });
    }
  };

  const handleDayClick = (day: number) => {
    const key = toKey(year, month, day);
    const clicked = new Date(year, month, day);
    if (plan === "hora") {
      const s = new Set([key]);
      setMultiDates(s);
      notify(s, clicked, time);
    } else if (plan === "día") {
      const s = new Set(multiDates);
      s.has(key) ? s.delete(key) : s.add(key);
      setMultiDates(s);
      notify(s, null, "");
    } else {
      setStartDate(clicked);
      notify(new Set(), clicked, "");
    }
  };

  const handleTime = (t: string) => {
    setTime(t);
    notify(multiDates, startDate, t);
  };

  const prevM = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextM = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const endDate = startDate && (plan === "mes") ? addDays(startDate,30) : startDate && plan==="anual" ? addDays(startDate,365) : null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm space-y-6">
      {/* Range banner */}
      {startDate && endDate && (
        <div className="bg-secondary-container/20 border border-secondary/20 rounded-2xl px-5 py-3 text-sm font-medium text-primary">
          📅 Tu estancia será desde <span className="font-bold">{fmtDate(startDate)}</span> hasta{" "}
          <span className="font-bold">{fmtDate(endDate)}</span>
        </div>
      )}
      {plan === "día" && multiDates.size > 0 && (
        <div className="bg-secondary-container/20 border border-secondary/20 rounded-2xl px-5 py-3 text-sm font-medium text-primary">
          📅 <span className="font-bold">{multiDates.size} día{multiDates.size>1?"s":""} seleccionado{multiDates.size>1?"s":""}</span>
        </div>
      )}

      {/* Calendar header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">{MONTHS[month]} {year}</h2>
        <div className="flex gap-1">
          <button onClick={prevM} className="p-2 rounded-full hover:bg-surface-container text-outline transition-colors"><ChevronLeft size={18}/></button>
          <button onClick={nextM} className="p-2 rounded-full hover:bg-surface-container text-outline transition-colors"><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map(d => <span key={d} className="text-[10px] font-bold text-outline uppercase tracking-widest pb-2">{d}</span>)}
        {Array.from({length: firstDay}).map((_,i) => <span key={`e${i}`}/>)}
        {Array.from({length: daysInMonth}, (_,i) => i+1).map(day => {
          const key = toKey(year, month, day);
          const isMultiSel = multiDates.has(key);
          const isRangeStart = startDate && toKey(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) === key;
          const isInRange = rangeSet.has(key);
          const isPast = new Date(year, month, day) < now;

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => handleDayClick(day)}
              className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all
                ${isPast ? "text-outline/30 cursor-not-allowed" : ""}
                ${isRangeStart ? "bg-primary text-white shadow-lg shadow-primary/30" : ""}
                ${isInRange && !isRangeStart ? "bg-primary/10 text-primary" : ""}
                ${isMultiSel && plan==="hora" ? "bg-primary text-white shadow-lg shadow-primary/30" : ""}
                ${isMultiSel && plan==="día" ? "bg-secondary text-white" : ""}
                ${!isMultiSel && !isInRange && !isPast ? "hover:bg-surface-container text-primary" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Time slots for "hora" */}
      {plan === "hora" && (
        <div className="pt-4 border-t border-outline-variant/30 space-y-3">
          <h3 className="text-xs font-bold text-outline uppercase tracking-widest">Horarios Disponibles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TIMES.map(t => (
              <button key={t} onClick={() => handleTime(t)}
                className={`py-3 px-3 rounded-2xl border-2 text-[11px] font-bold tracking-tight transition-all uppercase
                  ${time===t ? "bg-secondary-container text-on-secondary-container border-secondary-container" : "border-outline-variant/20 hover:border-secondary/40 text-primary"}`}
              >{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* Multi-day summary */}
      {plan === "día" && multiDates.size > 1 && (
        <div className="pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-outline font-medium">Días: {Array.from(multiDates).map(k=>{const[,m,d]=k.split("-");return `${d}/${parseInt(m)+1}`;}).join(", ")}</p>
        </div>
      )}
    </div>
  );
}
