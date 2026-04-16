"use client";
import { useParams } from "next/navigation";
import { getUserById, getDataForUser, getTotalIncome, getTotalExpenses } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Users } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

export default function EntrepreneurDetailPage() {
  const params = useParams();
  const user   = getUserById(params.id as string);

  if (!user || user.role !== "entrepreneur") {
    return (
      <main className="main-content">
        <p style={{ color: "var(--text-3)", marginBottom: "12px" }}>Entrepreneur not found.</p>
        <Link href="/admin/entrepreneurs" className="btn btn-ghost" style={{ textDecoration: "none" }}>← Back</Link>
      </main>
    );
  }

  const data    = getDataForUser(user.id);
  const income  = getTotalIncome(user.id);
  const expenses = getTotalExpenses(user.id);
  const profit  = income - expenses;
  const b       = user.business!;
  const unpaid  = data.invoices.filter(i => i.status !== "paid").reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const payRate = data.invoices.length ? Math.round((data.invoices.filter(i => i.status === "paid").length / data.invoices.length) * 100) : 0;

  return (
    <main className="main-content">
      <div className="page-wrap">
        {/* Back + header */}
        <div style={{ marginBottom: "24px" }}>
          <Link href="/admin/entrepreneurs" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-3)", textDecoration: "none", fontSize: "12px", marginBottom: "14px" }}>
            <ArrowLeft size={13} /> Back to Entrepreneurs
          </Link>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <div style={{ width: "46px", height: "46px", background: "var(--bg-4)", border: "1px solid var(--border-2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", flexShrink: 0 }}>
              {user.name[0]}
            </div>
            <div>
              <h1 style={{ marginBottom: "3px" }}>{user.name}</h1>
              <p style={{ color: "var(--text-3)", fontSize: "13px" }}>{b.name} · {user.email}</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-row" style={{ marginBottom: "16px" }}>
          {[
            { label: "Income",      value: fmt(income)   },
            { label: "Expenses",    value: fmt(expenses) },
            { label: "Net Profit",  value: fmt(profit)   },
            { label: "Outstanding", value: fmt(unpaid)   },
          ].map(({ label, value }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom: "5px" }}>{label}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--white)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="card" style={{ padding: "18px 20px", marginBottom: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
          {[
            { label: "Income vs R20k",      pct: Math.min(100, (income / 20000) * 100) },
            { label: "Invoice payment rate", pct: payRate },
            { label: "Platform engagement",  pct: Math.min(100, (user.loginDates.length / 10) * 100) },
            { label: "Profitability",        pct: income > 0 ? Math.min(100, Math.max(0, (profit / income) * 100)) : 0 },
          ].map(bar => (
            <div key={bar.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{bar.label}</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-2)" }}>{Math.round(bar.pct)}%</span>
              </div>
              <div style={{ height: "5px", background: "var(--bg-4)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${bar.pct}%`, borderRadius: "3px",
                  background: bar.pct >= 70 ? "rgba(255,255,255,0.7)" : bar.pct >= 40 ? "rgba(255,255,255,0.38)" : "rgba(255,90,90,0.55)",
                }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: "16px" }}>
          {/* Business profile */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>Business Profile</div>
            <div style={{ display: "grid", gap: "10px" }}>
              {[
                { icon: Briefcase, label: "Sector",    value: b.sector },
                { icon: MapPin,    label: "Location",  value: b.location },
                { icon: Phone,     label: "Phone",     value: b.phone },
                { icon: Users,     label: "Employees", value: String(b.employees) },
                { icon: Briefcase, label: "Stage",     value: b.stage },
                { icon: Mail,      label: "Email",     value: user.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "26px", height: "26px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={11} strokeWidth={1.5} color="var(--text-3)" />
                  </div>
                  <div>
                    <div className="section-label" style={{ fontSize: "9px", marginBottom: "1px" }}>{label}</div>
                    <div style={{ fontSize: "12px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
            {b.description && <p style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "12px", color: "var(--text-3)", lineHeight: "1.6" }}>{b.description}</p>}
          </div>

          {/* Activity */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>Activity & Counts</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "14px" }}>
              {[
                { label: "Quotations", value: data.quotations.length },
                { label: "Invoices",   value: data.invoices.length },
                { label: "Receipts",   value: data.receipts.length },
                { label: "Customers",  value: data.customers.length },
                { label: "Products",   value: data.products.length },
                { label: "Logins",     value: user.loginDates.length },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--white)", marginBottom: "2px" }}>{value}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="section-label" style={{ marginBottom: "8px" }}>Login history</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {user.loginDates.map((d, i) => (
                <span key={i} style={{ fontSize: "10px", color: "var(--text-3)", background: "var(--bg-3)", border: "1px solid var(--border)", padding: "3px 7px", borderRadius: "3px", fontFamily: "monospace" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div style={{ marginBottom: "14px" }}>
          <div className="section-label" style={{ marginBottom: "10px" }}>Invoices ({data.invoices.length})</div>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: "480px" }}>
                <thead><tr><th>ID</th><th>Customer</th><th>Date</th><th style={{ textAlign: "right" }}>Total</th><th style={{ textAlign: "right" }}>Paid</th><th>Status</th></tr></thead>
                <tbody>
                  {data.invoices.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--text-3)" }}>{inv.id.toUpperCase()}</td>
                      <td style={{ fontWeight: "500" }}>{inv.customerName}</td>
                      <td style={{ color: "var(--text-3)", fontSize: "12px" }}>{inv.date}</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>{fmt(inv.total)}</td>
                      <td style={{ textAlign: "right", color: "var(--text-2)" }}>{fmt(inv.paidAmount)}</td>
                      <td><span className={`badge ${inv.status==="paid"?"badge-green":inv.status==="partial"?"badge-yellow":"badge-red"}`}>{inv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div style={{ marginBottom: "14px" }}>
          <div className="section-label" style={{ marginBottom: "10px" }}>Expenses ({data.expenses.length})</div>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: "420px" }}>
                <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                <tbody>
                  {data.expenses.map(exp => (
                    <tr key={exp.id}>
                      <td style={{ color: "var(--text-3)", fontSize: "12px" }}>{exp.date}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: "10px" }}>{exp.category}</span></td>
                      <td>{exp.description}</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>{fmt(exp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div>
          <div className="section-label" style={{ marginBottom: "10px" }}>Customers ({data.customers.length})</div>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: "440px" }}>
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Added</th></tr></thead>
                <tbody>
                  {data.customers.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: "500" }}>{c.name}</td>
                      <td style={{ color: "var(--text-3)", fontSize: "12px" }}>{c.email}</td>
                      <td style={{ fontSize: "12px" }}>{c.phone}</td>
                      <td style={{ color: "var(--text-3)", fontSize: "12px" }}>{c.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
