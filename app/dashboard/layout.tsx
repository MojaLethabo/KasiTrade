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
    if (!user) router.push("/");
    else if (user.role === "admin") router.push("/admin");
  }, [user, router]);

  // Close drawer on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!user || user.role === "admin") return null;

  const currentLabel = allNavItems().find(n => {
    const href = n.href;
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  })?.label || "";

  return (
    <div className="app-shell">
      {/* ── Mobile top bar ── */}
      <header className="topbar">
        <button
          className="hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "var(--white)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#000" }}>K</span>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--white)", letterSpacing: "-0.02em" }}>KasiTrade</span>
        </div>
        {currentLabel && (
          <span style={{ fontSize: "12px", color: "var(--text-3)", marginLeft: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentLabel}
          </span>
        )}
      </header>

      {/* ── Shell body ── */}
      <div className="shell-body">
        {/* Overlay */}
        {open && (
          <div
            className="sidebar-overlay visible"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar drawer */}
        <aside className={`sidebar${open ? " open" : ""}`}>
          {/* Close button inside drawer (mobile only) */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 12px 0", flexShrink: 0 }}>
            <button
              onClick={() => setOpen(false)}
              className="hamburger"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
          <SidebarInner onNavigate={() => setOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
