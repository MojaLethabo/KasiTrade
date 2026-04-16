"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Receipt, CreditCard,
  Users, Package, TrendingDown, User, LogOut,
  FileCheck, FileSignature, Menu, X,
} from "lucide-react";

const nav = [
  { href: "/dashboard",             icon: LayoutDashboard, label: "Dashboard"           },
  { href: "/dashboard/quotations",  icon: FileText,         label: "Quotations"          },
  { href: "/dashboard/invoices",    icon: CreditCard,       label: "Invoices"            },
  { href: "/dashboard/receipts",    icon: Receipt,          label: "Receipts"            },
  { href: "/dashboard/expenses",    icon: TrendingDown,     label: "Expenses"            },
  { href: "/dashboard/customers",   icon: Users,            label: "Customers"           },
  { href: "/dashboard/products",    icon: Package,          label: "Products & Services" },
];
const docsNav = [
  { href: "/dashboard/payslip",  icon: FileCheck,     label: "Payslip Generator"  },
  { href: "/dashboard/contract", icon: FileSignature, label: "Contract Generator" },
];
const settingsNav = [
  { href: "/dashboard/profile", icon: User, label: "Business Profile" },
];

function NavItem({
  href, icon: Icon, label, active, onClick,
}: { href: string; icon: React.ElementType; label: string; active: boolean; onClick?: () => void }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }} onClick={onClick}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 12px", borderRadius: "6px", marginBottom: "2px",
        background: active ? "rgba(255,255,255,0.09)" : "transparent",
        color: active ? "var(--white)" : "var(--text-3)",
        transition: "all 0.12s",
        fontSize: "13px", fontWeight: active ? "600" : "400",
      }}>
        <Icon size={15} strokeWidth={1.8} style={{ flexShrink: 0 }} />
        {label}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }
  function handleLogout() { logout(); router.push("/"); }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{ width: "28px", height: "28px", background: "var(--white)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#000" }}>K</span>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--white)", letterSpacing: "-0.02em" }}>KasiTrade</span>
        </div>
        {user?.business && (
          <div style={{ marginTop: "12px", padding: "8px 10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: "4px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.business.name}</div>
            <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "1px" }}>{user.business.sector}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        <div className="section-label" style={{ padding: "0 12px", marginBottom: "6px", marginTop: "4px" }}>Main</div>
        {nav.map(item => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} onClick={() => setOpen(false)} />
        ))}
        <div className="section-label" style={{ padding: "0 12px", marginBottom: "6px", marginTop: "18px" }}>Documents</div>
        {docsNav.map(item => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} onClick={() => setOpen(false)} />
        ))}
        <div className="section-label" style={{ padding: "0 12px", marginBottom: "6px", marginTop: "18px" }}>Settings</div>
        {settingsNav.map(item => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} onClick={() => setOpen(false)} />
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 12px", marginBottom: "6px" }}>
          <div style={{ width: "28px", height: "28px", background: "var(--bg-4)", border: "1px solid var(--border-2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "var(--white)", flexShrink: 0 }}>
            {user?.name?.[0]}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "10px", color: "var(--text-3)" }}>Entrepreneur</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "6px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-3)", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", transition: "all 0.15s" }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "var(--white)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#000" }}>K</span>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--white)", letterSpacing: "-0.02em" }}>KasiTrade</span>
        </div>
        {/* Active page name */}
        <span style={{ fontSize: "13px", color: "var(--text-3)", marginLeft: "auto" }}>
          {[...nav, ...docsNav, ...settingsNav].find(n => isActive(n.href))?.label || ""}
        </span>
      </div>

      {/* Overlay */}
      {open && <div className="sidebar-overlay show" onClick={() => setOpen(false)} />}

      {/* Drawer / sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Mobile close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 14px 0" }}>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "4px" }}
            className="hamburger-btn"
          >
            <X size={18} />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
