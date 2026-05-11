"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { students, SUPPORT_TYPES, SupportType } from "@/lib/data";
import { Check, Edit2, X } from "lucide-react";

export default function StudentProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  const profile = students.find(s => s.id === user.id);
  if (!profile) return <main className="main-content"><p style={{ color:"var(--ink-3)" }}>Profile not found.</p></main>;

  const [editing, setEditing] = useState(false);
  const [bio,    setBio]    = useState(profile.bio);
  const [skills, setSkills] = useState<SupportType[]>([...profile.skills]);

  function toggleSkill(s: SupportType) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function save() {
    if (!profile) return;
    profile.bio    = bio;
    profile.skills = [...skills];
    setEditing(false);
  }

  return (
    <main className="main-content">
      <div className="page-wrap-sm">
        <div className="page-header">
          <h1>My Profile</h1>
          {!editing
            ? <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}><Edit2 size={13} /> Edit</button>
            : <div style={{ display:"flex", gap:"8px" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}><X size={13} /> Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={save}><Check size={13} /> Save</button>
              </div>
          }
        </div>

        {/* Identity */}
        <div className="card" style={{ padding:"24px 28px", marginBottom:"16px" }}>
          <div style={{ display:"flex", gap:"16px", alignItems:"center", marginBottom:"20px" }}>
            <div style={{ width:"60px", height:"60px", background:"#DCFCE7", border:"2px solid #86EFAC", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:"700", color:"#14532D", flexShrink:0 }}>
              {profile.avatar}
            </div>
            <div>
              <h2 style={{ marginBottom:"2px" }}>{profile.name}</h2>
              <div style={{ fontSize:"13px", color:"var(--ink-3)" }}>{profile.course} · Year {profile.yearOfStudy}</div>
              <div style={{ fontSize:"13px", color:"var(--ink-3)" }}>{profile.institution}</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            {[
              { l:"Email",         v:profile.email },
              { l:"Phone",         v:profile.phone },
              { l:"Joined",        v:profile.joinedAt },
              { l:"Status",        v:profile.active ? "Active" : "Inactive" },
            ].map(({ l, v }) => (
              <div key={l}>
                <div className="label" style={{ marginBottom:"3px" }}>{l}</div>
                <div style={{ fontSize:"13px", color:"var(--ink)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="card" style={{ padding:"20px 24px", marginBottom:"16px" }}>
          <div className="section-label" style={{ marginBottom:"10px" }}>About Me</div>
          {editing
            ? <textarea className="input" rows={4} value={bio} onChange={e => setBio(e.target.value)} />
            : <p style={{ fontSize:"13px", lineHeight:"1.65" }}>{profile.bio}</p>
          }
        </div>

        {/* Skills */}
        <div className="card" style={{ padding:"20px 24px" }}>
          <div className="section-label" style={{ marginBottom:"12px" }}>Areas of Expertise</div>
          {editing ? (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"7px" }}>
              {SUPPORT_TYPES.map(t => (
                <button key={t} type="button" onClick={() => toggleSkill(t)}
                  style={{ padding:"9px 12px", textAlign:"left", background: skills.includes(t) ? "#DCFCE7" : "var(--surface-2)", border:`1.5px solid ${skills.includes(t) ? "#16A34A" : "var(--border-2)"}`, borderRadius:"7px", cursor:"pointer", fontSize:"12.5px", fontWeight: skills.includes(t) ? "600" : "400", color: skills.includes(t) ? "#14532D" : "var(--ink-2)", fontFamily:"inherit", transition:"all .12s" }}>
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
              {profile.skills.map(s => <span key={s} className="badge badge-green" style={{ fontSize:"11px" }}>{s}</span>)}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
