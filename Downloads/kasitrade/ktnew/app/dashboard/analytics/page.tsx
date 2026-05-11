"use client";
import { useAuth } from "@/lib/auth";
import {
  getDataForUser, getTotalIncome, getTotalExpenses,
  analyseBusinessHealth, receipts as allReceipts, expenses as allExpenses,
} from "@/lib/data";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, ArrowUpRight, Target, Zap } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
function fmtK(n: number) { return n >= 1000 ? "R" + (n / 1000).toFixed(1) + "k" : "R" + n; }

// ── Mini SVG line chart ────────────────────────────────────────────────────
function LineSparkline({ values, W = 120, H = 40, color = "var(--ink-2)" }: {
  values: number[]; W?: number; H?: number; color?: string;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const p = 4;
  const xs = values.map((_, i) => p + (i / (values.length - 1)) * (W - p * 2));
  const ys = values.map(v => H - p - ((v / max) * (H - p * 2)));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: "block", overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={color} />
    </svg>
  );
}

// ── Simple bar chart ───────────────────────────────────────────────────────
function BarRow({ label, value, max, color = "var(--brand)" }: {
  label: string; value: number; max: number; color?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink)" }}>{fmt(value)}</span>
      </div>
      <div style={{ height: "5px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// ── Score ring ─────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "var(--ink-2)" : score >= 40 ? "var(--amber)" : "var(--red)";
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill="var(--ink)" fontSize="16" fontWeight="700" fontFamily="Inter,sans-serif">{score}</text>
    </svg>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const data     = getDataForUser(user.id);
  const health   = analyseBusinessHealth(user.id);
  const income   = getTotalIncome(user.id);
  const expenses = getTotalExpenses(user.id);
  const profit   = income - expenses;
  const margin   = income > 0 ? Math.round((profit / income) * 100) : 0;

  // Monthly income for sparkline
  const months = ["2024-01", "2024-02", "2024-03", "2024-04"];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr"];
  const monthlyIncome   = months.map(m => allReceipts.filter(r => r.userId === user.id && r.date.startsWith(m)).reduce((s, r) => s + r.amount, 0));
  const monthlyExpenses = months.map(m => allExpenses.filter(e => e.userId === user.id && e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0));
  const monthlyProfit   = monthlyIncome.map((inc, i) => inc - monthlyExpenses[i]);
  const maxMonthly      = Math.max(...monthlyIncome, ...monthlyExpenses, 1);

  // Expense breakdown
  const byCat: Record<string, number> = {};
  data.expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const sortedCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCats[0]?.[1] || 1;

  // Invoice conversion stats
  const totalInvoiced    = data.invoices.reduce((s, i) => s + i.total, 0);
  const collectedPct     = totalInvoiced > 0 ? Math.round((income / totalInvoiced) * 100) : 0;
  const avgInvoiceValue  = data.invoices.length > 0 ? Math.round(totalInvoiced / data.invoices.length) : 0;

  // Business score (0-100, simple composite)
  const scoreComponents = [
    income > 0 ? 20 : 0,
    health.trend === "growing" ? 25 : health.trend === "stable" ? 15 : 5,
    health.quoteConversionRate >= 50 ? 20 : health.quoteConversionRate >= 25 ? 12 : 5,
    health.unpaidRate <= 20 ? 20 : health.unpaidRate <= 40 ? 12 : 4,
    data.customers.length >= 3 ? 15 : data.customers.length >= 2 ? 10 : 4,
  ];
  const businessScore = scoreComponents.reduce((s, v) => s + v, 0);

  const statusColor = (s: string) =>
    s === "growing" ? "var(--ink-2)" :
    s === "stable"  ? "var(--ink-3)" :
    s === "at_risk" ? "var(--amber)"  :
                      "var(--red)";

  const trendLabel = health.trend === "growing" ? "Growing" : health.trend === "declining" ? "Declining" : health.trend === "stable" ? "Stable" : "Limited data";

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* ── Header ── */}
        <div style={{ marginBottom: "28px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>Your Business</div>
          <h1 style={{ marginBottom: "4px" }}>Analytics</h1>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>{user.business?.name} — how your business is performing</p>
        </div>

        {/* ── Business Health Score ── */}
        <div className="card" style={{ padding: "22px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <ScoreRing score={businessScore} size={88} />
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div className="section-label" style={{ marginBottom: "4px" }}>Business Health Score</div>
              <div style={{ fontSize: "13px", color: "var(--ink-2)", marginBottom: "10px", lineHeight: "1.5" }}>
                {businessScore >= 70
                  ? "Your business is in strong shape. Keep the momentum going."
                  : businessScore >= 45
                  ? "Your business is developing. A few areas need attention."
                  : "Your business needs focus in key areas to grow consistently."}
              </div>
              {/* Score breakdown bar */}
              <div style={{ height: "6px", borderRadius: "3px", overflow: "hidden", background: "var(--surface-3)", display: "flex", gap: "2px" }}>
                {scoreComponents.map((v, i) => (
                  <div key={i} style={{ flex: 1, background: v >= 15 ? "var(--ink-2)" : v >= 8 ? "var(--amber)" : "rgba(255,100,80,0.4)", borderRadius: "2px" }} />
                ))}
              </div>
              <div style={{ fontSize: "10px", color: "var(--ink-3)", marginTop: "5px" }}>
                Income · Trend · Demand · Payment · Customers
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: statusColor(health.overallStatus) + "22", color: statusColor(health.overallStatus), border: `1px solid ${statusColor(health.overallStatus)}` }}>
                {health.overallStatus === "needs_support" ? "Needs attention" : trendLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Top KPIs ── */}
        <div className="kpi-row" style={{ marginBottom: "16px" }}>
          {[
            { label: "Total Income",  value: fmt(income),   sub: "All payments received" },
            { label: "Total Expenses",value: fmt(expenses), sub: "All costs recorded"    },
            { label: "Net Profit",    value: fmt(profit),   sub: `${margin}% margin`     },
            { label: "Outstanding",   value: fmt(health.unpaidValue), sub: `${health.unpaidRate}% unpaid` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom: "6px" }}>{label}</div>
              <div className="stat-num" style={{ marginBottom: "3px" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Monthly Performance Chart ── */}
        <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>Monthly Performance</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "10px", height: "3px", borderRadius: "2px", background: "var(--ink-2)" }} />
                <span style={{ fontSize: "10px", color: "var(--ink-3)" }}>Income</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "10px", height: "3px", borderRadius: "2px", background: "rgba(255,100,80,0.6)", borderStyle: "dashed" }} />
                <span style={{ fontSize: "10px", color: "var(--ink-3)" }}>Expenses</span>
              </div>
            </div>
          </div>

          {/* Monthly bars side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "12px" }}>
            {months.map((_, i) => {
              const inc = monthlyIncome[i];
              const exp = monthlyExpenses[i];
              const pro = monthlyProfit[i];
              const incH = maxMonthly > 0 ? Math.max(4, (inc / maxMonthly) * 80) : 4;
              const expH = maxMonthly > 0 ? Math.max(4, (exp / maxMonthly) * 80) : 4;
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ height: "90px", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "4px", marginBottom: "6px" }}>
                    <div style={{ width: "18px", height: `${incH}px`, background: "var(--brand)", borderRadius: "3px 3px 0 0" }} title={`Income: ${fmt(inc)}`} />
                    <div style={{ width: "18px", height: `${expH}px`, background: "rgba(255,100,80,0.45)", borderRadius: "3px 3px 0 0" }} title={`Expenses: ${fmt(exp)}`} />
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--ink-3)", marginBottom: "2px" }}>{monthLabels[i]}</div>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: pro >= 0 ? "var(--green-text)" : "var(--red-text)" }}>
                    {pro >= 0 ? "+" : ""}{fmtK(pro)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month-on-month trend label */}
          <div style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            {health.trend === "growing"   && <TrendingUp  size={14} color="rgba(200,220,200,0.8)" />}
            {health.trend === "declining" && <TrendingDown size={14} color="rgba(255,120,100,0.8)" />}
            {health.trend === "stable"    && <Minus size={14} color="var(--ink-3)" />}
            {health.trend === "insufficient_data" && <Minus size={14} color="var(--ink-3)" />}
            <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>
              {health.trendReason}
              {health.incomeChange !== 0 && (
                <strong style={{ color: health.incomeChange > 0 ? "var(--green-text)" : "var(--red-text)", marginLeft: "4px" }}>
                  ({health.incomeChange > 0 ? "+" : ""}{health.incomeChange}%)
                </strong>
              )}
            </span>
          </div>
        </div>

        {/* ── Two column: Demand + Payment ── */}
        <div className="grid-2" style={{ marginBottom: "16px" }}>

          {/* Demand / Pipeline */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
              <Target size={14} color="var(--ink-3)" />
              <h3>Demand & Pipeline</h3>
            </div>

            {/* Quote funnel */}
            <div style={{ marginBottom: "16px" }}>
              {[
                { label: "Quotes created",   value: health.quoteVolume,             color: "var(--ink-3)" },
                { label: "Accepted/Converted",value: Math.round(health.quoteVolume * health.quoteConversionRate / 100), color: "var(--green)" },
                { label: "Declined",         value: Math.round(health.quoteVolume * health.lostQuoteRate / 100), color: "rgba(255,120,100,0.5)" },
              ].map(({ label, value, color }) => (
                <BarRow key={label} label={label} value={value} max={Math.max(health.quoteVolume, 1)} color={color} />
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {[
                { label: "Conversion rate", value: `${health.quoteConversionRate}%`,   good: health.quoteConversionRate >= 50 },
                { label: "Decline rate",    value: `${health.lostQuoteRate}%`,          good: health.lostQuoteRate < 20 },
              ].map(({ label, value, good }) => (
                <div key={label} style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: "6px", textAlign: "center" }}>
                  <div className="section-label" style={{ marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: good ? "var(--green-text)" : "var(--amber-text)" }}>{value}</div>
                </div>
              ))}
            </div>

            {health.pendingQuoteValue > 0 && (
              <div style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>Pending pipeline</span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--amber-text)" }}>{fmt(health.pendingQuoteValue)}</span>
              </div>
            )}

            <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "10px", lineHeight: "1.5" }}>
              {health.demandReason}
            </p>
            <Link href="/dashboard/quotations" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--ink-3)", textDecoration: "none", marginTop: "8px" }}>
              View quotations <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Payment Health */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
              <Zap size={14} color="var(--ink-3)" />
              <h3>Payment Health</h3>
            </div>

            {/* Unpaid rate ring */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              {/* Collection rate ring (inverse of unpaid) */}
              <ScoreRing score={100 - health.unpaidRate} size={72} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)", marginBottom: "3px" }}>{100 - health.unpaidRate}% collected</div>
                <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>of all invoiced value</div>
                {health.overdueCount > 0 && (
                  <div style={{ fontSize: "11px", color: "var(--red-text)", marginTop: "4px" }}>
                    {health.overdueCount} overdue invoice{health.overdueCount > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* Invoice status breakdown */}
            {[
              { label: "Paid invoices",    value: data.invoices.filter(i => i.status === "paid").length,    total: data.invoices.length, color: "var(--green)" },
              { label: "Partially paid",   value: data.invoices.filter(i => i.status === "partial").length, total: data.invoices.length, color: "var(--amber)"   },
              { label: "Unpaid invoices",  value: data.invoices.filter(i => i.status === "unpaid").length,  total: data.invoices.length, color: "rgba(255,120,100,0.5)"   },
            ].map(({ label, value, total, color }) => (
              <div key={label} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>{value} / {total}</span>
                </div>
                <div style={{ height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${total > 0 ? (value / total) * 100 : 0}%`, background: color, borderRadius: "2px" }} />
                </div>
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
              <div style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: "6px", textAlign: "center" }}>
                <div className="section-label" style={{ marginBottom: "4px" }}>Avg. invoice</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>{fmt(avgInvoiceValue)}</div>
              </div>
              <div style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: "6px", textAlign: "center" }}>
                <div className="section-label" style={{ marginBottom: "4px" }}>Outstanding</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: health.unpaidValue > 0 ? "var(--amber-text)" : "var(--green-text)" }}>{fmt(health.unpaidValue)}</div>
              </div>
            </div>

            <Link href="/dashboard/invoices" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--ink-3)", textDecoration: "none", marginTop: "10px" }}>
              View invoices <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>

        {/* ── Expense breakdown ── */}
        <div className="card" style={{ padding: "18px 20px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>Where Your Money Goes</h3>
            <span style={{ fontSize: "12px", color: "var(--ink-3)" }}>Total: {fmt(expenses)}</span>
          </div>
          {sortedCats.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>No expenses recorded yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "2px" }}>
              {sortedCats.map(([cat, amount]) => {
                const pct = Math.round((amount / expenses) * 100);
                return (
                  <div key={cat} style={{ display: "grid", gridTemplateColumns: "110px 1fr 80px 36px", gap: "10px", alignItems: "center", padding: "6px 0" }}>
                    <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{cat}</span>
                    <div style={{ height: "5px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(amount / maxCat) * 100}%`, background: "var(--border-2)", borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", textAlign: "right" }}>{fmt(amount)}</span>
                    <span style={{ fontSize: "11px", color: "var(--ink-3)", textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/dashboard/expenses" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--ink-3)", textDecoration: "none", marginTop: "12px" }}>
            Manage expenses <ArrowUpRight size={11} />
          </Link>
        </div>

        {/* ── Action signals ── */}
        {health.flags.length > 0 && (
          <div className="card" style={{ padding: "18px 20px", marginBottom: "16px", border: "1px solid rgba(255,200,80,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
              <AlertTriangle size={14} color="var(--amber)" />
              <h3>Action Signals</h3>
              <span style={{ fontSize: "11px", color: "var(--ink-3)", marginLeft: "4px" }}>{health.flags.length} item{health.flags.length > 1 ? "s" : ""} to review</span>
            </div>
            <div style={{ display: "grid", gap: "8px" }}>
              {health.flags.map((flag, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "11px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--amber)", flexShrink: 0, marginTop: "4px" }} />
                  <span style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.5" }}>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {health.flags.length === 0 && (
          <div className="card" style={{ padding: "16px 20px", border: "1px solid rgba(180,220,180,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={14} color="var(--green)" />
              <span style={{ fontSize: "13px", color: "var(--ink-2)" }}>No active concerns — your business is performing well across all areas.</span>
            </div>
          </div>
        )}

        {/* ── Quick stats grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", marginTop: "16px" }}>
          {[
            { label: "Customers",  value: data.customers.length,  note: data.customers.length < 2 ? "Build your base" : "Good network" },
            { label: "Products",   value: data.products.length,   note: "In your catalogue"    },
            { label: "Receipts",   value: data.receipts.length,   note: "Payments recorded"   },
          ].map(({ label, value, note }) => (
            <div key={label} style={{ background: "var(--surface)", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--ink)", marginBottom: "3px" }}>{value}</div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <div style={{ fontSize: "10px", color: "var(--ink-3)", marginTop: "2px" }}>{note}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
