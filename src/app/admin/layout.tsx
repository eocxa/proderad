// Layout aislado para el panel de administración
// No incluye Navbar, Footer ni Chatbot del sitio público
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — ProDental Radiología",
  description: "Panel de administración privado",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
