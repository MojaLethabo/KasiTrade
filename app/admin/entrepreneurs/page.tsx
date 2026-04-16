"use client";
import { useState, useMemo } from "react";
import { users, getDataForUser, getTotalIncome, getTotalExpenses } from "@/lib/data";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight, X } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

const entrepreneurs = users.filter(u => u.role === "entrepreneur");
const allSectors   = [...new Set(entrepreneurs.map(e => e.business?.sector).filter(Boolean))] as string[];
const allStages    = [...new Set(entrepreneurs.map(e => e.business?.stage).filter(Boolean))] as string[];
const allLocations = [...new Set(entrepreneurs.map(e => e.business?.location).filter(Boolean))] as string[];

function getActivity(n: number) {
  return n >= 6 ? "Active" : n >= 3 ? "Moderate" : "Low";
}

export default function EntrepreneursPage() {
  const [search,    setSearch]    = useState("");
  const [sector,    setSector]    = useState("All");
  const [stage,     setStage]     = useState("All");
  const [location,  setLocation]  = useState("All");
  const [activity,  setActivity]  = useState("All");
  const [sortBy,    setSortBy]    = useState<"name"|"income"|"profit"|"logins">("name");
  const [sortDir,   setSortDir]   = useState<"asc"|"desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  const processed = useMemo(() => {
    let list = entrepreneurs.map(e => {
      const data     = getDataForUser(e.id);
      const income   = getTotalIncome(e.id);
      const exps     = getTotalExpenses(e.id);
      const profit   = income - exps;
      const act      = getActivity(e.loginDates.length);
      const unpaid   = data.invoices.filter(i => i.status !== "paid").reduce((s, i) => s + (i.total - i.paidAmount), 0);
      const payRate  = data.invoices.length ? Math.round((data.invoices.filter(i => i.status === "paid").length / data.invoices.length) * 100) : 0;
      return { ...e, income, expenses: exps, profit, activity: act, unpaid, payRate, data };
    });

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || (e.business?.name || "").toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    if (sector   !== "All") list = list.filter(e => e.business?.sector   === sector);
    if (stage    !== "All") list = list.filter(e => e.business?.stage    === stage);
    if (location !== "All") list = list.filter(e => e.business?.location === location);
    if (activity !== "All") list = list.filter(e => e.activity           === activity);

    list.sort((a, b) => {
      const av = sortBy === "name" ? a.name : sortBy === "income" ? a.income : sortBy === "profit" ? a.profit : a.loginDates.length;
      const bv = sortBy === "name" ? b.name : sortBy === "income" ? b.income : sortBy === "profit" ? b.profit : b.loginDates.length;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [search, sector, stage, location, activity, sortBy, sortDir]);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  }

  const activeFilters = [sector, stage, location, activity].filter(f => f !== "All").length;
  function clearAll() { setSector("All"); setStage("All"); setLocation("All"); setActivity("All"); setSearch(""); }

  return (
    <main className="main-content">
      <div className="page-wrap">
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>Administration</div>
          <h1 style={{ marginBottom: "4px" }}>Entrepreneurs</h1>
          <p style={{ color: "var(--text-3)", fontSize: "13px" }}>
            {processed.length} of {entrepreneurs.length} shown{activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? "s" : ""} active`}
          </p>
        </div>

        {/* Aggregate KPIs for filtered set */}
        <div className="kpi-row" style={{ marginBottom: "16px" }}>
          {[
            { label: "Combined Income",   value: fmt(processed.reduce((s,e) => s + e.income,   0)) },
            { label: "Combined Expenses", value: fmt(processed.reduce((s,e) => s + e.expenses, 0)) },
            { label: "Combined Profit",   value: fmt(processed.reduce((s,e) => s + e.profit,   0)) },
            { label: "Outstanding",       value: fmt(processed.reduce((s,e) => s + e.unpaid,   0)) },
          ].map(({ label, value }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--white)" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search + filter bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "200px", maxWidth: "320px" }}>
            <Search size={13} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
            <input className="input" style={{ paddingLeft: "33px" }} placeholder="Search name, business…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => setShowFilters(v => !v)}
            style={{ borderColor: activeFilters > 0 ? "rgba(255,255,255,0.3)" : undefined, color: activeFilters > 0 ? "var(--white)" : undefined }}
          >
            <SlidersHorizontal size={13} /> Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
          {(activeFilters > 0 || search) && (
            <button className="btn btn-ghost" onClick={clearAll}><X size={12} /> Clear</button>
          )}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginLeft: "auto" }}>
            {(["name","income","profit","logins"] as const).map(col => (
              <button key={col} onClick={() => toggleSort(col)} className={sortBy === col ? "btn btn-secondary btn-sm" : "btn btn-ghost btn-sm"} style={{ textTransform: "capitalize" }}>
                {col}{sortBy === col ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="card" style={{ padding: "16px 18px", marginBottom: "12px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
            {[
              { label: "Sector",         value: sector,   options: ["All", ...allSectors],           set: setSector   },
              { label: "Business Stage", value: stage,    options: ["All", ...allStages],            set: setStage    },
              { label: "Location",       value: location, options: ["All", ...allLocations],         set: setLocation },
              { label: "Activity",       value: activity, options: ["All","Active","Moderate","Low"],set: setActivity },
            ].map(({ label, value, options, set }) => (
              <div key={label}>
                <label className="label">{label}</label>
                <select className="input" value={value} onChange={e => set(e.target.value)}>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {processed.length === 0 ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--text-3)", marginBottom: "12px" }}>No entrepreneurs match your filters.</p>
            <button className="btn btn-ghost" onClick={clearAll}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {processed.map(e => {
              const actBadge = e.activity === "Active" ? "badge-green" : e.activity === "Moderate" ? "badge-yellow" : "badge-red";
              return (
                <div key={e.id} className="card" style={{ overflow: "hidden" }}>
                  {/* Identity row */}
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "200px" }}>
                      <div style={{ width: "36px", height: "36px", background: "var(--bg-4)", border: "1px solid var(--border-2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", flexShrink: 0 }}>
                        {e.name[0]}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.business?.name} · {e.business?.location}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <span className={`badge ${actBadge}`}>{e.activity}</span>
                      <span className="badge badge-blue" style={{ fontSize: "10px" }}>{e.business?.sector}</span>
                      <span className="badge badge-white" style={{ fontSize: "10px" }}>{e.business?.stage}</span>
                      <Link href={`/admin/entrepreneurs/${e.id}`} style={{ textDecoration: "none" }}>
                        <button className="btn btn-ghost btn-sm">Details <ArrowUpRight size={11} /></button>
                      </Link>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div style={{ overflowX: "auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(90px, 1fr))", background: "var(--bg-3)", minWidth: "600px" }}>
                      {[
                        { label: "Income",     value: fmt(e.income)            },
                        { label: "Expenses",   value: fmt(e.expenses)          },
                        { label: "Profit",     value: fmt(e.profit),  bold: true },
                        { label: "Outstanding",value: fmt(e.unpaid)            },
                        { label: "Invoices",   value: String(e.data.invoices.length)   },
                        { label: "Quotes",     value: String(e.data.quotations.length) },
                        { label: "Customers",  value: String(e.data.customers.length)  },
                        { label: "Logins",     value: String(e.loginDates.length)      },
                      ].map(({ label, value, bold }, i) => (
                        <div key={label} style={{ padding: "10px 14px", borderRight: i < 7 ? "1px solid var(--border)" : "none" }}>
                          <div className="section-label" style={{ fontSize: "9px", marginBottom: "3px" }}>{label}</div>
                          <div style={{ fontSize: "12px", fontWeight: bold ? "700" : "500", color: bold ? "var(--white)" : "var(--text-2)" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div style={{ padding: "12px 18px", background: "var(--bg-2)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
                    {[
                      { label: "Income vs R20k",     pct: Math.min(100, (e.income / 20000) * 100) },
                      { label: "Invoice payment rate", pct: e.payRate },
                      { label: "Platform engagement",  pct: Math.min(100, (e.loginDates.length / 10) * 100) },
                      { label: "Profitability",        pct: e.income > 0 ? Math.min(100, Math.max(0, (e.profit / e.income) * 100)) : 0 },
                    ].map(bar => (
                      <div key={bar.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "10px", color: "var(--text-3)" }}>{bar.label}</span>
                          <span style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-2)" }}>{Math.round(bar.pct)}%</span>
                        </div>
                        <div style={{ height: "3px", background: "var(--bg-4)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${bar.pct}%`, borderRadius: "2px",
                            background: bar.pct >= 70 ? "rgba(255,255,255,0.7)" : bar.pct >= 40 ? "rgba(255,255,255,0.38)" : "rgba(255,90,90,0.55)",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
