"use client";
import { useAuth } from "@/lib/auth";
import { bookings, supportRequests, users } from "@/lib/data";
import { Calendar, Video, MapPin, CheckCircle, Clock } from "lucide-react";

export default function StudentSessionsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const myBookings = bookings.filter(b => b.studentId === user.id);
  const upcoming   = myBookings.filter(b => b.status === "confirmed");
  const completed  = myBookings.filter(b => b.status === "completed");

  const BookingCard = ({ bk }: { bk: typeof bookings[0] }) => {
    const req = supportRequests.find(r => r.id === bk.requestId);
    const sme = users.find(u => u.id === bk.smeId);
    const isDone = bk.status === "completed";
    return (
      <div className="card" style={{ padding: "18px 22px", marginBottom: "12px", borderTop: `3px solid ${isDone ? "var(--green)" : "#7C3AED"}` }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "3px" }}>{req?.title}</div>
            <div style={{ fontSize: "12px", color: "var(--ink-3)" }}>
              {sme?.name} · {sme?.business?.name}
            </div>
          </div>
          <span className={`badge ${isDone ? "badge-green" : "badge-purple"}`}>{isDone ? "Completed" : "Confirmed"}</span>
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px" }}>
            <Calendar size={14} color="var(--ink-3)" />
            <span style={{ fontWeight: "500" }}>{bk.confirmedSlot.label}</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px" }}>
            {bk.mode === "online" ? <Video size={14} color="var(--ink-3)" /> : <MapPin size={14} color="var(--ink-3)" />}
            <span>{bk.mode === "online" ? "Online session" : "In-person session"}</span>
          </div>
          {bk.meetingLink && !isDone && (
            <a href={bk.meetingLink} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#E8F0FC", border: "1px solid #93C5FD", borderRadius: "6px", color: "#1E3A8A", fontSize: "12px", fontWeight: "600", textDecoration: "none", marginTop: "4px", width: "fit-content" }}>
              <Video size={13} /> Join Teams Meeting
            </a>
          )}
          {isDone && bk.completedAt && (
            <div style={{ fontSize: "12px", color: "var(--ink-3)", display: "flex", alignItems: "center", gap: "5px" }}>
              <CheckCircle size={12} color="var(--green)" /> Completed {bk.completedAt}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="main-content">
      <div className="page-wrap">
        <div className="page-header">
          <div>
            <h1 style={{ marginBottom: "4px" }}>Sessions</h1>
            <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Your upcoming and completed support sessions.</p>
          </div>
        </div>

        <div className="kpi-row" style={{ gridTemplateColumns: "repeat(2,1fr)", maxWidth: "500px" }}>
          {[
            { icon: Clock,        label: "Upcoming",  value: upcoming.length,  color: "#7C3AED", bg: "#EDE9FE" },
            { icon: CheckCircle,  label: "Completed", value: completed.length, color: "#16A34A", bg: "#DCFCE7" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="kpi-cell">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div className="section-label">{label}</div>
                <div style={{ width: "30px", height: "30px", background: bg, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={color} strokeWidth={1.8} />
                </div>
              </div>
              <div className="stat-num">{value}</div>
            </div>
          ))}
        </div>

        {upcoming.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <div className="section-label" style={{ marginBottom: "12px" }}>Upcoming Sessions</div>
            {upcoming.map(bk => <BookingCard key={bk.id} bk={bk} />)}
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <div className="section-label" style={{ marginBottom: "12px" }}>Completed Sessions</div>
            {completed.map(bk => <BookingCard key={bk.id} bk={bk} />)}
          </div>
        )}

        {myBookings.length === 0 && (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", background: "#EDE9FE", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Calendar size={22} color="#7C3AED" strokeWidth={1.5} />
            </div>
            <h3 style={{ marginBottom: "6px" }}>No sessions yet</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Accept a request to get your first session booked.</p>
          </div>
        )}
      </div>
    </main>
  );
}
