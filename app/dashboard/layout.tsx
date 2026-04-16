"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/");
    else if (user.role === "admin") router.push("/admin");
  }, [user, router]);
  if (!user || user.role === "admin") return null;

  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}
