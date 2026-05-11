"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { getEmployeesForUser, Employee } from "@/lib/data";
import { useRouter } from "next/navigation";
import {
  Plus, X, Check, Mail, Phone, User, Briefcase,
  CreditCard, FileCheck, FileSignature, Edit2, ChevronRight, Building2,
} from "lucide-react";

function fmt(n: number) { return "R " + n.toLocaleString("en-ZA"); }

const CONTRACT_TYPES = ["Permanent","Fixed-Term","Part-Time","Casual","Contractor","Internship"] as const;

type FormState = {
  firstName: string; lastName: string; email: string; phone: string;
  idNumber: string; role: string; employeeNumber: string;
  bankName: string; accountNumber: string; startDate: string;
  contractType: string; salary: string;
};

const EMPTY: FormState = {
  firstName:"", lastName:"", email:"", phone:"",
  idNumber:"", role:"", employeeNumber:"",
  bankName:"", accountNumber:"", startDate:"",
  contractType:"Permanent", salary:"",
};

export default function WorkersPage() {
  const { user } = useAuth();
  const router   = useRouter();
  if (!user) return null;

  const [workers, setWorkers] = useState<Employee[]>(getEmployeesForUser(user.id));
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<string | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errors, setErrors]     = useState<Partial<FormState>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  function upd(k: keyof FormState, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e: Partial<FormState> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.role.trim())      e.role      = "Required";
    if (!form.idNumber.trim())  e.idNumber  = "Required";
    if (!form.startDate)        e.startDate = "Required";
    if (!form.contractType)     e.contractType = "Required";
    if (!form.salary || parseFloat(form.salary) <= 0) e.salary = "Enter a valid salary";
    setErrors(e);
    return !Object.keys(e).length;
  }

  function openAdd() {
    setForm(EMPTY); setErrors({}); setEditing(null); setShowForm(true);
  }

  function openEdit(emp: Employee) {
    setForm({
      firstName: emp.firstName, lastName: emp.lastName,
      email: emp.email, phone: emp.phone,
      idNumber: emp.idNumber, role: emp.role,
      employeeNumber: emp.employeeNumber,
      bankName: emp.bankName, accountNumber: emp.accountNumber,
      startDate: emp.startDate, contractType: emp.contractType,
      salary: String(emp.salary),
    });
    setErrors({}); setEditing(emp.id); setShowForm(true);
  }

  function handleSave() {
    if (!validate()) return;
    if (editing) {
      setWorkers(ws => ws.map(w => w.id === editing ? {
        ...w, ...form, salary: parseFloat(form.salary),
        contractType: form.contractType as Employee["contractType"],
      } : w));
    } else {
      const newEmp: Employee = {
        id: "emp" + Date.now(), userId: user!.id,
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, phone: form.phone,
        idNumber: form.idNumber, role: form.role,
        employeeNumber: form.employeeNumber || `EMP${String(workers.length + 1).padStart(3,"0")}`,
        bankName: form.bankName, accountNumber: form.accountNumber,
        startDate: form.startDate,
        contractType: form.contractType as Employee["contractType"],
        salary: parseFloat(form.salary),
        active: true,
      };
      setWorkers(ws => [...ws, newEmp]);
    }
    setShowForm(false); setEditing(null);
  }

  function handleDeactivate(id: string) {
    setWorkers(ws => ws.map(w => w.id === id ? { ...w, active: !w.active } : w));
  }

  function goPayslip(emp: Employee) {
    const params = new URLSearchParams({
      name:   `${emp.firstName} ${emp.lastName}`,
      id:     emp.idNumber,
      role:   emp.role,
      empNum: emp.employeeNumber,
      bank:   emp.bankName,
      acc:    emp.accountNumber,
      salary: String(emp.salary),
    });
    router.push(`/dashboard/payslip?${params.toString()}`);
  }

  function goContract(emp: Employee) {
    const params = new URLSearchParams({
      name:     `${emp.firstName} ${emp.lastName}`,
      id:       emp.idNumber,
      role:     emp.role,
      type:     emp.contractType,
      salary:   String(emp.salary),
      start:    emp.startDate,
    });
    router.push(`/dashboard/contract?${params.toString()}`);
  }

  const errMsg = (k: keyof FormState) => errors[k] && (
    <p style={{ fontSize:"11px", color:"var(--red-text)", marginTop:"4px" }}>{errors[k]}</p>
  );

  const active   = workers.filter(w => w.active);
  const inactive = workers.filter(w => !w.active);

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 style={{ marginBottom:"4px" }}>Workers & Team</h1>
            <p style={{ color:"var(--ink-3)", fontSize:"13px" }}>
              {active.length} active worker{active.length !== 1 ? "s" : ""}
              {inactive.length > 0 && ` · ${inactive.length} inactive`}
            </p>
          </div>
          {!showForm && (
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={14} /> Add Worker
            </button>
          )}
        </div>

        {/* ── Add / Edit Form ── */}
        {showForm && (
          <div className="card" style={{ overflow:"hidden", marginBottom:"20px" }}>
            <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3>{editing ? "Edit Worker" : "Add New Worker"}</h3>
              <button onClick={() => setShowForm(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink-3)" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding:"20px" }}>

              {/* Personal */}
              <div className="section-label" style={{ marginBottom:"12px" }}>Personal Details</div>
              <div className="form-row-2" style={{ marginBottom:"12px" }}>
                <div>
                  <label className="label">First name *</label>
                  <input className="input" placeholder="Sipho" value={form.firstName} onChange={e=>upd("firstName",e.target.value)} />
                  {errMsg("firstName")}
                </div>
                <div>
                  <label className="label">Last name *</label>
                  <input className="input" placeholder="Mokoena" value={form.lastName} onChange={e=>upd("lastName",e.target.value)} />
                  {errMsg("lastName")}
                </div>
              </div>

              <div className="form-row-2" style={{ marginBottom:"12px" }}>
                <div>
                  <label className="label">Email address</label>
                  <input className="input" type="email" placeholder="sipho@email.com" value={form.email} onChange={e=>upd("email",e.target.value)} />
                </div>
                <div>
                  <label className="label">Phone number</label>
                  <input className="input" type="tel" placeholder="072 345 6789" value={form.phone} onChange={e=>upd("phone",e.target.value)} />
                </div>
              </div>

              <div className="form-row-2" style={{ marginBottom:"16px" }}>
                <div>
                  <label className="label">ID number *</label>
                  <input className="input" placeholder="8001015009087" value={form.idNumber} onChange={e=>upd("idNumber",e.target.value)} />
                  {errMsg("idNumber")}
                </div>
                <div>
                  <label className="label">Employee #</label>
                  <input className="input" placeholder="EMP001 (auto if blank)" value={form.employeeNumber} onChange={e=>upd("employeeNumber",e.target.value)} />
                </div>
              </div>

              {/* Employment */}
              <div className="section-label" style={{ marginBottom:"12px" }}>Employment Details</div>
              <div className="form-row-2" style={{ marginBottom:"12px" }}>
                <div>
                  <label className="label">Job title / Role *</label>
                  <input className="input" placeholder="e.g. Electrician" value={form.role} onChange={e=>upd("role",e.target.value)} />
                  {errMsg("role")}
                </div>
                <div>
                  <label className="label">Start date *</label>
                  <input className="input" type="date" value={form.startDate} onChange={e=>upd("startDate",e.target.value)} />
                  {errMsg("startDate")}
                </div>
              </div>

              <div className="form-row-2" style={{ marginBottom:"12px" }}>
                <div>
                  <label className="label">Contract type *</label>
                  <select className="input" value={form.contractType} onChange={e=>upd("contractType",e.target.value)}>
                    {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Monthly salary (R) *</label>
                  <input className="input" type="number" min="0" placeholder="8500" value={form.salary} onChange={e=>upd("salary",e.target.value)} />
                  {errMsg("salary")}
                </div>
              </div>

              {/* Banking */}
              <div className="section-label" style={{ marginBottom:"12px" }}>Banking Details</div>
              <div className="form-row-2" style={{ marginBottom:"20px" }}>
                <div>
                  <label className="label">Bank name</label>
                  <input className="input" placeholder="FNB, Capitec, Absa…" value={form.bankName} onChange={e=>upd("bankName",e.target.value)} />
                </div>
                <div>
                  <label className="label">Account number</label>
                  <input className="input" placeholder="62XXXXXXXXX" value={form.accountNumber} onChange={e=>upd("accountNumber",e.target.value)} />
                </div>
              </div>

              <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end", borderTop:"1px solid var(--border)", paddingTop:"16px" }}>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Check size={14} /> {editing ? "Save changes" : "Add Worker"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Workers list ── */}
        {workers.length === 0 ? (
          <div className="card" style={{ padding:"48px", textAlign:"center" }}>
            <p style={{ color:"var(--ink-3)", marginBottom:"14px" }}>No workers added yet. Add your first team member to generate payslips and contracts quickly.</p>
            <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> Add First Worker</button>
          </div>
        ) : (
          <div style={{ display:"grid", gap:"10px" }}>
            {[...active, ...inactive].map(emp => {
              const isOpen = expanded === emp.id;
              return (
                <div key={emp.id} className="card" style={{ overflow:"hidden", opacity: emp.active ? 1 : 0.6 }}>
                  {/* Main row */}
                  <div
                    style={{ padding:"14px 18px", display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
                    onClick={() => setExpanded(isOpen ? null : emp.id)}
                  >
                    {/* Avatar + name */}
                    <div style={{ display:"flex", alignItems:"center", gap:"12px", flex:1, minWidth:180 }}>
                      <div style={{ width:"40px", height:"40px", background:"var(--surface-3)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", fontWeight:"700", color:"var(--ink)", flexShrink:0 }}>
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:"600", marginBottom:"2px" }}>
                          {emp.firstName} {emp.lastName}
                          {!emp.active && <span style={{ marginLeft:"8px", fontSize:"10px", background:"var(--surface-3)", border:"1px solid var(--border)", padding:"2px 7px", borderRadius:"3px", color:"var(--ink-3)" }}>Inactive</span>}
                        </div>
                        <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>{emp.role} · {emp.contractType} · {emp.employeeNumber}</div>
                      </div>
                    </div>

                    {/* Salary + quick actions */}
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                      <div style={{ textAlign:"right", marginRight:"4px" }}>
                        <div style={{ fontSize:"13px", fontWeight:"600" }}>{fmt(emp.salary)}/mo</div>
                        <div style={{ fontSize:"10px", color:"var(--ink-3)" }}>Started {emp.startDate}</div>
                      </div>
                      {emp.active && (
                        <>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={e => { e.stopPropagation(); goPayslip(emp); }}
                            title="Generate payslip"
                            style={{ gap:"5px" }}
                          >
                            <FileCheck size={13} /> Payslip
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={e => { e.stopPropagation(); goContract(emp); }}
                            title="Generate contract"
                            style={{ gap:"5px" }}
                          >
                            <FileSignature size={13} /> Contract
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={e => { e.stopPropagation(); openEdit(emp); }}
                      >
                        <Edit2 size={12} />
                      </button>
                      <ChevronRight size={16} color="var(--ink-3)" style={{ transform: isOpen ? "rotate(90deg)" : "none", transition:"transform 0.2s", flexShrink:0 }} />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop:"1px solid var(--border)", background:"var(--surface-2)" }}>
                      <div style={{ padding:"16px 18px", display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))", gap:"14px" }}>
                        {[
                          { icon:<Mail size={12}/>,     label:"Email",          value: emp.email     || "—" },
                          { icon:<Phone size={12}/>,    label:"Phone",          value: emp.phone     || "—" },
                          { icon:<User size={12}/>,     label:"ID Number",      value: emp.idNumber          },
                          { icon:<Briefcase size={12}/>,label:"Contract",       value: emp.contractType      },
                          { icon:<Building2 size={12}/>,label:"Bank",           value: emp.bankName  || "—" },
                          { icon:<CreditCard size={12}/>,label:"Account",       value: emp.accountNumber || "—" },
                        ].map(({ icon, label, value }) => (
                          <div key={label}>
                            <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"10px", color:"var(--ink-3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"3px" }}>
                              {icon} {label}
                            </div>
                            <div style={{ fontSize:"13px", color:"var(--ink-2)" }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding:"10px 18px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end", gap:"8px" }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeactivate(emp.id)}>
                          {emp.active ? "Mark Inactive" : "Reactivate"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
