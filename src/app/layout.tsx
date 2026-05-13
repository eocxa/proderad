import type { Metadata, Viewport } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "ProDental — Clínica Dental y Renta de Consultorios",
  description: "Transformando sonrisas y ofreciendo los mejores espacios dentales en México.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0EA5E9",
};

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Chatbot } from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={cn(
        "min-h-screen bg-white antialiased font-work-sans",
        outfit.variable,
        workSans.variable
      )}>
        <GoogleAnalytics />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
