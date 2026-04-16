"use client";
import { useAuth } from "@/lib/auth";
import { getDataForUser } from "@/lib/data";
import { Plus } from "lucide-react";
function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
export default function ReceiptsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const { receipts } = getDataForUser(user.id);
  const total = receipts.reduce((s,r) => s + r.amount, 0);
  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div><h1 style={{ marginBottom:"4px" }}>Receipts & Payments</h1>
            <p style={{ color:"var(--text-3)", fontSize:"13px" }}>{receipts.length} payments · Total: <strong style={{ color:"var(--white)" }}>{fmt(total)}</strong></p>
          </div>
          <button className="btn btn-primary"><Plus size={14} /> Record Payment</button>
        </div>
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table className="tbl" style={{ minWidth:"480px" }}>
              <thead><tr><th>Customer</th><th>Method</th><th>Date</th><th style={{ textAlign:"right" }}>Amount</th><th>Note</th></tr></thead>
              <tbody>
                {receipts.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight:"500" }}>{r.customerName}</td>
                    <td><span className="badge badge-white" style={{ fontSize:"10px" }}>{r.method}</span></td>
                    <td style={{ color:"var(--text-3)", fontSize:"12px" }}>{r.date}</td>
                    <td style={{ textAlign:"right", fontWeight:"600" }}>{fmt(r.amount)}</td>
                    <td style={{ color:"var(--text-3)", fontSize:"12px" }}>{r.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
