"use client";
import { useAuth } from "@/lib/auth";
import { students, getRatingsForStudent, supportRequests, users } from "@/lib/data";
import { Star } from "lucide-react";

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={14} fill={n <= Math.round(value) ? "#D97706" : "none"} color={n <= Math.round(value) ? "#D97706" : "#D1D5DB"} />
      ))}
    </div>
  );
}

export default function StudentRatingsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const profile = students.find(s => s.id === user.id);
  const myRatings = getRatingsForStudent(user.id);

  const breakdown = profile ? [
    { label: "Professionalism", avg: myRatings.length ? myRatings.reduce((s,r)=>s+r.professionalism,0)/myRatings.length : 0 },
    { label: "Communication",   avg: myRatings.length ? myRatings.reduce((s,r)=>s+r.communication,0)/myRatings.length   : 0 },
    { label: "Helpfulness",     avg: myRatings.length ? myRatings.reduce((s,r)=>s+r.helpfulness,0)/myRatings.length     : 0 },
    { label: "Knowledge",       avg: myRatings.length ? myRatings.reduce((s,r)=>s+r.knowledge,0)/myRatings.length       : 0 },
  ] : [];

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div>
            <h1 style={{ marginBottom: "4px" }}>My Ratings</h1>
            <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Feedback from SMEs after completed sessions.</p>
          </div>
        </div>

        {myRatings.length === 0 ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "6px" }}>No ratings yet</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Complete sessions to receive feedback from SME owners.</p>
          </div>
        ) : (
          <>
            {/* Overall score */}
            <div className="card" style={{ padding: "24px 28px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center" }}>
              <div style={{ textAlign: "center", minWidth: "100px" }}>
                <div style={{ fontSize: "52px", fontWeight: "800", color: "var(--ink)", letterSpacing: "-.04em", lineHeight: "1" }}>{profile?.avgRating.toFixed(1)}</div>
                <Stars value={profile?.avgRating || 0} />
                <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px" }}>{myRatings.length} review{myRatings.length !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                {breakdown.map(({ label, avg }) => (
                  <div key={label} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>{avg.toFixed(1)} / 5</span>
                    </div>
                    <div style={{ height: "6px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(avg/5)*100}%`, background: avg >= 4 ? "var(--green)" : avg >= 3 ? "var(--amber)" : "var(--red)", borderRadius: "3px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual reviews */}
            <div className="section-label" style={{ marginBottom: "12px" }}>All Reviews</div>
            {myRatings.map(r => {
              const req = supportRequests.find(q => q.id === r.requestId);
              const sme = users.find(u => u.id === r.smeId);
              return (
                <div key={r.id} className="card" style={{ padding: "18px 22px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>{req?.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>{sme?.name} · {r.createdAt}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Stars value={r.overall} />
                      <span style={{ fontSize: "13px", fontWeight: "700" }}>{r.overall.toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "6px", marginBottom: "10px" }}>
                    {[
                      { l: "Professionalism", v: r.professionalism },
                      { l: "Communication",   v: r.communication   },
                      { l: "Helpfulness",     v: r.helpfulness     },
                      { l: "Knowledge",       v: r.knowledge       },
                    ].map(({ l, v }) => (
                      <div key={l} style={{ padding: "7px 10px", background: "var(--surface-2)", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>{l}</span>
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>{v}/5</span>
                      </div>
                    ))}
                  </div>
                  {r.feedback && (
                    <p style={{ fontSize: "13px", color: "var(--ink-2)", fontStyle: "italic", padding: "10px 13px", background: "var(--surface-2)", borderRadius: "6px", borderLeft: "3px solid var(--brand-mid)" }}>
                      "{r.feedback}"
                    </p>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
}
