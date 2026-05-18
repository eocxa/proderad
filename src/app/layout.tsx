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
  themeColor: "#1e3a5f",
};

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Chatbot } from "@/components/Chatbot";
import Script from "next/script";

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
        <Script id="media-query-shim" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              if (window.MediaQueryList && !window.MediaQueryList.prototype.addListener) {
                window.MediaQueryList.prototype.addListener = function(cb) {
                  this.addEventListener('change', cb);
                };
              }
              if (window.MediaQueryList && !window.MediaQueryList.prototype.removeListener) {
                window.MediaQueryList.prototype.removeListener = function(cb) {
                  this.removeEventListener('change', cb);
                };
              }
            }
          `}
        </Script>
        <GoogleAnalytics />
        <div className="overflow-x-hidden">{children}</div>
        <Chatbot />
      </body>
    </html>
  );
}
