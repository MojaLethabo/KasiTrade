"use client";
import {
  users, getTotalIncome, getTotalExpenses,
  getEcosystemSummary, analyseBusinessHealth,
  receipts as allReceipts, invoices as allInvoices,
} from "@/lib/data";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, AlertTriangle, CheckCircle, Target, Zap, Activity } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
function fmtK(n: number) { return n >= 1000 ? "R" + (n / 1000).toFixed(1) + "k" : "R" + n; }

const entrepreneurs = users.filter(u => u.role === "entrepreneur");

// ── Score ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "rgba(200,220,200,0.75)" : score >= 40 ? "var(--amber)" : "rgba(255,120,100,0.7)";
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2+4} textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">{score}</text>
    </svg>
  );
}

function TrendChip({ trend, change }: { trend: string; change: number }) {
  if (trend === "growing")   return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"var(--green-text)" }}><TrendingUp size={12} />+{Math.abs(change)}%</span>;
  if (trend === "declining") return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"var(--red-text)" }}><TrendingDown size={12} />–{Math.abs(change)}%</span>;
  if (trend === "stable")    return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, color:"var(--ink-3)" }}><Minus size={12} />Stable</span>;
  return <span style={{ fontSize:11, color:"var(--ink-3)" }}>—</span>;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    growing:       { label: "Growing",       bg: "rgba(180,220,180,0.12)", color: "var(--green-text)" },
    stable:        { label: "Stable",        bg: "var(--surface-2)", color: "var(--ink-2)"  },
    at_risk:       { label: "At Risk",       bg: "rgba(255,200,80,0.12)",  color: "var(--amber-text)"  },
    needs_support: { label: "Needs support", bg: "rgba(255,120,100,0.12)", color: "rgba(255,140,120,0.85)" },
  };
  const c = cfg[status] || cfg.stable;
  return (
    <span style={{ padding: "3px 9px", borderRadius: "3px", fontSize: "11px", fontWeight: "600", background: c.bg, color: c.color, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

function DemandDot({ signal }: { signal: string }) {
  const color = signal === "strong" ? "rgba(200,220,200,0.8)" : signal === "moderate" ? "var(--ink-3)" : signal === "weak" ? "rgba(255,130,80,0.8)" : "rgba(100,100,100,0.5)";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0, display:"inline-block" }} />
      <span style={{ fontSize:11, color:"var(--ink-2)", textTransform:"capitalize" }}>{signal.replace("_"," ")}</span>
    </span>
  );
}

export default function EcosystemPage() {
  const eco         = getEcosystemSummary();
  const healthData  = entrepreneurs.map(e => analyseBusinessHealth(e.id));

  // Platform monthly income
  const months      = ["2024-01","2024-02","2024-03","2024-04"];
  const monthLabels = ["Jan","Feb","Mar","Apr"];
  const monthlyIncome = months.map(m => allReceipts.filter(r => r.date.startsWith(m)).reduce((s,r) => s+r.amount,0));
  const maxInc        = Math.max(...monthlyIncome, 1);

  // Businesses that need the most urgent attention
  const priorityList = healthData
    .filter(h => h.overallStatus === "needs_support" || h.overallStatus === "at_risk")
    .sort((a, b) => b.flags.length - a.flags.length);

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* ── Header ── */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <Activity size={14} color="var(--ink-3)" />
            <div className="section-label">Administration</div>
          </div>
          <h1 style={{ marginBottom: "4px" }}>Ecosystem Intelligence</h1>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>A clear picture of how the entire entrepreneur portfolio is performing.</p>
        </div>

        {/* ── Platform Pulse: 5 numbers that matter ── */}
        <div className="kpi-row" style={{ marginBottom: "16px" }}>
          {[
            { label: "Growing",      value: String(eco.growing),      sub: `${eco.growingPct}% of businesses`,  accent: "var(--green)" },
            { label: "Need support", value: String(eco.needsSupport), sub: `${eco.needsSupportPct}% of businesses`, accent: "rgba(255,140,120,0.65)" },
            { label: "Avg. conversion",value: `${eco.avgConversion}%`, sub: "Quote to invoice",              accent: "rgba(200,200,200,0.4)" },
            { label: "Pipeline",     value: fmt(eco.pendingPipeline), sub: "Unresolved quote value",          accent: "var(--amber)" },
          ].map(({ label, value, sub, accent }) => (
            <div key={label} className="kpi-cell" style={{ borderBottom: `2px solid ${accent}` }}>
              <div className="section-label" style={{ marginBottom: "8px" }}>{label}</div>
              <div className="stat-num" style={{ marginBottom: "3px" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Health distribution bar ── */}
        <div className="card" style={{ padding: "18px 20px", marginBottom: "16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:10 }}>
            <div>
              <h3 style={{ marginBottom:3 }}>Portfolio Health</h3>
              <p style={{ fontSize:"12px", color:"var(--ink-3)" }}>{eco.total} entrepreneur{eco.total !== 1 ? "s" : ""} across the platform</p>
            </div>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {[
                { label:"Growing",       count:eco.growing,      color:"var(--green)" },
                { label:"Stable",        count:eco.stable,       color:"rgba(200,200,200,0.3)"  },
                { label:"At risk",       count:eco.atRisk,       color:"var(--amber)"   },
                { label:"Needs support", count:eco.needsSupport, color:"rgba(255,140,120,0.65)" },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:color, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:"var(--ink-3)" }}>{label}: <strong style={{ color:"var(--ink-2)" }}>{count}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked bar */}
          <div style={{ height:"10px", borderRadius:"5px", overflow:"hidden", display:"flex", gap:"2px", marginBottom:8 }}>
            {eco.growing > 0      && <div style={{ flex:eco.growing,      background:"var(--green)" }} />}
            {eco.stable > 0       && <div style={{ flex:eco.stable,       background:"rgba(200,200,200,0.3)"  }} />}
            {eco.atRisk > 0       && <div style={{ flex:eco.atRisk,       background:"var(--amber)"   }} />}
            {eco.needsSupport > 0 && <div style={{ flex:eco.needsSupport, background:"rgba(255,140,120,0.65)" }} />}
          </div>

          {/* Platform monthly income mini chart */}
          <div style={{ marginTop:16 }}>
            <div className="section-label" style={{ marginBottom:10 }}>Platform income trend</div>
            <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:52 }}>
              {monthlyIncome.map((inc, i) => {
                const h = Math.max(4, (inc / maxInc) * 44);
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:"100%", height:`${h}px`, background:"rgba(255,255,255,0.35)", borderRadius:"3px 3px 0 0" }} />
                    <span style={{ fontSize:9, color:"var(--ink-3)" }}>{monthLabels[i]}</span>
                  </div>
                );
              })}
              <div style={{ marginLeft:8, fontSize:12, color:"var(--ink-3)", paddingBottom:16 }}>
                Total: {fmt(monthlyIncome.reduce((s,v)=>s+v,0))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Priority Attention List ── */}
        {priorityList.length > 0 && (
          <div style={{ marginBottom:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
              <AlertTriangle size={14} color="var(--amber)" />
              <h3>Businesses Needing Attention</h3>
              <span style={{ fontSize:"11px", color:"var(--ink-3)", marginLeft:2 }}>{priorityList.length} flagged</span>
            </div>
            <div style={{ display:"grid", gap:"10px" }}>
              {priorityList.map(h => (
                <div key={h.userId} className="card" style={{ overflow:"hidden", border: h.overallStatus === "needs_support" ? "1px solid rgba(255,140,120,0.2)" : "1px solid rgba(255,200,80,0.15)" }}>
                  <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:10, justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, background:"var(--surface-3)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>
                        {h.userName[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:"1px" }}>{h.businessName}</div>
                        <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>{h.userName} · {h.sector}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                      <StatusBadge status={h.overallStatus} />
                      <Link href={`/admin/entrepreneurs/${h.userId}`} style={{ textDecoration:"none" }}>
                        <button className="btn btn-ghost btn-sm">View <ArrowUpRight size={11} /></button>
                      </Link>
                    </div>
                  </div>

                  {/* Key numbers */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderBottom:"1px solid var(--border)" }}>
                    {[
                      { label:"Income",    value:fmt(getTotalIncome(h.userId)) },
                      { label:"Profit",    value:fmt(getTotalIncome(h.userId)-getTotalExpenses(h.userId)) },
                      { label:"Unpaid",    value:fmt(h.unpaidValue) },
                      { label:"Conversion",value:`${h.quoteConversionRate}%` },
                    ].map(({ label, value }, i) => (
                      <div key={label} style={{ padding:"10px 14px", borderRight: i < 3 ? "1px solid var(--border)" : "none", background:"var(--surface-2)" }}>
                        <div className="section-label" style={{ fontSize:"9px", marginBottom:3 }}>{label}</div>
                        <div style={{ fontSize:"12px", fontWeight:"600" }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Flags */}
                  <div style={{ padding:"10px 18px", display:"flex", flexWrap:"wrap", gap:6 }}>
                    {h.flags.map((flag, i) => (
                      <span key={i} style={{ fontSize:"11px", color:"var(--ink-2)", background:"var(--surface-2)", border:"1px solid var(--border-2)", padding:"3px 8px", borderRadius:"3px", lineHeight:1.4 }}>
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All Businesses: Individual Health Cards ── */}
        <div style={{ marginBottom:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <h3>All Businesses</h3>
            <Link href="/admin/entrepreneurs" style={{ fontSize:"11px", color:"var(--ink-3)", textDecoration:"none", display:"flex", alignItems:"center", gap:3 }}>
              Full view <ArrowUpRight size={11} />
            </Link>
          </div>
          <div style={{ display:"grid", gap:"10px" }}>
            {healthData.map(h => {
              const inc = getTotalIncome(h.userId);
              const exp = getTotalExpenses(h.userId);

              // Business score
              const score = [
                inc > 0 ? 20 : 0,
                h.trend === "growing" ? 25 : h.trend === "stable" ? 15 : 5,
                h.quoteConversionRate >= 50 ? 20 : h.quoteConversionRate >= 25 ? 12 : 5,
                h.unpaidRate <= 20 ? 20 : h.unpaidRate <= 40 ? 12 : 4,
                10,
              ].reduce((s, v) => s + v, 0);

              return (
                <div key={h.userId} className="card" style={{ overflow:"hidden" }}>
                  {/* Header */}
                  <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:10, justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:180 }}>
                      <ScoreRing score={score} size={52} />
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:2 }}>{h.businessName}</div>
                        <div style={{ fontSize:"11px", color:"var(--ink-3)", marginBottom:4 }}>{h.userName} · {h.sector}</div>
                        <StatusBadge status={h.overallStatus} />
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", flexShrink:0 }}>
                      <TrendChip trend={h.trend} change={h.incomeChange} />
                      <DemandDot signal={h.demandSignal} />
                      <Link href={`/admin/entrepreneurs/${h.userId}`} style={{ textDecoration:"none" }}>
                        <button className="btn btn-ghost btn-sm">Details</button>
                      </Link>
                    </div>
                  </div>

                  {/* 3 signal columns */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>

                    {/* Income */}
                    <div style={{ padding:"12px 16px", borderRight:"1px solid var(--border)" }}>
                      <div className="section-label" style={{ marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                        <TrendingUp size={10} /> Income
                      </div>
                      <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:3 }}>{fmt(inc)}</div>
                      <div style={{ fontSize:"11px", color:"var(--ink-3)", marginBottom:8 }}>Profit: {fmt(inc - exp)}</div>
                      {/* Monthly bars */}
                      <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:28 }}>
                        {h.monthlyIncome.map((m, i) => {
                          const maxM = Math.max(...h.monthlyIncome.map(x => x.value), 1);
                          const barH = Math.max(2, (m.value / maxM) * 24);
                          return (
                            <div key={i} style={{ flex:1, height:`${barH}px`, background: m.value > 0 ? "var(--border-2)" : "var(--surface-3)", borderRadius:"2px 2px 0 0" }} title={`${m.month}: ${fmt(m.value)}`} />
                          );
                        })}
                      </div>
                    </div>

                    {/* Demand */}
                    <div style={{ padding:"12px 16px", borderRight:"1px solid var(--border)" }}>
                      <div className="section-label" style={{ marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                        <Target size={10} /> Demand
                      </div>
                      <div style={{ marginBottom:8 }}><DemandDot signal={h.demandSignal} /></div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                        {[
                          { label:"Quotes",    value:String(h.quoteVolume) },
                          { label:"Converted", value:`${h.quoteConversionRate}%` },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ padding:"5px 7px", background:"var(--surface-2)", borderRadius:4, textAlign:"center" }}>
                            <div style={{ fontSize:9, color:"var(--ink-3)", marginBottom:1 }}>{label}</div>
                            <div style={{ fontSize:12, fontWeight:700 }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      {h.pendingQuoteValue > 0 && (
                        <div style={{ fontSize:10, color:"rgba(255,200,80,0.75)", marginTop:6 }}>{fmt(h.pendingQuoteValue)} pending</div>
                      )}
                    </div>

                    {/* Payment */}
                    <div style={{ padding:"12px 16px" }}>
                      <div className="section-label" style={{ marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                        <Zap size={10} /> Payments
                      </div>
                      <div style={{ marginBottom:6 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:11, color:"var(--ink-3)" }}>Collected</span>
                          <span style={{ fontSize:11, fontWeight:700, color: (100-h.unpaidRate) >= 80 ? "var(--green-text)" : "var(--amber-text)" }}>
                            {100 - h.unpaidRate}%
                          </span>
                        </div>
                        <div style={{ height:5, background:"var(--surface-3)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${100-h.unpaidRate}%`, background: (100-h.unpaidRate) >= 80 ? "var(--green)" : "var(--amber)", borderRadius:3 }} />
                        </div>
                      </div>
                      {h.overdueCount > 0 && (
                        <div style={{ fontSize:11, color:"var(--red-text)", marginBottom:4 }}>{h.overdueCount} overdue</div>
                      )}
                      <div style={{ fontSize:11, color:"var(--ink-3)" }}>Unpaid: {fmt(h.unpaidValue)}</div>
                    </div>
                  </div>

                  {/* Flags */}
                  {h.flags.length > 0 ? (
                    <div style={{ padding:"10px 18px", background:"var(--surface-2)", borderTop:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                      <AlertTriangle size={11} color="rgba(255,200,80,0.65)" style={{ flexShrink:0 }} />
                      {h.flags.map((flag, i) => (
                        <span key={i} style={{ fontSize:"11px", color:"var(--ink-2)", background:"var(--surface-3)", border:"1px solid var(--border-2)", padding:"2px 8px", borderRadius:3 }}>
                          {flag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding:"8px 18px", background:"var(--surface-2)", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", gap:6 }}>
                      <CheckCircle size={11} color="rgba(180,200,180,0.4)" />
                      <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>No active concerns</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Demand breakdown table ── */}
        <div className="card" style={{ overflow:"hidden", marginBottom:"16px" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:7 }}>
            <Target size={14} color="var(--ink-3)" />
            <h3>Demand Pipeline — Where Deals Are Won or Lost</h3>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table className="tbl" style={{ minWidth:560 }}>
              <thead>
                <tr>
                  <th>Business</th>
                  <th style={{ textAlign:"center" }}>Quotes</th>
                  <th style={{ textAlign:"center" }}>Converted</th>
                  <th style={{ textAlign:"center" }}>Declined</th>
                  <th style={{ textAlign:"right"  }}>Pipeline</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {healthData.map(h => (
                  <tr key={h.userId}>
                    <td>
                      <div style={{ fontWeight:"600", fontSize:13 }}>{h.businessName}</div>
                      <div style={{ fontSize:10, color:"var(--ink-3)" }}>{h.sector}</div>
                    </td>
                    <td style={{ textAlign:"center" }}>{h.quoteVolume || <span style={{ color:"var(--ink-3)" }}>—</span>}</td>
                    <td style={{ textAlign:"center" }}>
                      {h.quoteVolume > 0
                        ? <span style={{ fontWeight:700, color: h.quoteConversionRate>=50 ? "var(--green-text)" : h.quoteConversionRate>=25 ? "var(--amber-text)" : "var(--red-text)" }}>
                            {Math.round(h.quoteVolume * h.quoteConversionRate/100)} ({h.quoteConversionRate}%)
                          </span>
                        : <span style={{ color:"var(--ink-3)" }}>—</span>}
                    </td>
                    <td style={{ textAlign:"center" }}>
                      {h.lostQuoteRate > 0
                        ? <span style={{ color:"var(--red-text)" }}>{Math.round(h.quoteVolume * h.lostQuoteRate/100)} ({h.lostQuoteRate}%)</span>
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

        {/* ── Cash flow risk table ── */}
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:7 }}>
            <Zap size={14} color="var(--ink-3)" />
            <h3>Payment & Cash Flow Risk</h3>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table className="tbl" style={{ minWidth:520 }}>
              <thead>
                <tr>
                  <th>Business</th>
                  <th style={{ textAlign:"right" }}>Invoiced</th>
                  <th style={{ textAlign:"right" }}>Collected</th>
                  <th style={{ textAlign:"right" }}>Unpaid</th>
                  <th style={{ textAlign:"center" }}>Collection %</th>
                  <th style={{ textAlign:"center" }}>Overdue</th>
                </tr>
              </thead>
              <tbody>
                {healthData.map(h => {
                  const totalInvoiced = allInvoices.filter(i => i.userId === h.userId).reduce((s,i) => s+i.total, 0);
                  const collected     = getTotalIncome(h.userId);
                  const collPct       = totalInvoiced > 0 ? Math.round((collected/totalInvoiced)*100) : 0;
                  return (
                    <tr key={h.userId}>
                      <td style={{ fontWeight:"600" }}>{h.businessName}</td>
                      <td style={{ textAlign:"right" }}>{fmt(totalInvoiced)}</td>
                      <td style={{ textAlign:"right", color:"var(--green-text)" }}>{fmt(collected)}</td>
                      <td style={{ textAlign:"right", fontWeight:"600", color: h.unpaidValue > 0 ? "var(--amber-text)" : "var(--ink-2)" }}>{fmt(h.unpaidValue)}</td>
                      <td style={{ textAlign:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                          <div style={{ width:48, height:4, background:"var(--surface-3)", borderRadius:2, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${collPct}%`, background: collPct>=80 ? "var(--green)" : collPct>=50 ? "var(--amber)" : "var(--red)", borderRadius:2 }} />
                          </div>
                          <span style={{ fontSize:11, fontWeight:700 }}>{collPct}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign:"center", color: h.overdueCount > 0 ? "var(--red-text)" : "var(--ink-3)", fontWeight: h.overdueCount > 0 ? "700" : "400" }}>
                        {h.overdueCount > 0 ? h.overdueCount : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
