"use client";
import { useAuth } from "@/lib/auth";
import { getDataForUser } from "@/lib/data";
import { Plus } from "lucide-react";
function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
export default function ExpensesPage() {
  const { user } = useAuth();
  if (!user) return null;
  const { expenses } = getDataForUser(user.id);
  const total = expenses.reduce((s,e) => s + e.amount, 0);
  const byCategory: Record<string,number> = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + e.amount; });
  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div><h1 style={{ marginBottom:"4px" }}>Expenses</h1>
            <p style={{ color:"var(--text-3)", fontSize:"13px" }}>{expenses.length} expenses · Total: <strong style={{ color:"var(--white)" }}>{fmt(total)}</strong></p>
          </div>
          <button className="btn btn-primary"><Plus size={14} /> Add Expense</button>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"1px", background:"var(--border)", borderRadius:"6px", overflow:"hidden", marginBottom:"20px" }}>
          {Object.entries(byCategory).map(([cat,amt]) => (
            <div key={cat} style={{ background:"var(--bg-2)", padding:"14px 18px", minWidth:"130px", flex:"1" }}>
              <div className="section-label" style={{ marginBottom:"5px" }}>{cat}</div>
              <div style={{ fontSize:"16px", fontWeight:"700", color:"var(--white)" }}>{fmt(amt)}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table className="tbl" style={{ minWidth:"400px" }}>
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style={{ textAlign:"right" }}>Amount</th></tr></thead>
              <tbody>
                {[...expenses].reverse().map(exp => (
                  <tr key={exp.id}>
                    <td style={{ color:"var(--text-3)", fontSize:"12px", whiteSpace:"nowrap" }}>{exp.date}</td>
                    <td><span className="badge badge-blue" style={{ fontSize:"10px" }}>{exp.category}</span></td>
                    <td style={{ fontWeight:"500" }}>{exp.description}</td>
                    <td style={{ textAlign:"right", fontWeight:"600" }}>{fmt(exp.amount)}</td>
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
