"use client";
import { users, invoices, receipts, expenses, customers, quotations, getDataForUser, getTotalIncome, getTotalExpenses } from "@/lib/data";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, Users, FileText, Receipt, TrendingDown } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

const entrepreneurs = users.filter(u => u.role === "entrepreneur");

export default function AdminPage() {
  const totalIncome   = receipts.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const unpaidInvoices = invoices.filter(i => i.status !== "paid");
  const unpaidTotal   = unpaidInvoices.reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const activeUsers   = entrepreneurs.filter(e => e.loginDates.length >= 6).length;
  const moderateUsers = entrepreneurs.filter(e => e.loginDates.length >= 3 && e.loginDates.length < 6).length;
  const lowUsers      = entrepreneurs.filter(e => e.loginDates.length < 3).length;

  return (
    <main className="main-content">
      <div className="page-wrap">
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>Administration</div>
          <h1 style={{ marginBottom: "4px" }}>Platform Overview</h1>
          <p style={{ color: "var(--text-3)", fontSize: "13px" }}>Monitor all entrepreneurs and business activity</p>
        </div>

        {/* Top KPIs */}
        <div className="kpi-row" style={{ marginBottom: "16px" }}>
          {[
            { label: "Entrepreneurs", value: String(entrepreneurs.length), sub: `${activeUsers} active · ${moderateUsers} moderate · ${lowUsers} low`, icon: Users },
            { label: "Platform Income", value: fmt(totalIncome), sub: "All collected receipts", icon: TrendingUp },
            { label: "Platform Expenses", value: fmt(totalExpenses), sub: "All recorded expenses", icon: TrendingDown },
            { label: "Outstanding", value: fmt(unpaidTotal), sub: `${unpaidInvoices.length} unpaid invoices`, icon: Receipt },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="kpi-cell">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div className="section-label">{label}</div>
                <Icon size={14} strokeWidth={1.5} color="var(--text-3)" />
              </div>
              <div className="stat-num" style={{ marginBottom: "3px" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Secondary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", marginBottom: "24px" }}>
          {[
            { label: "Net Profit",       value: fmt(totalIncome - totalExpenses) },
            { label: "Total Invoices",   value: String(invoices.length)          },
            { label: "Total Quotations", value: String(quotations.length)        },
            { label: "Total Customers",  value: String(customers.length)         },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "var(--bg-3)", padding: "16px 20px" }}>
              <div className="section-label" style={{ marginBottom: "5px" }}>{label}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--white)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Performance + invoice status */}
        <div className="grid-2" style={{ marginBottom: "20px" }}>
          {/* Entrepreneur performance bars */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>Entrepreneur Performance</span>
              <Link href="/admin/entrepreneurs" style={{ fontSize: "11px", color: "var(--text-3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
                All <ArrowUpRight size={11} />
              </Link>
            </div>
            {entrepreneurs.map(e => {
              const inc    = getTotalIncome(e.id);
              const exp    = getTotalExpenses(e.id);
              const profit = inc - exp;
              const loginPct = Math.min(100, (e.loginDates.length / 10) * 100);
              return (
                <div key={e.id} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "1px" }}>{e.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{e.business?.name} · {e.business?.sector}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>{fmt(profit)}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-3)" }}>net</div>
                    </div>
                  </div>
                  {[
                    { label: "Income",          value: inc,      max: 20000,  pct: Math.min(100, (inc / 20000) * 100) },
                    { label: "Expenses",         value: exp,      max: 20000,  pct: Math.min(100, (exp / 20000) * 100) },
                    { label: "Platform activity",value: loginPct, max: 100,    pct: loginPct, isPercent: true },
                  ].map(bar => (
                    <div key={bar.label} style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontSize: "10px", color: "var(--text-3)" }}>{bar.label}</span>
                        <span style={{ fontSize: "10px", color: "var(--text-2)" }}>
                          {bar.isPercent ? `${Math.round(bar.value)}%` : fmt(bar.value)}
                        </span>
                      </div>
                      <div style={{ height: "3px", background: "var(--bg-4)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${bar.pct}%`, background: "rgba(255,255,255,0.45)", borderRadius: "2px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Invoice breakdown + recent receipts */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "14px" }}>Invoice & Payment Status</div>
            {(["paid", "partial", "unpaid"] as const).map(status => {
              const filtered = invoices.filter(i => i.status === status);
              const total    = filtered.reduce((s, i) => s + i.total, 0);
              const pct      = invoices.length ? Math.round((filtered.length / invoices.length) * 100) : 0;
              return (
                <div key={status} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span className={`badge ${status === "paid" ? "badge-green" : status === "partial" ? "badge-yellow" : "badge-red"}`}>{status}</span>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "600" }}>{filtered.length}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-3)", marginLeft: "8px" }}>{fmt(total)}</span>
                    </div>
                  </div>
                  <div style={{ height: "5px", background: "var(--bg-4)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: status === "paid" ? "rgba(255,255,255,0.55)" : status === "partial" ? "rgba(255,255,255,0.28)" : "rgba(255,80,80,0.5)", borderRadius: "3px" }} />
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-3)", marginTop: "3px" }}>{pct}% of all invoices</div>
                </div>
              );
            })}

            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "12px" }}>Recent Receipts</div>
              {receipts.slice(-4).reverse().map(r => {
                const owner = entrepreneurs.find(e => e.id === r.userId);
                return (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(42,42,42,0.5)", gap: "8px" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{owner?.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-3)" }}>{r.customerName} · {r.date}</div>
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>{fmt(r.amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Entrepreneurs table */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>All Entrepreneurs</span>
            <Link href="/admin/entrepreneurs" style={{ fontSize: "11px", color: "var(--text-3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
              Manage <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: "700px" }}>
                <thead>
                  <tr>
                    <th>Name</th><th>Business</th><th>Sector</th><th>Stage</th>
                    <th style={{ textAlign: "right" }}>Income</th>
                    <th style={{ textAlign: "right" }}>Expenses</th>
                    <th style={{ textAlign: "right" }}>Profit</th>
                    <th style={{ textAlign: "center" }}>Logins</th><th>Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {entrepreneurs.map(e => {
                    const inc  = getTotalIncome(e.id);
                    const exp  = getTotalExpenses(e.id);
                    const act  = e.loginDates.length >= 6 ? "Active" : e.loginDates.length >= 3 ? "Moderate" : "Low";
                    const actB = act === "Active" ? "badge-green" : act === "Moderate" ? "badge-yellow" : "badge-red";
                    return (
                      <tr key={e.id}>
                        <td>
                          <Link href={`/admin/entrepreneurs/${e.id}`} style={{ fontWeight: "600", textDecoration: "none", color: "var(--white)" }}>{e.name}</Link>
                        </td>
                        <td style={{ color: "var(--text-2)", fontSize: "12px" }}>{e.business?.name}</td>
                        <td><span className="badge badge-blue" style={{ fontSize: "10px" }}>{e.business?.sector}</span></td>
                        <td><span className="badge badge-white" style={{ fontSize: "10px" }}>{e.business?.stage}</span></td>
                        <td style={{ textAlign: "right", fontWeight: "500" }}>{fmt(inc)}</td>
                        <td style={{ textAlign: "right", color: "var(--text-2)" }}>{fmt(exp)}</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{fmt(inc - exp)}</td>
                        <td style={{ textAlign: "center" }}>{e.loginDates.length}</td>
                        <td><span className={`badge ${actB}`} style={{ fontSize: "10px" }}>{act}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
