"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => {
        if (res.ok) router.replace("/admin/dashboard");
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Error al iniciar sesión");
        setIsLoading(false);
        setPassword("");
        return;
      }

      router.replace("/admin/dashboard");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #0f766e, transparent)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #50d9fe, transparent)",
            animation: "float-delayed 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #1e3a5f, transparent)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(80,217,254,1) 1px, transparent 1px), linear-gradient(90deg, rgba(80,217,254,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Card de login */}
      <div
        className="relative w-full max-w-md"
        style={{
          animation: "loginCardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow:
              "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative" style={{ background: "linear-gradient(135deg, #0f766e, #0a5b55)" }}>
              {/* Ícono diente */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3C12.5 3 9 5.5 9 9C9 10.5 9.5 12 10 13.5C10.5 15 11 17 11 20C11 23 12 29 14 29C15.5 29 16 26 16 24C16 26 16.5 29 18 29C20 29 21 23 21 20C21 17 21.5 15 22 13.5C22.5 12 23 10.5 23 9C23 5.5 19.5 3 16 3Z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
              {/* Brillo en el ícono */}
              <div
                className="absolute top-1 right-2 w-2 h-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.4)" }}
              />
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              ProDental Admin
            </h1>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Panel de administración privado
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium mb-2"
                style={{ color: "#94a3b8" }}
              >
                Contraseña de acceso
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 pr-12 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: error
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-work-sans), sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border =
                      "1px solid rgba(80,217,254,0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(80,217,254,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = error
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: "#475569" }}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="flex items-center gap-2 mt-2 text-sm"
                  style={{
                    color: "#f87171",
                    animation: "shake 0.4s ease",
                  }}
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              id="admin-login-btn"
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 relative overflow-hidden"
              style={{
                background:
                  isLoading || !password
                    ? "rgba(15,118,110,0.4)"
                    : "linear-gradient(135deg, #0f766e, #0a5b55)",
                cursor: isLoading || !password ? "not-allowed" : "pointer",
                boxShadow:
                  isLoading || !password
                    ? "none"
                    : "0 8px 24px rgba(15,118,110,0.3)",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verificando...
                </span>
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>

          {/* Footer del login */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: "#334155" }}>
              Acceso restringido — Solo personal autorizado
            </p>
          </div>
        </div>
      </div>

      {/* Estilos de animación inline */}
      <style jsx global>{`
        @keyframes loginCardIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}