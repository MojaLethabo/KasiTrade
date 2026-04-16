"use client";
import { useAuth } from "@/lib/auth";
import { getDataForUser } from "@/lib/data";
import { Plus, Mail, Phone, MapPin } from "lucide-react";
function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
export default function CustomersPage() {
  const { user } = useAuth();
  if (!user) return null;
  const { customers, invoices } = getDataForUser(user.id);
  const getPaid = (cid: string) => invoices.filter(i => i.customerId===cid && i.status==="paid").reduce((s,i) => s+i.total, 0);
  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div><h1 style={{ marginBottom:"4px" }}>Customers</h1>
            <p style={{ color:"var(--text-3)", fontSize:"13px" }}>{customers.length} customers</p>
          </div>
          <button className="btn btn-primary"><Plus size={14} /> Add Customer</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:"12px" }}>
          {customers.map(c => {
            const paid = getPaid(c.id);
            return (
              <div key={c.id} className="card" style={{ padding:"18px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"12px" }}>
                  <div style={{ width:"38px", height:"38px", background:"var(--bg-4)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:"700", color:"var(--white)", flexShrink:0 }}>{c.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                    <div style={{ fontSize:"11px", color:"var(--text-3)" }}>Since {c.createdAt}</div>
                  </div>
                  {paid > 0 && <div style={{ fontSize:"12px", fontWeight:"600", color:"var(--text-2)", flexShrink:0 }}>{fmt(paid)}</div>}
                </div>
                <div style={{ display:"grid", gap:"6px" }}>
                  {c.email  && <div style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12px", color:"var(--text-3)" }}><Mail size={11} strokeWidth={1.5} /><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.email}</span></div>}
                  {c.phone  && <div style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12px", color:"var(--text-3)" }}><Phone size={11} strokeWidth={1.5} />{c.phone}</div>}
                  {c.address && <div style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12px", color:"var(--text-3)" }}><MapPin size={11} strokeWidth={1.5} /><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.address}</span></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
