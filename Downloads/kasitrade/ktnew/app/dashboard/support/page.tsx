"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getRequestsForSme, getMatchForRequest, getBookingForRequest,
  supportRequests, requestMatches, bookings, ratings, students,
  SUPPORT_TYPES, SupportRequest, SupportType, Rating,
} from "@/lib/data";
import {
  Plus, X, CheckCircle, Clock, AlertCircle, Star,
  Calendar, Video, MapPin, FileText, ChevronRight,
  Users, BookOpen, Lightbulb, TrendingUp,
} from "lucide-react";

const STATUS_CONFIG = {
  open:      { label: "Open — Finding students",    color: "#2563EB", bg: "#DBEAFE", icon: Clock      },
  matched:   { label: "Matched — Awaiting booking", color: "#D97706", bg: "#FEF3C7", icon: Users      },
  scheduled: { label: "Session scheduled",          color: "#7C3AED", bg: "#EDE9FE", icon: Calendar   },
  completed: { label: "Completed",                  color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle },
  cancelled: { label: "Cancelled",                  color: "#DC2626", bg: "#FEE2E2", icon: X          },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  "Financial Planning":          TrendingUp,
  "Bookkeeping & Accounting":    BookOpen,
  "Marketing & Social Media":    Lightbulb,
  "Business Strategy":           TrendingUp,
  default:                       FileText,
};

function StarRow({ value, onChange, readonly }: { value: number; onChange?: (n: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          size={18}
          fill={n <= (hover || value) ? "#D97706" : "none"}
          color={n <= (hover || value) ? "#D97706" : "#D1D5DB"}
          style={{ cursor: readonly ? "default" : "pointer", flexShrink: 0 }}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange?.(n)}
        />
      ))}
    </div>
  );
}

export default function SupportPage() {
  const { user } = useAuth();
  if (!user) return null;

  const [myRequests, setMyRequests] = useState<SupportRequest[]>(getRequestsForSme(user.id));
  const [myRatings,  setMyRatings]  = useState<Rating[]>(ratings.filter(r => r.smeId === user.id));

  // Panel state
  const [view,       setView]       = useState<"list" | "new" | "detail" | "slot" | "rate">("list");
  const [selected,   setSelected]   = useState<SupportRequest | null>(null);

  // New request form
  const [nType,  setNType]  = useState<SupportType | "">("");
  const [nTitle, setNTitle] = useState("");
  const [nDesc,  setNDesc]  = useState("");
  const [nErrs,  setNErrs]  = useState<Record<string,string>>({});

  // Slot confirmation
  const [pickedSlot, setPickedSlot] = useState<string>("");
  const [pickedMode, setPickedMode] = useState<"online"|"in-person">("online");

  // Rating form
  const [rProf, setRProf] = useState(0);
  const [rComm, setRComm] = useState(0);
  const [rHelp, setRHelp] = useState(0);
  const [rKnow, setRKnow] = useState(0);
  const [rText, setRText] = useState("");
  const [rErr,  setRErr]  = useState("");

  function submitRequest() {
    const e: Record<string,string> = {};
    if (!nType)          e.type  = "Select a support type";
    if (!nTitle.trim())  e.title = "Enter a title";
    if (!nDesc.trim())   e.desc  = "Describe what you need";
    setNErrs(e);
    if (Object.keys(e).length) return;

    const newReq: SupportRequest = {
      id: "req" + Date.now(), smeId: user!.id,
      type: nType as SupportType,
      title: nTitle, description: nDesc,
      documents: [], status: "open",
      createdAt: new Date().toISOString().split("T")[0],
      studentId: null, bookingId: null,
    };
    supportRequests.push(newReq);
    setMyRequests(prev => [newReq, ...prev]);
    setNType(""); setNTitle(""); setNDesc(""); setNErrs({});
    setView("list");
  }

  function confirmSlot() {
    if (!selected || !pickedSlot) return;
    const match = getMatchForRequest(selected.id);
    if (!match) return;
    const slot = match.timeSlots?.find(s => s.label === pickedSlot);
    if (!slot) return;

    const bk = {
      id: "bk" + Date.now(), requestId: selected.id,
      studentId: match.studentId, smeId: user!.id,
      confirmedSlot: slot, mode: pickedMode,
      meetingLink: pickedMode === "online" ? `https://teams.microsoft.com/l/meetup-join/kt-${Date.now()}` : undefined,
      status: "confirmed" as const,
      createdAt: new Date().toISOString().split("T")[0],
    };
    bookings.push(bk);
    const idx = supportRequests.findIndex(r => r.id === selected.id);
    if (idx >= 0) { supportRequests[idx].status = "scheduled"; supportRequests[idx].bookingId = bk.id; }
    setMyRequests(getRequestsForSme(user!.id));
    setSelected({ ...selected, status: "scheduled", bookingId: bk.id });
    setView("detail");
  }

  function submitRating() {
    if (!selected) return;
    if (!rProf || !rComm || !rHelp || !rKnow) { setRErr("Please rate all four areas"); return; }
    const overall = +((rProf + rComm + rHelp + rKnow) / 4).toFixed(2);
    const bk = getBookingForRequest(selected.id);
    const newRating: Rating = {
      id: "r" + Date.now(),
      bookingId: bk?.id || "",
      requestId: selected.id,
      studentId: selected.studentId || "",
      smeId: user!.id,
      professionalism: rProf, communication: rComm,
      helpfulness: rHelp, knowledge: rKnow, overall,
      feedback: rText,
      createdAt: new Date().toISOString().split("T")[0],
    };
    ratings.push(newRating);
    const idx = supportRequests.findIndex(r => r.id === selected.id);
    if (idx >= 0) supportRequests[idx].status = "completed";
    setMyRequests(getRequestsForSme(user!.id));
    setMyRatings(ratings.filter(r => r.smeId === user!.id));
    setView("list");
  }

  const totalReqs = myRequests.length;
  const active    = myRequests.filter(r => r.status !== "completed" && r.status !== "cancelled").length;
  const completed = myRequests.filter(r => r.status === "completed").length;

  // ── Render helpers ───────────────────────────────────────────────
  const RequestCard = ({ req }: { req: SupportRequest }) => {
    const cfg    = STATUS_CONFIG[req.status];
    const Ic     = cfg.icon;
    const TypeIc = TYPE_ICONS[req.type] || TYPE_ICONS.default;
    const match  = getMatchForRequest(req.id);
    const bk     = req.bookingId ? bookings.find(b => b.id === req.bookingId) : null;
    const student = req.studentId ? students.find(s => s.id === req.studentId) : null;

    return (
      <div
        className="card"
        onClick={() => { setSelected(req); setView("detail"); }}
        style={{ padding: "18px 20px", cursor: "pointer", transition: "box-shadow .15s, transform .15s", marginBottom: "10px" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ""; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <div style={{ width: "40px", height: "40px", background: cfg.bg, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TypeIc size={18} color={cfg.color} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.title}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: cfg.bg, color: cfg.color, borderRadius: "5px", fontSize: "11px", fontWeight: "600", flexShrink: 0 }}>
                <Ic size={11} />{cfg.label}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "6px" }}>
              <span className="badge badge-blue" style={{ fontSize: "10px", marginRight: "6px" }}>{req.type}</span>
              {req.createdAt}
            </div>
            <p style={{ fontSize: "13px", color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "520px" }}>
              {req.description}
            </p>
            {student && (
              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: "22px", height: "22px", background: "#DCFCE7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#14532D", flexShrink: 0 }}>
                  {student.avatar}
                </div>
                <span style={{ fontSize: "12px", color: "var(--ink-2)" }}>{student.name}</span>
                {bk && <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>· {bk.confirmedSlot.label}</span>}
              </div>
            )}
          </div>
          <ChevronRight size={16} color="var(--ink-4)" style={{ flexShrink: 0, marginTop: "2px" }} />
        </div>
      </div>
    );
  };

  // ── VIEWS ────────────────────────────────────────────────────────
  return (
    <main className="main-content">
      <div className="page-wrap">

        {/* ── LIST ── */}
        {view === "list" && (
          <>
            <div className="page-header">
              <div>
                <h1 style={{ marginBottom: "4px" }}>SME Support</h1>
                <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>
                  Connect with university students for business support — free, practical, and structured.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setView("new")}>
                <Plus size={14} /> Request Support
              </button>
            </div>

            {/* Stats */}
            <div className="kpi-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {[
                { label: "Total Requests", value: totalReqs  },
                { label: "Active",         value: active     },
                { label: "Completed",      value: completed  },
              ].map(({ label, value }) => (
                <div key={label} className="kpi-cell">
                  <div className="section-label" style={{ marginBottom: "6px" }}>{label}</div>
                  <div className="stat-num">{value}</div>
                </div>
              ))}
            </div>

            {/* Explainer if no requests */}
            {myRequests.length === 0 && (
              <div className="card" style={{ padding: "40px 32px", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", background: "#DCFCE7", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Users size={24} color="#16A34A" strokeWidth={1.5} />
                </div>
                <h3 style={{ marginBottom: "8px" }}>Get free business support</h3>
                <p style={{ color: "var(--ink-3)", fontSize: "13px", maxWidth: "420px", margin: "0 auto 20px", lineHeight: "1.65" }}>
                  University students in accounting, marketing, finance, and law are ready to help your business — for free. Submit a request and get matched in minutes.
                </p>
                <button className="btn btn-primary" onClick={() => setView("new")}><Plus size={14} /> Submit first request</button>
              </div>
            )}

            {/* Request list grouped by status */}
            {["scheduled","matched","open","completed","cancelled"].map(status => {
              const group = myRequests.filter(r => r.status === status);
              if (!group.length) return null;
              return (
                <div key={status} style={{ marginBottom: "24px" }}>
                  <div className="section-label" style={{ marginBottom: "10px" }}>
                    {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label} ({group.length})
                  </div>
                  {group.map(req => <RequestCard key={req.id} req={req} />)}
                </div>
              );
            })}
          </>
        )}

        {/* ── NEW REQUEST ── */}
        {view === "new" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setView("list")}>← Back</button>
              <h1>New Support Request</h1>
            </div>

            <div className="card" style={{ padding: "28px 32px", maxWidth: "640px" }}>
              <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "24px", lineHeight: "1.65" }}>
                Describe what you need help with. A student whose skills match your request will be notified and can accept within 24–48 hours.
              </p>

              <div style={{ marginBottom: "18px" }}>
                <label className="label">Type of support needed *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {SUPPORT_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setNType(t); setNErrs(e => ({ ...e, type: "" })); }}
                      style={{ padding: "10px 12px", textAlign: "left", background: nType === t ? "#DCFCE7" : "var(--surface-2)", border: `1.5px solid ${nType === t ? "#16A34A" : "var(--border-2)"}`, borderRadius: "7px", cursor: "pointer", fontSize: "12.5px", fontWeight: nType === t ? "600" : "400", color: nType === t ? "#14532D" : "var(--ink-2)", transition: "all .12s", fontFamily: "inherit" }}
                    >{t}</button>
                  ))}
                </div>
                {nErrs.type && <p style={{ fontSize: "11px", color: "var(--red)", marginTop: "5px" }}>{nErrs.type}</p>}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="label">Request title *</label>
                <input className="input" placeholder="e.g. Help setting up a bookkeeping system" value={nTitle} onChange={e => { setNTitle(e.target.value); setNErrs(p => ({ ...p, title: "" })); }} style={{ borderColor: nErrs.title ? "var(--red)" : undefined }} />
                {nErrs.title && <p style={{ fontSize: "11px", color: "var(--red)", marginTop: "5px" }}>{nErrs.title}</p>}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label className="label">Describe what you need *</label>
                <textarea className="input" rows={5} placeholder="Explain your problem or goal in as much detail as possible. The more context you give, the better the student can prepare." value={nDesc} onChange={e => { setNDesc(e.target.value); setNErrs(p => ({ ...p, desc: "" })); }} style={{ borderColor: nErrs.desc ? "var(--red)" : undefined }} />
                {nErrs.desc && <p style={{ fontSize: "11px", color: "var(--red)", marginTop: "5px" }}>{nErrs.desc}</p>}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setView("list")}>Cancel</button>
                <button className="btn btn-primary" onClick={submitRequest}><CheckCircle size={14} /> Submit Request</button>
              </div>
            </div>
          </>
        )}

        {/* ── DETAIL ── */}
        {view === "detail" && selected && (() => {
          const cfg     = STATUS_CONFIG[selected.status];
          const Ic      = cfg.icon;
          const match   = getMatchForRequest(selected.id);
          const bk      = selected.bookingId ? bookings.find(b => b.id === selected.bookingId) : null;
          const student = selected.studentId ? students.find(s => s.id === selected.studentId) : null;
          const rated   = myRatings.some(r => r.requestId === selected.id);

          return (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setView("list")}>← Back</button>
                <h1 style={{ flex: 1 }}>{selected.title}</h1>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 12px", background: cfg.bg, color: cfg.color, borderRadius: "6px", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>
                  <Ic size={12} />{cfg.label}
                </span>
              </div>

              <div className="grid-2" style={{ alignItems: "start" }}>
                {/* Left — details */}
                <div>
                  <div className="card" style={{ padding: "20px 22px", marginBottom: "14px" }}>
                    <div className="section-label" style={{ marginBottom: "10px" }}>Request Details</div>
                    <div style={{ marginBottom: "10px" }}><span className="badge badge-blue">{selected.type}</span></div>
                    <p style={{ fontSize: "13px", lineHeight: "1.65", color: "var(--ink-2)" }}>{selected.description}</p>
                    <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--ink-3)" }}>Submitted {selected.createdAt}</div>
                  </div>

                  {/* Booking details if scheduled */}
                  {bk && (
                    <div className="card" style={{ padding: "20px 22px", marginBottom: "14px", borderTop: "3px solid #7C3AED" }}>
                      <div className="section-label" style={{ marginBottom: "12px" }}>Session Booked</div>
                      <div style={{ display: "grid", gap: "10px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <Calendar size={15} color="var(--ink-3)" />
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>{bk.confirmedSlot.label}</span>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          {bk.mode === "online" ? <Video size={15} color="var(--ink-3)" /> : <MapPin size={15} color="var(--ink-3)" />}
                          <span style={{ fontSize: "13px" }}>{bk.mode === "online" ? "Online" : "In person"}</span>
                        </div>
                        {bk.meetingLink && (
                          <a href={bk.meetingLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#E8F0FC", border: "1px solid #93C5FD", borderRadius: "6px", color: "#1E3A8A", fontSize: "12px", fontWeight: "600", textDecoration: "none", width: "fit-content" }}>
                            <Video size={13} /> Join Teams Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completed — rate or show rating */}
                  {selected.status === "completed" && rated && (
                    <div className="card" style={{ padding: "20px 22px", borderTop: "3px solid var(--green)" }}>
                      <div className="section-label" style={{ marginBottom: "12px" }}>Your Rating</div>
                      {(() => {
                        const r = myRatings.find(r => r.requestId === selected.id)!;
                        return (
                          <div style={{ display: "grid", gap: "10px" }}>
                            {[["Professionalism", r.professionalism],["Communication", r.communication],["Helpfulness", r.helpfulness],["Knowledge", r.knowledge]].map(([label, val]) => (
                              <div key={String(label)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "13px", color: "var(--ink-2)" }}>{label}</span>
                                <StarRow value={Number(val)} readonly />
                              </div>
                            ))}
                            {r.feedback && <p style={{ fontSize: "12px", color: "var(--ink-3)", fontStyle: "italic", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>"{r.feedback}"</p>}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {selected.status === "matched" && match?.timeSlots && (
                      <button className="btn btn-primary" onClick={() => { setPickedSlot(""); setView("slot"); }}>
                        <Calendar size={14} /> Choose a time slot
                      </button>
                    )}
                    {selected.status === "scheduled" && bk?.status !== "completed" && !rated && (
                      <button className="btn btn-primary" onClick={() => setView("rate")}>
                        <Star size={14} /> Close & Rate Session
                      </button>
                    )}
                  </div>
                </div>

                {/* Right — student card */}
                {student && (
                  <div className="card" style={{ padding: "20px 22px" }}>
                    <div className="section-label" style={{ marginBottom: "14px" }}>Your Support Student</div>
                    <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                      <div style={{ width: "44px", height: "44px", background: "#DCFCE7", border: "2px solid #86EFAC", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#14532D", flexShrink: 0 }}>
                        {student.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "2px" }}>{student.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--ink-3)" }}>{student.course}</div>
                        <div style={{ fontSize: "11px", color: "var(--ink-3)" }}>{student.institution}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                      <StarRow value={Math.round(student.avgRating)} readonly />
                      <span style={{ fontSize: "12px", fontWeight: "600" }}>{student.avgRating.toFixed(1)}</span>
                      <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>({student.ratingCount} ratings)</span>
                    </div>
                    <p style={{ fontSize: "12.5px", color: "var(--ink-2)", lineHeight: "1.55", marginBottom: "12px" }}>{student.bio}</p>
                    <div className="section-label" style={{ marginBottom: "7px" }}>Areas of expertise</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {student.skills.map(s => (
                        <span key={s} className="badge badge-green" style={{ fontSize: "10px" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          );
        })()}

        {/* ── SLOT SELECTION ── */}
        {view === "slot" && selected && (() => {
          const match = getMatchForRequest(selected.id);
          return (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setView("detail")}>← Back</button>
                <h1>Choose a Time Slot</h1>
              </div>
              <div className="card" style={{ padding: "28px 32px", maxWidth: "520px" }}>
                <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "22px" }}>
                  Select one of the available time slots offered by the student.
                </p>

                <div className="section-label" style={{ marginBottom: "10px" }}>Available slots</div>
                <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
                  {match?.timeSlots?.map(slot => (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => setPickedSlot(slot.label)}
                      style={{ padding: "12px 16px", background: pickedSlot === slot.label ? "#DCFCE7" : "var(--surface-2)", border: `1.5px solid ${pickedSlot === slot.label ? "#16A34A" : "var(--border-2)"}`, borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: pickedSlot === slot.label ? "600" : "400", color: pickedSlot === slot.label ? "#14532D" : "var(--ink-2)", display: "flex", alignItems: "center", gap: "8px", transition: "all .12s", textAlign: "left" }}
                    >
                      <Calendar size={14} color={pickedSlot === slot.label ? "#16A34A" : "var(--ink-3)"} />
                      {slot.label}
                    </button>
                  ))}
                </div>

                <div className="section-label" style={{ marginBottom: "10px" }}>Session mode</div>
                {match?.sessionMode === "both" && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                    {(["online", "in-person"] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPickedMode(mode)}
                        style={{ flex: 1, padding: "10px", background: pickedMode === mode ? "#DCFCE7" : "var(--surface-2)", border: `1.5px solid ${pickedMode === mode ? "#16A34A" : "var(--border-2)"}`, borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "12.5px", fontWeight: pickedMode === mode ? "600" : "400", color: pickedMode === mode ? "#14532D" : "var(--ink-2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all .12s" }}
                      >
                        {mode === "online" ? <Video size={13} /> : <MapPin size={13} />}
                        {mode === "online" ? "Online (Teams)" : "In Person"}
                      </button>
                    ))}
                  </div>
                )}
                {match?.sessionMode !== "both" && (
                  <div style={{ marginBottom: "20px", padding: "10px 13px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "13px", color: "var(--ink-2)", display: "flex", alignItems: "center", gap: "7px" }}>
                    {match?.sessionMode === "online" ? <Video size={13} /> : <MapPin size={13} />}
                    {match?.sessionMode === "online" ? "Online session via Teams" : "In-person session"}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button className="btn btn-ghost" onClick={() => setView("detail")}>Cancel</button>
                  <button className="btn btn-primary" onClick={confirmSlot} disabled={!pickedSlot}>
                    <CheckCircle size={14} /> Confirm Booking
                  </button>
                </div>
              </div>
            </>
          );
        })()}

        {/* ── RATE SESSION ── */}
        {view === "rate" && selected && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setView("detail")}>← Back</button>
              <h1>Rate the Session</h1>
            </div>
            <div className="card" style={{ padding: "28px 32px", maxWidth: "520px" }}>
              <p style={{ fontSize: "13px", color: "var(--ink-3)", marginBottom: "24px" }}>
                Rate the student's support. Your feedback helps improve the quality of help for all SMEs.
              </p>
              {[
                { label: "Professionalism", val: rProf, set: setRProf },
                { label: "Communication",   val: rComm, set: setRComm },
                { label: "Helpfulness",     val: rHelp, set: setRHelp },
                { label: "Knowledge",       val: rKnow, set: setRKnow },
              ].map(({ label, val, set }) => (
                <div key={label} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="label" style={{ margin: 0 }}>{label}</label>
                    <span style={{ fontSize: "12px", color: "var(--ink-3)" }}>{val ? `${val}/5` : "Not rated"}</span>
                  </div>
                  <StarRow value={val} onChange={set} />
                </div>
              ))}

              <div style={{ marginBottom: "22px" }}>
                <label className="label">Written feedback <span style={{ fontWeight: "400", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <textarea className="input" rows={3} placeholder="What did the student do well? What could they improve?" value={rText} onChange={e => setRText(e.target.value)} />
              </div>

              {rErr && <p style={{ fontSize: "12px", color: "var(--red)", marginBottom: "14px" }}>{rErr}</p>}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setView("detail")}>Cancel</button>
                <button className="btn btn-primary" onClick={submitRating}>
                  <Star size={14} /> Submit & Close Request
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
