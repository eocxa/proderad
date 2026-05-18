import { AdminLogin } from "@/components/admin/AdminLogin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso Admin — ProDental",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return <AdminLogin />;
}
