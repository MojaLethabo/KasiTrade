"use client";
import { useState } from "react";
import {
  Building2, MapPin, Phone, Users, Briefcase,
  User, Lock, Bell, Shield, Trash2,
  Check, Eye, EyeOff, AlertTriangle,
  Mail, Edit3, Save, X, Palette, FileImage,
  Receipt, Hash, Percent, CreditCard, FileText,
} from "lucide-react";

// ── Dummy data ────────────────────────────────────────────────────
const DUMMY = {
  name:     "Thabo Nkosi",
  email:    "thabo@kasitrade.co.za",
  phone:    "+27 71 234 5678",
  business: {
    name:        "Thabo's Spaza Shop",
    sector:      "Retail & FMCG",
    location:    "Soweto, Gauteng",
    phone:       "+27 71 234 5678",
    employees:   "3",
    stage:       "Growing",
    description: "A community spaza shop serving daily essentials to locals in Soweto. Stocking groceries, airtime, and household goods since 2019.",
  },
  notifications: {
    emailInvoice:  true,
    emailReceipt:  true,
    emailWeekly:   false,
    smsPayment:    true,
    smsReminder:   false,
  },
  branding: {
    primaryColor: "#16A34A",
    logoUrl:      "",
    stampUrl:     "",
    signatureUrl: "",
    tagline:      "Quality products, community prices.",
  },
  invoiceSettings: {
    prefix:       "INV",
    nextNumber:   "001",
    vatRate:      "15",
    paymentTerms: "30",
    notes:        "Thank you for your business. Please pay within the agreed terms.",
    bankName:     "FNB",
    accountNumber:"62012345678",
    branchCode:   "250655",
  },
};

// ── Reusable components ───────────────────────────────────────────
function SectionTab({ id, active, icon: Icon, label, onClick }: {
  id: string; active: boolean; icon: React.ElementType; label: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "9px",
        width: "100%", padding: "10px 14px", borderRadius: "7px",
        background: active ? "rgba(22,163,74,0.12)" : "transparent",
        border: active ? "1px solid rgba(22,163,74,0.2)" : "1px solid transparent",
        color: active ? "#16A34A" : "var(--ink-2)",
        fontSize: "13px", fontWeight: active ? "600" : "400",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        transition: "all .12s",
      }}
    >
      <Icon size={14} strokeWidth={active ? 2 : 1.7} />
      {label}
    </button>
  );
}

function FieldRow({ label, value, editing, onChange }: {
  label: string; value: string; editing: boolean; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>
        {label}
      </label>
      {editing ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1px solid var(--border-2)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", outline: "none" }}
          onFocus={e => { e.currentTarget.style.borderColor = "#16A34A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      ) : (
        <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)", padding: "9px 0" }}>{value || "—"}</div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: "13px", color: "var(--ink-2)" }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "38px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
          background: checked ? "#16A34A" : "var(--surface-3)",
          position: "relative", transition: "background .2s", flexShrink: 0,
        }}
      >
        <div style={{
          width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
          position: "absolute", top: "3px",
          left: checked ? "19px" : "3px",
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

function SaveBar({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [saved, setSaved] = useState(false);
  function handleSave() {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
      <button
        onClick={handleSave}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: saved ? "#15803D" : "#16A34A", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}
      >
        {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save changes</>}
      </button>
      <button
        onClick={onCancel}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
      >
        <X size={13} /> Cancel
      </button>
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────

function ProfileSection() {
  const [editing, setEditing] = useState(false);
  const [name,  setName]  = useState(DUMMY.name);
  const [email, setEmail] = useState(DUMMY.email);
  const [phone, setPhone] = useState(DUMMY.phone);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ marginBottom: "3px" }}>Personal Details</h2>
          <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Your name, email and contact number</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", color: "var(--ink-2)" }}>
            <Edit3 size={12} /> Edit
          </button>
        )}
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px", padding: "16px", background: "var(--surface-2)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <div style={{ width: "52px", height: "52px", background: "rgba(22,163,74,0.15)", border: "2px solid rgba(22,163,74,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", color: "#16A34A", flexShrink: 0 }}>
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "2px" }}>{name}</div>
          <div style={{ fontSize: "12px", color: "var(--ink-3)" }}>Entrepreneur · KasiTrade member</div>
        </div>
      </div>

      <FieldRow label="Full name"     value={name}  editing={editing} onChange={setName}  />
      <FieldRow label="Email address" value={email} editing={editing} onChange={setEmail} />
      <FieldRow label="Phone number"  value={phone} editing={editing} onChange={setPhone} />

      {editing && <SaveBar onSave={() => setEditing(false)} onCancel={() => setEditing(false)} />}
    </div>
  );
}

function BusinessSection() {
  const [editing, setEditing] = useState(false);
  const [biz, setBiz] = useState(DUMMY.business);
  const set = (k: keyof typeof biz) => (v: string) => setBiz(b => ({ ...b, [k]: v }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ marginBottom: "3px" }}>Business Profile</h2>
          <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Your registered business details</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", color: "var(--ink-2)" }}>
            <Edit3 size={12} /> Edit
          </button>
        )}
      </div>

      {/* Business header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px", padding: "16px", background: "var(--surface-2)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <div style={{ width: "44px", height: "44px", background: "var(--surface-3)", border: "1px solid var(--border-2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Building2 size={18} strokeWidth={1.5} color="var(--ink-2)" />
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>{biz.name}</div>
          <div style={{ fontSize: "12px", color: "var(--ink-3)" }}>{biz.sector}</div>
        </div>
      </div>

      <FieldRow label="Business name" value={biz.name}        editing={editing} onChange={set("name")}        />
      <FieldRow label="Sector"        value={biz.sector}      editing={editing} onChange={set("sector")}      />
      <FieldRow label="Location"      value={biz.location}    editing={editing} onChange={set("location")}    />
      <FieldRow label="Phone"         value={biz.phone}       editing={editing} onChange={set("phone")}       />
      <FieldRow label="Employees"     value={biz.employees}   editing={editing} onChange={set("employees")}   />
      <FieldRow label="Stage"         value={biz.stage}       editing={editing} onChange={set("stage")}       />
      <FieldRow label="Description"   value={biz.description} editing={editing} onChange={set("description")} />

      {editing && <SaveBar onSave={() => setEditing(false)} onCancel={() => setEditing(false)} />}
    </div>
  );
}

function PasswordSection() {
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!current) { setError("Enter your current password."); return; }
    if (next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (next !== confirm) { setError("Passwords don't match."); return; }
    // TODO: call POST /otp/reset-password
    setDone(true);
    setCurrent(""); setNext(""); setConfirm("");
    setTimeout(() => setDone(false), 3000);
  }

  const PwField = ({ label, value, onChange, show, onToggle }: {
    label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void;
  }) => (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 40px 9px 12px", border: "1px solid var(--border-2)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", outline: "none" }}
          onFocus={e => { e.currentTarget.style.borderColor = "#16A34A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <button type="button" onClick={onToggle}
          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", display: "flex", padding: "2px" }}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "3px" }}>Change Password</h2>
        <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Update your account password</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <PwField label="Current password" value={current} onChange={setCurrent} show={showCur} onToggle={() => setShowCur(v => !v)} />
        <PwField label="New password"     value={next}    onChange={setNext}    show={showNew} onToggle={() => setShowNew(v => !v)} />
        <PwField label="Confirm password" value={confirm} onChange={setConfirm} show={showNew} onToggle={() => setShowNew(v => !v)} />

        {error && (
          <div style={{ marginBottom: "14px", padding: "10px 13px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "7px", fontSize: "13px", color: "#7F1D1D" }}>
            {error}
          </div>
        )}
        {done && (
          <div style={{ marginBottom: "14px", padding: "10px 13px", background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: "7px", fontSize: "13px", color: "#14532D", display: "flex", alignItems: "center", gap: "7px" }}>
            <Check size={13} /> Password updated successfully.
          </div>
        )}

        <button type="submit"
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: "#16A34A", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
          <Lock size={13} /> Update password
        </button>
      </form>
    </div>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState(DUMMY.notifications);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs(p => ({ ...p, [k]: v }));

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "3px" }}>Notifications</h2>
        <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Control how KasiTrade contacts you</p>
      </div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Mail size={11} /> Email notifications
        </div>
        <Toggle label="Invoice created or sent"  checked={prefs.emailInvoice} onChange={set("emailInvoice")} />
        <Toggle label="Payment received"         checked={prefs.emailReceipt} onChange={set("emailReceipt")} />
        <Toggle label="Weekly business summary"  checked={prefs.emailWeekly}  onChange={set("emailWeekly")}  />
      </div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Phone size={11} /> SMS notifications
        </div>
        <Toggle label="Payment received"    checked={prefs.smsPayment}  onChange={set("smsPayment")}  />
        <Toggle label="Invoice reminders"   checked={prefs.smsReminder} onChange={set("smsReminder")} />
      </div>

      <button onClick={handleSave}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: saved ? "#15803D" : "#16A34A", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}>
        {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save preferences</>}
      </button>
    </div>
  );
}

function SecuritySection() {
  const sessions = [
    { device: "Chrome · Windows 10",  location: "Johannesburg, ZA", time: "Active now",         current: true  },
    { device: "Safari · iPhone 14",   location: "Soweto, ZA",       time: "2 hours ago",        current: false },
    { device: "Chrome · Android",     location: "Pretoria, ZA",     time: "Yesterday, 14:32",   current: false },
  ];
  const [revoked, setRevoked] = useState<number[]>([]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "3px" }}>Security</h2>
        <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Active sessions and account security</p>
      </div>

      {/* 2FA notice */}
      <div style={{ padding: "14px 16px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <Shield size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: "1px" }} />
        <div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)", marginBottom: "3px" }}>Two-factor authentication</div>
          <div style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "10px" }}>Add an extra layer of security to your account.</div>
          <button style={{ padding: "6px 14px", background: "#16A34A", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active sessions */}
      <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "10px" }}>
        Active sessions
      </div>
      <div style={{ display: "grid", gap: "8px" }}>
        {sessions.map((s, i) => (
          <div key={i} style={{ padding: "13px 16px", background: "var(--surface-2)", border: `1px solid ${s.current ? "rgba(22,163,74,0.2)" : "var(--border)"}`, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", opacity: revoked.includes(i) ? 0.4 : 1 }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--ink)", marginBottom: "3px", display: "flex", alignItems: "center", gap: "7px" }}>
                {s.device}
                {s.current && <span style={{ fontSize: "10px", background: "rgba(22,163,74,0.15)", color: "#16A34A", padding: "1px 7px", borderRadius: "10px", fontWeight: "600" }}>Current</span>}
              </div>
              <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>{s.location} · {s.time}</div>
            </div>
            {!s.current && !revoked.includes(i) && (
              <button onClick={() => setRevoked(r => [...r, i])}
                style={{ padding: "5px 12px", background: "transparent", border: "1px solid var(--border-2)", borderRadius: "5px", fontSize: "11px", color: "var(--ink-3)", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Revoke
              </button>
            )}
            {revoked.includes(i) && <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>Revoked</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DangerSection() {
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "3px" }}>Danger Zone</h2>
        <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Irreversible actions — proceed with caution</p>
      </div>

      <div style={{ border: "1px solid rgba(220,60,60,0.25)", borderRadius: "10px", overflow: "hidden" }}>
        {/* Export data */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(220,60,60,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)", marginBottom: "3px" }}>Export my data</div>
            <div style={{ fontSize: "12px", color: "var(--ink-3)" }}>Download all your business data as a CSV file.</div>
          </div>
          <button style={{ padding: "7px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", color: "var(--ink-2)", whiteSpace: "nowrap" }}>
            Export
          </button>
        </div>

        {/* Delete account */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#DC2626", marginBottom: "3px" }}>Delete account</div>
          <div style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "14px" }}>
            Permanently delete your KasiTrade account and all associated data. This cannot be undone.
          </div>

          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.3)", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#DC2626", cursor: "pointer", fontFamily: "inherit" }}>
              <Trash2 size={13} /> Delete my account
            </button>
          ) : (
            <div style={{ padding: "14px", background: "rgba(220,60,60,0.05)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                <AlertTriangle size={14} color="#DC2626" />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#DC2626" }}>This will permanently delete everything.</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "12px" }}>
                Type <strong>DELETE</strong> to confirm.
              </p>
              <input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1px solid rgba(220,60,60,0.3)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", marginBottom: "10px", outline: "none" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={confirmText !== "DELETE"}
                  style={{ padding: "8px 16px", background: confirmText === "DELETE" ? "#DC2626" : "rgba(220,60,60,0.2)", color: confirmText === "DELETE" ? "#fff" : "rgba(220,60,60,0.5)", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: confirmText === "DELETE" ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all .15s" }}>
                  Confirm delete
                </button>
                <button onClick={() => { setShowConfirm(false); setConfirmText(""); }}
                  style={{ padding: "8px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "13px", color: "var(--ink-3)", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Branding Section ──────────────────────────────────────────────
function BrandingSection() {
  const [color,     setColor]     = useState(DUMMY.branding.primaryColor);
  const [tagline,   setTagline]   = useState(DUMMY.branding.tagline);
  const [logoName,  setLogoName]  = useState("");
  const [stampName, setStampName] = useState("");
  const [sigName,   setSigName]   = useState("");
  const [saved,     setSaved]     = useState(false);

  const PRESETS = ["#16A34A","#2563EB","#DC2626","#D97706","#7C3AED","#0F172A","#0891B2","#DB2777"];

  function handleFile(setter: (n: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) setter(f.name);
    };
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const UploadBox = ({ label, fileName, inputId, onChange, hint }: {
    label: string; fileName: string; inputId: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; hint: string;
  }) => (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px" }}>
        {label}
      </label>
      <label htmlFor={inputId} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "2px dashed var(--border-2)", borderRadius: "8px", cursor: "pointer", background: "var(--surface-2)", transition: "border-color .15s" }}
        onMouseEnter={e => (e.currentTarget as HTMLLabelElement).style.borderColor = "#16A34A"}
        onMouseLeave={e => (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--border-2)"}
      >
        <FileImage size={18} color="var(--ink-3)" />
        <div>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--ink-2)" }}>
            {fileName || "Click to upload"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "1px" }}>{hint}</div>
        </div>
        {fileName && <Check size={14} color="#16A34A" style={{ marginLeft: "auto" }} />}
      </label>
      <input id={inputId} type="file" accept="image/*" onChange={onChange} style={{ display: "none" }} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "3px" }}>Business Branding</h2>
        <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Logo, colours and signature for your documents</p>
      </div>

      {/* Live preview strip */}
      <div style={{ padding: "16px 20px", borderRadius: "10px", marginBottom: "22px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${color}55` }}>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>T</span>
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>Thabo's Spaza Shop</div>
          <div style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "1px" }}>{tagline || "Your tagline here"}</div>
        </div>
        <div style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: "6px", background: color, color: "#fff", fontSize: "11px", fontWeight: "700" }}>
          Invoice preview
        </div>
      </div>

      {/* Brand colour */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "8px" }}>
          Brand colour
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {PRESETS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              style={{ width: "28px", height: "28px", borderRadius: "50%", background: c, border: color === c ? `3px solid var(--ink)` : "2px solid transparent", cursor: "pointer", outline: "none", transition: "transform .1s", transform: color === c ? "scale(1.15)" : "scale(1)" }}
            />
          ))}
          <input type="color" value={color} onChange={e => setColor(e.target.value)}
            style={{ width: "28px", height: "28px", borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: "none" }}
            title="Custom colour"
          />
          <span style={{ fontSize: "12px", color: "var(--ink-3)", fontFamily: "monospace" }}>{color}</span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>
          Business tagline
        </label>
        <input value={tagline} onChange={e => setTagline(e.target.value)}
          placeholder="e.g. Quality products, community prices."
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1px solid var(--border-2)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", outline: "none" }}
          onFocus={e => { e.currentTarget.style.borderColor = "#16A34A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px" }}>Appears on invoices and quotes below your business name.</div>
      </div>

      {/* File uploads */}
      <UploadBox label="Business logo"  fileName={logoName}  inputId="logo-upload"  onChange={handleFile(setLogoName)}  hint="PNG or JPG · max 2MB · shown on all documents" />
      <UploadBox label="Official stamp" fileName={stampName} inputId="stamp-upload" onChange={handleFile(setStampName)} hint="PNG with transparent background recommended" />
      <UploadBox label="Signature"      fileName={sigName}   inputId="sig-upload"   onChange={handleFile(setSigName)}   hint="PNG with transparent background · shown on contracts" />

      <button onClick={handleSave}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: saved ? "#15803D" : "#16A34A", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "background .15s", marginTop: "4px" }}>
        {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save branding</>}
      </button>
    </div>
  );
}

// ── Invoice Settings Section ───────────────────────────────────────
function InvoiceSettingsSection() {
  const [settings, setSettings] = useState(DUMMY.invoiceSettings);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof settings) => (v: string) => setSettings(s => ({ ...s, [k]: v }));

  const TERMS_OPTIONS = ["7", "14", "30", "60", "90"];
  const VAT_OPTIONS   = ["0", "15"];

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Field = ({ label, icon: Icon, value, onChange, placeholder, hint, type = "text" }: {
    label: string; icon: React.ElementType; value: string;
    onChange: (v: string) => void; placeholder?: string; hint?: string; type?: string;
  }) => (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>
        <Icon size={10} /> {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1px solid var(--border-2)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", outline: "none" }}
        onFocus={e => { e.currentTarget.style.borderColor = "#16A34A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "none"; }}
      />
      {hint && <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "3px" }}>{hint}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "3px" }}>Invoice Settings</h2>
        <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Default values applied to every new invoice and quote</p>
      </div>

      {/* Live preview */}
      <div style={{ padding: "14px 18px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "22px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Next invoice",  value: `${settings.prefix}-${settings.nextNumber.padStart(3, "0")}` },
          { label: "VAT rate",      value: `${settings.vatRate}%`                                        },
          { label: "Payment terms", value: `${settings.paymentTerms} days`                              },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "3px" }}>{label}</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Numbering */}
      <div style={{ padding: "16px 18px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-2)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Hash size={12} /> Document numbering
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="Invoice prefix" icon={Hash}    value={settings.prefix}     onChange={set("prefix")}     placeholder="INV"  hint="e.g. INV, QT, REC" />
          <Field label="Next number"    icon={Hash}    value={settings.nextNumber} onChange={set("nextNumber")} placeholder="001"  hint="Auto-increments after each invoice" />
        </div>
      </div>

      {/* Tax & terms */}
      <div style={{ padding: "16px 18px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-2)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Percent size={12} /> Tax & payment terms
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px" }}>
            Default VAT rate
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {VAT_OPTIONS.map(v => (
              <button key={v} onClick={() => set("vatRate")(v)}
                style={{ padding: "8px 20px", borderRadius: "6px", border: `1px solid ${settings.vatRate === v ? "#16A34A" : "var(--border)"}`, background: settings.vatRate === v ? "rgba(22,163,74,0.1)" : "var(--surface)", color: settings.vatRate === v ? "#16A34A" : "var(--ink-2)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                {v}%
              </button>
            ))}
            <input type="number" value={settings.vatRate} onChange={e => set("vatRate")(e.target.value)} min="0" max="100"
              placeholder="Custom"
              style={{ width: "90px", padding: "8px 12px", border: "1px solid var(--border-2)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", outline: "none" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px" }}>
            Payment terms (days)
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {TERMS_OPTIONS.map(t => (
              <button key={t} onClick={() => set("paymentTerms")(t)}
                style={{ padding: "8px 16px", borderRadius: "6px", border: `1px solid ${settings.paymentTerms === t ? "#16A34A" : "var(--border)"}`, background: settings.paymentTerms === t ? "rgba(22,163,74,0.1)" : "var(--surface)", color: settings.paymentTerms === t ? "#16A34A" : "var(--ink-2)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                {t} days
              </button>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "5px" }}>
            Shown as "Payment due in {settings.paymentTerms} days" on invoices.
          </div>
        </div>
      </div>

      {/* Banking details */}
      <div style={{ padding: "16px 18px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--ink-2)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <CreditCard size={12} /> Banking details (printed on invoices)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="Bank name"      icon={CreditCard} value={settings.bankName}      onChange={set("bankName")}      placeholder="e.g. FNB"       />
          <Field label="Account number" icon={Hash}       value={settings.accountNumber} onChange={set("accountNumber")} placeholder="e.g. 62012345678" />
        </div>
        <Field label="Branch code" icon={Hash} value={settings.branchCode} onChange={set("branchCode")} placeholder="e.g. 250655" />
      </div>

      {/* Default notes */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "5px" }}>
          <FileText size={10} /> Default invoice notes
        </label>
        <textarea value={settings.notes} onChange={e => set("notes")(e.target.value)} rows={3}
          placeholder="e.g. Thank you for your business. Please pay within the agreed terms."
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1px solid var(--border-2)", borderRadius: "6px", fontSize: "13px", color: "var(--ink)", background: "var(--surface)", fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: "1.5" }}
          onFocus={e => { e.currentTarget.style.borderColor = "#16A34A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,163,74,0.1)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "3px" }}>Appears at the bottom of every invoice.</div>
      </div>

      <button onClick={handleSave}
        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: saved ? "#15803D" : "#16A34A", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}>
        {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save invoice settings</>}
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
const TABS = [
  { id: "profile",         icon: User,      label: "Personal Details"   },
  { id: "business",        icon: Building2, label: "Business Profile"   },
  { id: "branding",        icon: Palette,   label: "Branding"           },
  { id: "invoice",         icon: Receipt,   label: "Invoice Settings"   },
  { id: "password",        icon: Lock,      label: "Change Password"    },
  { id: "notifications",   icon: Bell,      label: "Notifications"      },
  { id: "security",        icon: Shield,    label: "Security"           },
  { id: "danger",          icon: Trash2,    label: "Danger Zone"        },
];

export default function ProfilePage() {
  const [active, setActive] = useState("profile");

  return (
    <main className="main-content">
      <div className="page-wrap">

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "4px" }}>Profile & Settings</h1>
          <p style={{ color: "var(--ink-3)", fontSize: "13px" }}>Manage your account, business, and preferences</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "16px", alignItems: "start" }}>

          {/* Sidebar nav */}
          <div className="card" style={{ padding: "10px", position: "sticky", top: "16px" }}>
            <div style={{ display: "grid", gap: "2px" }}>
              {TABS.map(t => (
                <SectionTab key={t.id} {...t} active={active === t.id} onClick={() => setActive(t.id)} />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="card" style={{ padding: "26px 28px", minHeight: "400px" }}>
            {active === "profile"       && <ProfileSection />}
            {active === "business"      && <BusinessSection />}
            {active === "branding"      && <BrandingSection />}
            {active === "invoice"       && <InvoiceSettingsSection />}
            {active === "password"      && <PasswordSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "security"      && <SecuritySection />}
            {active === "danger"        && <DangerSection />}
          </div>

        </div>
      </div>
    </main>
  );
}