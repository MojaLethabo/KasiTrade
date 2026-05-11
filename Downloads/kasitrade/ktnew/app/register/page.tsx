"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from "lucide-react";

const SECTORS = [
  "Construction & Trades",
  "Food & Hospitality",
  "Retail & Wholesale",
  "Transport & Logistics",
  "Personal Care & Beauty",
  "Health & Wellness",
  "Education & Training",
  "Creative & Media",
  "Technology & Digital",
  "Agriculture & Farming",
  "Manufacturing",
  "Professional Services",
  "Other",
];

const STAGES = [
  { value: "Idea",        label: "Idea",        desc: "Still planning and developing the concept"  },
  { value: "Early",       label: "Early",       desc: "Just started, building the first clients"    },
  { value: "Growing",     label: "Growing",     desc: "Running well, expanding the business"        },
  { value: "Established", label: "Established", desc: "Stable, consistent revenue and customers"    },
];

type S1 = { firstName: string; lastName: string; email: string; phone: string; password: string; confirm: string };
type S2 = { businessName: string; sector: string; location: string; bizPhone: string; stage: string; employees: string; description: string };
type Errs = Record<string, string>;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [step,       setStep]       = useState(1);
  const [showPw,     setShowPw]     = useState(false);
  const [busy,       setBusy]       = useState(false);
  const [apiErr,     setApiErr]     = useState("");

  const [s1, setS1] = useState<S1>({ firstName:"", lastName:"", email:"", phone:"", password:"", confirm:"" });
  const [s2, setS2] = useState<S2>({ businessName:"", sector:"", location:"", bizPhone:"", stage:"", employees:"1", description:"" });
  const [e1, setE1] = useState<Errs>({});
  const [e2, setE2] = useState<Errs>({});

  function f1(k: keyof S1, v: string) { setS1(p => ({ ...p, [k]: v })); setE1(p => ({ ...p, [k]: "" })); }
  function f2(k: keyof S2, v: string) { setS2(p => ({ ...p, [k]: v })); setE2(p => ({ ...p, [k]: "" })); }

  function validateStep1() {
    const e: Errs = {};
    if (!s1.firstName.trim())                              e.firstName = "Required";
    if (!s1.lastName.trim())                               e.lastName  = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s1.email))    e.email     = "Enter a valid email";
    if (!s1.phone.trim())                                  e.phone     = "Required";
    if (s1.password.length < 8)                            e.password  = "At least 8 characters";
    if (s1.password !== s1.confirm)                        e.confirm   = "Passwords do not match";
    setE1(e);
    return !Object.keys(e).length;
  }

  function validateStep2() {
    const e: Errs = {};
    if (!s2.businessName.trim()) e.businessName = "Required";
    if (!s2.sector)              e.sector       = "Select a sector";
    if (!s2.location.trim())     e.location     = "Required";
    if (!s2.stage)               e.stage        = "Select a stage";
    const emp = parseInt(s2.employees);
    if (isNaN(emp) || emp < 1)   e.employees    = "Enter a valid number";
    setE2(e);
    return !Object.keys(e).length;
  }

  function goNext(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;
    setBusy(true); setApiErr("");
    const result = register({
      firstName:  s1.firstName,
      lastName:   s1.lastName,
      email:      s1.email,
      phone:      s1.phone,
      password:   s1.password,
      business: {
        name:        s2.businessName,
        sector:      s2.sector,
        location:    s2.location,
        phone:       s2.bizPhone || s1.phone,
        stage:       s2.stage,
        employees:   parseInt(s2.employees) || 1,
        description: s2.description,
      },
    });
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setApiErr(result.error || "Registration failed. Please try again.");
      setBusy(false);
    }
  }

  function pwScore(pw: string) {
    let n = 0;
    if (pw.length >= 8)          n++;
    if (pw.length >= 12)         n++;
    if (/[A-Z]/.test(pw))        n++;
    if (/[0-9]/.test(pw))        n++;
    if (/[^A-Za-z0-9]/.test(pw)) n++;
    const color = n <= 1 ? "var(--red)" : n <= 3 ? "rgba(255,200,80,0.75)" : "rgba(180,220,180,0.75)";
    const label = n <= 1 ? "Weak" : n <= 3 ? "Fair" : "Strong";
    return { n, color, label };
  }
  const pw = pwScore(s1.password);

  const inp = (err?: string): React.CSSProperties =>
    err ? { borderColor: "rgba(255,80,80,0.5)" } : {};

  const err1 = (k: keyof S1) => e1[k] && (
    <p style={{ fontSize:"11px", color:"var(--red-text)", marginTop:"4px" }}>{e1[k]}</p>
  );
  const err2 = (k: keyof S2) => e2[k] && (
    <p style={{ fontSize:"11px", color:"var(--red-text)", marginTop:"4px" }}>{e2[k]}</p>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0F1923 0%, #0A2E1E 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"clamp(16px,4vw,32px)" }}>
      <div style={{ width:"100%", maxWidth:"500px" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"clamp(24px,5vw,36px)" }}>
          <div style={{ width:"30px", height:"30px", background:"var(--white)", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:"14px", fontWeight:"800", color:"#000" }}>K</span>
          </div>
          <span style={{ fontSize:"17px", fontWeight:"700", letterSpacing:"-0.02em", color:"#0D1B2A" }}>KasiTrade</span>
        </div>

        {/* Step tracker */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"24px" }}>
          {[
            { n:1, label:"Your details" },
            { n:2, label:"Business details" },
          ].map((s, i) => (
            <div key={s.n} style={{ display:"flex", alignItems:"center", gap:"8px", flex: i < 1 ? undefined : 1 }}>
              {i > 0 && (
                <div style={{ flex:1, height:"1px", background: step > 1 ? "rgba(255,255,255,0.25)" : "var(--border)", transition:"background 0.3s" }} />
              )}
              <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                <div style={{
                  width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                  background: step > s.n ? "rgba(10,124,89,0.25)" : step === s.n ? "#0EA572" : "var(--surface-3)",
                  border: step === s.n ? "none" : step > s.n ? "1px solid rgba(10,165,114,0.5)" : "1px solid rgba(255,255,255,0.12)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"11px", fontWeight:"700",
                  color: step > s.n ? "var(--green)" : step === s.n ? "#fff" : "rgba(168,186,206,0.5)",
                  transition:"all 0.2s",
                }}>
                  {step > s.n ? <Check size={12} /> : s.n}
                </div>
                <span style={{ fontSize:"12px", fontWeight: step === s.n ? "600" : "400", color: step === s.n ? "#fff" : "rgba(168,186,206,0.55)", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background:"#fff", borderRadius:"10px", padding:"clamp(20px,5vw,28px)", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>

          {/* ── STEP 1: Personal details ── */}
          {step === 1 && (
            <>
              <div style={{ marginBottom:"22px" }}>
                <h2 style={{ marginBottom:"4px" }}>Create your account</h2>
                <p style={{ color:"#7A90A8", fontSize:"13px" }}>Your personal login details.</p>
              </div>

              <form onSubmit={goNext} noValidate>
                <div className="form-row-2" style={{ marginBottom:"14px" }}>
                  <div>
                    <label className="label">First name *</label>
                    <input className="input" placeholder="Thabo" value={s1.firstName} onChange={e=>f1("firstName",e.target.value)} style={inp(e1.firstName)} autoFocus />
                    {err1("firstName")}
                  </div>
                  <div>
                    <label className="label">Last name *</label>
                    <input className="input" placeholder="Nkosi" value={s1.lastName} onChange={e=>f1("lastName",e.target.value)} style={inp(e1.lastName)} />
                    {err1("lastName")}
                  </div>
                </div>

                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Email address *</label>
                  <input className="input" type="email" placeholder="you@example.com" value={s1.email} onChange={e=>f1("email",e.target.value)} style={inp(e1.email)} />
                  {err1("email")}
                </div>

                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Mobile number *</label>
                  <input className="input" type="tel" placeholder="071 234 5678" value={s1.phone} onChange={e=>f1("phone",e.target.value)} style={inp(e1.phone)} />
                  {err1("phone")}
                </div>

                <div style={{ marginBottom:"6px" }}>
                  <label className="label">Password *</label>
                  <div style={{ position:"relative" }}>
                    <input
                      className="input"
                      type={showPw ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={s1.password}
                      onChange={e=>f1("password",e.target.value)}
                      style={{ ...inp(e1.password), paddingRight:"42px" }}
                    />
                    <button type="button" onClick={()=>setShowPw(v=>!v)}
                      style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#7A90A8", padding:"4px", display:"flex" }}>
                      {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                  {s1.password.length > 0 && (
                    <div style={{ marginTop:"6px" }}>
                      <div style={{ display:"flex", gap:"3px", marginBottom:"3px" }}>
                        {[1,2,3,4,5].map(i => (
                          <div key={i} style={{ flex:1, height:"3px", borderRadius:"2px", background: i<=pw.n ? pw.color : "var(--surface-3)", transition:"background 0.2s" }} />
                        ))}
                      </div>
                      <span style={{ fontSize:"11px", color:pw.color }}>{pw.label}</span>
                    </div>
                  )}
                  {err1("password")}
                </div>

                <div style={{ marginBottom:"24px" }}>
                  <label className="label">Confirm password *</label>
                  <input
                    className="input"
                    type={showPw ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={s1.confirm}
                    onChange={e=>f1("confirm",e.target.value)}
                    style={inp(e1.confirm)}
                  />
                  {err1("confirm")}
                </div>

                <button className="btn btn-primary btn-full" type="submit" style={{ padding:"12px", gap:"8px" }}>
                  Next — Business details <ArrowRight size={15}/>
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: Business details ── */}
          {step === 2 && (
            <>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"22px", gap:"10px" }}>
                <div>
                  <h2 style={{ marginBottom:"4px" }}>Your business</h2>
                  <p style={{ color:"#7A90A8", fontSize:"13px" }}>Tell us about what you do.</p>
                </div>
                <button type="button" onClick={()=>setStep(1)} className="btn btn-ghost btn-sm" style={{ flexShrink:0, gap:"5px" }}>
                  <ArrowLeft size={13}/> Back
                </button>
              </div>

              <form onSubmit={submit} noValidate>
                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Business name *</label>
                  <input className="input" placeholder="e.g. Nkosi Electrical Services" value={s2.businessName} onChange={e=>f2("businessName",e.target.value)} style={inp(e2.businessName)} autoFocus />
                  {err2("businessName")}
                </div>

                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Sector / Industry *</label>
                  <select className="input" value={s2.sector} onChange={e=>f2("sector",e.target.value)} style={inp(e2.sector)}>
                    <option value="">Select your sector…</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {err2("sector")}
                </div>

                <div className="form-row-2" style={{ marginBottom:"14px" }}>
                  <div>
                    <label className="label">Location *</label>
                    <input className="input" placeholder="e.g. Soweto, Johannesburg" value={s2.location} onChange={e=>f2("location",e.target.value)} style={inp(e2.location)} />
                    {err2("location")}
                  </div>
                  <div>
                    <label className="label">Business phone</label>
                    <input className="input" type="tel" placeholder="Leave blank to use personal" value={s2.bizPhone} onChange={e=>f2("bizPhone",e.target.value)} />
                  </div>
                </div>

                {/* Stage selector */}
                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Business stage *</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    {STAGES.map(st => (
                      <button
                        key={st.value}
                        type="button"
                        onClick={()=>f2("stage",st.value)}
                        style={{
                          padding:"10px 12px",
                          background: s2.stage===st.value ? "var(--surface-3)" : "var(--surface-2)",
                          border: s2.stage===st.value ? "1px solid rgba(255,255,255,0.35)" : "1px solid var(--border)",
                          borderRadius:"6px", cursor:"pointer", textAlign:"left", transition:"all 0.15s",
                        }}
                      >
                        <div style={{ fontSize:"13px", fontWeight:"600", color: s2.stage===st.value ? "var(--white)" : "var(--text-2)", marginBottom:"2px" }}>{st.label}</div>
                        <div style={{ fontSize:"11px", color:"#7A90A8", lineHeight:"1.35" }}>{st.desc}</div>
                      </button>
                    ))}
                  </div>
                  {err2("stage")}
                </div>

                <div style={{ marginBottom:"14px" }}>
                  <label className="label">Number of employees *</label>
                  <input className="input" type="number" min="1" max="500" placeholder="1" value={s2.employees} onChange={e=>f2("employees",e.target.value)} style={inp(e2.employees)} />
                  {err2("employees")}
                  <p style={{ fontSize:"11px", color:"#7A90A8", marginTop:"4px" }}>Include yourself. Enter 1 if you are a sole trader.</p>
                </div>

                <div style={{ marginBottom:"24px" }}>
                  <label className="label">Brief description <span style={{ fontWeight:"400", textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="e.g. Residential and commercial electrical installations and repairs."
                    value={s2.description}
                    onChange={e=>f2("description",e.target.value)}
                    style={{ height:"68px" }}
                  />
                </div>

                {apiErr && (
                  <div style={{ background:"rgba(255,68,68,0.08)", border:"1px solid rgba(255,68,68,0.2)", color:"var(--red-text)", padding:"10px 14px", borderRadius:"6px", fontSize:"13px", marginBottom:"16px" }}>
                    {apiErr}
                  </div>
                )}

                <button className="btn btn-primary btn-full" type="submit" disabled={busy} style={{ padding:"12px", gap:"8px" }}>
                  {busy ? "Creating account…" : <><Check size={15}/> Create my account</>}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Sign in link */}
        <p style={{ textAlign:"center", marginTop:"18px", fontSize:"13px", color:"#7A90A8" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color:"var(--text-2)", textDecoration:"underline" }}>Sign in</Link>
        </p>

      </div>
    </div>
  );
}
