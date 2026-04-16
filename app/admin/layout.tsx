"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Users, BarChart2, LogOut, Shield, Menu, X } from "lucide-react";

const adminNav = [
  { href: "/admin",                   icon: LayoutDashboard, label: "Overview"      },
  { href: "/admin/entrepreneurs",     icon: Users,           label: "Entrepreneurs" },
  { href: "/admin/reports",           icon: BarChart2,       label: "Reports"       },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push("/");
    else if (user.role !== "admin") router.push("/dashboard");
  }, [user, router]);
  useEffect(() => { setOpen(false); }, [pathname]);

  if (!user || user.role !== "admin") return null;

  const sidebarContent = (
    <>
      <div style={{ padding:"18px 14px 14px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
          <div style={{ width:"28px", height:"28px", background:"var(--white)", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:"13px", fontWeight:"800", color:"#000" }}>K</span>
          </div>
          <div>
            <div style={{ fontSize:"15px", fontWeight:"700", color:"var(--white)", letterSpacing:"-0.02em" }}>KasiTrade</div>
            <div style={{ fontSize:"9px", color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.12em" }}>Admin</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
        {adminNav.map(({ href, icon:Icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{ textDecoration:"none" }} onClick={() => setOpen(false)}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"6px", marginBottom:"2px", background: active ? "rgba(255,255,255,0.09)" : "transparent", color: active ? "var(--white)" : "var(--text-3)", fontSize:"13px", fontWeight: active ? "600" : "400" }}>
                <Icon size={15} strokeWidth={1.8} />{label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div style={{ padding:"12px 8px", borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"9px", padding:"8px 12px", marginBottom:"6px" }}>
          <div style={{ width:"28px", height:"28px", background:"var(--bg-4)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Shield size={12} color="var(--text-2)" /></div>
          <div><div style={{ fontSize:"12px", fontWeight:"600" }}>Admin</div><div style={{ fontSize:"10px", color:"var(--text-3)" }}>Centre Admin</div></div>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:"8px", padding:"9px 12px", borderRadius:"6px", background:"transparent", border:"1px solid var(--border)", color:"var(--text-3)", cursor:"pointer", fontSize:"13px", fontFamily:"inherit" }}>
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {open && <div className="sidebar-overlay show" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`} style={{ background:"var(--bg-2)", borderRight:"1px solid var(--border)" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"10px 12px 0" }}>
          <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-3)" }}><X size={18} /></button>
        </div>
        {sidebarContent}
      </aside>

      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <button className="hamburger-btn" onClick={() => setOpen(true)}><Menu size={18} /></button>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"22px", height:"22px", background:"var(--white)", borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:"10px", fontWeight:"800", color:"#000" }}>K</span>
            </div>
            <span style={{ fontSize:"14px", fontWeight:"700", letterSpacing:"-0.02em" }}>KasiTrade Admin</span>
          </div>
        </div>
        <main style={{ flex:1 }}>{children}</main>
      </div>
    </div>
  );
}
