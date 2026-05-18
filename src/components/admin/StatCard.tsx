"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  type: string;
  color: string;
  icon: React.ReactNode;
}

export function StatCard({ title, value, change, type, color, icon }: StatCardProps) {
  return (
    <div
      className="p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        borderColor: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Background Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-400 font-medium leading-none">
          {title}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `rgba(${color === "#50d9fe" ? "80,217,254" : color === "#0f766e" ? "15,118,110" : color === "#10b981" ? "16,185,129" : "245,158,11"}, 0.1)`,
            color: color,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <h3
          className="text-2xl font-bold text-white tracking-tight leading-none mb-2"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          {value}
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `rgba(${color === "#50d9fe" ? "80,217,254" : color === "#0f766e" ? "15,118,110" : color === "#10b981" ? "16,185,129" : "245,158,11"}, 0.08)`,
              color: color,
            }}
          >
            {change}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">vs semana pasada</span>
        </div>
      </div>

      {/* Thin colored bottom border that glows on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 opacity-20 group-hover:opacity-100"
        style={{
          background: color,
        }}
      />
    </div>
  );
}
