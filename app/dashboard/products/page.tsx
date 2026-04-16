"use client";
import { useAuth } from "@/lib/auth";
import { getDataForUser } from "@/lib/data";
import { Plus } from "lucide-react";
function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }
export default function ProductsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const { products } = getDataForUser(user.id);
  return (
    <main className="main-content">
      <div className="page-wrap page-wrap-sm">
        <div className="page-header">
          <div><h1 style={{ marginBottom:"4px" }}>Products & Services</h1>
            <p style={{ color:"var(--text-3)", fontSize:"13px" }}>{products.length} items</p>
          </div>
          <button className="btn btn-primary"><Plus size={14} /> Add Item</button>
        </div>
        <div style={{ display:"grid", gap:"10px" }}>
          {products.map((p, i) => (
            <div key={p.id} className="card" style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:"14px" }}>
              <div style={{ width:"34px", height:"34px", background:"var(--bg-4)", border:"1px solid var(--border-2)", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", color:"var(--text-2)", flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:"2px" }}>{p.name}</div>
                <div style={{ fontSize:"12px", color:"var(--text-3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.description}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:"16px", fontWeight:"700" }}>{fmt(p.price)}</div>
                <div style={{ fontSize:"11px", color:"var(--text-3)" }}>per {p.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
