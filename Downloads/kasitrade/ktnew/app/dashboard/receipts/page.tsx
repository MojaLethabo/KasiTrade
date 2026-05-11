"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getDataForUser,
  receipts as seedReceipts,
  Receipt,
} from "@/lib/data";
import { Plus, X, Check, Printer, Download } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
function fmtFull(n: number) {
  return "R " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PAYMENT_METHODS = ["Cash", "EFT", "SnapScan", "Card", "PayFast", "Zapper", "Other"];

export default function ReceiptsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const { invoices, customers } = getDataForUser(user.id);
  const [receipts, setReceipts] = useState<Receipt[]>(
    seedReceipts.filter(r => r.userId === user.id)
  );

  const [showForm, setShowForm]   = useState(false);
  const [printId, setPrintId]     = useState<string | null>(null);

  // Form state
  const [invoiceId,    setInvoiceId]    = useState("");
  const [customerId,   setCustomerId]   = useState("");
  const [amount,       setAmount]       = useState("");
  const [method,       setMethod]       = useState("EFT");
  const [date,         setDate]         = useState(new Date().toISOString().split("T")[0]);
  const [note,         setNote]         = useState("");
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  const total = receipts.reduce((s, r) => s + r.amount, 0);
  const printReceipt = receipts.find(r => r.id === printId);

  // When an invoice is selected, pre-fill customer + outstanding amount
  function handleInvoiceChange(id: string) {
    setInvoiceId(id);
    setErrors({});
    if (!id) { setCustomerId(""); setAmount(""); return; }
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    setCustomerId(inv.customerId);
    const outstanding = inv.total - inv.paidAmount;
    setAmount(outstanding > 0 ? String(outstanding) : "");
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!customerId && !invoiceId) e.customer = "Select a customer or invoice";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter a valid amount";
    if (!date) e.date = "Pick a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const inv     = invoiceId ? invoices.find(i => i.id === invoiceId) : null;
    const cust    = customers.find(c => c.id === (customerId || inv?.customerId));
    const newReceipt: Receipt = {
      id:           "r" + Date.now(),
      userId:       user!.id,
      invoiceId:    invoiceId || "",
      customerName: cust?.name || inv?.customerName || "Unknown",
      amount:       parseFloat(amount),
      method,
      date,
      note,
    };

    setReceipts(rs => [newReceipt, ...rs]);
    // Reset
    setShowForm(false);
    setInvoiceId(""); setCustomerId(""); setAmount("");
    setMethod("EFT"); setDate(new Date().toISOString().split("T")[0]);
    setNote(""); setErrors({});
    // Show the print modal automatically
    setPrintId(newReceipt.id);
  }

  function handleCancel() {
    setShowForm(false);
    setInvoiceId(""); setCustomerId(""); setAmount("");
    setMethod("EFT"); setDate(new Date().toISOString().split("T")[0]);
    setNote(""); setErrors({});
  }

  // Unpaid / partially paid invoices for selection
  const openInvoices = invoices.filter(i => i.status !== "paid");

  const business = user.business;

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <h1 style={{ marginBottom: "4px" }}>Receipts & Payments</h1>
            <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>
              {receipts.length} payment{receipts.length !== 1 ? "s" : ""} recorded ·{" "}
              Total collected: <strong style={{ color: "var(--ink)" }}>{fmt(total)}</strong>
            </p>
          </div>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={14} /> Record Payment
            </button>
          )}
        </div>

        {/* ── Capture Form ── */}
        {showForm && (
          <div className="card" style={{ overflow: "hidden", marginBottom: "20px" }}>
            {/* Form header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Record a Payment</h3>
              <button onClick={handleCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: "4px" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Step hint */}
              <div style={{ marginBottom: "18px", padding: "10px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", color: "var(--ink-3)", lineHeight: "1.5" }}>
                Link to an open invoice (recommended) to automatically track payment against it — or record a standalone payment without an invoice.
              </div>

              <div className="grid-2" style={{ marginBottom: "16px" }}>
                {/* Left column */}
                <div style={{ display: "grid", gap: "14px" }}>

                  {/* Invoice picker */}
                  <div>
                    <label className="label">Link to Invoice (optional)</label>
                    <select
                      className="input"
                      value={invoiceId}
                      onChange={e => handleInvoiceChange(e.target.value)}
                    >
                      <option value="">— No invoice / standalone —</option>
                      {openInvoices.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.id.toUpperCase()} · {inv.customerName} · {fmt(inv.total - inv.paidAmount)} outstanding
                        </option>
                      ))}
                    </select>
                    {openInvoices.length === 0 && (
                      <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "5px" }}>No open invoices. All invoices are paid.</p>
                    )}
                  </div>

                  {/* Customer (auto-filled or manual) */}
                  <div>
                    <label className="label">
                      Customer {invoiceId ? <span style={{ fontWeight: "400", textTransform: "none", letterSpacing: 0 }}>(from invoice)</span> : "*"}
                    </label>
                    {invoiceId ? (
                      <div className="input" style={{ color: "var(--ink-2)", cursor: "not-allowed", opacity: 0.7 }}>
                        {customers.find(c => c.id === customerId)?.name || invoices.find(i => i.id === invoiceId)?.customerName || "—"}
                      </div>
                    ) : (
                      <select
                        className="input"
                        value={customerId}
                        onChange={e => { setCustomerId(e.target.value); setErrors(er => ({ ...er, customer: "" })); }}
                        style={{ borderColor: errors.customer ? "rgba(255,80,80,0.6)" : undefined }}
                      >
                        <option value="">Select customer…</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    )}
                    {errors.customer && <p style={{ fontSize: "11px", color: "#ff8080", marginTop: "4px" }}>{errors.customer}</p>}
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className="label">Payment Method *</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {PAYMENT_METHODS.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMethod(m)}
                          className={method === m ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
                          style={{ minHeight: "34px" }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ display: "grid", gap: "14px", alignContent: "start" }}>

                  {/* Amount */}
                  <div>
                    <label className="label">Amount Received (R) *</label>
                    <input
                      className="input"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => { setAmount(e.target.value); setErrors(er => ({ ...er, amount: "" })); }}
                      style={{ fontSize: "20px", fontWeight: "700", borderColor: errors.amount ? "rgba(255,80,80,0.6)" : undefined }}
                    />
                    {errors.amount && <p style={{ fontSize: "11px", color: "#ff8080", marginTop: "4px" }}>{errors.amount}</p>}
                    {invoiceId && (() => {
                      const inv = invoices.find(i => i.id === invoiceId);
                      if (!inv) return null;
                      const out = inv.total - inv.paidAmount;
                      const entered = parseFloat(amount) || 0;
                      if (entered > out) return <p style={{ fontSize: "11px", color: "var(--amber-text)", marginTop: "4px" }}>Amount exceeds outstanding balance of {fmt(out)}</p>;
                      if (entered > 0 && entered < out) return <p style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px" }}>Partial payment · {fmt(out - entered)} will remain outstanding</p>;
                      if (entered === out) return <p style={{ fontSize: "11px", color: "var(--green-text)", marginTop: "4px" }}>Full payment — invoice will be marked paid</p>;
                      return null;
                    })()}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="label">Payment Date *</label>
                    <input
                      className="input"
                      type="date"
                      value={date}
                      onChange={e => { setDate(e.target.value); setErrors(er => ({ ...er, date: "" })); }}
                      style={{ borderColor: errors.date ? "rgba(255,80,80,0.6)" : undefined }}
                    />
                    {errors.date && <p style={{ fontSize: "11px", color: "#ff8080", marginTop: "4px" }}>{errors.date}</p>}
                  </div>

                  {/* Note */}
                  <div>
                    <label className="label">Note / Reference (optional)</label>
                    <input
                      className="input"
                      placeholder="e.g. deposit, ref #123456, thank you"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <button className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  <Check size={14} /> Record Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Receipts table ── */}
        {receipts.length === 0 ? (
          <div className="card" style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ color: "var(--ink-3)", marginBottom: "14px" }}>No payments recorded yet.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={14} /> Record First Payment
            </button>
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: "560px" }}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Invoice</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Note</th>
                    <th style={{ textAlign: "center" }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: "500" }}>{r.customerName}</td>
                      <td style={{ fontSize: "11px", color: "var(--ink-3)", fontFamily: "monospace" }}>
                        {r.invoiceId ? r.invoiceId.toUpperCase() : <span style={{ color: "var(--ink-3)" }}>—</span>}
                      </td>
                      <td>
                        <span className="badge badge-white" style={{ fontSize: "10px" }}>{r.method}</span>
                      </td>
                      <td style={{ color: "var(--ink-3)", fontSize: "12px" }}>{r.date}</td>
                      <td style={{ textAlign: "right", fontWeight: "700", fontSize: "14px" }}>{fmt(r.amount)}</td>
                      <td style={{ color: "var(--ink-3)", fontSize: "12px" }}>{r.note || "—"}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => setPrintId(r.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "5px 10px" }}
                          title="Print receipt"
                        >
                          <Printer size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Print / PDF Receipt Modal ── */}
        {printId && printReceipt && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px", overflowY: "auto" }}>
            <div style={{ background: "var(--surface)", borderRadius: "8px", width: "100%", maxWidth: "680px", marginTop: "8px" }}>
              {/* Modal header */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", fontSize: "14px" }}>Payment Receipt</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                    <Printer size={12} /> Print / PDF
                  </button>
                  <button onClick={() => setPrintId(null)} className="btn btn-ghost btn-sm">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* ── Printable receipt document ── */}
              <div
                id="receipt-print"
                className="print-target"
                style={{ padding: "40px 48px", background: "#fff", color: "#000", fontFamily: "Inter, sans-serif" }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingBottom: "20px", borderBottom: "2px solid #000", marginBottom: "28px" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.03em", marginBottom: "3px" }}>
                      {business?.name || "Business Name"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{business?.location}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{business?.phone}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{user.email}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em" }}>RECEIPT</div>
                    <div style={{ fontSize: "12px", color: "#444", marginTop: "3px" }}>No: {printReceipt.id.toUpperCase()}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>Date: {printReceipt.date}</div>
                  </div>
                </div>

                {/* Received from */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px", padding: "16px 20px", background: "#f8f8f8", borderRadius: "4px" }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Received from</div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>{printReceipt.customerName}</div>
                  </div>
                  {printReceipt.invoiceId && (
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>For Invoice</div>
                      <div style={{ fontSize: "14px", fontWeight: "600", fontFamily: "monospace" }}>{printReceipt.invoiceId.toUpperCase()}</div>
                    </div>
                  )}
                </div>

                {/* Payment details */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #000" }}>
                      <th style={{ textAlign: "left", padding: "8px 0", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</th>
                      <th style={{ textAlign: "right", padding: "8px 0", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "12px 0", fontSize: "14px" }}>
                        Payment received
                        {printReceipt.invoiceId && <span style={{ color: "#666", fontSize: "12px" }}> — Invoice {printReceipt.invoiceId.toUpperCase()}</span>}
                      </td>
                      <td style={{ padding: "12px 0", textAlign: "right", fontSize: "14px" }}>{fmtFull(printReceipt.amount)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ padding: "14px 0 0", textAlign: "right", fontWeight: "700", borderTop: "2px solid #000", fontSize: "14px" }}>Total Received</td>
                      <td style={{ padding: "14px 0 0", textAlign: "right", fontWeight: "800", fontSize: "22px", borderTop: "2px solid #000" }}>{fmtFull(printReceipt.amount)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Payment method + note */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
                  <div style={{ padding: "12px 16px", background: "#f8f8f8", borderRadius: "4px" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Payment method</div>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{printReceipt.method}</div>
                  </div>
                  {printReceipt.note && (
                    <div style={{ padding: "12px 16px", background: "#f8f8f8", borderRadius: "4px" }}>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Reference / Note</div>
                      <div style={{ fontSize: "14px" }}>{printReceipt.note}</div>
                    </div>
                  )}
                </div>

                {/* Thank you + signature */}
                <div style={{ textAlign: "center", marginBottom: "32px", padding: "16px", border: "1px solid #000", borderRadius: "4px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>Thank you for your payment</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>This receipt serves as proof of payment received.</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                  {["Issued by", "Received by"].map(label => (
                    <div key={label}>
                      <div style={{ borderBottom: "1px solid #000", marginBottom: "7px", paddingBottom: "28px" }} />
                      <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Inter, sans-serif" }}>{label}</div>
                      <div style={{ fontSize: "10px", color: "#999", marginTop: "3px", fontFamily: "Inter, sans-serif" }}>Date: ___________________________</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "32px", paddingTop: "12px", borderTop: "1px solid #e0e0e0", textAlign: "center", fontSize: "10px", color: "#bbb", fontFamily: "Inter, sans-serif" }}>
                  Generated by KasiTrade Business Platform · {business?.name} · {printReceipt.date}
                </div>
              </div>
            </div>
            <style>{`@media print{body *{visibility:hidden}#receipt-print,#receipt-print *{visibility:visible}#receipt-print{position:fixed;left:0;top:0;width:100%;padding:32px}}`}</style>
          </div>
        )}

      </div>
    </main>
  );
}
