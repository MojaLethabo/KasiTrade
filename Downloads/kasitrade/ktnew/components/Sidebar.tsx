"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Receipt, CreditCard,
  Users, Package, TrendingDown, User, LogOut,
  FileCheck, FileSignature, BarChart2, Users2, Handshake,
} from "lucide-react";

const nav = [
  { href: "/dashboard",            icon: LayoutDashboard, label: "Dashboard"           },
  { href: "/dashboard/analytics",  icon: BarChart2,       label: "Analytics"           },
  { href: "/dashboard/quotations", icon: FileText,        label: "Quotations"          },
  { href: "/dashboard/invoices",   icon: CreditCard,      label: "Invoices"            },
  { href: "/dashboard/receipts",   icon: Receipt,         label: "Receipts"            },
  { href: "/dashboard/expenses",   icon: TrendingDown,    label: "Expenses"            },
  { href: "/dashboard/customers",  icon: Users,           label: "Customers"           },
  { href: "/dashboard/products",   icon: Package,         label: "Products & Services" },
  { href: "/dashboard/workers",    icon: Users2,          label: "Workers & Team"      },
  { href: "/dashboard/support",    icon: Handshake,       label: "SME Support"         },
];
const docsNav = [
  { href: "/dashboard/payslip",  icon: FileCheck,     label: "Payslip Generator"  },
  { href: "/dashboard/contract", icon: FileSignature, label: "Contract Generator" },
];
const settingsNav = [
  { href: "/dashboard/profile", icon: User, label: "Business Profile" },
];

export function allNavItems() { return [...nav, ...docsNav, ...settingsNav]; }

export function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const active = isActive(href);
    return (
      <Link href={href} style={{ textDecoration: "none" }} onClick={onNavigate}>
        <div style={{
          display: "flex", alignItems: "center", gap: "9px",
          padding: "8px 12px", borderRadius: "6px", marginBottom: "1px",
          background: active ? "rgba(22,163,74,0.18)" : "transparent",
          color: active ? "#4ade80" : "rgba(209,213,219,0.7)",
          fontSize: "13px", fontWeight: active ? "600" : "400",
          borderLeft: `2px solid ${active ? "#4ade80" : "transparent"}`,
          transition: "all .12s", cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}>
          <Icon size={14} strokeWidth={active ? 2 : 1.7} style={{ flexShrink: 0 }} />
          {label}
        </div>
      </Link>
    );
  };

  const GroupLabel = ({ text }: { text: string }) => (
    <div style={{ padding: "0 14px", marginTop: "20px", marginBottom: "4px", fontSize: "10px", fontWeight: "700", color: "rgba(156,163,175,0.5)", textTransform: "uppercase", letterSpacing: ".1em" }}>
      {text}
    </div>
  );

  return (
    <>
      {/* Brand */}
      <div style={{ padding: "16px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: user?.business ? "12px" : "0" }}>
          <div style={{ width: "30px", height: "30px", background: "#16A34A", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(22,163,74,0.4)" }}>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#fff", letterSpacing: "-.01em" }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "-.02em" }}>KasiTrade</div>
            <div style={{ fontSize: "10px", color: "rgba(156,163,175,0.5)", letterSpacing: ".04em" }}>Business Platform</div>
          </div>
        </div>
        {user?.business && (
          <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#f9fafb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "1px" }}>
              {user.business.name}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(156,163,175,0.5)" }}>{user.business.sector}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px 0", overflowY: "auto" }}>
        <GroupLabel text="Main" />
        {nav.map(i => <NavItem key={i.href} {...i} />)}
        <GroupLabel text="Documents" />
        {docsNav.map(i => <NavItem key={i.href} {...i} />)}
        <GroupLabel text="Account" />
        {settingsNav.map(i => <NavItem key={i.href} {...i} />)}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "8px 12px", marginBottom: "6px" }}>
          <div style={{ width: "28px", height: "28px", background: "rgba(22,163,74,0.2)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#4ade80", flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#f9fafb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "10px", color: "rgba(156,163,175,0.45)" }}>Entrepreneur</div>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(156,163,175,0.6)", cursor: "pointer", fontSize: "12px", fontFamily: "inherit", transition: "all .15s" }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,0.06)"; b.style.color = "rgba(209,213,219,0.9)"; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "rgba(156,163,175,0.6)"; }}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </>
  );
}
