"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { getDataForUser, invoices as seedInvoices, customers as allCustomers, Invoice, QuotationItem } from "@/lib/data";
import { Plus, Trash2, Printer, Send, X, Check, ChevronDown, Mail } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
type LineItem = { id: string; description: string; qty: number; unitPrice: number };
function uid() { return Math.random().toString(36).slice(2); }
function emptyLine(): LineItem { return { id: uid(), description: "", qty: 1, unitPrice: 0 }; }

function InvoiceForm({ customers, products, quotations, onSave, onCancel }: {
  customers: { id: string; name: string; email: string }[];
  products:  { id: string; name: string; price: number; unit: string }[];
  quotations: { id: string; customerName: string; customerId: string; items: QuotationItem[]; total: number }[];
  onSave: (inv: Omit<Invoice, "id" | "userId">) => void;
  onCancel: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const in30  = new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0];
  const [customerId, setCustomerId] = useState("");
  const [date,       setDate]       = useState(today);
  const [dueDate,    setDueDate]    = useState(in30);
  const [lines, setLines]           = useState<LineItem[]>([emptyLine()]);
  const [picker, setPicker]         = useState<string | null>(null);
  const [fromQuote, setFromQuote]   = useState("");

  const customer = customers.find(c => c.id === customerId);
  const total    = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

  function applyQuotation(qid: string) {
    const q = quotations.find(q => q.id === qid);
    if (!q) return;
    setFromQuote(qid); setCustomerId(q.customerId);
    setLines(q.items.map(it => ({ id: uid(), description: it.productName, qty: it.qty, unitPrice: it.unitPrice })));
  }
  function setLine(id: string, key: keyof LineItem, val: string | number) {
    setLines(ls => ls.map(l => l.id === id ? { ...l, [key]: val } : l));
  }
  function pickProd(lineId: string, p: { name: string; price: number }) {
    setLines(ls => ls.map(l => l.id === lineId ? { ...l, description: p.name, unitPrice: p.price } : l));
    setPicker(null);
  }
  function save() {
    if (!customerId) { alert("Select a customer."); return; }
    if (lines.some(l => !l.description.trim())) { alert("All items need a description."); return; }
    const items: QuotationItem[] = lines.map(l => ({ productId: "", productName: l.description, qty: l.qty, unitPrice: l.unitPrice }));
    onSave({ customerId, customerName: customer?.name || "", quotationId: fromQuote || undefined, items, total, status: "unpaid", date, dueDate, paidAmount: 0 });
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>New Invoice</h3>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><X size={18} /></button>
      </div>
      <div style={{ padding: "18px" }}>
        {quotations.length > 0 && (
          <div style={{ marginBottom: "18px", padding: "12px 14px", background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "6px" }}>
            <div className="label">Import from Quotation</div>
            <select className="input" value={fromQuote} onChange={e => applyQuotation(e.target.value)}>
              <option value="">Select a quotation…</option>
              {quotations.map(q => <option key={q.id} value={q.id}>{q.id.toUpperCase()} — {q.customerName} · {fmt(q.total)}</option>)}
            </select>
          </div>
        )}
        <div className="form-row-3">
          <div><label className="label">Customer *</label>
            <select className="input" value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="label">Invoice Date</label>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div><label className="label">Due Date</label>
            <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
        </div>

        {/* Line items */}
        <div className="section-label" style={{ marginBottom: "10px", marginTop: "4px" }}>Line Items</div>
        {lines.map(line => (
          <div key={line.id} className="line-item-row">
            <div style={{ position: "relative", gridColumn: "1 / -1" }}>
              <input className="input" value={line.description} onChange={e => setLine(line.id, "description", e.target.value)}
                placeholder="Item description…" style={{ paddingRight: "36px" }} />
              <button onClick={() => setPicker(picker === line.id ? null : line.id)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}>
                <ChevronDown size={14} />
              </button>
              {picker === line.id && (
                <div style={{ position: "absolute", top: "calc(100%+3px)", left: 0, right: 0, background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "6px", zIndex: 30, maxHeight: "200px", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                  {products.length === 0 ? <div style={{ padding: "12px", fontSize: "12px", color: "var(--text-3)" }}>No products saved.</div>
                    : products.map(p => (
                      <div key={p.id} onClick={() => pickProd(line.id, p)}
                        style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-4)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <span style={{ fontSize: "13px" }}>{p.name}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-3)" }}>R {p.price} / {p.unit}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="line-item-meta">
              <input type="number" className="input" min="1" value={line.qty} onChange={e => setLine(line.id, "qty", parseFloat(e.target.value) || 1)} placeholder="Qty" style={{ textAlign: "right" }} />
              <input type="number" className="input" min="0" step="0.01" value={line.unitPrice || ""} onChange={e => setLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)} placeholder="Unit price" style={{ textAlign: "right" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{fmt(line.qty * line.unitPrice)}</span>
              <button onClick={() => setLines(ls => ls.filter(l => l.id !== line.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "4px" }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        <button onClick={() => setLines(ls => [...ls, emptyLine()])} className="btn btn-ghost btn-sm" style={{ marginTop: "6px" }}>
          <Plus size={13} /> Add item
        </button>

        <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
          <div style={{ background: "var(--bg-3)", border: "1px solid var(--border-2)", padding: "12px 18px", borderRadius: "6px", display: "flex", gap: "16px", alignItems: "center" }}>
            <span className="section-label">Total</span>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--white)" }}>{fmt(total)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button onClick={save} className="btn btn-primary"><Check size={14} /> Create Invoice</button>
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const { user } = useAuth();
  if (!user) return null;
  const { customers, products, quotations } = getDataForUser(user.id);
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices.filter(i => i.userId === user.id));
  const [showNew,  setShowNew]  = useState(false);
  const [viewId,   setViewId]   = useState<string | null>(null);
  const [sending,  setSending]  = useState<string | null>(null);
  const [sent,     setSent]     = useState<Set<string>>(new Set());

  function handleCreate(data: Omit<Invoice, "id" | "userId">) {
    setInvoices(ivs => [{ ...data, id: "inv" + Date.now(), userId: user!.id }, ...ivs]);
    setShowNew(false);
  }
  function sendInvoice(inv: Invoice) {
    const cust    = customers.find(c => c.id === inv.customerId) || allCustomers.find(c => c.id === inv.customerId);
    const email   = cust?.email || "";
    const biz     = user!.business;
    const subject = encodeURIComponent(`Invoice ${inv.id.toUpperCase()} from ${biz?.name}`);
    const body    = encodeURIComponent(`Dear ${inv.customerName},\n\nInvoice: ${inv.id.toUpperCase()}\nDate: ${inv.date}\nDue: ${inv.dueDate}\n\nItems:\n${inv.items.map(it => `- ${it.productName} x${it.qty} @ ${fmt(it.unitPrice)} = ${fmt(it.qty * it.unitPrice)}`).join("\n")}\n\nTotal: ${fmt(inv.total)}\n\nRegards,\n${biz?.name}\n${user!.email}`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    setSent(s => new Set(s).add(inv.id));
    setSending(null);
  }

  const business = user!.business;
  const viewInv  = invoices.find(i => i.id === viewId);
  const sBadge   = (s: string) => s === "paid" ? "badge-green" : s === "partial" ? "badge-yellow" : "badge-red";
  const totInv   = invoices.reduce((s,i) => s + i.total, 0);
  const totPaid  = invoices.reduce((s,i) => s + i.paidAmount, 0);

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div>
            <h1 style={{ marginBottom: "4px" }}>Invoices</h1>
            <p style={{ color: "var(--text-3)", fontSize: "13px" }}>{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</p>
          </div>
          {!showNew && (
            <button onClick={() => setShowNew(true)} className="btn btn-primary"><Plus size={14} /> New Invoice</button>
          )}
        </div>

        <div className="kpi-row" style={{ marginBottom: "20px" }}>
          {[
            { label: "Total Invoiced", value: fmt(totInv) },
            { label: "Collected",      value: fmt(totPaid) },
            { label: "Outstanding",    value: fmt(totInv - totPaid) },
            { label: "Count",          value: String(invoices.length) },
          ].map(({ label, value }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom: "5px" }}>{label}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--white)" }}>{value}</div>
            </div>
          ))}
        </div>

        {showNew && <div style={{ marginBottom: "20px" }}><InvoiceForm customers={customers} products={products} quotations={quotations} onSave={handleCreate} onCancel={() => setShowNew(false)} /></div>}

        {invoices.length === 0 && !showNew ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--text-3)", marginBottom: "14px" }}>No invoices yet.</p>
            <button onClick={() => setShowNew(true)} className="btn btn-primary">Create First Invoice</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {invoices.map(inv => {
              const cust    = customers.find(c => c.id === inv.customerId) || allCustomers.find(c => c.id === inv.customerId);
              const hasSent = sent.has(inv.id);
              const overdue = inv.status !== "paid" && new Date(inv.dueDate) < new Date();
              return (
                <div key={inv.id} className="card" style={{ border: overdue ? "1px solid rgba(255,80,80,0.3)" : undefined, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{inv.customerName}</span>
                          <span className={`badge ${sBadge(inv.status)}`}>{inv.status}</span>
                          {overdue  && <span style={{ fontSize: "10px", color: "#ff5555", fontWeight: "700", textTransform: "uppercase" }}>OVERDUE</span>}
                          {hasSent  && <span style={{ fontSize: "10px", color: "var(--text-3)", fontWeight: "600" }}>✓ Sent</span>}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-3)" }}>
                          {inv.id.toUpperCase()} · {inv.date} → Due {inv.dueDate}
                          {cust?.email && <span> · {cust.email}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "2px" }}>{fmt(inv.total)}</div>
                        {inv.paidAmount > 0 && inv.status !== "paid" && <div style={{ fontSize: "11px", color: "var(--text-3)" }}>Paid: {fmt(inv.paidAmount)}</div>}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                      <button onClick={() => setViewId(inv.id)} className="btn btn-ghost btn-sm">View / Print</button>
                      {sending === inv.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "6px", flexWrap: "wrap" }}>
                          <Mail size={12} color="var(--text-3)" />
                          <span style={{ fontSize: "12px", color: "var(--text-2)" }}>Send to {cust?.email || "client"}?</span>
                          <button onClick={() => sendInvoice(inv)} className="btn btn-primary btn-sm">Confirm</button>
                          <button onClick={() => setSending(null)} className="btn btn-ghost btn-sm"><X size={12} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setSending(inv.id)} className="btn btn-secondary btn-sm">
                          <Send size={12} /> {hasSent ? "Resend" : "Send to Client"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View/Print modal */}
        {viewId && viewInv && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "var(--bg-2)", borderRadius: "8px", width: "100%", maxWidth: "760px", marginTop: "8px" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600" }}>Invoice {viewInv.id.toUpperCase()}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setSending(viewId); setViewId(null); }} className="btn btn-secondary btn-sm"><Send size={12} /> Send</button>
                  <button onClick={() => window.print()} className="btn btn-primary btn-sm"><Printer size={12} /> Print</button>
                  <button onClick={() => setViewId(null)} className="btn btn-ghost btn-sm"><X size={14} /></button>
                </div>
              </div>
              {/* Printable doc */}
              <div id="inv-print" className="print-target" style={{ padding: "40px", background: "#fff", color: "#000", fontFamily: "Inter, sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingBottom: "20px", borderBottom: "2px solid #000", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.03em", marginBottom: "3px" }}>{business?.name}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{business?.location} · {business?.phone}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{user!.email}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: "700" }}>INVOICE</div>
                    <div style={{ fontSize: "12px", color: "#444", marginTop: "3px" }}>No: {viewInv.id.toUpperCase()}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>Date: {viewInv.date} · Due: {viewInv.dueDate}</div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>Bill To</div>
                  <div style={{ fontSize: "15px", fontWeight: "700" }}>{viewInv.customerName}</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #000" }}>
                      {["Description", "Qty", "Unit Price", "Amount"].map((h, i) => (
                        <th key={h} style={{ textAlign: i > 0 ? "right" : "left", padding: "7px 0", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewInv.items.map((it, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
                        <td style={{ padding: "9px 0" }}>{it.productName}</td>
                        <td style={{ padding: "9px 0", textAlign: "right", color: "#555" }}>{it.qty}</td>
                        <td style={{ padding: "9px 0", textAlign: "right", color: "#555" }}>{fmt(it.unitPrice)}</td>
                        <td style={{ padding: "9px 0", textAlign: "right", fontWeight: "600" }}>{fmt(it.qty * it.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ padding: "12px 0 0", textAlign: "right", fontWeight: "700", borderTop: "2px solid #000" }}>TOTAL DUE</td>
                      <td style={{ padding: "12px 0 0", textAlign: "right", fontWeight: "800", fontSize: "18px", borderTop: "2px solid #000" }}>{fmt(viewInv.total)}</td>
                    </tr>
                  </tfoot>
                </table>
                <div style={{ marginTop: "32px", paddingTop: "12px", borderTop: "1px solid #e0e0e0", textAlign: "center", fontSize: "10px", color: "#aaa" }}>
                  Generated by KasiTrade · {business?.name}
                </div>
              </div>
            </div>
            <style>{`@media print{body *{visibility:hidden}#inv-print,#inv-print *{visibility:visible}#inv-print{position:fixed;left:0;top:0;width:100%;padding:32px}}`}</style>
          </div>
        )}
      </div>
    </main>
  );
}
