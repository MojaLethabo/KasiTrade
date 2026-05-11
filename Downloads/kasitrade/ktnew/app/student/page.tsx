"use client";
import { useAuth } from "@/lib/auth";
import {
  students, supportRequests, requestMatches, bookings, ratings,
  getRequestsForStudent, getRatingsForStudent,
} from "@/lib/data";
import Link from "next/link";
import { Star, TrendingUp, CheckSquare, Clock, Inbox, ArrowRight } from "lucide-react";

function StarDisplay({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={14} fill={n <= Math.round(value) ? "#D97706" : "none"} color={n <= Math.round(value) ? "#D97706" : "#D1D5DB"} />
      ))}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const profile = students.find(s => s.id === user.id);
  if (!profile) return (
    <main className="main-content">
      <div className="page-wrap">
        <p style={{ color: "var(--ink-3)" }}>Student profile not found.</p>
      </div>
    </main>
  );

  const myMatches    = requestMatches.filter(m => m.studentId === user.id);
  const pendingMatch = myMatches.filter(m => m.status === "pending");
  const myRequests   = getRequestsForStudent(user.id);
  const myBookings   = bookings.filter(b => b.studentId === user.id);
  const completed    = myBookings.filter(b => b.status === "completed");
  const myRatings    = getRatingsForStudent(user.id);

  // Recent activity: last 4 requests
  const recentRequests = myRequests.slice(-4).reverse();

  const statCards = [
    { icon: Inbox,       label: "Requests Received",  value: profile.requestsReceived,  color: "#2563EB", bg: "#DBEAFE" },
    { icon: CheckSquare, label: "Accepted",            value: profile.requestsAccepted,  color: "#16A34A", bg: "#DCFCE7" },
    { icon: TrendingUp,  label: "Sessions Completed",  value: profile.sessionsCompleted, color: "#7C3AED", bg: "#EDE9FE" },
    { icon: Star,        label: "Avg. Rating",         value: profile.avgRating.toFixed(1) + " / 5", color: "#D97706", bg: "#FEF3C7" },
  ];

  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "52px", height: "52px", background: "#DCFCE7", border: "2px solid #86EFAC", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", color: "#14532D", flexShrink: 0 }}>
              {profile.avatar}
            </div>
            <div>
              <h1 style={{ marginBottom: "2px" }}>Welcome, {profile.name.split(" ")[0]}</h1>
              <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>{profile.course} · Year {profile.yearOfStudy} · {profile.institution}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {profile.skills.map(s => <span key={s} className="badge badge-green" style={{ fontSize: "10px" }}>{s}</span>)}
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-row" style={{ marginBottom: "24px" }}>
          {statCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="kpi-cell">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div className="section-label">{label}</div>
                <div style={{ width: "32px", height: "32px", background: bg, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={color} strokeWidth={1.8} />
                </div>
              </div>
              <div className="stat-num">{value}</div>
            </div>
          ))}
        </div>

        {/* Alert: pending requests */}
        {pendingMatch.length > 0 && (
          <div style={{ marginBottom: "20px", padding: "14px 18px", background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Clock size={16} color="#D97706" />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#78350F" }}>
                {pendingMatch.length} new request{pendingMatch.length > 1 ? "s" : ""} waiting for your response
              </span>
            </div>
            <Link href="/student/requests" style={{ textDecoration: "none" }}>
              <button className="btn btn-sm" style={{ background: "#D97706", color: "#fff", border: "none" }}>
                View requests <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        )}

        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Recent requests */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>Recent Requests</h3>
              <Link href="/student/requests" style={{ fontSize: "12px", color: "var(--brand)", textDecoration: "none", fontWeight: "600" }}>View all →</Link>
            </div>
            {recentRequests.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>No requests yet. New matches will appear here.</p>
            ) : recentRequests.map(req => {
              const match = requestMatches.find(m => m.requestId === req.id && m.studentId === user.id);
              const statusColor = req.status === "completed" ? "var(--green)" : req.status === "scheduled" ? "#7C3AED" : "var(--amber)";
              return (
                <div key={req.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{req.title}</span>
                    <span className="badge" style={{ background: req.status === "completed" ? "#DCFCE7" : "#EDE9FE", color: statusColor, border: `1px solid ${statusColor}30`, fontSize: "10px", flexShrink: 0, marginLeft: "8px" }}>{req.status}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>
                    <span className="badge badge-blue" style={{ fontSize: "9px", marginRight: "5px" }}>{req.type}</span>
                    {req.createdAt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rating summary */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>My Ratings</h3>
              <Link href="/student/ratings" style={{ fontSize: "12px", color: "var(--brand)", textDecoration: "none", fontWeight: "600" }}>View all →</Link>
            </div>
            {myRatings.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>No ratings yet. Complete sessions to earn feedback.</p>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "18px", padding: "16px", background: "var(--surface-2)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "36px", fontWeight: "700", color: "var(--ink)", letterSpacing: "-.04em", marginBottom: "4px" }}>{profile.avgRating.toFixed(1)}</div>
                  <StarDisplay value={profile.avgRating} />
                  <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px" }}>{profile.ratingCount} rating{profile.ratingCount !== 1 ? "s" : ""}</div>
                </div>
                {[
                  { label: "Professionalism", avg: myRatings.reduce((s,r)=>s+r.professionalism,0)/myRatings.length },
                  { label: "Communication",   avg: myRatings.reduce((s,r)=>s+r.communication,0)/myRatings.length  },
                  { label: "Helpfulness",     avg: myRatings.reduce((s,r)=>s+r.helpfulness,0)/myRatings.length    },
                  { label: "Knowledge",       avg: myRatings.reduce((s,r)=>s+r.knowledge,0)/myRatings.length      },
                ].map(({ label, avg }) => (
                  <div key={label} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>{avg.toFixed(1)}</span>
                    </div>
                    <div style={{ height: "5px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(avg/5)*100}%`, background: avg >= 4 ? "var(--green)" : avg >= 3 ? "var(--amber)" : "var(--red)", borderRadius: "3px" }} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
