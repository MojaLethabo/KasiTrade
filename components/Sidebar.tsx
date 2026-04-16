"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Receipt, CreditCard,
  Users, Package, TrendingDown, User, LogOut,
  FileCheck, FileSignature,
} from "lucide-react";

const nav = [
  { href: "/dashboard",            icon: LayoutDashboard, label: "Dashboard"           },
  { href: "/dashboard/quotations", icon: FileText,         label: "Quotations"          },
  { href: "/dashboard/invoices",   icon: CreditCard,       label: "Invoices"            },
  { href: "/dashboard/receipts",   icon: Receipt,          label: "Receipts"            },
  { href: "/dashboard/expenses",   icon: TrendingDown,     label: "Expenses"            },
  { href: "/dashboard/customers",  icon: Users,            label: "Customers"           },
  { href: "/dashboard/products",   icon: Package,          label: "Products & Services" },
];
const docsNav = [
  { href: "/dashboard/payslip",  icon: FileCheck,     label: "Payslip Generator"  },
  { href: "/dashboard/contract", icon: FileSignature, label: "Contract Generator" },
];
const settingsNav = [
  { href: "/dashboard/profile", icon: User, label: "Business Profile" },
];

export function allNavItems() {
  return [...nav, ...docsNav, ...settingsNav];
}

interface SidebarInnerProps {
  onNavigate?: () => void;
  role?: "entrepreneur" | "admin";
}

export function SidebarInner({ onNavigate }: SidebarInnerProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const active = isActive(href);
    return (
      <Link href={href} style={{ textDecoration: "none" }} onClick={onNavigate}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "6px", marginBottom: "2px",
          background: active ? "rgba(255,255,255,0.09)" : "transparent",
          color: active ? "var(--white)" : "var(--text-3)",
          transition: "background 0.12s, color 0.12s",
          fontSize: "13px", fontWeight: active ? "600" : "400",
          WebkitTapHighlightColor: "transparent",
        }}>
          <Icon size={15} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          {label}
        </div>
      </Link>
    );
  }

  return (
    <>
      {/* Logo */}
      <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
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

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        <div className="section-label" style={{ padding: "0 12px", marginBottom: "6px", marginTop: "4px" }}>Main</div>
        {nav.map(item => <NavItem key={item.href} {...item} />)}

        <div className="section-label" style={{ padding: "0 12px", marginBottom: "6px", marginTop: "18px" }}>Documents</div>
        {docsNav.map(item => <NavItem key={item.href} {...item} />)}

        <div className="section-label" style={{ padding: "0 12px", marginBottom: "6px", marginTop: "18px" }}>Settings</div>
        {settingsNav.map(item => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
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
          onClick={() => { logout(); router.push("/"); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "6px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-3)", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </>
  );
}
