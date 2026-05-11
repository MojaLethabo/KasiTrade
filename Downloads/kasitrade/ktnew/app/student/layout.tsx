"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Inbox, CheckSquare, Star, User, LogOut, Menu, X, GraduationCap } from "lucide-react";

const nav = [
  { href: "/student",           icon: LayoutDashboard, label: "My Dashboard" },
  { href: "/student/requests",  icon: Inbox,           label: "Requests"     },
  { href: "/student/sessions",  icon: CheckSquare,     label: "Sessions"     },
  { href: "/student/ratings",   icon: Star,            label: "My Ratings"   },
  { href: "/student/profile",   icon: User,            label: "My Profile"   },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role !== "student") router.push(user.role === "admin" ? "/admin" : "/dashboard");
  }, [user, router]);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!user || user.role !== "student") return null;

  const label = nav.find(n => pathname === n.href || (n.href !== "/student" && pathname.startsWith(n.href)))?.label || "";

  const sidebarContent = (
    <>
      <div style={{ padding: "16px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "30px", height: "30px", background: "#16A34A", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(22,163,74,0.4)", flexShrink: 0 }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#fff" }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "-.02em" }}>KasiTrade</div>
            <div style={{ fontSize: "10px", color: "rgba(156,163,175,0.5)" }}>Student Portal</div>
          </div>
        </div>
        <div style={{ padding: "8px 10px", background: "rgba(22,163,74,0.15)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "2px" }}>
            <GraduationCap size={12} color="#4ade80" />
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#4ade80" }}>Student</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#f9fafb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "10px 8px 0", overflowY: "auto" }}>
        <div style={{ padding: "0 14px", marginTop: "4px", marginBottom: "4px", fontSize: "10px", fontWeight: "700", color: "rgba(156,163,175,0.4)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>
        {nav.map(({ href, icon: Icon, label: l }) => {
          const active = pathname === href || (href !== "/student" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 12px", borderRadius: "6px", marginBottom: "1px", background: active ? "rgba(22,163,74,0.18)" : "transparent", color: active ? "#4ade80" : "rgba(209,213,219,0.7)", fontSize: "13px", fontWeight: active ? "600" : "400", borderLeft: `2px solid ${active ? "#4ade80" : "transparent"}`, transition: "all .12s" }}>
                <Icon size={14} strokeWidth={active ? 2 : 1.7} />{l}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <button onClick={() => { logout(); router.push("/login"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(156,163,175,0.6)", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="hamburger" onClick={() => setOpen(true)}><Menu size={19} /></button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "26px", height: "26px", background: "#16A34A", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff" }}>K</span>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff" }}>KasiTrade</span>
        </div>
        {label && <span style={{ fontSize: "12px", color: "rgba(156,163,175,0.5)", marginLeft: "auto" }}>{label}</span>}
      </header>
      <div className="shell-body">
        {open && <div className="sidebar-overlay visible" onClick={() => setOpen(false)} />}
        <aside className={`sidebar${open ? " open" : ""}`}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 10px 0" }}>
            <button onClick={() => setOpen(false)} className="hamburger"><X size={16} /></button>
          </div>
          {sidebarContent}
        </aside>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
