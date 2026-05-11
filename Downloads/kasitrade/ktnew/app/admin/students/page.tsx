"use client";
import { useState } from "react";
import {
  students as seedStudents, supportRequests, requestMatches, bookings,
  ratings, SUPPORT_TYPES, SupportType, StudentProfile,
} from "@/lib/data";
import { Plus, X, Check, Star, Users, CheckSquare, ChevronRight } from "lucide-react";

function Stars({ v }: { v: number }) {
  return (
    <div style={{ display:"flex", gap:"2px" }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={12} fill={n<=Math.round(v)?"#D97706":"none"} color={n<=Math.round(v)?"#D97706":"#D1D5DB"} />
      ))}
    </div>
  );
}

const EMPTY_FORM = {
  firstName:"", lastName:"", email:"", phone:"",
  institution:"", course:"", yearOfStudy:"1",
  bio:"", skills: [] as SupportType[],
};

export default function AdminStudentsPage() {
  const [studentList, setStudentList] = useState<StudentProfile[]>([...seedStudents]);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ ...EMPTY_FORM });
  const [errors, setErrors]           = useState<Record<string,string>>({});
  const [detail, setDetail]           = useState<StudentProfile | null>(null);

  function toggleSkill(s: SupportType) {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s],
    }));
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    if (!form.institution.trim()) e.institution = "Required";
    if (!form.course.trim())    e.course    = "Required";
    if (!form.skills.length)    e.skills    = "Select at least one skill";
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleAdd() {
    if (!validate()) return;
    const s: StudentProfile = {
      id: "s" + Date.now(),
      name: `${form.firstName} ${form.lastName}`,
      email: form.email, phone: form.phone,
      institution: form.institution, course: form.course,
      yearOfStudy: parseInt(form.yearOfStudy) || 1,
      skills: form.skills,
      bio: form.bio,
      avatar: `${form.firstName[0]}${form.lastName[0]}`.toUpperCase(),
      joinedAt: new Date().toISOString().split("T")[0],
      active: true,
      requestsReceived: 0, requestsAccepted: 0,
      sessionsCompleted: 0, avgRating: 0, ratingCount: 0,
    };
    seedStudents.push(s);
    setStudentList([...seedStudents]);
    setForm({ ...EMPTY_FORM }); setErrors({}); setShowForm(false);
  }

  function toggleActive(id: string) {
    const s = seedStudents.find(s => s.id === id);
    if (s) s.active = !s.active;
    setStudentList([...seedStudents]);
    if (detail?.id === id) setDetail({ ...s! });
  }

  const totalRequests  = supportRequests.length;
  const open           = supportRequests.filter(r => r.status === "open").length;
  const completed      = supportRequests.filter(r => r.status === "completed").length;
  const activeStudents = studentList.filter(s => s.active).length;

  return (
    <main className="main-content">
      <div className="page-wrap">

        <div className="page-header">
          <div>
            <h1 style={{ marginBottom:"4px" }}>Student Management</h1>
            <p style={{ fontSize:"13px", color:"var(--ink-3)" }}>Manage students in the SME Support System.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Add Student
          </button>
        </div>

        {/* Platform stats */}
        <div className="kpi-row" style={{ marginBottom:"24px" }}>
          {[
            { label:"Active Students",   value:activeStudents                            },
            { label:"Total Requests",    value:totalRequests                             },
            { label:"Open / Unmatched",  value:open                                      },
            { label:"Completed Sessions",value:completed                                  },
          ].map(({ label, value }) => (
            <div key={label} className="kpi-cell">
              <div className="section-label" style={{ marginBottom:"6px" }}>{label}</div>
              <div className="stat-num">{value}</div>
            </div>
          ))}
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card" style={{ padding:"24px 28px", marginBottom:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h3>Add New Student</h3>
              <button onClick={() => setShowForm(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink-3)" }}><X size={18}/></button>
            </div>

            <div className="form-row-2" style={{ marginBottom:"14px" }}>
              <div>
                <label className="label">First name *</label>
                <input className="input" value={form.firstName} onChange={e => setForm(f=>({...f,firstName:e.target.value}))} placeholder="Lebogang" style={{ borderColor:errors.firstName?"var(--red)":undefined }} />
                {errors.firstName && <p style={{ fontSize:"11px",color:"var(--red)",marginTop:"3px" }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="label">Last name *</label>
                <input className="input" value={form.lastName} onChange={e => setForm(f=>({...f,lastName:e.target.value}))} placeholder="Mosia" style={{ borderColor:errors.lastName?"var(--red)":undefined }} />
                {errors.lastName && <p style={{ fontSize:"11px",color:"var(--red)",marginTop:"3px" }}>{errors.lastName}</p>}
              </div>
            </div>

            <div className="form-row-2" style={{ marginBottom:"14px" }}>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="lebo@uj.ac.za" style={{ borderColor:errors.email?"var(--red)":undefined }} />
                {errors.email && <p style={{ fontSize:"11px",color:"var(--red)",marginTop:"3px" }}>{errors.email}</p>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="073 111 2233" />
              </div>
            </div>

            <div className="form-row-2" style={{ marginBottom:"14px" }}>
              <div>
                <label className="label">Institution *</label>
                <input className="input" value={form.institution} onChange={e => setForm(f=>({...f,institution:e.target.value}))} placeholder="University of Johannesburg" style={{ borderColor:errors.institution?"var(--red)":undefined }} />
                {errors.institution && <p style={{ fontSize:"11px",color:"var(--red)",marginTop:"3px" }}>{errors.institution}</p>}
              </div>
              <div>
                <label className="label">Course *</label>
                <input className="input" value={form.course} onChange={e => setForm(f=>({...f,course:e.target.value}))} placeholder="BCom Accounting" style={{ borderColor:errors.course?"var(--red)":undefined }} />
                {errors.course && <p style={{ fontSize:"11px",color:"var(--red)",marginTop:"3px" }}>{errors.course}</p>}
              </div>
            </div>

            <div style={{ marginBottom:"14px" }}>
              <label className="label">Year of study</label>
              <select className="input" value={form.yearOfStudy} onChange={e => setForm(f=>({...f,yearOfStudy:e.target.value}))}>
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:"14px" }}>
              <label className="label">Areas of expertise *</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))", gap:"6px" }}>
                {SUPPORT_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => toggleSkill(t)}
                    style={{ padding:"8px 11px", textAlign:"left", background:form.skills.includes(t)?"#DCFCE7":"var(--surface-2)", border:`1.5px solid ${form.skills.includes(t)?"#16A34A":"var(--border-2)"}`, borderRadius:"6px", cursor:"pointer", fontSize:"12px", fontWeight:form.skills.includes(t)?"600":"400", color:form.skills.includes(t)?"#14532D":"var(--ink-2)", fontFamily:"inherit", transition:"all .12s" }}>
                    {t}
                  </button>
                ))}
              </div>
              {errors.skills && <p style={{ fontSize:"11px",color:"var(--red)",marginTop:"5px" }}>{errors.skills}</p>}
            </div>

            <div style={{ marginBottom:"20px" }}>
              <label className="label">Short bio</label>
              <textarea className="input" rows={2} value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="Brief description of the student and their focus area..." />
            </div>

            <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}><Check size={14}/> Add Student</button>
            </div>
          </div>
        )}

        {/* Student list */}
        {detail ? (
          // Detail view
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setDetail(null)} style={{ marginBottom:"20px" }}>← All Students</button>
            <div className="grid-2" style={{ alignItems:"start" }}>
              <div>
                <div className="card" style={{ padding:"22px 26px", marginBottom:"14px" }}>
                  <div style={{ display:"flex", gap:"14px", alignItems:"center", marginBottom:"16px" }}>
                    <div style={{ width:"52px", height:"52px", background:"#DCFCE7", border:"2px solid #86EFAC", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:"700", color:"#14532D", flexShrink:0 }}>{detail.avatar}</div>
                    <div>
                      <h2 style={{ marginBottom:"2px" }}>{detail.name}</h2>
                      <p style={{ fontSize:"13px", color:"var(--ink-3)" }}>{detail.course} · Year {detail.yearOfStudy} · {detail.institution}</p>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
                    {[
                      { l:"Email",   v:detail.email  },
                      { l:"Phone",   v:detail.phone  },
                      { l:"Joined",  v:detail.joinedAt },
                      { l:"Status",  v:detail.active ? "Active" : "Inactive" },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <div className="label" style={{ marginBottom:"2px" }}>{l}</div>
                        <div style={{ fontSize:"13px" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {detail.bio && <p style={{ fontSize:"13px", color:"var(--ink-2)", lineHeight:"1.6" }}>{detail.bio}</p>}
                  <div style={{ marginTop:"14px", display:"flex", flexWrap:"wrap", gap:"5px" }}>
                    {detail.skills.map(s => <span key={s} className="badge badge-green" style={{ fontSize:"10px" }}>{s}</span>)}
                  </div>
                </div>
                <button className={`btn btn-sm ${detail.active ? "btn-danger" : "btn-secondary"}`} onClick={() => toggleActive(detail.id)}>
                  {detail.active ? "Deactivate Student" : "Reactivate Student"}
                </button>
              </div>
              <div>
                <div className="card" style={{ padding:"20px 22px" }}>
                  <div className="section-label" style={{ marginBottom:"14px" }}>Performance Summary</div>
                  {[
                    { l:"Requests Received",   v:detail.requestsReceived  },
                    { l:"Requests Accepted",   v:detail.requestsAccepted  },
                    { l:"Sessions Completed",  v:detail.sessionsCompleted },
                    { l:"Rating Count",        v:detail.ratingCount       },
                  ].map(({ l, v }) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontSize:"13px", color:"var(--ink-2)" }}>{l}</span>
                      <span style={{ fontSize:"13px", fontWeight:"600" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", alignItems:"center" }}>
                    <span style={{ fontSize:"13px", color:"var(--ink-2)" }}>Avg. Rating</span>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <Stars v={detail.avgRating} />
                      <span style={{ fontSize:"13px", fontWeight:"600" }}>{detail.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // List view
          <div className="card" style={{ overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table className="tbl" style={{ minWidth:"680px" }}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Institution</th>
                    <th>Skills</th>
                    <th style={{ textAlign:"center" }}>Accepted</th>
                    <th style={{ textAlign:"center" }}>Completed</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map(s => (
                    <tr key={s.id} style={{ cursor:"pointer" }} onClick={() => setDetail(s)}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
                          <div style={{ width:"32px", height:"32px", background:"#DCFCE7", border:"1px solid #86EFAC", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:"700", color:"#14532D", flexShrink:0 }}>{s.avatar}</div>
                          <div>
                            <div style={{ fontSize:"13px", fontWeight:"600" }}>{s.name}</div>
                            <div style={{ fontSize:"11px", color:"var(--ink-3)" }}>{s.course} · Y{s.yearOfStudy}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize:"12px", color:"var(--ink-2)" }}>{s.institution}</td>
                      <td>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                          {s.skills.slice(0,2).map(sk => <span key={sk} className="badge badge-blue" style={{ fontSize:"9px" }}>{sk}</span>)}
                          {s.skills.length > 2 && <span className="badge badge-white" style={{ fontSize:"9px" }}>+{s.skills.length-2}</span>}
                        </div>
                      </td>
                      <td style={{ textAlign:"center", fontWeight:"600" }}>{s.requestsAccepted}</td>
                      <td style={{ textAlign:"center", fontWeight:"600" }}>{s.sessionsCompleted}</td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                          <Stars v={s.avgRating} />
                          <span style={{ fontSize:"12px", fontWeight:"600" }}>{s.avgRating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td><span className={`badge ${s.active?"badge-green":"badge-yellow"}`}>{s.active?"Active":"Inactive"}</span></td>
                      <td><ChevronRight size={14} color="var(--ink-4)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
