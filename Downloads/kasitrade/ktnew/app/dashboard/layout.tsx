"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { SidebarInner, allNavItems } from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role === "admin") router.push("/admin");
  }, [user, router]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!user || user.role === "admin") return null;

  const label = allNavItems().find(n =>
    pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href))
  )?.label || "";

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="hamburger" onClick={() => setOpen(true)} aria-label="Menu"><Menu size={19} /></button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "26px", height: "26px", background: "#16A34A", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 6px rgba(22,163,74,.5)" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff" }}>K</span>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "-.02em" }}>KasiTrade</span>
        </div>
        {label && <span style={{ fontSize: "12px", color: "rgba(156,163,175,0.55)", marginLeft: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "120px" }}>{label}</span>}
      </header>

      <div className="shell-body">
        {open && <div className="sidebar-overlay visible" onClick={() => setOpen(false)} />}
        <aside className={`sidebar${open ? " open" : ""}`}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 10px 0", flexShrink: 0 }}>
            <button onClick={() => setOpen(false)} className="hamburger" aria-label="Close"><X size={16} /></button>
          </div>
          <SidebarInner onNavigate={() => setOpen(false)} />
        </aside>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
