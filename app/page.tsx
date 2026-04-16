"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const ok = login(email, password);
    if (ok) router.push(email === "admin@kasitrade.co.za" ? "/admin" : "/dashboard");
    else setError("Invalid email or password.");
  }

  const demos = [
    { label:"Thabo Nkosi",    role:"Entrepreneur",  email:"thabo@kasitrade.co.za",  pass:"password123" },
    { label:"Zanele Dlamini", role:"Entrepreneur",  email:"zanele@kasitrade.co.za", pass:"password123" },
    { label:"Admin User",     role:"Administrator", email:"admin@kasitrade.co.za",  pass:"admin123"    },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div style={{ display:"flex", flex:1, flexDirection:"column", minHeight:"100vh" }}>
        <style>{`@media(min-width:768px){.login-wrap{flex-direction:row!important}.login-left{width:400px!important;border-right:1px solid var(--border);border-bottom:none!important}.login-right{flex:1!important}}`}</style>

        <div className="login-wrap" style={{ display:"flex", flex:1, flexDirection:"column" }}>
          {/* Left / top panel — sign in form */}
          <div className="login-left" style={{ padding:"clamp(24px,5vw,48px)", borderBottom:"1px solid var(--border)", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"clamp(28px,6vw,56px)" }}>
                <div style={{ width:"30px", height:"30px", background:"var(--white)", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"14px", fontWeight:"800", color:"#000" }}>K</span>
                </div>
                <span style={{ fontSize:"17px", fontWeight:"700", letterSpacing:"-0.02em" }}>KasiTrade</span>
              </div>

              <div style={{ marginBottom:"28px" }}>
                <h1 style={{ marginBottom:"6px" }}>Welcome back.</h1>
                <p style={{ color:"var(--text-3)", fontSize:"14px" }}>Sign in to manage your business.</p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Email address</label>
                  <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div style={{ marginBottom:"20px" }}>
                  <label className="label">Password</label>
                  <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && (
                  <div style={{ background:"rgba(255,68,68,0.08)", border:"1px solid rgba(255,68,68,0.2)", color:"#ff8080", padding:"10px 14px", borderRadius:"var(--radius)", fontSize:"13px", marginBottom:"14px" }}>{error}</div>
                )}
                <button className="btn btn-primary btn-full" type="submit" style={{ padding:"12px" }}>Sign In</button>
              </form>
            </div>
            <p style={{ fontSize:"11px", color:"var(--text-3)", marginTop:"24px" }}>© {new Date().getFullYear()} KasiTrade. All rights reserved.</p>
          </div>

          {/* Right / bottom panel — demo accounts */}
          <div className="login-right" style={{ padding:"clamp(24px,5vw,48px)", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ maxWidth:"420px" }}>
              <p className="section-label" style={{ marginBottom:"16px" }}>Demo accounts — click to pre-fill</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px" }}>
                {demos.map(d => (
                  <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.pass); }}
                    style={{ background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", cursor:"pointer", textAlign:"left", width:"100%", transition:"border-color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor="var(--border-2)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor="var(--border)")}>
                    <div style={{ width:"34px", height:"34px", background:"var(--bg-4)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700", flexShrink:0 }}>{d.label[0]}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"13px", fontWeight:"600", marginBottom:"1px" }}>{d.label}</div>
                      <div style={{ fontSize:"11px", color:"var(--text-3)" }}>{d.role}</div>
                    </div>
                    <code style={{ fontSize:"10px", color:"var(--text-3)", background:"var(--bg-3)", padding:"3px 7px", borderRadius:"3px", display:"none" }}
                      className="email-code">{d.email}</code>
                  </button>
                ))}
              </div>
              <div style={{ padding:"16px", background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--radius)" }}>
                <p className="section-label" style={{ marginBottom:"10px" }}>Platform features</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px" }}>
                  {["Quotations & Invoices","Payment Receipts","Expense Tracking","Payslip Generator","Contract Generator","Admin Analytics"].map(f => (
                    <div key={f} style={{ fontSize:"12px", color:"var(--text-2)", display:"flex", alignItems:"center", gap:"6px" }}>
                      <div style={{ width:"3px", height:"3px", background:"var(--text-3)", borderRadius:"50%", flexShrink:0 }} />{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
