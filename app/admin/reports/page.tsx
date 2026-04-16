"use client";
import { useState } from "react";
import { users, invoices, receipts, expenses, customers, quotations, getTotalIncome, getTotalExpenses, getPlatformMonthlyTrend } from "@/lib/data";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

const entrepreneurs = users.filter(u => u.role === "entrepreneur");

function downloadCSV(data: Record<string, string | number>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${String(row[h]).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type StatFilter = "all" | "active" | "moderate" | "low";

export default function ReportsPage() {
  const [statFilter, setStatFilter] = useState<StatFilter>("all");
  const [sectorFilter, setSectorFilter] = useState("All");

  const allSectors = [...new Set(entrepreneurs.map(e => e.business?.sector).filter(Boolean))] as string[];

  function getActivity(n: number) {
    if (n >= 6) return "active";
    if (n >= 3) return "moderate";
    return "low";
  }

  const filtered = entrepreneurs.filter(e => {
    const act = getActivity(e.loginDates.length);
    return (statFilter === "all" || act === statFilter) && (sectorFilter === "All" || e.business?.sector === sectorFilter);
  });

  const totalIncome   = filtered.reduce((s, e) => s + getTotalIncome(e.id), 0);
  const totalExpenses = filtered.reduce((s, e) => s + getTotalExpenses(e.id), 0);
  const filteredInvoices  = invoices.filter(i  => filtered.some(e => e.id === i.userId));
  const filteredReceipts  = receipts.filter(r  => filtered.some(e => e.id === r.userId));
  const filteredExpenses  = expenses.filter(ex => filtered.some(e => e.id === ex.userId));

  const trend = getPlatformMonthlyTrend();
  const maxTrendIncome = Math.max(...trend.map(t => t.income), 1);

  const bySector: Record<string, { count: number; income: number }> = {};
  entrepreneurs.forEach(e => {
    const sec = e.business?.sector || "Other";
    if (!bySector[sec]) bySector[sec] = { count: 0, income: 0 };
    bySector[sec].count++;
    bySector[sec].income += getTotalIncome(e.id);
  });

  const byStage: Record<string, number> = {};
  entrepreneurs.forEach(e => { const s = e.business?.stage || "Unknown"; byStage[s] = (byStage[s] || 0) + 1; });

  const byActivity = { active: 0, moderate: 0, low: 0 };
  entrepreneurs.forEach(e => { const a = getActivity(e.loginDates.length) as keyof typeof byActivity; byActivity[a]++; });

  const byInvStatus: Record<string, { count: number; value: number }> = {};
  invoices.forEach(i => {
    if (!byInvStatus[i.status]) byInvStatus[i.status] = { count: 0, value: 0 };
    byInvStatus[i.status].count++; byInvStatus[i.status].value += i.total;
  });

  const byCat: Record<string, number> = {};
  expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const maxCat = Math.max(...Object.values(byCat), 1);

  function exportEntrepreneurs() {
    downloadCSV(filtered.map(e => ({
      Name: e.name, Email: e.email, Business: e.business?.name||"", Sector: e.business?.sector||"",
      Location: e.business?.location||"", Stage: e.business?.stage||"", Employees: e.business?.employees||0,
      Income: getTotalIncome(e.id), Expenses: getTotalExpenses(e.id), Profit: getTotalIncome(e.id)-getTotalExpenses(e.id),
      Logins: e.loginDates.length, Activity: getActivity(e.loginDates.length), Joined: e.createdAt, LastLogin: e.lastLogin,
    })), "kasitrade-entrepreneurs.csv");
  }
  function exportInvoices() {
    downloadCSV(filteredInvoices.map(i => {
      const o = entrepreneurs.find(e => e.id === i.userId);
      return { ID: i.id, Entrepreneur: o?.name||"", Business: o?.business?.name||"", Customer: i.customerName, Date: i.date, DueDate: i.dueDate, Total: i.total, PaidAmount: i.paidAmount, Balance: i.total-i.paidAmount, Status: i.status };
    }), "kasitrade-invoices.csv");
  }
  function exportExpenses() {
    downloadCSV(filteredExpenses.map(ex => {
      const o = entrepreneurs.find(e => e.id === ex.userId);
      return { ID: ex.id, Entrepreneur: o?.name||"", Business: o?.business?.name||"", Category: ex.category, Description: ex.description, Amount: ex.amount, Date: ex.date };
    }), "kasitrade-expenses.csv");
  }
  function exportTrend() {
    downloadCSV(trend.map(t => ({ Month: t.month, Income: t.income, Expenses: t.expenses, Profit: t.income-t.expenses, InvoicesIssued: t.invoicesIssued, InvoicesPaid: t.invoicesPaid, NewCustomers: t.newCustomers })), "kasitrade-monthly-trend.csv");
  }

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div style={{ marginBottom: "24px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>Administration</div>
          <h1 style={{ marginBottom: "4px" }}>Reports & Data Export</h1>
          <p style={{ color: "var(--text-3)", fontSize: "13px" }}>Platform analytics, income trends, and CSV export.</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "var(--text-3)" }}>Filter:</span>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {(["all","active","moderate","low"] as StatFilter[]).map(f => (
              <button key={f} onClick={() => setStatFilter(f)} className={statFilter === f ? "btn btn-secondary btn-sm" : "btn btn-ghost btn-sm"} style={{ textTransform: "capitalize" }}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <select className="input" style={{ width: "180px" }} value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}>
            <option value="All">All Sectors</option>
            {allSectors.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* KPIs */}
        <div className="kpi-row" style={{ marginBottom: "20px" }}>
          {[
            { label: "Total Income",   value: fmt(totalIncome) },
            { label: "Total Expenses", value: fmt(totalExpenses) },
            { label: "Net Profit",     value: fmt(totalIncome - totalExpenses) },
            { label: "Invoices",       value: String(filteredInvoices.length) },
          ].map(({ label, value }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom: "5px" }}>{label}</div>
              <div className="stat-num">{value}</div>
            </div>
          ))}
        </div>

        {/* ── Monthly Income Trend ── */}
        <div className="card" style={{ overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <h3 style={{ marginBottom: "2px" }}>Monthly Income Trend</h3>
              <p style={{ fontSize: "11px", color: "var(--text-3)" }}>Platform-wide income, expenses, and activity by month</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={exportTrend}><Download size={12} /> Export CSV</button>
          </div>

          {/* Mini bar chart */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px", alignItems: "flex-end", height: "72px" }}>
            {trend.map((t, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", height: "100%" }}>
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", gap: "2px" }}>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.6)", borderRadius: "2px 2px 0 0", height: `${Math.max(4, (t.income / maxTrendIncome) * 100)}%` }} title={`Income: ${fmt(t.income)}`} />
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.2)", borderRadius: "2px 2px 0 0", height: `${Math.max(4, (t.expenses / maxTrendIncome) * 100)}%` }} title={`Expenses: ${fmt(t.expenses)}`} />
                </div>
                <span style={{ fontSize: "9px", color: "var(--text-3)", whiteSpace: "nowrap" }}>{t.month.split(" ")[0]}</span>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingBottom: "14px", marginLeft: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "var(--text-3)" }}><div style={{ width: "8px", height: "8px", background: "rgba(255,255,255,0.6)", borderRadius: "1px" }} />Income</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "var(--text-3)" }}><div style={{ width: "8px", height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "1px" }} />Expenses</div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="tbl" style={{ minWidth: "640px" }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th style={{ textAlign: "right" }}>Income</th>
                  <th style={{ textAlign: "right" }}>Expenses</th>
                  <th style={{ textAlign: "right" }}>Net Profit</th>
                  <th style={{ textAlign: "right" }}>Margin</th>
                  <th style={{ textAlign: "right" }}>Inv. Issued</th>
                  <th style={{ textAlign: "right" }}>Inv. Paid</th>
                  <th style={{ textAlign: "right" }}>New Cust.</th>
                  <th style={{ textAlign: "center" }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {trend.map((t, i) => {
                  const profit = t.income - t.expenses;
                  const margin = t.income > 0 ? Math.round((profit / t.income) * 100) : 0;
                  const prev = trend[i - 1];
                  const change = prev ? t.income - prev.income : 0;
                  return (
                    <tr key={t.month}>
                      <td style={{ fontWeight: "600" }}>{t.month}</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>{t.income > 0 ? fmt(t.income) : <span style={{ color: "var(--text-3)" }}>—</span>}</td>
                      <td style={{ textAlign: "right", color: "var(--text-2)" }}>{t.expenses > 0 ? fmt(t.expenses) : <span style={{ color: "var(--text-3)" }}>—</span>}</td>
                      <td style={{ textAlign: "right", fontWeight: "600", color: profit < 0 ? "#ff8080" : undefined }}>{(t.income > 0 || t.expenses > 0) ? fmt(profit) : <span style={{ color: "var(--text-3)" }}>—</span>}</td>
                      <td style={{ textAlign: "right" }}>{t.income > 0 ? <span className={`badge ${margin >= 50 ? "badge-green" : margin >= 20 ? "badge-yellow" : "badge-red"}`}>{margin}%</span> : <span style={{ color: "var(--text-3)", fontSize: "12px" }}>—</span>}</td>
                      <td style={{ textAlign: "right" }}>{t.invoicesIssued || <span style={{ color: "var(--text-3)" }}>0</span>}</td>
                      <td style={{ textAlign: "right" }}>{t.invoicesPaid || <span style={{ color: "var(--text-3)" }}>0</span>}</td>
                      <td style={{ textAlign: "right" }}>{t.newCustomers || <span style={{ color: "var(--text-3)" }}>0</span>}</td>
                      <td style={{ textAlign: "center" }}>
                        {i === 0 ? <Minus size={12} color="var(--text-3)" /> : change > 0 ? <TrendingUp size={12} color="var(--text-2)" /> : change < 0 ? <TrendingDown size={12} color="#ff8080" /> : <Minus size={12} color="var(--text-3)" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid var(--border-2)" }}>
                  <td style={{ fontWeight: "700", padding: "11px 16px" }}>Totals</td>
                  <td style={{ textAlign: "right", fontWeight: "700", padding: "11px 16px" }}>{fmt(trend.reduce((s,t) => s+t.income,0))}</td>
                  <td style={{ textAlign: "right", fontWeight: "600", padding: "11px 16px", color: "var(--text-2)" }}>{fmt(trend.reduce((s,t) => s+t.expenses,0))}</td>
                  <td style={{ textAlign: "right", fontWeight: "700", padding: "11px 16px" }}>{fmt(trend.reduce((s,t) => s+t.income-t.expenses,0))}</td>
                  <td colSpan={2} style={{ padding: "11px 16px" }}></td>
                  <td style={{ textAlign: "right", fontWeight: "600", padding: "11px 16px" }}>{trend.reduce((s,t) => s+t.invoicesPaid,0)}</td>
                  <td style={{ textAlign: "right", fontWeight: "600", padding: "11px 16px" }}>{trend.reduce((s,t) => s+t.newCustomers,0)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Breakdowns */}
        <div className="grid-3" style={{ marginBottom: "16px" }}>
          <div className="card" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginBottom: "12px" }}>By Sector</div>
            {Object.entries(bySector).map(([sec, d]) => (
              <div key={sec} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px" }}>{sec}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{d.count} · {fmt(d.income)}</span>
                </div>
                <div style={{ height: "3px", background: "var(--bg-4)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(d.count/entrepreneurs.length)*100}%`, background: "rgba(255,255,255,0.45)", borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginBottom: "12px" }}>Activity Levels</div>
            {(["active","moderate","low"] as const).map(level => {
              const count = byActivity[level];
              const pct   = entrepreneurs.length ? (count/entrepreneurs.length)*100 : 0;
              const badge = level === "active" ? "badge-green" : level === "moderate" ? "badge-yellow" : "badge-red";
              return (
                <div key={level} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span className={`badge ${badge}`} style={{ width: "70px", justifyContent: "center" }}>{level}</span>
                  <div style={{ flex: 1, height: "3px", background: "var(--bg-4)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.45)", borderRadius: "2px" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-3)", width: "20px", textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
            <div className="divider" style={{ margin: "12px 0" }} />
            <div className="section-label" style={{ marginBottom: "10px" }}>Stages</div>
            {Object.entries(byStage).map(([st, count]) => (
              <div key={st} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(42,42,42,0.4)" }}>
                <span style={{ fontSize: "12px" }}>{st}</span>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>{count}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginBottom: "12px" }}>Invoice Status</div>
            {Object.entries(byInvStatus).map(([status, d]) => {
              const pct   = invoices.length ? (d.count/invoices.length)*100 : 0;
              const badge = status === "paid" ? "badge-green" : status === "partial" ? "badge-yellow" : "badge-red";
              return (
                <div key={status} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span className={`badge ${badge}`}>{status}</span>
                    <div><span style={{ fontSize: "12px", fontWeight: "600" }}>{d.count}</span><span style={{ fontSize: "11px", color: "var(--text-3)", marginLeft: "6px" }}>{fmt(d.value)}</span></div>
                  </div>
                  <div style={{ height: "4px", background: "var(--bg-4)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "rgba(255,255,255,0.45)", borderRadius: "2px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense categories */}
        <div className="card" style={{ padding: "16px 18px", marginBottom: "16px" }}>
          <div className="section-label" style={{ marginBottom: "12px" }}>Expense Categories</div>
          <div style={{ display: "grid", gap: "8px" }}>
            {Object.entries(byCat).sort((a,b) => b[1]-a[1]).map(([cat, total]) => (
              <div key={cat} style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-2)" }}>{cat}</span>
                <div style={{ height: "4px", background: "var(--bg-4)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(total/maxCat)*100}%`, background: "rgba(255,255,255,0.4)", borderRadius: "2px" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "600", textAlign: "right" }}>{fmt(total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-entrepreneur table */}
        <div style={{ marginBottom: "20px" }}>
          <div className="section-label" style={{ marginBottom: "10px" }}>Individual Breakdown ({filtered.length})</div>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: "640px" }}>
                <thead>
                  <tr><th>Entrepreneur</th><th>Sector</th><th>Stage</th><th style={{ textAlign:"right" }}>Income</th><th style={{ textAlign:"right" }}>Expenses</th><th style={{ textAlign:"right" }}>Profit</th><th style={{ textAlign:"center" }}>Inv.</th><th style={{ textAlign:"center" }}>Pay%</th><th style={{ textAlign:"center" }}>Logins</th><th>Activity</th></tr>
                </thead>
                <tbody>
                  {filtered.map(e => {
                    const inc  = getTotalIncome(e.id);
                    const exp  = getTotalExpenses(e.id);
                    const uInv = invoices.filter(i => i.userId === e.id);
                    const payRate = uInv.length ? Math.round((uInv.filter(i => i.status==="paid").length/uInv.length)*100) : 0;
                    const act  = getActivity(e.loginDates.length);
                    const actB = act === "active" ? "badge-green" : act === "moderate" ? "badge-yellow" : "badge-red";
                    return (
                      <tr key={e.id}>
                        <td style={{ fontWeight: "500" }}>{e.name}</td>
                        <td><span className="badge badge-blue" style={{ fontSize: "10px" }}>{e.business?.sector}</span></td>
                        <td><span className="badge badge-white" style={{ fontSize: "10px" }}>{e.business?.stage}</span></td>
                        <td style={{ textAlign:"right", fontWeight:"500" }}>{fmt(inc)}</td>
                        <td style={{ textAlign:"right", color:"var(--text-2)" }}>{fmt(exp)}</td>
                        <td style={{ textAlign:"right", fontWeight:"600" }}>{fmt(inc-exp)}</td>
                        <td style={{ textAlign:"center" }}>{uInv.length}</td>
                        <td style={{ textAlign:"center" }}>{payRate}%</td>
                        <td style={{ textAlign:"center" }}>{e.loginDates.length}</td>
                        <td><span className={`badge ${actB}`} style={{ fontSize:"10px" }}>{act}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <h3 style={{ marginBottom: "5px" }}>Export Data</h3>
          <p style={{ color: "var(--text-3)", fontSize: "13px", marginBottom: "16px" }}>Download CSV files. Exports respect current filter selections.</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm" onClick={exportEntrepreneurs}><Download size={12} /> Entrepreneurs ({filtered.length})</button>
            <button className="btn btn-secondary btn-sm" onClick={exportInvoices}><Download size={12} /> Invoices ({filteredInvoices.length})</button>
            <button className="btn btn-secondary btn-sm" onClick={exportExpenses}><Download size={12} /> Expenses ({filteredExpenses.length})</button>
            <button className="btn btn-secondary btn-sm" onClick={exportTrend}><Download size={12} /> Monthly Trend</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { exportEntrepreneurs(); setTimeout(exportInvoices,400); setTimeout(exportExpenses,800); setTimeout(exportTrend,1200); }}>
              Export All (4 files)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
