"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, ChevronRight, ArrowRight, Lock, Mail } from "lucide-react";

const DEMO = [
  { label: "Thabo — Entrepreneur",   email: "thabo@kasitrade.co.za",  password: "password123" },
  { label: "Zanele — Entrepreneur",  email: "zanele@kasitrade.co.za", password: "password123" },
  { label: "Lebogang — Student",     email: "lebo@uj.ac.za",          password: "student123"  },
  { label: "Admin",                  email: "admin@kasitrade.co.za",  password: "admin123"    },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router    = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const ok = login(email, password);
    if (!ok) { setError("Incorrect email or password. Try a demo account above."); setLoading(false); return; }
    const stored = localStorage.getItem("kasitrade_user");
    const u = stored ? JSON.parse(stored) : null;
    router.push(u?.role === "admin" ? "/admin" : u?.role === "student" ? "/student" : "/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6F9", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: "#111827", height: "56px", display: "flex", alignItems: "center", padding: "0 clamp(16px,4vw,48px)", boxShadow: "0 1px 0 rgba(255,255,255,0.06)" }}>
        <Link href="/welcome" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{ width: "28px", height: "28px", background: "#16A34A", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(22,163,74,0.4)" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#fff" }}>K</span>
          </div>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#fff", letterSpacing: "-.02em" }}>KasiTrade</span>
        </Link>
      </nav>

      {/* Page */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(32px,6vw,64px) clamp(16px,4vw,24px)", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {/* Heading */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "clamp(1.4rem,4vw,1.75rem)", fontWeight: "700", color: "#111827", letterSpacing: "-.025em", marginBottom: "6px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>Sign in to your KasiTrade account</p>
          </div>

          {/* Demo accounts */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "16px 18px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>
              Demo accounts — click to fill
            </div>
            <div style={{ display: "grid", gap: "6px" }}>
              {DEMO.map(d => (
                <button
                  key={d.email}
                  onClick={() => { setEmail(d.email); setPassword(d.password); setError(""); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", transition: "all .12s", textAlign: "left" }}
                  onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#F3F4F6"; b.style.borderColor = "#D1D5DB"; }}
                  onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#F9FAFB"; b.style.borderColor = "#E5E7EB"; }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#374151" }}>{d.label}</span>
                  <ChevronRight size={14} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "500" }}>or enter credentials manually</span>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "22px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ marginBottom: "14px" }}>
              <label className="label">Email address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="#9CA3AF" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  style={{ paddingLeft: "36px" }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} color="#9CA3AF" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  className="input"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  style={{ paddingLeft: "36px", paddingRight: "44px" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: "2px" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: "14px", padding: "10px 13px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "7px", fontSize: "13px", color: "#7F1D1D" }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-full"
              type="submit"
              disabled={loading}
              style={{ padding: "12px", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {loading ? "Signing in..." : <><span>Sign in</span><ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", flexWrap: "wrap", gap: "8px" }}>
            <p style={{ fontSize: "13px", color: "#6B7280" }}>
              No account?{" "}
              <Link href="/register" style={{ color: "#16A34A", fontWeight: "600", textDecoration: "none" }}>Create one free</Link>
            </p>
            <Link href="/welcome" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
              About KasiTrade <ChevronRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
