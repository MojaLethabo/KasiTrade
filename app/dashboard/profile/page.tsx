"use client";
import { useAuth } from "@/lib/auth";
import { Building2, MapPin, Phone, Users, Briefcase } from "lucide-react";
export default function ProfilePage() {
  const { user } = useAuth();
  if (!user || !user.business) return null;
  const b = user.business;
  return (
    <main className="main-content">
      <div className="page-wrap page-wrap-sm">
        <div style={{ marginBottom:"24px" }}>
          <h1 style={{ marginBottom:"4px" }}>Business Profile</h1>
          <p style={{ color:"var(--text-3)", fontSize:"13px" }}>Your registered business on KasiTrade</p>
        </div>
        <div className="card" style={{ padding:"22px", marginBottom:"14px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:"14px", marginBottom:"18px", paddingBottom:"18px", borderBottom:"1px solid var(--border)" }}>
            <div style={{ width:"48px", height:"48px", background:"var(--bg-4)", border:"1px solid var(--border-2)", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Building2 size={20} strokeWidth={1.5} color="var(--text-2)" />
            </div>
            <div>
              <h2 style={{ marginBottom:"3px" }}>{b.name}</h2>
              <div style={{ fontSize:"13px", color:"var(--text-3)" }}>{b.sector}</div>
            </div>
          </div>
          <div className="grid-2" style={{ marginBottom:"14px" }}>
            {[
              { icon:MapPin,    label:"Location",  value:b.location },
              { icon:Phone,     label:"Phone",     value:b.phone },
              { icon:Users,     label:"Employees", value:String(b.employees) },
              { icon:Briefcase, label:"Stage",     value:b.stage },
            ].map(({ icon:Icon, label, value }) => (
              <div key={label} style={{ padding:"12px 14px", background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"5px" }}>
                <div className="section-label" style={{ marginBottom:"5px", display:"flex", alignItems:"center", gap:"5px" }}>
                  <Icon size={10} /> {label}
                </div>
                <div style={{ fontSize:"14px", fontWeight:"500" }}>{value}</div>
              </div>
            ))}
          </div>
          {b.description && <p style={{ fontSize:"13px", color:"var(--text-3)", lineHeight:"1.6" }}>{b.description}</p>}
        </div>
        <div className="card" style={{ padding:"18px 22px", marginBottom:"20px" }}>
          <div className="section-label" style={{ marginBottom:"10px" }}>Account Owner</div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"34px", height:"34px", background:"var(--bg-4)", border:"1px solid var(--border-2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700" }}>{user.name[0]}</div>
            <div>
              <div style={{ fontWeight:"600", fontSize:"14px" }}>{user.name}</div>
              <div style={{ fontSize:"12px", color:"var(--text-3)" }}>{user.email}</div>
            </div>
          </div>
        </div>
        <button className="btn btn-secondary">Edit Profile</button>
      </div>
    </main>
  );
}
