"use client";
import {
  users, invoices, receipts, expenses, customers, quotations,
  getTotalIncome, getTotalExpenses,
  getEcosystemSummary, analyseBusinessHealth,
} from "@/lib/data";
import Link from "next/link";
import {
  ArrowUpRight, TrendingUp, TrendingDown, Minus,
  Users, Receipt, AlertTriangle, CheckCircle,
  Activity, Target, Zap, AlertCircle,
} from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

const entrepreneurs = users.filter(u => u.role === "entrepreneur");

// ── Inline spark line ────────────────────────────────────────────────────────
function SparkLine({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <div style={{ width: 64, height: 24 }} />;
  const max = Math.max(...data, 1);
  const W = 64, H = 24, p = 3;
  const xs = data.map((_, i) => p + (i / (data.length - 1)) * (W - p * 2));
  const ys = data.map(v => H - p - ((v / max) * (H - p * 2)));
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`);
  const d = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: "block", flexShrink: 0, overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="2.5" fill={color} />
    </svg>
  );
}

// ── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    growing:       { label: "Growing",       cls: "badge-green"  },
    stable:        { label: "Stable",        cls: "badge-white"  },
    at_risk:       { label: "At Risk",       cls: "badge-yellow" },
    needs_support: { label: "Needs Support", cls: "badge-red"    },
  };
  const cfg = map[status] || { label: status, cls: "badge-white" };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

function TrendArrow({ trend, change }: { trend: string; change: number }) {
  if (trend === "growing")  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"rgba(220,220,220,0.8)" }}><TrendingUp  size={12} />+{Math.abs(change)}%</span>;
  if (trend === "declining")return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"rgba(255,130,100,0.85)" }}><TrendingDown size={12} />–{Math.abs(change)}%</span>;
  if (trend === "stable")   return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"var(--ink-3)" }}><Minus size={12} />~{Math.abs(change)}%</span>;
  return <span style={{ fontSize:11, color:"var(--ink-3)" }}>—</span>;
}

function DemandDot({ signal }: { signal: string }) {
  const color =
    signal === "strong"   ? "var(--ink)" :
    signal === "moderate" ? "rgba(190,190,190,0.6)"  :
    signal === "weak"     ? "rgba(255,130,80,0.8)"   :
                            "rgba(100,100,100,0.55)";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0, display:"inline-block" }} />
      <span style={{ fontSize:11, color:"var(--ink-2)", textTransform:"capitalize" }}>{signal.replace("_"," ")}</span>
    </span>
  );
}

export default function AdminPage() {
  const totalIncome    = receipts.reduce((s, r) => s + r.amount, 0);
  const totalExpenses  = expenses.reduce((s, e) => s + e.amount, 0);
  const unpaidInvoices = invoices.filter(i => i.status !== "paid");
  const unpaidTotal    = unpaidInvoices.reduce((s, i) => s + (i.total - i.paidAmount), 0);
  const activeUsers    = entrepreneurs.filter(e => e.loginDates.length >= 6).length;
  const moderateUsers  = entrepreneurs.filter(e => e.loginDates.length >= 3 && e.loginDates.length < 6).length;
  const lowUsers       = entrepreneurs.filter(e => e.loginDates.length < 3).length;

  const eco        = getEcosystemSummary();
  const healthData = entrepreneurs.map(e => analyseBusinessHealth(e.id));

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* ── Header ── */}
        <div style={{ marginBottom: "28px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>Administration</div>
          <h1 style={{ marginBottom: "4px" }}>Platform Overview</h1>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>Monitor all entrepreneurs and business activity across KasiTrade</p>
        </div>

        {/* ── Top KPIs ── */}
        <div className="kpi-row" style={{ marginBottom: "16px" }}>
          {[
            { label: "Entrepreneurs",    value: String(entrepreneurs.length), sub: `${activeUsers} active · ${moderateUsers} moderate · ${lowUsers} low`, icon: Users },
            { label: "Platform Income",  value: fmt(totalIncome),             sub: "All collected receipts",  icon: TrendingUp   },
            { label: "Platform Expenses",value: fmt(totalExpenses),           sub: "All recorded expenses",   icon: TrendingDown },
            { label: "Outstanding",      value: fmt(unpaidTotal),             sub: `${unpaidInvoices.length} unpaid invoices`, icon: Receipt },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="kpi-cell">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                <div className="section-label">{label}</div>
                <Icon size={14} strokeWidth={1.5} color="var(--ink-3)" />
              </div>
              <div className="stat-num" style={{ marginBottom:"3px" }}>{value}</div>
              <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Secondary row ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1px", background:"var(--border)", borderRadius:"6px", overflow:"hidden", marginBottom:"32px" }}>
          {[
            { label:"Net Profit",       value:fmt(totalIncome - totalExpenses) },
            { label:"Total Invoices",   value:String(invoices.length)          },
            { label:"Total Quotations", value:String(quotations.length)        },
            { label:"Total Customers",  value:String(customers.length)         },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:"var(--surface-2)", padding:"14px 18px" }}>
              <div className="section-label" style={{ marginBottom:"4px" }}>{label}</div>
              <div style={{ fontSize:"18px", fontWeight:"700", color:"var(--ink)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  ECOSYSTEM INTELLIGENCE                                         */}
        {/* ════════════════════════════════════════════════════════════════ */}

        <div style={{ marginBottom:"18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
            <Activity size={15} color="var(--ink-3)" />
            <h2>Ecosystem Intelligence</h2>
          </div>
          <p style={{ fontSize:"13px", color:"var(--ink-3)" }}>
            Signals derived from income trends, demand patterns, and payment behaviour — to support quicker decisions and targeted intervention.
          </p>
        </div>

        {/* ── Ecosystem Health Summary ── */}
        <div className="card" style={{ padding:"20px 22px", marginBottom:"16px" }}>
          <div className="section-label" style={{ marginBottom:"14px" }}>Overall Ecosystem Health</div>

          {/* Distribution bar */}
          <div style={{ height:"10px", borderRadius:"5px", overflow:"hidden", display:"flex", gap:"2px", marginBottom:"10px" }}>
            {eco.growing > 0      && <div style={{ flex:eco.growing,      background:"var(--ink-2)", transition:"flex 0.4s" }} />}
            {eco.stable > 0       && <div style={{ flex:eco.stable,       background:"var(--border-2)", transition:"flex 0.4s" }} />}
            {eco.atRisk > 0       && <div style={{ flex:eco.atRisk,       background:"var(--amber)",  transition:"flex 0.4s" }} />}
            {eco.needsSupport > 0 && <div style={{ flex:eco.needsSupport, background:"rgba(255,100,80,0.65)", transition:"flex 0.4s" }} />}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"16px", marginBottom:"18px" }}>
            {[
              { label:"Growing",       count:eco.growing,      pct:eco.growingPct,      color:"var(--ink-2)" },
              { label:"Stable",        count:eco.stable,       pct:eco.stablePct,        color:"var(--border-2)" },
              { label:"At Risk",       count:eco.atRisk,       pct:eco.atRiskPct,        color:"rgba(255,200,80,0.65)"  },
              { label:"Needs Support", count:eco.needsSupport, pct:eco.needsSupportPct,  color:"var(--red)"   },
            ].map(({ label, count, pct, color }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <div style={{ width:9, height:9, borderRadius:"2px", background:color, flexShrink:0 }} />
                <span style={{ fontSize:"13px", color:"var(--ink-2)" }}>
                  <strong style={{ color:"var(--ink)" }}>{count}</strong> {label}
                  <span style={{ color:"var(--ink-3)", marginLeft:4 }}>({pct}%)</span>
                </span>
              </div>
            ))}
          </div>

          {/* Platform-wide signal metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))", gap:"1px", background:"var(--border)", borderRadius:"6px", overflow:"hidden" }}>
            {[
              { label:"Avg. Quote Conversion", value:`${eco.avgConversion}%`,     note:"Platform-wide" },
              { label:"Pending Pipeline",       value:fmt(eco.pendingPipeline),    note:"Unresolved quotes" },
              { label:"Total Unpaid",           value:fmt(eco.totalUnpaid),        note:"Across all invoices" },
              { label:"Businesses Growing",     value:`${eco.growingPct}%`,        note:`${eco.growing} of ${eco.total}` },
            ].map(({ label, value, note }) => (
              <div key={label} style={{ background:"var(--surface-2)", padding:"14px 16px" }}>
                <div className="section-label" style={{ marginBottom:"5px" }}>{label}</div>
                <div style={{ fontSize:"18px", fontWeight:"700", color:"var(--ink)", marginBottom:"2px" }}>{value}</div>
                <div style={{ fontSize:"10px", color:"var(--ink-3)" }}>{note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Per-Business Health Cards ── */}
        <div style={{ display:"grid", gap:"12px", marginBottom:"28px" }}>
          {healthData.map(h => {
            const sparkVals  = h.monthlyIncome.map(m => m.value);
            const sparkColor = h.trend === "growing" ? "var(--ink)" : h.trend === "declining" ? "rgba(255,130,100,0.75)" : "rgba(160,160,160,0.5)";

            return (
              <div key={h.userId} className="card" style={{ overflow:"hidden" }}>
                {/* Header row */}
                <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:36, height:36, background:"var(--surface-3)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, flexShrink:0 }}>
                      {h.userName[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:"2px" }}>{h.businessName}</div>
                      <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>{h.userName} · {h.sector}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                    <StatusPill status={h.overallStatus} />
                    <Link href={`/admin/entrepreneurs/${h.userId}`} style={{ textDecoration:"none" }}>
                      <button className="btn btn-ghost btn-sm">View <ArrowUpRight size={11} /></button>
                    </Link>
                  </div>
                </div>

                {/* Three signal columns */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>

                  {/* Income Trend */}
                  <div style={{ padding:"14px 16px", borderRight:"1px solid var(--border)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px" }}>
                      <TrendingUp size={12} color="var(--ink-3)" />
                      <div className="section-label">Income Trend</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
                      <TrendArrow trend={h.trend} change={h.incomeChange} />
                      <SparkLine data={sparkVals} color={sparkColor} />
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"6px" }}>
                      {h.monthlyIncome.filter(m => m.value > 0).map(m => (
                        <div key={m.month} style={{ padding:"4px 8px", background:"var(--surface-2)", borderRadius:"3px" }}>
                          <div style={{ fontSize:"9px", color:"var(--ink-3)", marginBottom:"1px" }}>{m.month}</div>
                          <div style={{ fontSize:"11px", fontWeight:"600" }}>{fmt(m.value)}</div>
                        </div>
                      ))}
                      {h.monthlyIncome.filter(m => m.value > 0).length === 0 && (
                        <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>No income recorded yet</span>
                      )}
                    </div>
                    <div style={{ fontSize:"11px", color:"var(--ink-3)", lineHeight:"1.45" }}>{h.trendReason}</div>
                  </div>

                  {/* Demand Signal */}
                  <div style={{ padding:"14px 16px", borderRight:"1px solid var(--border)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px" }}>
                      <Target size={12} color="var(--ink-3)" />
                      <div className="section-label">Demand</div>
                    </div>
                    <div style={{ marginBottom:"8px" }}><DemandDot signal={h.demandSignal} /></div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"5px", marginBottom:"8px" }}>
                      {[
                        { label:"Quotes",      value:String(h.quoteVolume)            },
                        { label:"Converted",   value:`${h.quoteConversionRate}%`      },
                        { label:"Declined",    value:`${h.lostQuoteRate}%`            },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ padding:"5px 7px", background:"var(--surface-2)", borderRadius:"3px", textAlign:"center" }}>
                          <div style={{ fontSize:"9px", color:"var(--ink-3)", marginBottom:"1px" }}>{label}</div>
                          <div style={{ fontSize:"12px", fontWeight:"700" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    {h.pendingQuoteValue > 0 && (
                      <div style={{ fontSize:"11px", color:"var(--ink-3)", marginBottom:"4px" }}>
                        {fmt(h.pendingQuoteValue)} in pending quotes
                      </div>
                    )}
                    <div style={{ fontSize:"11px", color:"var(--ink-3)", lineHeight:"1.45" }}>{h.demandReason}</div>
                  </div>

                  {/* Payment Health */}
                  <div style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"10px" }}>
                      <Zap size={12} color="var(--ink-3)" />
                      <div className="section-label">Payment Health</div>
                    </div>
                    <div style={{ marginBottom:"10px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                        <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>Unpaid rate</span>
                        <span style={{ fontSize:"11px", fontWeight:"700", color: h.unpaidRate >= 50 ? "var(--red-text)" : "var(--ink-2)" }}>
                          {h.unpaidRate}%
                        </span>
                      </div>
                      <div style={{ height:"5px", background:"var(--surface-3)", borderRadius:"3px", overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:"3px", width:`${h.unpaidRate}%`, background: h.unpaidRate >= 50 ? "var(--red)" : h.unpaidRate >= 25 ? "var(--amber)" : "var(--border-2)" }} />
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px" }}>
                      <div style={{ padding:"5px 7px", background:"var(--surface-2)", borderRadius:"3px" }}>
                        <div style={{ fontSize:"9px", color:"var(--ink-3)", marginBottom:"1px" }}>Unpaid</div>
                        <div style={{ fontSize:"12px", fontWeight:"600" }}>{fmt(h.unpaidValue)}</div>
                      </div>
                      <div style={{ padding:"5px 7px", background:"var(--surface-2)", borderRadius:"3px" }}>
                        <div style={{ fontSize:"9px", color:"var(--ink-3)", marginBottom:"1px" }}>Overdue</div>
                        <div style={{ fontSize:"13px", fontWeight:"700", color: h.overdueCount > 0 ? "var(--red-text)" : "var(--ink-2)" }}>
                          {h.overdueCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flags */}
                {h.flags.length > 0 ? (
                  <div style={{ padding:"10px 18px", background:"var(--surface-2)", borderTop:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:"7px", alignItems:"center" }}>
                    <AlertTriangle size={12} color="var(--amber)" style={{ flexShrink:0 }} />
                    {h.flags.map((flag, i) => (
                      <span key={i} style={{ fontSize:"11px", color:"var(--ink-2)", background:"var(--surface-3)", border:"1px solid var(--border-2)", padding:"3px 8px", borderRadius:"3px" }}>
                        {flag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding:"9px 18px", background:"var(--surface-2)", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", gap:"6px" }}>
                    <CheckCircle size={12} color="rgba(200,200,200,0.4)" />
                    <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>No active concerns — performing within expected range</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Demand & Pipeline Breakdown ── */}
        <div className="card" style={{ overflow:"hidden", marginBottom:"20px" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:"7px" }}>
            <Target size={14} color="var(--ink-3)" />
            <h3>Demand & Pipeline Breakdown</h3>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table className="tbl" style={{ minWidth:"580px" }}>
              <thead>
                <tr>
                  <th>Business</th>
                  <th style={{ textAlign:"center" }}>Quotes</th>
                  <th style={{ textAlign:"center" }}>Converted</th>
                  <th style={{ textAlign:"center" }}>Conversion %</th>
                  <th style={{ textAlign:"center" }}>Declined</th>
                  <th style={{ textAlign:"right"  }}>Pending Value</th>
                  <th>Demand Signal</th>
                </tr>
              </thead>
              <tbody>
                {healthData.map(h => (
                  <tr key={h.userId}>
                    <td>
                      <div style={{ fontWeight:"600" }}>{h.businessName}</div>
                      <div style={{ fontSize:"10px", color:"var(--ink-3)" }}>{h.sector}</div>
                    </td>
                    <td style={{ textAlign:"center" }}>{h.quoteVolume || <span style={{ color:"var(--ink-3)" }}>—</span>}</td>
                    <td style={{ textAlign:"center", fontWeight:"600" }}>
                      {h.quoteVolume > 0
                        ? Math.round(h.quoteVolume * h.quoteConversionRate / 100)
                        : <span style={{ color:"var(--ink-3)" }}>—</span>}
                    </td>
                    <td style={{ textAlign:"center" }}>
                      {h.quoteVolume > 0
                        ? <span style={{ fontWeight:"700", color: h.quoteConversionRate>=50 ? "rgba(220,220,220,0.9)" : h.quoteConversionRate>=25 ? "rgba(220,200,100,0.9)" : "rgba(255,130,80,0.9)" }}>
                            {h.quoteConversionRate}%
                          </span>
                        : <span style={{ color:"var(--ink-3)" }}>—</span>}
                    </td>
                    <td style={{ textAlign:"center" }}>
                      {h.lostQuoteRate > 0
                        ? <span style={{ color:"rgba(255,150,100,0.85)", fontWeight:"600" }}>
                            {Math.round(h.quoteVolume * h.lostQuoteRate / 100)} ({h.lostQuoteRate}%)
                          </span>
                        : <span style={{ color:"var(--ink-3)" }}>0</span>}
                    </td>
                    <td style={{ textAlign:"right", fontWeight:"600" }}>
                      {h.pendingQuoteValue > 0 ? fmt(h.pendingQuoteValue) : <span style={{ color:"var(--ink-3)" }}>—</span>}
                    </td>
                    <td><DemandDot signal={h.demandSignal} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Invoice health + recent receipts ── */}
        <div className="grid-2" style={{ marginBottom:"20px" }}>
          <div className="card" style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"14px" }}>
              <AlertCircle size={14} color="var(--ink-3)" />
              <h3>Invoice & Payment Status</h3>
            </div>
            {(["paid","partial","unpaid"] as const).map(status => {
              const fil   = invoices.filter(i => i.status === status);
              const total = fil.reduce((s, i) => s + i.total, 0);
              const p     = invoices.length ? Math.round((fil.length / invoices.length) * 100) : 0;
              const bar   = status==="paid" ? "var(--ink-3)" : status==="partial" ? "var(--amber)" : "rgba(255,100,80,0.55)";
              return (
                <div key={status} style={{ marginBottom:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                    <span className={`badge ${status==="paid"?"badge-green":status==="partial"?"badge-yellow":"badge-red"}`}>{status}</span>
                    <div>
                      <span style={{ fontSize:"13px", fontWeight:"600" }}>{fil.length}</span>
                      <span style={{ fontSize:"11px", color:"var(--ink-3)", marginLeft:"8px" }}>{fmt(total)}</span>
                    </div>
                  </div>
                  <div style={{ height:"5px", background:"var(--surface-3)", borderRadius:"3px", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${p}%`, background:bar, borderRadius:"3px" }} />
                  </div>
                  <div style={{ fontSize:"10px", color:"var(--ink-3)", marginTop:"2px" }}>{p}% of all invoices</div>
                </div>
              );
            })}
          </div>
          <div className="card" style={{ padding:"18px 20px" }}>
            <div style={{ fontSize:"13px", fontWeight:"600", marginBottom:"14px" }}>Recent Collections</div>
            {receipts.slice(-5).reverse().map(r => {
              const owner = entrepreneurs.find(e => e.id === r.userId);
              return (
                <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid var(--border)", gap:"8px" }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:"12px", fontWeight:"500", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{owner?.name}</div>
                    <div style={{ fontSize:"10px", color:"var(--ink-3)" }}>{r.customerName} · {r.date}</div>
                  </div>
                  <div style={{ display:"flex", gap:"7px", alignItems:"center", flexShrink:0 }}>
                    <span style={{ fontSize:"11px", color:"var(--ink-3)", background:"var(--surface-2)", padding:"2px 7px", borderRadius:"3px" }}>{r.method}</span>
                    <span style={{ fontSize:"12px", fontWeight:"600" }}>{fmt(r.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Summary table ── */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <h3>All Entrepreneurs</h3>
            <Link href="/admin/entrepreneurs" style={{ fontSize:"11px", color:"var(--ink-3)", textDecoration:"none", display:"flex", alignItems:"center", gap:"3px" }}>
              Manage & filter <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="card" style={{ overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table className="tbl" style={{ minWidth:"700px" }}>
                <thead>
                  <tr>
                    <th>Name</th><th>Business</th><th>Sector</th>
                    <th style={{ textAlign:"right" }}>Income</th>
                    <th style={{ textAlign:"right" }}>Profit</th>
                    <th>Trend</th><th>Demand</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {healthData.map(h => (
                    <tr key={h.userId}>
                      <td>
                        <Link href={`/admin/entrepreneurs/${h.userId}`} style={{ fontWeight:"600", textDecoration:"none", color:"var(--ink)" }}>{h.userName}</Link>
                      </td>
                      <td style={{ color:"var(--ink-2)", fontSize:"12px" }}>{h.businessName}</td>
                      <td><span className="badge badge-blue" style={{ fontSize:"10px" }}>{h.sector}</span></td>
                      <td style={{ textAlign:"right", fontWeight:"500" }}>{fmt(getTotalIncome(h.userId))}</td>
                      <td style={{ textAlign:"right", fontWeight:"600" }}>{fmt(getTotalIncome(h.userId) - getTotalExpenses(h.userId))}</td>
                      <td><TrendArrow trend={h.trend} change={h.incomeChange} /></td>
                      <td><DemandDot signal={h.demandSignal} /></td>
                      <td><StatusPill status={h.overallStatus} /></td>
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
