"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Printer } from "lucide-react";

const contractTypes = [
  "Permanent Employment","Fixed-Term Contract","Part-Time Employment",
  "Casual / Temporary Employment","Independent Contractor","Internship / Learnership",
];

function fmt(n: number) {
  return "R " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ContractPage() {
  const { user } = useAuth();
  const business = user?.business;
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    employeeName: "", idNumber: "", role: "",
    contractType: "Permanent Employment",
    costToCompany: "", startDate: today, endDate: "", duration: "",
    noticePeriod: "30", probationPeriod: "3", workingHours: "40",
    workingDays: "Monday to Friday", leaveEntitlement: "15",
    additionalTerms: "",
  });

  function upd(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const ctc = parseFloat(form.costToCompany) || 0;
  const isFixed = form.contractType === "Fixed-Term Contract";
  const signDate = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  const clauses = [
    {
      num: "1", title: "Position & Duties",
      body: `The Employee is appointed to the position of <strong>${form.role || "[Role]"}</strong>. The Employee shall perform all duties reasonably required by the Employer in connection with this position.`
    },
    {
      num: "2", title: "Commencement & Duration",
      body: isFixed
        ? `This contract commences on <strong>${form.startDate || "[Start Date]"}</strong> and terminates on <strong>${form.endDate || "[End Date]"}</strong>, unless terminated earlier in accordance with this Agreement.`
        : `This contract commences on <strong>${form.startDate || "[Start Date]"}</strong> and shall continue indefinitely until terminated in accordance with this Agreement.`
    },
    {
      num: "3", title: "Remuneration",
      body: `The Employee shall receive a total cost to company (CTC) of <strong>${ctc ? fmt(ctc) : "R [amount]"} per month</strong>. This amount encompasses all remuneration, benefits, and statutory contributions. Salary shall be paid on the last working day of each month.`
    },
    {
      num: "4", title: "Working Hours",
      body: `The Employee shall work a maximum of <strong>${form.workingHours} hours per week</strong>, from <strong>${form.workingDays}</strong>. Reasonable overtime may be required in accordance with the Basic Conditions of Employment Act.`
    },
    {
      num: "5", title: "Probationary Period",
      body: `Employment is subject to a probationary period of <strong>${form.probationPeriod} months</strong>. During this period, either party may terminate with <strong>7 days' written notice</strong>.`
    },
    {
      num: "6", title: "Leave Entitlement",
      body: `The Employee is entitled to <strong>${form.leaveEntitlement} days annual leave</strong> per annum, taken at times agreed with the Employer in accordance with the Basic Conditions of Employment Act.`
    },
    {
      num: "7", title: "Notice Period",
      body: `Either party may terminate this contract by giving <strong>${form.noticePeriod} days' written notice</strong>. The Employer reserves the right to pay out notice in lieu of service.`
    },
    {
      num: "8", title: "Confidentiality",
      body: `The Employee agrees to maintain strict confidentiality regarding all business affairs, client information, pricing, and trade secrets, both during and after employment.`
    },
    {
      num: "9", title: "Governing Law",
      body: `This Agreement is governed by the laws of the Republic of South Africa, including the Labour Relations Act, Basic Conditions of Employment Act, and Employment Equity Act.`
    },
  ];

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div style={{ marginBottom: "24px" }}>
          <div className="section-label" style={{ marginBottom: "6px" }}>Documents</div>
          <h1 style={{ marginBottom: "4px" }}>Contract Generator</h1>
          <p style={{ color: "var(--text-3)", fontSize: "13px" }}>Complete the fields below to generate a formal employment contract.</p>
        </div>

        {/* Form */}
        <div className="grid-2" style={{ marginBottom: "20px" }}>
          {/* Employee details */}
          <div className="card" style={{ padding: "20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>Employee Details</div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label className="label">Full Legal Name *</label>
                <input className="input" placeholder="As per ID document" value={form.employeeName} onChange={e => upd("employeeName", e.target.value)} />
              </div>
              <div>
                <label className="label">ID / Passport Number *</label>
                <input className="input" placeholder="RSA ID or Passport #" value={form.idNumber} onChange={e => upd("idNumber", e.target.value)} />
              </div>
              <div>
                <label className="label">Job Title / Role *</label>
                <input className="input" placeholder="e.g. Electrician, Chef, Driver" value={form.role} onChange={e => upd("role", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Contract details */}
          <div className="card" style={{ padding: "20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>Contract Details</div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label className="label">Contract Type *</label>
                <select className="input" value={form.contractType} onChange={e => upd("contractType", e.target.value)}>
                  {contractTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Cost to Company / Month (R) *</label>
                <input className="input" type="number" placeholder="0.00" value={form.costToCompany} onChange={e => upd("costToCompany", e.target.value)} />
              </div>
              <div className="form-row-2">
                <div>
                  <label className="label">Start Date *</label>
                  <input className="input" type="date" value={form.startDate} onChange={e => upd("startDate", e.target.value)} />
                </div>
                {isFixed ? (
                  <div>
                    <label className="label">End Date *</label>
                    <input className="input" type="date" value={form.endDate} onChange={e => upd("endDate", e.target.value)} />
                  </div>
                ) : (
                  <div>
                    <label className="label">Duration</label>
                    <input className="input" placeholder="e.g. Indefinite" value={form.duration} onChange={e => upd("duration", e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Working conditions */}
          <div className="card" style={{ padding: "20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>Working Conditions</div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div className="form-row-2">
                <div>
                  <label className="label">Hours / Week</label>
                  <input className="input" type="number" placeholder="40" value={form.workingHours} onChange={e => upd("workingHours", e.target.value)} />
                </div>
                <div>
                  <label className="label">Annual Leave (days)</label>
                  <input className="input" type="number" placeholder="15" value={form.leaveEntitlement} onChange={e => upd("leaveEntitlement", e.target.value)} />
                </div>
              </div>
              <div className="form-row-2">
                <div>
                  <label className="label">Probation (months)</label>
                  <input className="input" type="number" placeholder="3" value={form.probationPeriod} onChange={e => upd("probationPeriod", e.target.value)} />
                </div>
                <div>
                  <label className="label">Notice Period (days)</label>
                  <input className="input" type="number" placeholder="30" value={form.noticePeriod} onChange={e => upd("noticePeriod", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Working Days</label>
                <input className="input" placeholder="Monday to Friday" value={form.workingDays} onChange={e => upd("workingDays", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Additional terms */}
          <div className="card" style={{ padding: "20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>Additional Terms (optional)</div>
            <textarea
              className="input"
              style={{ height: "180px" }}
              placeholder="Add any special conditions, bonuses, benefits, or other terms specific to this role…"
              value={form.additionalTerms}
              onChange={e => upd("additionalTerms", e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "32px", flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            disabled={!form.employeeName || !form.idNumber || !form.role || !form.costToCompany}
          >
            <Printer size={14} /> Print / Save PDF
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>Save as PDF</button>
        </div>

        {/* ── Contract Document (print target) ── */}
        <div
          id="contract-doc"
          className="print-target"
          style={{ background: "#fff", color: "#000", border: "1px solid var(--border)", borderRadius: "6px", padding: "clamp(24px, 5vw, 56px)", maxWidth: "820px", fontFamily: "Georgia, serif", lineHeight: "1.7" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "3px solid #000", paddingBottom: "24px", marginBottom: "32px" }}>
            <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "3px", fontFamily: "Inter, sans-serif" }}>{business?.name || "[Business Name]"}</div>
            <div style={{ fontSize: "11px", color: "#666", fontFamily: "Inter, sans-serif" }}>{business?.location} · {business?.phone}</div>
            <div style={{ marginTop: "18px", fontSize: "20px", fontWeight: "700", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Employment Contract</div>
            <div style={{ marginTop: "4px", fontSize: "12px", color: "#555", fontFamily: "Inter, sans-serif" }}>{form.contractType}</div>
          </div>

          <p style={{ fontSize: "13px", marginBottom: "20px" }}>
            This Employment Contract (<strong>"Agreement"</strong>) is entered into on <strong>{signDate}</strong> between:
          </p>

          {/* Parties */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", padding: "18px 22px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "24px", background: "#fafafa" }}>
            <div>
              <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Employer</div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>{business?.name || "[Business Name]"}</div>
              <div style={{ fontSize: "12px", color: "#555" }}>{business?.location}</div>
              <div style={{ fontSize: "12px", color: "#555" }}>{business?.sector}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: "6px", fontFamily: "Inter, sans-serif" }}>Employee</div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>{form.employeeName || "[Employee Name]"}</div>
              <div style={{ fontSize: "12px", color: "#555" }}>ID/Passport: {form.idNumber || "[ID Number]"}</div>
            </div>
          </div>

          {/* Clauses */}
          {clauses.map(c => (
            <div key={c.num} style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "5px", fontFamily: "Inter, sans-serif" }}>{c.num}. {c.title}</div>
              <p style={{ fontSize: "13px", color: "#333" }} dangerouslySetInnerHTML={{ __html: c.body }} />
            </div>
          ))}

          {form.additionalTerms && (
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "5px", fontFamily: "Inter, sans-serif" }}>10. Additional Terms & Conditions</div>
              <p style={{ fontSize: "13px", color: "#333", whiteSpace: "pre-line" }}>{form.additionalTerms}</p>
            </div>
          )}

          {/* Signatures */}
          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "2px solid #000" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "20px", fontFamily: "Inter, sans-serif" }}>SIGNED AND AGREED</div>
            <p style={{ fontSize: "12px", marginBottom: "28px", color: "#555" }}>
              By signing below, both parties acknowledge they have read, understood, and agree to all terms in this Agreement.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
              {[
                { label: "For and on behalf of Employer", name: business?.name || "[Business Name]", sub: "Authorised Signatory" },
                { label: "Employee", name: form.employeeName || "[Employee Name]", sub: "Employee Signature" },
              ].map(sig => (
                <div key={sig.label}>
                  <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "36px", fontFamily: "Inter, sans-serif" }}>{sig.label}</div>
                  <div style={{ borderBottom: "1px solid #000", marginBottom: "7px" }} />
                  <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "2px" }}>{sig.name}</div>
                  <div style={{ fontSize: "10px", color: "#666", fontFamily: "Inter, sans-serif", marginBottom: "12px" }}>{sig.sub}</div>
                  <div style={{ fontSize: "10px", color: "#888", fontFamily: "Inter, sans-serif" }}>Date: ___________________________</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "36px", paddingTop: "12px", borderTop: "1px solid #ddd", textAlign: "center", fontSize: "10px", color: "#bbb", fontFamily: "Inter, sans-serif" }}>
            Generated by KasiTrade Business Platform · {business?.name} · {new Date().toLocaleDateString("en-ZA")}
          </div>
        </div>

        <style>{`@media print{body *{visibility:hidden}#contract-doc,#contract-doc *{visibility:visible}#contract-doc{position:fixed;left:0;top:0;width:100%;background:#fff!important;padding:32px!important;border:none!important}}`}</style>
      </div>
    </main>
  );
}
