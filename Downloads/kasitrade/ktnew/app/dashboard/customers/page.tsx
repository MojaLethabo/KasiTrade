"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { getDataForUser, customers as seedCustomers, Customer } from "@/lib/data";
import { useRouter } from "next/navigation";
import { Plus, Mail, Phone, MapPin, X, Check, ChevronRight } from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

type Form = { name: string; email: string; phone: string; address: string };
const EMPTY: Form = { name:"", email:"", phone:"", address:"" };

export default function CustomersPage() {
  const { user }  = useAuth();
  const router    = useRouter();
  if (!user) return null;

  const { invoices } = getDataForUser(user.id);
  const [customers, setCustomers] = useState<Customer[]>(
    seedCustomers.filter(c => c.userId === user.id)
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<Form>(EMPTY);
  const [errors, setErrors]     = useState<Partial<Form>>({});

  function upd(k: keyof Form, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e: Partial<Form> = {};
    if (!form.name.trim()) e.name = "Customer name is required";
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSave() {
    if (!validate()) return;
    const newCust: Customer = {
      id: "c" + Date.now(), userId: user!.id,
      name: form.name, email: form.email,
      phone: form.phone, address: form.address,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCustomers(cs => [...cs, newCust]);
    setShowForm(false); setForm(EMPTY); setErrors({});
  }

  function getTotalPaid(cid: string) {
    return invoices
      .filter(i => i.customerId === cid && i.status === "paid")
      .reduce((s, i) => s + i.total, 0);
  }

  function getInvoiceCount(cid: string) { return invoices.filter(i => i.customerId === cid).length; }

  return (
    <main className="main-content">
      <div className="page-wrap">

        <div className="page-header">
          <div>
            <h1 style={{ marginBottom:"4px" }}>Customers</h1>
            <p style={{ color:"var(--ink-3)", fontSize:"13px" }}>{customers.length} customer{customers.length !== 1 ? "s" : ""}</p>
          </div>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={14} /> Add Customer
            </button>
          )}
        </div>

        {/* ── Add form ── */}
        {showForm && (
          <div className="card" style={{ overflow:"hidden", marginBottom:"20px" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3>New Customer</h3>
              <button onClick={() => { setShowForm(false); setForm(EMPTY); setErrors({}); }} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink-3)" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding:"18px 20px" }}>
              <div className="form-row-2" style={{ marginBottom:"12px" }}>
                <div>
                  <label className="label">Customer / Business name *</label>
                  <input className="input" placeholder="e.g. Sipho Molefe or Build-It Roodepoort" value={form.name} onChange={e=>upd("name",e.target.value)} style={{ borderColor: errors.name ? "rgba(255,80,80,0.5)" : undefined }} autoFocus />
                  {errors.name && <p style={{ fontSize:"11px", color:"var(--red-text)", marginTop:"4px" }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Email address</label>
                  <input className="input" type="email" placeholder="client@example.com" value={form.email} onChange={e=>upd("email",e.target.value)} />
                </div>
              </div>
              <div className="form-row-2" style={{ marginBottom:"16px" }}>
                <div>
                  <label className="label">Phone number</label>
                  <input className="input" type="tel" placeholder="071 234 5678" value={form.phone} onChange={e=>upd("phone",e.target.value)} />
                </div>
                <div>
                  <label className="label">Address</label>
                  <input className="input" placeholder="14 Main Reef Rd, Roodepoort" value={form.address} onChange={e=>upd("address",e.target.value)} />
                </div>
              </div>
              <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", borderTop:"1px solid var(--border)", paddingTop:"14px" }}>
                <button className="btn btn-ghost" onClick={() => { setShowForm(false); setForm(EMPTY); }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}><Check size={14} /> Add Customer</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Customer cards — clickable ── */}
        {customers.length === 0 ? (
          <div className="card" style={{ padding:"48px", textAlign:"center" }}>
            <p style={{ color:"var(--ink-3)", marginBottom:"14px" }}>No customers yet. Add your first client.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14} /> Add Customer</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:"12px" }}>
            {customers.map(c => {
              const paid = getTotalPaid(c.id);
              const invCount = getInvoiceCount(c.id);
              return (
                <div
                  key={c.id}
                  className="card"
                  onClick={() => router.push(`/dashboard/customers/${c.id}`)}
                  style={{ padding:"18px", cursor:"pointer", transition:"border-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor="var(--border-2)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor="var(--border)")}
                >
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"12px" }}>
                    <div style={{ width:"40px", height:"40px", background:"var(--surface-3)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", fontWeight:"700", color:"var(--ink)", flexShrink:0 }}>
                      {c.name[0]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                      <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>Since {c.createdAt}</div>
                    </div>
                    <ChevronRight size={15} color="var(--ink-3)" style={{ flexShrink:0, marginTop:"2px" }} />
                  </div>

                  <div style={{ display:"grid", gap:"5px", marginBottom:"12px" }}>
                    {c.email   && <div style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12px", color:"var(--ink-3)" }}><Mail size={11} strokeWidth={1.5} /><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.email}</span></div>}
                    {c.phone   && <div style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12px", color:"var(--ink-3)" }}><Phone size={11} strokeWidth={1.5} />{c.phone}</div>}
                    {c.address && <div style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12px", color:"var(--ink-3)" }}><MapPin size={11} strokeWidth={1.5} /><span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.address}</span></div>}
                  </div>

                  {/* Stats row */}
                  <div style={{ display:"flex", gap:"12px", paddingTop:"10px", borderTop:"1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize:"10px", color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"2px" }}>Invoices</div>
                      <div style={{ fontSize:"13px", fontWeight:"600" }}>{invCount}</div>
                    </div>
                    {paid > 0 && (
                      <div>
                        <div style={{ fontSize:"10px", color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"2px" }}>Total Paid</div>
                        <div style={{ fontSize:"13px", fontWeight:"600", color:"rgba(180,220,180,0.85)" }}>{fmt(paid)}</div>
                      </div>
                    )}
                    <div style={{ marginLeft:"auto", display:"flex", alignItems:"center" }}>
                      <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>View history →</span>
                    </div>
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
