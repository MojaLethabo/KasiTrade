"use client";
import { useAuth } from "@/lib/auth";
import { getDataForUser } from "@/lib/data";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar,
  FileText, CreditCard, Receipt, TrendingUp,
  CheckCircle, Clock, AlertCircle, ChevronRight,
} from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

export default function CustomerDetailPage() {
  const { user }  = useAuth();
  const params    = useParams();
  const router    = useRouter();
  if (!user) return null;

  const { customers, quotations, invoices, receipts } = getDataForUser(user.id);
  const customerId = params.id as string;
  const customer   = customers.find(c => c.id === customerId);

  if (!customer) {
    return (
      <main className="main-content">
        <div style={{ padding:"48px", textAlign:"center" }}>
          <p style={{ color:"var(--ink-3)", marginBottom:"14px" }}>Customer not found.</p>
          <Link href="/dashboard/customers" className="btn btn-ghost">Back to Customers</Link>
        </div>
      </main>
    );
  }

  const cQuotes   = quotations.filter(q => q.customerId === customerId);
  const cInvoices = invoices.filter(i => i.customerId === customerId);
  const cReceipts = receipts.filter(r => cInvoices.some(i => i.id === r.invoiceId));

  // Money stats
  const totalInvoiced = cInvoices.reduce((s, i) => s + i.total, 0);
  const totalPaid     = cReceipts.reduce((s, r) => s + r.amount, 0);
  const totalUnpaid   = totalInvoiced - totalPaid;
  const paidRate      = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  // Combined timeline — all events sorted newest first
  type Event =
    | { kind: "quotation"; date: string; obj: typeof cQuotes[0] }
    | { kind: "invoice";   date: string; obj: typeof cInvoices[0] }
    | { kind: "receipt";   date: string; obj: typeof cReceipts[0] };

  const timeline: Event[] = [
    ...cQuotes.map(q   => ({ kind: "quotation" as const, date: q.date,   obj: q })),
    ...cInvoices.map(i => ({ kind: "invoice"   as const, date: i.date,   obj: i })),
    ...cReceipts.map(r => ({ kind: "receipt"   as const, date: r.date,   obj: r })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const statusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      draft:     { cls:"badge-white",  label:"Draft"     },
      sent:      { cls:"badge-blue",   label:"Sent"      },
      accepted:  { cls:"badge-green",  label:"Accepted"  },
      declined:  { cls:"badge-red",    label:"Declined"  },
      converted: { cls:"badge-purple", label:"Converted" },
      unpaid:    { cls:"badge-red",    label:"Unpaid"    },
      partial:   { cls:"badge-yellow", label:"Partial"   },
      paid:      { cls:"badge-green",  label:"Paid"      },
    };
    const cfg = map[status] || { cls:"badge-white", label: status };
    return <span className={`badge ${cfg.cls}`} style={{ fontSize:"10px" }}>{cfg.label}</span>;
  };

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* Back */}
        <button
          onClick={() => router.push("/dashboard/customers")}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom:"20px", gap:"6px" }}
        >
          <ArrowLeft size={13} /> All Customers
        </button>

        {/* ── Header card ── */}
        <div className="card" style={{ padding:"20px 22px", marginBottom:"16px" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"16px", alignItems:"flex-start" }}>
            {/* Avatar */}
            <div style={{ width:"52px", height:"52px", background:"var(--surface-3)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:"700", color:"var(--ink)", flexShrink:0 }}>
              {customer.name[0]}
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <h1 style={{ marginBottom:"4px" }}>{customer.name}</h1>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"14px" }}>
                {customer.email && (
                  <a href={`mailto:${customer.email}`} style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"13px", color:"var(--ink-3)", textDecoration:"none" }}>
                    <Mail size={12} strokeWidth={1.5} />{customer.email}
                  </a>
                )}
                {customer.phone && (
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"13px", color:"var(--ink-3)" }}>
                    <Phone size={12} strokeWidth={1.5} />{customer.phone}
                  </span>
                )}
                {customer.address && (
                  <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"13px", color:"var(--ink-3)" }}>
                    <MapPin size={12} strokeWidth={1.5} />{customer.address}
                  </span>
                )}
                <span style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"13px", color:"var(--ink-3)" }}>
                  <Calendar size={12} strokeWidth={1.5} />Client since {customer.createdAt}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="kpi-row" style={{ marginBottom:"16px" }}>
          {[
            { label:"Total Invoiced", value: fmt(totalInvoiced), sub:`${cInvoices.length} invoice${cInvoices.length !== 1?"s":""}` },
            { label:"Total Paid",     value: fmt(totalPaid),     sub:`${paidRate}% collection rate` },
            { label:"Outstanding",    value: fmt(totalUnpaid),   sub: totalUnpaid > 0 ? "Needs follow-up" : "All cleared" },
            { label:"Quotations",     value: String(cQuotes.length), sub: `${cQuotes.filter(q=>q.status==="converted").length} converted` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom:"6px" }}>{label}</div>
              <div className="stat-num" style={{ marginBottom:"3px" }}>{value}</div>
              <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Payment health bar ── */}
        {totalInvoiced > 0 && (
          <div className="card" style={{ padding:"16px 20px", marginBottom:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
              <span style={{ fontSize:"12px", color:"var(--ink-2)" }}>Payment collection</span>
              <span style={{ fontSize:"12px", fontWeight:"700", color: paidRate >= 80 ? "var(--green-text)" : paidRate >= 50 ? "var(--amber-text)" : "var(--red-text)" }}>{paidRate}% collected</span>
            </div>
            <div style={{ height:"8px", background:"var(--surface-3)", borderRadius:"4px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${paidRate}%`, background: paidRate >= 80 ? "var(--green)" : paidRate >= 50 ? "var(--amber)" : "var(--red)", borderRadius:"4px", transition:"width 0.4s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
              <span style={{ fontSize:"10px", color:"var(--ink-3)" }}>Paid: {fmt(totalPaid)}</span>
              <span style={{ fontSize:"10px", color:"var(--ink-3)" }}>Unpaid: {fmt(totalUnpaid)}</span>
            </div>
          </div>
        )}

        {/* ── Full interaction timeline ── */}
        <div style={{ marginBottom:"8px" }}>
          <h3 style={{ marginBottom:"16px" }}>Interaction History</h3>

          {timeline.length === 0 ? (
            <div className="card" style={{ padding:"32px", textAlign:"center" }}>
              <p style={{ color:"var(--ink-3)" }}>No interactions yet. Create a quotation or invoice for this client.</p>
            </div>
          ) : (
            <div style={{ position:"relative" }}>
              {/* Vertical line */}
              <div style={{ position:"absolute", left:"19px", top:"20px", bottom:"20px", width:"1px", background:"var(--border)", zIndex:0 }} />

              <div style={{ display:"grid", gap:"10px" }}>
                {timeline.map((event, idx) => {
                  if (event.kind === "quotation") {
                    const q = event.obj;
                    return (
                      <div key={`q-${q.id}`} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                        {/* Timeline dot */}
                        <div style={{ width:"38px", height:"38px", background:"var(--surface)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1 }}>
                          <FileText size={15} color="var(--ink-3)" strokeWidth={1.5} />
                        </div>
                        <div className="card" style={{ flex:1, padding:"14px 16px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", marginBottom:"6px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                              <span style={{ fontSize:"13px", fontWeight:"600" }}>Quotation</span>
                              {statusBadge(q.status)}
                            </div>
                            <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>{q.date}</span>
                          </div>
                          <div style={{ fontSize:"12px", color:"var(--ink-3)", marginBottom:"6px" }}>
                            {q.items.length} line item{q.items.length !== 1?"s":""} · Valid until {q.validUntil}
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div style={{ fontSize:"14px", fontWeight:"700" }}>{fmt(q.total)}</div>
                            <Link href="/dashboard/quotations" style={{ fontSize:"11px", color:"var(--ink-3)", textDecoration:"none", display:"flex", alignItems:"center", gap:"3px" }}>
                              View <ChevronRight size={11} />
                            </Link>
                          </div>
                          {q.notes && <p style={{ fontSize:"11px", color:"var(--ink-3)", marginTop:"6px", fontStyle:"italic" }}>"{q.notes}"</p>}
                        </div>
                      </div>
                    );
                  }

                  if (event.kind === "invoice") {
                    const inv = event.obj;
                    const icon = inv.status === "paid" ? <CheckCircle size={15} color="rgba(180,220,180,0.7)" /> : inv.status === "partial" ? <Clock size={15} color="var(--amber)" /> : <AlertCircle size={15} color="rgba(255,130,80,0.7)" />;
                    return (
                      <div key={`i-${inv.id}`} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                        <div style={{ width:"38px", height:"38px", background:"var(--surface)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1 }}>
                          <CreditCard size={15} color="var(--ink-3)" strokeWidth={1.5} />
                        </div>
                        <div className="card" style={{ flex:1, padding:"14px 16px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", marginBottom:"6px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                              <span style={{ fontSize:"13px", fontWeight:"600" }}>Invoice</span>
                              {statusBadge(inv.status)}
                            </div>
                            <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>{inv.date}</span>
                          </div>
                          <div style={{ fontSize:"12px", color:"var(--ink-3)", marginBottom:"6px" }}>
                            Due {inv.dueDate}
                            {inv.paidAmount > 0 && inv.paidAmount < inv.total && ` · R${(inv.total - inv.paidAmount).toLocaleString("en-ZA")} outstanding`}
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div>
                              <span style={{ fontSize:"14px", fontWeight:"700" }}>{fmt(inv.total)}</span>
                              {inv.paidAmount > 0 && (
                                <span style={{ fontSize:"11px", color:"rgba(180,220,180,0.7)", marginLeft:"8px" }}>
                                  {fmt(inv.paidAmount)} paid
                                </span>
                              )}
                            </div>
                            <Link href="/dashboard/invoices" style={{ fontSize:"11px", color:"var(--ink-3)", textDecoration:"none", display:"flex", alignItems:"center", gap:"3px" }}>
                              View <ChevronRight size={11} />
                            </Link>
                          </div>
                          {/* Mini payment bar */}
                          {inv.total > 0 && (
                            <div style={{ marginTop:"8px", height:"3px", background:"var(--surface-3)", borderRadius:"2px", overflow:"hidden" }}>
                              <div style={{ height:"100%", width:`${Math.round((inv.paidAmount/inv.total)*100)}%`, background:"var(--green)", borderRadius:"2px" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (event.kind === "receipt") {
                    const r = event.obj;
                    return (
                      <div key={`r-${r.id}`} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                        <div style={{ width:"38px", height:"38px", background:"var(--surface)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1 }}>
                          <Receipt size={15} color="var(--green)" strokeWidth={1.5} />
                        </div>
                        <div className="card" style={{ flex:1, padding:"14px 16px", borderColor:"rgba(180,220,180,0.15)" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", marginBottom:"6px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                              <span style={{ fontSize:"13px", fontWeight:"600" }}>Payment received</span>
                              <span className="badge badge-green" style={{ fontSize:"10px" }}>{r.method}</span>
                            </div>
                            <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>{r.date}</span>
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div style={{ fontSize:"16px", fontWeight:"700", color:"var(--green-text)" }}>{fmt(r.amount)}</div>
                            {r.note && <span style={{ fontSize:"11px", color:"var(--ink-3)", fontStyle:"italic" }}>"{r.note}"</span>}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginTop:"20px", paddingTop:"16px", borderTop:"1px solid var(--border)" }}>
          <Link href="/dashboard/quotations" style={{ textDecoration:"none" }}>
            <button className="btn btn-secondary btn-sm" style={{ gap:"6px" }}>
              <FileText size={13} /> New Quote for {customer.name.split(" ")[0]}
            </button>
          </Link>
          <Link href="/dashboard/invoices" style={{ textDecoration:"none" }}>
            <button className="btn btn-secondary btn-sm" style={{ gap:"6px" }}>
              <CreditCard size={13} /> New Invoice
            </button>
          </Link>
          {customer.email && (
            <a href={`mailto:${customer.email}`} style={{ textDecoration:"none" }}>
              <button className="btn btn-ghost btn-sm" style={{ gap:"6px" }}>
                <Mail size={13} /> Email {customer.name.split(" ")[0]}
              </button>
            </a>
          )}
        </div>

      </div>
    </main>
  );
}
