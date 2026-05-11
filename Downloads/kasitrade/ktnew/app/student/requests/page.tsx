"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  students, supportRequests, requestMatches, users,
  SupportRequest, RequestMatch,
} from "@/lib/data";
import {
  CheckCircle, XCircle, Clock, Calendar, Video, MapPin,
  ChevronRight, FileText, AlertCircle,
} from "lucide-react";

const STATUS_COLORS = {
  pending:  { bg: "#FEF3C7", color: "#78350F", label: "Awaiting response" },
  accepted: { bg: "#DCFCE7", color: "#14532D", label: "Accepted"          },
  declined: { bg: "#FEE2E2", color: "#7F1D1D", label: "Declined"          },
};

const SLOTS_DEFAULT = [
  { date: "", time: "09:00", label: "" },
  { date: "", time: "14:00", label: "" },
];

export default function StudentRequestsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const profile  = students.find(s => s.id === user.id);
  const myMatches = requestMatches.filter(m => m.studentId === user.id);

  const [matches, setMatches]     = useState<RequestMatch[]>(myMatches);
  const [view,    setView]        = useState<"list" | "detail">("list");
  const [current, setCurrent]     = useState<{ req: SupportRequest; match: RequestMatch } | null>(null);

  // Accept form state
  const [slots,  setSlots]  = useState([
    { date: "", time: "09:00" },
    { date: "", time: "14:00" },
  ]);
  const [mode,   setMode]   = useState<"online" | "in-person" | "both">("online");
  const [slotErr, setSlotErr] = useState("");

  // Decline form state
  const [declining, setDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineErr, setDeclineErr] = useState("");

  function openDetail(match: RequestMatch) {
    const req = supportRequests.find(r => r.id === match.requestId);
    if (!req) return;
    setCurrent({ req, match });
    setView("detail");
    setSlots([{ date:"", time:"09:00" }, { date:"", time:"14:00" }]);
    setMode("online"); setSlotErr(""); setDeclining(false); setDeclineReason(""); setDeclineErr("");
  }

  function handleAccept() {
    if (!current) return;
    const validSlots = slots.filter(s => s.date.trim());
    if (validSlots.length === 0) { setSlotErr("Add at least one available time slot"); return; }
    const timeSlots = validSlots.map(s => ({
      date: s.date, time: s.time,
      label: `${new Date(s.date).toLocaleDateString("en-ZA",{weekday:"short",day:"numeric",month:"short"})} at ${s.time}`,
    }));
    const idx = requestMatches.findIndex(m => m.id === current.match.id);
    if (idx >= 0) {
      requestMatches[idx].status    = "accepted";
      requestMatches[idx].timeSlots = timeSlots;
      requestMatches[idx].sessionMode = mode;
      requestMatches[idx].respondedAt = new Date().toISOString().split("T")[0];
      const req = supportRequests.find(r => r.id === current.req.id);
      if (req) req.status = "matched";
    }
    const updated = requestMatches.filter(m => m.studentId === user!.id);
    setMatches([...updated]);
    setCurrent(null); setView("list");
  }

  function handleDecline() {
    if (!declineReason.trim()) { setDeclineErr("Please provide a reason"); return; }
    if (!current) return;
    const idx = requestMatches.findIndex(m => m.id === current.match.id);
    if (idx >= 0) {
      requestMatches[idx].status = "declined";
      requestMatches[idx].declineReason = declineReason;
      requestMatches[idx].respondedAt = new Date().toISOString().split("T")[0];
    }
    setMatches(requestMatches.filter(m => m.studentId === user!.id));
    setCurrent(null); setView("list");
  }

  const pending  = matches.filter(m => m.status === "pending");
  const accepted = matches.filter(m => m.status === "accepted");
  const declined = matches.filter(m => m.status === "declined");

  const MatchCard = ({ match }: { match: RequestMatch }) => {
    const req = supportRequests.find(r => r.id === match.requestId);
    if (!req) return null;
    const sme = users.find(u => u.id === req.smeId);
    const cfg = STATUS_COLORS[match.status];
    return (
      <div
        className="card"
        onClick={() => openDetail(match)}
        style={{ padding: "16px 20px", cursor: "pointer", marginBottom: "10px", transition: "all .15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,.08)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div style={{ width: "38px", height: "38px", background: "#DBEAFE", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={16} color="#2563EB" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.title}</span>
              <span style={{ padding: "3px 8px", background: cfg.bg, color: cfg.color, borderRadius: "5px", fontSize: "11px", fontWeight: "600", flexShrink: 0 }}>{cfg.label}</span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "4px" }}>
              <span className="badge badge-blue" style={{ fontSize: "9px", marginRight: "5px" }}>{req.type}</span>
              {sme?.name} · {req.createdAt}
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.description}</p>
          </div>
          <ChevronRight size={15} color="var(--ink-4)" style={{ flexShrink: 0 }} />
        </div>
      </div>
    );
  };

  return (
    <main className="main-content">
      <div className="page-wrap">

        {view === "list" && (
          <>
            <div className="page-header">
              <div>
                <h1 style={{ marginBottom: "4px" }}>Support Requests</h1>
                <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>Requests matched to your skills. Review and respond within 48 hours.</p>
              </div>
            </div>

            {pending.length > 0 && (
              <div style={{ marginBottom: "24px", padding: "12px 16px", background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={15} color="#D97706" />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#78350F" }}>
                  {pending.length} pending request{pending.length > 1 ? "s" : ""} need your response
                </span>
              </div>
            )}

            {[
              { group: pending,  title: `Pending (${pending.length})`,   show: true           },
              { group: accepted, title: `Accepted (${accepted.length})`, show: accepted.length > 0 },
              { group: declined, title: `Declined (${declined.length})`, show: declined.length > 0 },
            ].map(({ group, title, show }) => show && (
              <div key={title} style={{ marginBottom: "24px" }}>
                <div className="section-label" style={{ marginBottom: "10px" }}>{title}</div>
                {group.length === 0
                  ? <p style={{ fontSize: "13px", color: "var(--ink-3)", padding: "16px 0" }}>No requests here yet.</p>
                  : group.map(m => <MatchCard key={m.id} match={m} />)
                }
              </div>
            ))}

            {matches.length === 0 && (
              <div className="card" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ width: "48px", height: "48px", background: "#DBEAFE", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Clock size={22} color="#2563EB" strokeWidth={1.5} />
                </div>
                <h3 style={{ marginBottom: "6px" }}>No requests yet</h3>
                <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>When SMEs submit requests matching your skills, they will appear here.</p>
              </div>
            )}
          </>
        )}

        {view === "detail" && current && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setView("list")}>← Back</button>
              <h1>{current.req.title}</h1>
            </div>

            <div className="grid-2" style={{ alignItems: "start" }}>
              {/* Request details */}
              <div>
                <div className="card" style={{ padding: "20px 22px", marginBottom: "14px" }}>
                  <div className="section-label" style={{ marginBottom: "10px" }}>Request Details</div>
                  <span className="badge badge-blue" style={{ marginBottom: "10px", display: "inline-block" }}>{current.req.type}</span>
                  <p style={{ fontSize: "13px", lineHeight: "1.65", color: "var(--ink-2)", marginBottom: "10px" }}>{current.req.description}</p>
                  <div style={{ fontSize: "12px", color: "var(--ink-3)" }}>Submitted {current.req.createdAt}</div>
                </div>

                {/* SME info */}
                {(() => {
                  const sme = users.find(u => u.id === current.req.smeId);
                  return sme ? (
                    <div className="card" style={{ padding: "16px 20px" }}>
                      <div className="section-label" style={{ marginBottom: "10px" }}>Business Owner</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", background: "var(--surface-3)", border: "1px solid var(--border-2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{sme.name[0]}</div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "600" }}>{sme.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>{sme.business?.name} · {sme.business?.sector}</div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Response panel */}
              <div>
                {current.match.status === "pending" && !declining && (
                  <div className="card" style={{ padding: "20px 22px" }}>
                    <h3 style={{ marginBottom: "16px" }}>Your Response</h3>

                    <div className="section-label" style={{ marginBottom: "8px" }}>Your available time slots *</div>
                    {slots.map((slot, i) => (
                      <div key={i} className="form-row-2" style={{ marginBottom: "10px" }}>
                        <div>
                          <label className="label">Date</label>
                          <input className="input" type="date" value={slot.date} onChange={e => {
                            const updated = [...slots]; updated[i] = { ...updated[i], date: e.target.value };
                            setSlots(updated); setSlotErr("");
                          }} />
                        </div>
                        <div>
                          <label className="label">Time</label>
                          <input className="input" type="time" value={slot.time} onChange={e => {
                            const updated = [...slots]; updated[i] = { ...updated[i], time: e.target.value };
                            setSlots(updated);
                          }} />
                        </div>
                      </div>
                    ))}
                    {slotErr && <p style={{ fontSize: "11px", color: "var(--red)", marginBottom: "10px" }}>{slotErr}</p>}

                    <div style={{ marginBottom: "18px" }}>
                      <div className="section-label" style={{ marginBottom: "8px" }}>Session mode</div>
                      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                        {(["online","in-person","both"] as const).map(m => (
                          <button key={m} type="button" onClick={() => setMode(m)}
                            style={{ padding: "7px 14px", background: mode === m ? "#DCFCE7" : "var(--surface-2)", border: `1.5px solid ${mode === m ? "#16A34A" : "var(--border-2)"}`, borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", fontWeight: mode === m ? "600" : "400", color: mode === m ? "#14532D" : "var(--ink-2)", display: "flex", alignItems: "center", gap: "5px", transition: "all .12s" }}>
                            {m === "online" ? <Video size={12}/> : m === "in-person" ? <MapPin size={12}/> : null}
                            {m === "online" ? "Online" : m === "in-person" ? "In Person" : "Either"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeclining(true)} style={{ flex: 1 }}>
                        <XCircle size={13} /> Decline
                      </button>
                      <button className="btn btn-primary" onClick={handleAccept} style={{ flex: 2 }}>
                        <CheckCircle size={13} /> Accept Request
                      </button>
                    </div>
                  </div>
                )}

                {declining && (
                  <div className="card" style={{ padding: "20px 22px", borderTop: "3px solid var(--red)" }}>
                    <h3 style={{ marginBottom: "12px" }}>Decline Request</h3>
                    <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "14px" }}>Please provide a reason. This helps the system find a better-matched student.</p>
                    <div style={{ marginBottom: "16px" }}>
                      <label className="label">Reason for declining *</label>
                      <textarea className="input" rows={3} placeholder="e.g. Not available during required timeframe, outside my area of expertise..." value={declineReason} onChange={e => { setDeclineReason(e.target.value); setDeclineErr(""); }} style={{ borderColor: declineErr ? "var(--red)" : undefined }} />
                      {declineErr && <p style={{ fontSize: "11px", color: "var(--red)", marginTop: "4px" }}>{declineErr}</p>}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeclining(false)}>Cancel</button>
                      <button className="btn btn-danger" onClick={handleDecline}>Confirm Decline</button>
                    </div>
                  </div>
                )}

                {current.match.status === "accepted" && (
                  <div className="card" style={{ padding: "20px 22px", borderTop: "3px solid var(--green)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <CheckCircle size={16} color="var(--green)" />
                      <h3>You accepted this request</h3>
                    </div>
                    <div className="section-label" style={{ marginBottom: "8px" }}>Your available slots</div>
                    {current.match.timeSlots?.map(s => (
                      <div key={s.label} style={{ padding: "8px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", marginBottom: "6px", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px" }}>
                        <Calendar size={13} color="var(--ink-3)" />{s.label}
                      </div>
                    ))}
                    <div style={{ marginTop: "10px", fontSize: "12px", color: "var(--ink-3)" }}>
                      Mode: {current.match.sessionMode} · Responded {current.match.respondedAt}
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "10px" }}>
                      Waiting for the SME to confirm a time slot. You will be notified once booked.
                    </p>
                  </div>
                )}

                {current.match.status === "declined" && (
                  <div className="card" style={{ padding: "20px 22px", borderTop: "3px solid var(--red)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <XCircle size={16} color="var(--red)" />
                      <h3>You declined this request</h3>
                    </div>
                    {current.match.declineReason && (
                      <p style={{ fontSize: "13px", color: "var(--ink-2)", fontStyle: "italic" }}>"{current.match.declineReason}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
