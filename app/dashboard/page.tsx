"use client";
import { useAuth } from "@/lib/auth";
import { getDataForUser, getTotalIncome, getTotalExpenses, getUnpaidInvoices } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight, FileText, CreditCard, Receipt, TrendingDown, Users, Package } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  const data    = getDataForUser(user.id);
  const income  = getTotalIncome(user.id);
  const expenses = getTotalExpenses(user.id);
  const unpaid  = getUnpaidInvoices(user.id);
  const unpaidAmt = unpaid.reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const profit  = income - expenses;

  return (
    <main className="main-content">
      <div className="page-wrap">
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>
            {new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ marginBottom: "4px" }}>Good morning, {user.name.split(" ")[0]}.</h1>
          <p style={{ color: "var(--text-3)", fontSize: "13px" }}>{user.business?.name} · {user.business?.location}</p>
        </div>

        {/* KPIs */}
        <div className="kpi-row" style={{ marginBottom: "24px" }}>
          {[
            { label: "Total Income",  value: fmt(income),    sub: "Collected receipts" },
            { label: "Total Expenses",value: fmt(expenses),  sub: "All recorded costs" },
            { label: "Net Profit",    value: fmt(profit),    sub: profit >= 0 ? "Positive" : "Review costs" },
            { label: "Outstanding",   value: fmt(unpaidAmt), sub: `${unpaid.length} unpaid invoice${unpaid.length !== 1 ? "s" : ""}` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom: "8px" }}>{label}</div>
              <div className="stat-num" style={{ marginBottom: "3px" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom: "28px" }}>
          <div className="section-label" style={{ marginBottom: "12px" }}>Quick Actions</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              { href: "/dashboard/quotations", icon: FileText,    label: "New Quotation"   },
              { href: "/dashboard/invoices",   icon: CreditCard,  label: "New Invoice"     },
              { href: "/dashboard/receipts",   icon: Receipt,     label: "Record Payment"  },
              { href: "/dashboard/expenses",   icon: TrendingDown,label: "Log Expense"     },
              { href: "/dashboard/payslip",    icon: FileText,    label: "Payslip"         },
              { href: "/dashboard/contract",   icon: FileText,    label: "Contract"        },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="btn btn-secondary" style={{ textDecoration: "none", fontSize: "12px", padding: "8px 14px" }}>
                <Icon size={13} strokeWidth={1.8} /> {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Activity grid */}
        <div className="grid-2" style={{ marginBottom: "16px" }}>
          {/* Recent invoices */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>Recent Invoices</span>
              <Link href="/dashboard/invoices" style={{ fontSize: "11px", color: "var(--text-3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
                All <ArrowUpRight size={11} />
              </Link>
            </div>
            {data.invoices.length === 0 ? (
              <div style={{ padding: "20px", fontSize: "12px", color: "var(--text-3)" }}>No invoices yet.</div>
            ) : data.invoices.slice(-4).reverse().map((inv) => (
              <div key={inv.id} style={{ padding: "11px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.customerName}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{inv.date}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "3px" }}>{fmt(inv.total)}</div>
                  <span className={`badge ${inv.status === "paid" ? "badge-green" : inv.status === "partial" ? "badge-yellow" : "badge-red"}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent expenses */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>Recent Expenses</span>
              <Link href="/dashboard/expenses" style={{ fontSize: "11px", color: "var(--text-3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
                All <ArrowUpRight size={11} />
              </Link>
            </div>
            {data.expenses.length === 0 ? (
              <div style={{ padding: "20px", fontSize: "12px", color: "var(--text-3)" }}>No expenses yet.</div>
            ) : data.expenses.slice(-4).reverse().map((exp) => (
              <div key={exp.id} style={{ padding: "11px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.description}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{exp.category} · {exp.date}</div>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-2)", flexShrink: 0 }}>–{fmt(exp.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)", borderRadius: "6px", overflow: "hidden" }}>
          {[
            { label: "Customers",  value: data.customers.length,  icon: Users       },
            { label: "Products",   value: data.products.length,   icon: Package     },
            { label: "Quotations", value: data.quotations.length, icon: FileText    },
            { label: "Invoices",   value: data.invoices.length,   icon: CreditCard  },
            { label: "Receipts",   value: data.receipts.length,   icon: Receipt     },
            { label: "Expenses",   value: data.expenses.length,   icon: TrendingDown},
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ background: "var(--bg-2)", padding: "16px 12px", textAlign: "center" }}>
              <Icon size={15} strokeWidth={1.5} color="var(--text-3)" style={{ marginBottom: "6px" }} />
              <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--white)", marginBottom: "2px" }}>{value}</div>
              <div style={{ fontSize: "10px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
