"use client";
import Link from "next/link";
import {
  FileText, CreditCard, Receipt, TrendingDown, Users, Package,
  BarChart2, FileCheck, FileSignature, Users2, Activity, Shield,
  ArrowRight, CheckCircle, Building2, GraduationCap, TrendingUp,
  BookOpen, Scale, Briefcase, ChevronRight, Star, Clock, Zap,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────── */
const FEATURES_SME = [
  { icon: FileText,      label: "Quotations",          desc: "Build and send professional quotes from your service catalogue."  },
  { icon: CreditCard,    label: "Invoices",             desc: "Issue invoices, track payments, manage outstanding balances."       },
  { icon: Receipt,       label: "Receipts",             desc: "Record every payment. Auto-generate printable receipts instantly."  },
  { icon: TrendingDown,  label: "Expenses",             desc: "Log costs by category. See exactly where your money is going."     },
  { icon: Users,         label: "Customers",            desc: "Full client list with complete interaction history per customer."   },
  { icon: Package,       label: "Products & Services",  desc: "Price catalogue reused across every quote and invoice you create." },
  { icon: Users2,        label: "Workers & Team",       desc: "Store employee details. Generate payslips and contracts in one tap."},
  { icon: BarChart2,     label: "Analytics",            desc: "Income trends, demand signals, payment health — all plain language."},
  { icon: FileCheck,     label: "Payslip Generator",    desc: "Professional payslips calculated automatically and ready to print." },
  { icon: FileSignature, label: "Contract Generator",   desc: "Employment contracts with all standard clauses, ready in seconds." },
];

const FEATURES_SUPPORT = [
  { icon: GraduationCap, label: "SME Support System",    desc: "Connect SMEs with university students for structured business help." },
  { icon: Activity,      label: "Ecosystem Intelligence", desc: "Portfolio-level health scoring across every business in the system." },
  { icon: Shield,        label: "Admin Dashboard",        desc: "Full platform oversight — requests, students, sessions, ratings."   },
];

const STEPS = [
  { n: "01", title: "Register your business",       desc: "Two-step signup — your personal details, then your business profile. Under two minutes." },
  { n: "02", title: "Add clients and services",     desc: "Build your customer list and service catalogue once. It powers every quote and invoice you create." },
  { n: "03", title: "Quote, invoice, and collect",  desc: "Send professional quotes, convert them to invoices, record payments. The whole workflow in one place." },
  { n: "04", title: "Track every rand",             desc: "Log income and expenses. KasiTrade calculates your profit and flags overdue invoices automatically." },
  { n: "05", title: "Understand your performance",  desc: "Your analytics dashboard tells you in plain language whether you are growing — and exactly what to do next." },
];

const FOR_WHO = [
  {
    icon: Building2, title: "Township entrepreneurs",
    items: ["Electricians, plumbers, and builders", "Caterers and event organisers", "Retailers and spaza shops", "Freelancers and consultants", "Any sole trader or small team"],
  },
  {
    icon: GraduationCap, title: "Students offering support",
    items: ["Accounting and finance students", "Marketing and strategy students", "Law and compliance students", "Digital technology students", "Any student wanting real-world experience"],
  },
  {
    icon: Briefcase, title: "Support organisations",
    items: ["Enterprise development programmes", "SMME support agencies", "Incubators and accelerators", "Community development finance institutions", "B-BBEE enterprise development teams"],
  },
];

const STATS = [
  { icon: Zap,    value: "12+",   label: "Business modules"  },
  { icon: Clock,  value: "2 min", label: "To get started"    },
  { icon: Star,   value: "Free",  label: "No setup cost"     },
  { icon: Shield, value: "100%",  label: "Mobile responsive" },
];

/* ─── Small components ──────────────────────────────────────────── */
const Tag = ({ text, green }: { text: string; green?: boolean }) => (
  <span style={{
    display: "inline-block", padding: "4px 14px",
    background: green ? "#DCFCE7" : "#F3F4F6",
    color: green ? "#14532D" : "#374151",
    borderRadius: "20px", fontSize: "11.5px", fontWeight: "700",
    textTransform: "uppercase", letterSpacing: ".07em",
    border: green ? "1px solid #86EFAC" : "1px solid #E5E7EB",
    marginBottom: "14px",
  }}>{text}</span>
);

const Divider = ({ label }: { label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "32px 0 24px" }}>
    <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
    <span style={{ fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".1em", whiteSpace: "nowrap" }}>{label}</span>
    <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
  </div>
);

export default function WelcomePage() {
  const WRAP = "max-width:1120px;width:100%;margin:0 auto;padding:0 clamp(16px,4vw,48px)";

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: "#F4F6F9", color: "#111827", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: "#111827", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", maxWidth: "1120px", margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "#16A34A", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(22,163,74,0.45)", flexShrink: 0 }}>
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#fff", fontFamily: "inherit" }}>K</span>
            </div>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#fff", letterSpacing: "-.02em" }}>KasiTrade</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button style={{ padding: "8px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "7px", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "13px", fontWeight: "500", fontFamily: "inherit", transition: "all .15s" }}>
                Sign In
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button style={{ padding: "8px 18px", background: "#16A34A", border: "none", borderRadius: "7px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(22,163,74,0.35)", transition: "all .15s" }}>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(160deg, #111827 0%, #0f2318 60%, #111827 100%)", padding: "clamp(64px,10vw,112px) clamp(16px,4vw,48px)", position: "relative", overflow: "hidden" }}>
        {/* Radial glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(22,163,74,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "20px", padding: "5px 16px", marginBottom: "28px" }}>
            <div style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#4ade80", letterSpacing: ".04em" }}>Business Management Platform</span>
          </div>

          <h1 style={{ fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: "800", color: "#fff", letterSpacing: "-.035em", lineHeight: "1.1", marginBottom: "20px" }}>
            Run your business<br />
            <span style={{ color: "#4ade80" }}>like a professional.</span>
          </h1>

          <p style={{ fontSize: "clamp(.95rem,2vw,1.15rem)", color: "rgba(209,213,219,0.8)", lineHeight: "1.7", maxWidth: "560px", margin: "0 auto 36px" }}>
            KasiTrade gives township entrepreneurs a complete business toolkit — quotes, invoices, receipts, expenses, and performance analytics — from any phone or computer.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", background: "#16A34A", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(22,163,74,0.4)", transition: "all .15s" }}>
                Start for free <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "13px 24px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "rgba(255,255,255,0.85)", cursor: "pointer", fontSize: "14px", fontWeight: "500", fontFamily: "inherit", transition: "all .15s" }}>
                Sign in <ChevronRight size={15} />
              </button>
            </Link>
          </div>

          {/* Stats strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginTop: "56px", maxWidth: "600px", margin: "56px auto 0" }}>
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ padding: "18px 12px", background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                  <Icon size={16} color="#4ade80" strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontWeight: "800", color: "#fff", letterSpacing: "-.03em", marginBottom: "2px" }}>{value}</div>
                <div style={{ fontSize: "11px", color: "rgba(156,163,175,0.7)", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ background: "#fff", padding: "clamp(56px,8vw,88px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", textAlign: "center" }}>
          <Tag text="The Problem We Solve" />
          <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.1rem)", fontWeight: "700", color: "#111827", letterSpacing: "-.025em", lineHeight: "1.2", marginBottom: "14px" }}>
            Most business tools were not built for you.
          </h2>
          <p style={{ fontSize: "clamp(.9rem,1.8vw,1rem)", color: "#6B7280", lineHeight: "1.7", maxWidth: "600px", margin: "0 auto 40px" }}>
            QuickBooks, Xero, and Sage assume you understand accounting. They are expensive, complex, and designed for office environments with dedicated finance staff.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
            {[
              { icon: FileText,  title: "No formal records",            desc: "Quotes sent on WhatsApp. Invoices tracked in notebooks. No documented business history." },
              { icon: TrendingDown, title: "Cash flow blindness",       desc: "No visibility of who owes what, or whether the business is profitable at any given moment."  },
              { icon: Scale,     title: "Excluded from formal economy", desc: "Without documented records, accessing bank credit or enterprise contracts is nearly impossible." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ padding: "22px 20px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "10px", textAlign: "left" }}>
                <div style={{ width: "36px", height: "36px", background: "#fff", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <Icon size={16} color="#DC2626" strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#7F1D1D", marginBottom: "6px" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "#991B1B", lineHeight: "1.55" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: "#F4F6F9", padding: "clamp(56px,8vw,88px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Tag text="Everything You Need" green />
            <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.1rem)", fontWeight: "700", color: "#111827", letterSpacing: "-.025em" }}>
              One platform. Your entire business.
            </h2>
          </div>

          <Divider label="For Entrepreneurs" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "12px", marginBottom: "8px" }}>
            {FEATURES_SME.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "box-shadow .2s, transform .2s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; el.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: "38px", height: "38px", background: "#DCFCE7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Icon size={17} color="#16A34A" strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#111827", marginBottom: "5px" }}>{label}</div>
                <div style={{ fontSize: "12.5px", color: "#6B7280", lineHeight: "1.55" }}>{desc}</div>
              </div>
            ))}
          </div>

          <Divider label="For Organisations &amp; Students" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
            {FEATURES_SUPPORT.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ width: "38px", height: "38px", background: "#DBEAFE", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <Icon size={17} color="#2563EB" strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#111827", marginBottom: "5px" }}>{label}</div>
                <div style={{ fontSize: "12.5px", color: "#6B7280", lineHeight: "1.55" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "#fff", padding: "clamp(56px,8vw,88px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <Tag text="How It Works" />
            <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.1rem)", fontWeight: "700", color: "#111827", letterSpacing: "-.025em" }}>
              Up and running in minutes.
            </h2>
          </div>

          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} style={{ display: "flex", gap: "20px", paddingBottom: "32px", position: "relative" }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{ position: "absolute", left: "19px", top: "44px", width: "2px", height: "calc(100% - 12px)", background: "linear-gradient(to bottom, #16A34A, #E5E7EB)", zIndex: 0 }} />
              )}
              {/* Step dot */}
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: i % 2 === 0 ? "#16A34A" : "#111827", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, boxShadow: i % 2 === 0 ? "0 3px 12px rgba(22,163,74,0.35)" : "0 3px 12px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#fff", fontFamily: "inherit" }}>{n}</span>
              </div>
              <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "5px" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.65" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ background: "#F4F6F9", padding: "clamp(56px,8vw,88px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Tag text="Who It Is For" />
            <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.1rem)", fontWeight: "700", color: "#111827", letterSpacing: "-.025em" }}>
              Built for the people who keep communities moving.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "16px" }}>
            {FOR_WHO.map(({ icon: Icon, title, items }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px 26px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <div style={{ width: "40px", height: "40px", background: "#DCFCE7", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="#16A34A" strokeWidth={1.7} />
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>{title}</span>
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  {items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                      <CheckCircle size={14} color="#16A34A" strokeWidth={2} style={{ flexShrink: 0, marginTop: "1px" }} />
                      <span style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SME SUPPORT CALLOUT ── */}
      <section style={{ background: "#fff", padding: "clamp(40px,6vw,72px) clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, #111827 0%, #0f2318 100%)", borderRadius: "16px", padding: "clamp(28px,5vw,48px)", display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(22,163,74,0.2)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={17} color="#4ade80" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", letterSpacing: ".08em" }}>SME Support System</span>
              </div>
              <h3 style={{ fontSize: "clamp(1.1rem,3vw,1.5rem)", fontWeight: "700", color: "#fff", letterSpacing: "-.02em", marginBottom: "10px", lineHeight: "1.3" }}>
                Free business support from qualified students.
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(209,213,219,0.75)", lineHeight: "1.65" }}>
                Submit a support request and get matched with a university student in accounting, marketing, finance, or law. Structured sessions, real outcomes.
              </p>
            </div>
            <Link href="/register" style={{ textDecoration: "none", flexShrink: 0 }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "#16A34A", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "700", fontFamily: "inherit", boxShadow: "0 3px 12px rgba(22,163,74,0.4)", whiteSpace: "nowrap" }}>
                Get support now <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(160deg, #111827 0%, #0f2318 100%)", padding: "clamp(72px,10vw,108px) clamp(16px,4vw,48px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(22,163,74,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(1.6rem,5vw,2.5rem)", fontWeight: "800", color: "#fff", letterSpacing: "-.03em", lineHeight: "1.15", marginBottom: "14px" }}>
            Ready to run your business properly?
          </h2>
          <p style={{ fontSize: "clamp(.9rem,1.8vw,1.05rem)", color: "rgba(209,213,219,0.75)", lineHeight: "1.65", marginBottom: "32px" }}>
            No accounting knowledge needed. No setup fees. Start quoting and invoicing in minutes.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "#16A34A", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(22,163,74,0.45)" }}>
                Create free account <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "14px 24px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "8px", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "15px", fontWeight: "500", fontFamily: "inherit" }}>
                Sign in <ChevronRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px clamp(16px,4vw,48px)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "24px", height: "24px", background: "#16A34A", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#fff", fontFamily: "inherit" }}>K</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.75)" }}>KasiTrade</span>
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {[["About", "/welcome"], ["Register", "/register"], ["Sign In", "/login"]].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: "12px", color: "rgba(156,163,175,0.55)", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <p style={{ fontSize: "11px", color: "rgba(156,163,175,0.35)" }}>
            {new Date().getFullYear()} KasiTrade. Built for township entrepreneurs.
          </p>
        </div>
      </footer>

    </div>
  );
}
