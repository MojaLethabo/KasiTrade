"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Printer, Plus, Trash2 } from "lucide-react";

type Deduction = { label: string; amount: number };
type Allowance = { label: string; amount: number };
function fmt(n: number) { return "R " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();

export default function PayslipPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    employeeName:"", idNumber:"", role:"", employeeNumber:"", bankName:"", accountNumber:"",
    payMonth: String(new Date().getMonth()), payYear: String(currentYear),
    basicSalary:"", hoursWorked:"", ratePerHour:"", payType:"monthly" as "monthly"|"hourly",
  });
  const [allowances, setAllowances] = useState<Allowance[]>([{ label:"Transport Allowance", amount:0 }]);
  const [deductions, setDeductions] = useState<Deduction[]>([{ label:"PAYE", amount:0 }, { label:"UIF", amount:0 }]);

  function upd(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const grossSalary = form.payType === "monthly"
    ? parseFloat(form.basicSalary)||0
    : (parseFloat(form.hoursWorked)||0) * (parseFloat(form.ratePerHour)||0);
  const totalAllowances = allowances.reduce((s,a) => s + (a.amount||0), 0);
  const totalDeductions = deductions.reduce((s,d) => s + (d.amount||0), 0);
  const netPay = grossSalary + totalAllowances - totalDeductions;
  const payPeriod = `${months[parseInt(form.payMonth)]} ${form.payYear}`;
  const business = user!.business;

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div style={{ marginBottom:"24px" }}>
          <div className="section-label" style={{ marginBottom:"6px" }}>Documents</div>
          <h1 style={{ marginBottom:"4px" }}>Payslip Generator</h1>
          <p style={{ color:"var(--text-3)", fontSize:"13px" }}>Fill in employee details to generate a professional payslip.</p>
        </div>

        <div className="grid-2" style={{ marginBottom:"20px" }}>
          <div>
            <div className="card" style={{ padding:"20px", marginBottom:"14px" }}>
              <div className="section-label" style={{ marginBottom:"14px" }}>Employee Information</div>
              <div style={{ display:"grid", gap:"12px" }}>
                <div><label className="label">Full Name *</label><input className="input" placeholder="e.g. Sipho Dlamini" value={form.employeeName} onChange={e => upd("employeeName",e.target.value)} /></div>
                <div className="form-row-2">
                  <div><label className="label">ID Number *</label><input className="input" placeholder="8001015009087" value={form.idNumber} onChange={e => upd("idNumber",e.target.value)} /></div>
                  <div><label className="label">Employee #</label><input className="input" placeholder="EMP001" value={form.employeeNumber} onChange={e => upd("employeeNumber",e.target.value)} /></div>
                </div>
                <div><label className="label">Job Title / Role *</label><input className="input" placeholder="e.g. Electrician" value={form.role} onChange={e => upd("role",e.target.value)} /></div>
                <div className="form-row-2">
                  <div><label className="label">Bank Name</label><input className="input" placeholder="FNB" value={form.bankName} onChange={e => upd("bankName",e.target.value)} /></div>
                  <div><label className="label">Account No.</label><input className="input" placeholder="62XXXXXXXX" value={form.accountNumber} onChange={e => upd("accountNumber",e.target.value)} /></div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding:"20px" }}>
              <div className="section-label" style={{ marginBottom:"14px" }}>Pay Period</div>
              <div className="form-row-2">
                <div><label className="label">Month</label>
                  <select className="input" value={form.payMonth} onChange={e => upd("payMonth",e.target.value)}>
                    {months.map((m,i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
                <div><label className="label">Year</label>
                  <select className="input" value={form.payYear} onChange={e => upd("payYear",e.target.value)}>
                    {[currentYear-1, currentYear, currentYear+1].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ padding:"20px", marginBottom:"14px" }}>
              <div className="section-label" style={{ marginBottom:"14px" }}>Earnings</div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                {(["monthly","hourly"] as const).map(t => (
                  <button key={t} onClick={() => upd("payType",t)} className={form.payType===t ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} style={{ flex:1 }}>
                    {t==="monthly" ? "Monthly" : "Hourly"}
                  </button>
                ))}
              </div>
              {form.payType==="monthly" ? (
                <div><label className="label">Basic Salary (R)</label><input className="input" type="number" placeholder="0.00" value={form.basicSalary} onChange={e => upd("basicSalary",e.target.value)} /></div>
              ) : (
                <div className="form-row-2">
                  <div><label className="label">Hours Worked</label><input className="input" type="number" placeholder="160" value={form.hoursWorked} onChange={e => upd("hoursWorked",e.target.value)} /></div>
                  <div><label className="label">Rate/Hour (R)</label><input className="input" type="number" placeholder="0.00" value={form.ratePerHour} onChange={e => upd("ratePerHour",e.target.value)} /></div>
                </div>
              )}

              <div className="section-label" style={{ marginBottom:"10px", marginTop:"16px" }}>Allowances</div>
              {allowances.map((a,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 90px 34px", gap:"8px", marginBottom:"8px", alignItems:"center" }}>
                  <input className="input" placeholder="Label" value={a.label} onChange={e => { const arr=[...allowances]; arr[i].label=e.target.value; setAllowances(arr); }} />
                  <input className="input" type="number" placeholder="0.00" value={a.amount||""} onChange={e => { const arr=[...allowances]; arr[i].amount=parseFloat(e.target.value)||0; setAllowances(arr); }} style={{ textAlign:"right" }} />
                  <button onClick={() => setAllowances(allowances.filter((_,j)=>j!==i))} className="btn btn-ghost btn-sm" style={{ padding:"8px" }}><Trash2 size={12} /></button>
                </div>
              ))}
              <button onClick={() => setAllowances([...allowances,{label:"",amount:0}])} className="btn btn-ghost btn-sm" style={{ marginTop:"4px" }}><Plus size={12} /> Add</button>
            </div>
            <div className="card" style={{ padding:"20px" }}>
              <div className="section-label" style={{ marginBottom:"10px" }}>Deductions</div>
              {deductions.map((d,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 90px 34px", gap:"8px", marginBottom:"8px", alignItems:"center" }}>
                  <input className="input" placeholder="Label" value={d.label} onChange={e => { const arr=[...deductions]; arr[i].label=e.target.value; setDeductions(arr); }} />
                  <input className="input" type="number" placeholder="0.00" value={d.amount||""} onChange={e => { const arr=[...deductions]; arr[i].amount=parseFloat(e.target.value)||0; setDeductions(arr); }} style={{ textAlign:"right" }} />
                  <button onClick={() => setDeductions(deductions.filter((_,j)=>j!==i))} className="btn btn-ghost btn-sm" style={{ padding:"8px" }}><Trash2 size={12} /></button>
                </div>
              ))}
              <button onClick={() => setDeductions([...deductions,{label:"",amount:0}])} className="btn btn-ghost btn-sm" style={{ marginTop:"4px" }}><Plus size={12} /> Add</button>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:"10px", marginBottom:"28px", flexWrap:"wrap" }}>
          <button className="btn btn-primary" onClick={() => window.print()} disabled={!form.employeeName||!form.idNumber||!form.role}>
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        {/* Printable doc */}
        <div id="payslip-doc" className="print-target" style={{ background:"#fff", color:"#000", border:"1px solid var(--border)", borderRadius:"6px", padding:"clamp(20px,4vw,48px)", maxWidth:"800px", fontFamily:"Inter,sans-serif" }}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"28px", paddingBottom:"20px", borderBottom:"2px solid #000" }}>
            <div>
              <div style={{ fontSize:"18px", fontWeight:"800", letterSpacing:"-0.03em", marginBottom:"3px" }}>{business?.name||"Business Name"}</div>
              <div style={{ fontSize:"11px", color:"#666" }}>{business?.location}</div>
              <div style={{ fontSize:"11px", color:"#666" }}>{business?.phone}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"18px", fontWeight:"700" }}>PAYSLIP</div>
              <div style={{ fontSize:"12px", color:"#444", marginTop:"3px" }}>Period: <strong>{payPeriod}</strong></div>
              <div style={{ fontSize:"11px", color:"#666" }}>{new Date().toLocaleDateString("en-ZA")}</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"12px", marginBottom:"28px", padding:"16px 20px", background:"#f8f8f8", borderRadius:"4px" }}>
            {[
              { label:"Employee Name", value:form.employeeName||"—" },
              { label:"ID Number",     value:form.idNumber||"—" },
              { label:"Job Title",     value:form.role||"—" },
              { label:"Employee #",    value:form.employeeNumber||"—" },
              ...(form.bankName ? [{ label:"Bank", value:form.bankName }] : []),
              ...(form.accountNumber ? [{ label:"Account", value:form.accountNumber }] : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize:"9px", fontWeight:"700", color:"#999", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"3px" }}>{label}</div>
                <div style={{ fontSize:"14px", fontWeight:"600", color:"#000" }}>{value}</div>
              </div>
            ))}
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"14px" }}>
            <thead><tr style={{ borderBottom:"2px solid #000" }}>
              <th style={{ textAlign:"left", padding:"7px 0", fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em" }}>Earnings</th>
              <th style={{ textAlign:"right", padding:"7px 0", fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em" }}>Amount (R)</th>
            </tr></thead>
            <tbody>
              <tr style={{ borderBottom:"1px solid #e0e0e0" }}>
                <td style={{ padding:"9px 0", fontSize:"13px" }}>{form.payType==="monthly" ? "Basic Salary" : `Hourly Pay (${form.hoursWorked||0}hrs × R${form.ratePerHour||0})`}</td>
                <td style={{ padding:"9px 0", textAlign:"right", fontSize:"13px" }}>{fmt(grossSalary)}</td>
              </tr>
              {allowances.filter(a => a.amount>0||a.label).map((a,i) => (
                <tr key={i} style={{ borderBottom:"1px solid #e0e0e0" }}>
                  <td style={{ padding:"9px 0", fontSize:"13px", color:"#444" }}>{a.label||"Allowance"}</td>
                  <td style={{ padding:"9px 0", textAlign:"right", fontSize:"13px", color:"#444" }}>{fmt(a.amount)}</td>
                </tr>
              ))}
              <tr style={{ borderBottom:"2px solid #000", background:"#f8f8f8" }}>
                <td style={{ padding:"9px 0", fontWeight:"700", fontSize:"13px" }}>Gross Pay</td>
                <td style={{ padding:"9px 0", textAlign:"right", fontWeight:"700", fontSize:"14px" }}>{fmt(grossSalary+totalAllowances)}</td>
              </tr>
            </tbody>
          </table>
          <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"20px" }}>
            <thead><tr style={{ borderBottom:"1px solid #000" }}>
              <th style={{ textAlign:"left", padding:"7px 0", fontSize:"10px", fontWeight:"700", color:"#666", textTransform:"uppercase", letterSpacing:"0.08em" }}>Deductions</th>
              <th style={{ textAlign:"right", padding:"7px 0", fontSize:"10px", fontWeight:"700", color:"#666", textTransform:"uppercase", letterSpacing:"0.08em" }}>Amount (R)</th>
            </tr></thead>
            <tbody>
              {deductions.filter(d => d.amount>0||d.label).map((d,i) => (
                <tr key={i} style={{ borderBottom:"1px solid #e0e0e0" }}>
                  <td style={{ padding:"9px 0", fontSize:"13px", color:"#444" }}>{d.label||"Deduction"}</td>
                  <td style={{ padding:"9px 0", textAlign:"right", fontSize:"13px", color:"#444" }}>{fmt(d.amount)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding:"9px 0", fontWeight:"700", fontSize:"13px" }}>Total Deductions</td>
                <td style={{ padding:"9px 0", textAlign:"right", fontWeight:"700", fontSize:"13px" }}>{fmt(totalDeductions)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ background:"#000", color:"#fff", padding:"16px 20px", borderRadius:"4px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px", flexWrap:"wrap", gap:"10px" }}>
            <div>
              <div style={{ fontSize:"10px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", opacity:0.5, marginBottom:"3px" }}>Net Pay</div>
              <div style={{ fontSize:"11px", opacity:0.4 }}>Amount to be deposited</div>
            </div>
            <div style={{ fontSize:"24px", fontWeight:"800", letterSpacing:"-0.04em" }}>{fmt(netPay)}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"32px", marginTop:"32px" }}>
            {["Employer Signature","Employee Signature"].map(label => (
              <div key={label}>
                <div style={{ borderBottom:"1px solid #000", marginBottom:"7px", paddingBottom:"28px" }} />
                <div style={{ fontSize:"10px", color:"#666", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
                <div style={{ fontSize:"10px", color:"#999", marginTop:"2px" }}>Date: ___________________</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"28px", paddingTop:"12px", borderTop:"1px solid #e0e0e0", textAlign:"center", fontSize:"10px", color:"#bbb" }}>
            Generated by KasiTrade · {business?.name} · {payPeriod}
          </div>
        </div>
        <style>{`@media print{body *{visibility:hidden}#payslip-doc,#payslip-doc *{visibility:visible}#payslip-doc{position:fixed;left:0;top:0;width:100%}}`}</style>
      </div>
    </main>
  );
}
