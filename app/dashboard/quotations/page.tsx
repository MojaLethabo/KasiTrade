"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { getDataForUser, quotations as seedQuotations, Quotation, QuotationItem } from "@/lib/data";
import { Plus, Trash2, Pencil, Printer, X, Check, ChevronDown } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
type LineItem = { id: string; description: string; qty: number; unitPrice: number };
function uid() { return Math.random().toString(36).slice(2); }
function emptyLine(): LineItem { return { id: uid(), description: "", qty: 1, unitPrice: 0 }; }

function QuoteForm({ initial, customers, products, onSave, onCancel }: {
  initial?: Quotation;
  customers: { id: string; name: string; email: string }[];
  products:  { id: string; name: string; price: number; unit: string }[];
  onSave: (q: Omit<Quotation, "id" | "userId">) => void;
  onCancel: () => void;
}) {
  const today  = new Date().toISOString().split("T")[0];
  const inFour = new Date(Date.now() + 28 * 864e5).toISOString().split("T")[0];
  const [customerId, setCustomerId] = useState(initial?.customerId || "");
  const [date,  setDate]  = useState(initial?.date || today);
  const [valid, setValid] = useState(initial?.validUntil || inFour);
  const [notes, setNotes] = useState(initial?.notes || "");
  const [lines, setLines] = useState<LineItem[]>(
    initial?.items?.map(it => ({ id: uid(), description: it.productName, qty: it.qty, unitPrice: it.unitPrice })) || [emptyLine()]
  );
  const [picker, setPicker] = useState<string | null>(null);
  const customer = customers.find(c => c.id === customerId);
  const total    = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

  function set(id: string, key: keyof LineItem, val: string | number) {
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
    onSave({ customerId, customerName: customer?.name || "", items, total, status: initial?.status || "draft", date, validUntil: valid, notes });
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>{initial ? "Edit Quotation" : "New Quotation"}</h3>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><X size={18} /></button>
      </div>
      <div style={{ padding: "18px" }}>
        <div className="form-row-3">
          <div><label className="label">Customer *</label>
            <select className="input" value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div><label className="label">Valid Until</label>
            <input type="date" className="input" value={valid} onChange={e => setValid(e.target.value)} />
          </div>
        </div>

        <div className="section-label" style={{ marginBottom: "10px", marginTop: "4px" }}>Line Items</div>
        {lines.map(line => (
          <div key={line.id} className="line-item-row">
            <div style={{ position: "relative", gridColumn: "1 / -1" }}>
              <input className="input" value={line.description} onChange={e => set(line.id, "description", e.target.value)}
                placeholder="Item description or pick ↓" style={{ paddingRight: "36px" }} />
              <button onClick={() => setPicker(picker === line.id ? null : line.id)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}>
                <ChevronDown size={14} />
              </button>
              {picker === line.id && (
                <div style={{ position: "absolute", top: "calc(100%+3px)", left: 0, right: 0, background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "6px", zIndex: 30, maxHeight: "200px", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  {products.length === 0 ? <div style={{ padding: "12px", fontSize: "12px", color: "var(--text-3)" }}>No products saved.</div>
                    : products.map(p => (
                      <div key={p.id} onClick={() => pickProd(line.id, p)}
                        style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-4)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <span style={{ fontSize: "13px" }}>{p.name}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-3)" }}>R {p.price}/{p.unit}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="line-item-meta">
              <input type="number" className="input" min="1" value={line.qty} onChange={e => set(line.id, "qty", parseFloat(e.target.value)||1)} placeholder="Qty" style={{ textAlign: "right" }} />
              <input type="number" className="input" min="0" step="0.01" value={line.unitPrice||""} onChange={e => set(line.id, "unitPrice", parseFloat(e.target.value)||0)} placeholder="Unit price" style={{ textAlign: "right" }} />
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

        <div style={{ marginBottom: "16px" }}>
          <label className="label">Notes (optional)</label>
          <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, delivery notes…" />
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button onClick={save} className="btn btn-primary"><Check size={14} /> {initial ? "Save Changes" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

export default function QuotationsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const { customers, products } = getDataForUser(user.id);
  const [quotes,  setQuotes]  = useState<Quotation[]>(seedQuotations.filter(q => q.userId === user.id));
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [printId, setPrintId] = useState<string | null>(null);

  function handleCreate(data: Omit<Quotation, "id" | "userId">) {
    setQuotes(qs => [{ ...data, id: "q" + Date.now(), userId: user!.id }, ...qs]);
    setShowNew(false);
  }
  function handleEdit(id: string, data: Omit<Quotation, "id" | "userId">) {
    setQuotes(qs => qs.map(q => q.id === id ? { ...q, ...data } : q));
    setEditing(null);
  }
  function del(id: string) {
    if (window.confirm("Delete this quotation?")) setQuotes(qs => qs.filter(q => q.id !== id));
  }

  const business = user!.business;
  const printQ   = quotes.find(q => q.id === printId);
  const sBadge   = (s: string) => s === "accepted" ? "badge-green" : s === "converted" ? "badge-purple" : s === "sent" ? "badge-blue" : s === "declined" ? "badge-red" : "badge-yellow";

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div>
            <h1 style={{ marginBottom: "4px" }}>Quotations</h1>
            <p style={{ color: "var(--text-3)", fontSize: "13px" }}>{quotes.length} quotation{quotes.length !== 1 ? "s" : ""}</p>
          </div>
          {!showNew && !editing && (
            <button onClick={() => setShowNew(true)} className="btn btn-primary"><Plus size={14} /> New Quotation</button>
          )}
        </div>

        {showNew  && <div style={{ marginBottom: "20px" }}><QuoteForm customers={customers} products={products} onSave={handleCreate} onCancel={() => setShowNew(false)} /></div>}
        {editing  && (
          <div style={{ marginBottom: "20px" }}>
            {(() => { const q = quotes.find(q => q.id === editing); return q ? <QuoteForm initial={q} customers={customers} products={products} onSave={d => handleEdit(editing, d)} onCancel={() => setEditing(null)} /> : null; })()}
          </div>
        )}

        {quotes.length === 0 && !showNew ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--text-3)", marginBottom: "14px" }}>No quotations yet.</p>
            <button onClick={() => setShowNew(true)} className="btn btn-primary">Create First Quotation</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {quotes.map(q => (
              <div key={q.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "3px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>{q.customerName}</span>
                        <span className={`badge ${sBadge(q.status)}`}>{q.status}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{q.id.toUpperCase()} · {q.date} → {q.validUntil}</div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                      <span style={{ fontSize: "16px", fontWeight: "700" }}>{fmt(q.total)}</span>
                      <button onClick={() => { setEditing(q.id); setShowNew(false); }} className="btn btn-ghost btn-sm"><Pencil size={12} /> Edit</button>
                      <button onClick={() => setPrintId(q.id)} className="btn btn-secondary btn-sm"><Printer size={12} /> Print</button>
                      <button onClick={() => del(q.id)} className="btn btn-danger btn-sm"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "420px" }}>
                    <thead>
                      <tr>
                        {["Item", "Qty", "Unit", "Subtotal"].map((h, i) => (
                          <th key={h} style={{ textAlign: i > 0 ? "right" : "left", padding: "8px 18px", fontSize: "10px", fontWeight: "700", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border)", background: "var(--bg-3)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {q.items.map((it, i) => (
                        <tr key={i} style={{ borderBottom: i < q.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                          <td style={{ padding: "10px 18px" }}>{it.productName}</td>
                          <td style={{ padding: "10px 18px", textAlign: "right", color: "var(--text-2)" }}>{it.qty}</td>
                          <td style={{ padding: "10px 18px", textAlign: "right", color: "var(--text-2)" }}>{fmt(it.unitPrice)}</td>
                          <td style={{ padding: "10px 18px", textAlign: "right", fontWeight: "600" }}>{fmt(it.qty * it.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {q.notes && <div style={{ padding: "10px 18px", background: "var(--bg-3)", borderTop: "1px solid var(--border)", fontSize: "12px", color: "var(--text-3)", fontStyle: "italic" }}>{q.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Print modal */}
        {printId && printQ && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "var(--bg-2)", borderRadius: "8px", width: "100%", maxWidth: "760px", marginTop: "8px" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600" }}>Print Quotation</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => window.print()} className="btn btn-primary btn-sm"><Printer size={12} /> Print/PDF</button>
                  <button onClick={() => setPrintId(null)} className="btn btn-ghost btn-sm"><X size={14} /></button>
                </div>
              </div>
              <div id="quote-print" className="print-target" style={{ padding: "40px", background: "#fff", color: "#000", fontFamily: "Inter, sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingBottom: "20px", borderBottom: "2px solid #000", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.03em", marginBottom: "3px" }}>{business?.name}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{business?.location} · {business?.phone}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: "700" }}>QUOTATION</div>
                    <div style={{ fontSize: "11px", color: "#444", marginTop: "3px" }}>Ref: {printQ.id.toUpperCase()}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>Date: {printQ.date} · Valid: {printQ.validUntil}</div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>Prepared For</div>
                  <div style={{ fontSize: "15px", fontWeight: "700" }}>{printQ.customerName}</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #000" }}>
                      {["Description","Qty","Unit Price","Amount"].map((h,i) => (
                        <th key={h} style={{ textAlign: i>0?"right":"left", padding: "7px 0", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {printQ.items.map((it,i) => (
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
                      <td colSpan={3} style={{ padding: "12px 0 0", textAlign: "right", fontWeight: "700", borderTop: "2px solid #000" }}>TOTAL</td>
                      <td style={{ padding: "12px 0 0", textAlign: "right", fontWeight: "800", fontSize: "18px", borderTop: "2px solid #000" }}>{fmt(printQ.total)}</td>
                    </tr>
                  </tfoot>
                </table>
                {printQ.notes && <div style={{ padding: "10px 12px", background: "#f8f8f8", fontSize: "12px", color: "#444", marginBottom: "16px" }}><strong>Notes: </strong>{printQ.notes}</div>}
                <div style={{ marginTop: "32px", paddingTop: "12px", borderTop: "1px solid #e0e0e0", textAlign: "center", fontSize: "10px", color: "#bbb" }}>
                  Valid until {printQ.validUntil} · Generated by KasiTrade · {business?.name}
                </div>
              </div>
            </div>
            <style>{`@media print{body *{visibility:hidden}#quote-print,#quote-print *{visibility:visible}#quote-print{position:fixed;left:0;top:0;width:100%;padding:32px}}`}</style>
          </div>
        )}
      </div>
    </main>
  );
}
