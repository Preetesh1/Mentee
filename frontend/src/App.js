import { useState, useEffect, useRef, useCallback } from "react";
import logo from "./assets/logo-icon.png";

// ─── Color Palette ───────────────────────────────────────────────────────────
// Cream: #FAF7F0, #F5EFE0, #EDE4CC
// Light Green: #A8C5A0, #7BAF72, #5A9651, #3D7A34
// Accents: #2C5F28 (deep green), #8B7355 (warm brown)

const COLORS = {
  cream1: "#FAF7F0",
  cream2: "#F5EFE0",
  cream3: "#EDE4CC",

  // Replace ALL greens with black shades
  green1: "#F5F5F5",   // light background
  green2: "#E0E0E0",
  green3: "#BDBDBD",
  green4: "#424242",   // medium dark
  green5: "#000000",   // primary black

  deepGreen: "#000000", // main headings → black

  brown: "#8B7355",

  text: "#1A1A1A",
  textMuted: "#6B6B6B",
  white: "#FFFFFF",

  error: "#C0392B",
  warning: "#D4873A",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_MENTORS = [
  { _id: "m1", username: "sarah_dev", email: "sarah@example.com", role: "Mentor", profile: { fullName: "Sarah Chen", company: "Google", position: "Senior Engineer", expertise: ["React", "System Design", "Career Guidance"], bio: "10 years in tech. Love helping students break into the industry.", yearsOfExperience: 10, availability: true } },
  { _id: "m2", username: "raj_pm", email: "raj@example.com", role: "Mentor", profile: { fullName: "Raj Patel", company: "Microsoft", position: "Product Manager", expertise: ["Product Management", "Interview Preparation", "Industry Insights"], bio: "PM at Microsoft for 7 years. Happy to guide aspiring PMs.", yearsOfExperience: 7, availability: true } },
  { _id: "m3", username: "priya_ml", email: "priya@example.com", role: "Mentor", profile: { fullName: "Priya Sharma", company: "Anthropic", position: "ML Engineer", expertise: ["Machine Learning", "Python", "Research"], bio: "ML Engineer passionate about AI safety and education.", yearsOfExperience: 5, availability: false } },
];

const MOCK_REQUESTS = [
  { _id: "r1", mentee: { _id: "u1", username: "student_arjun", profile: { fullName: "Arjun Kumar", college: "IIT Delhi", year: "3rd Year" } }, mentor: { _id: "m1", username: "sarah_dev", profile: { fullName: "Sarah Chen" } }, subject: "React career path", message: "Looking for guidance on transitioning to frontend roles", status: "Accepted", helpWith: ["Career Guidance", "Interview Preparation"], createdAt: "2025-03-01" },
  { _id: "r2", mentee: { _id: "u2", username: "student_meera", profile: { fullName: "Meera Singh", college: "NIT Trichy", year: "4th Year" } }, mentor: { _id: "m1", username: "sarah_dev", profile: { fullName: "Sarah Chen" } }, subject: "Resume review for internship", message: "Need help improving my resume for FAANG applications", status: "Pending", helpWith: ["Resume Review", "Internship Advice"], createdAt: "2025-03-10" },
];

const MOCK_MESSAGES = [
  { id: "msg1", sender: "m1", text: "Hi! Great to connect. What are your career goals?", time: "10:00 AM" },
  { id: "msg2", sender: "u1", text: "Hi Sarah! I want to become a frontend engineer at a top tech company.", time: "10:02 AM" },
  { id: "msg3", sender: "m1", text: "Awesome! Let's start with your current skill level in React.", time: "10:03 AM" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: 'DM Sans', sans-serif;
    background: ${COLORS.cream1};
    color: ${COLORS.text};
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.cream2}; }
  ::-webkit-scrollbar-thumb { background: #BDBDBD; } border-radius: 3px; }

  .serif { font-family: 'DM Serif Display', serif; }

  .fade-in {
    animation: fadeIn 0.4s ease forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ─── Utility Components ───────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const colors = {
    Pending: { bg: "#FFF3CD", color: "#856404", border: "#FFEAA7" },
    Accepted: { bg: "#D4EDDA", color: "#155724", border: "#C3E6CB" },
    Rejected: { bg: "#F8D7DA", color: "#721C24", border: "#F5C6CB" },
    Completed: { bg: "#D4E8D0", color: "#2C5F28", border: "#A8C5A0" },
  };
  const c = colors[status] || colors.Pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500
    }}>
      {status}
    </span>
  );
};

const Tag = ({ children }) => (
  <span style={{
    background: COLORS.green1, color: COLORS.deepGreen,
    padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, display: "inline-block", margin: "2px"
  }}>
    {children}
  </span>
);

const Avatar = ({ name, size = 40 }) => {
  const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  const hue = name?.charCodeAt(0) * 5 % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue}, 35%, 65%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 600, fontSize: size * 0.38,
      flexShrink: 0, fontFamily: "'DM Sans', sans-serif"
    }}>
      {initials}
    </div>
  );
};

const Btn = ({ children, variant = "primary", onClick, style = {}, disabled, small }) => {
  const base = {
    border: "none", borderRadius: "10px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.2s ease",
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: small ? "7px 16px" : "11px 22px",
    fontSize: small ? "13px" : "14px",
    opacity: disabled ? 0.6 : 1,
  };
  const variants = {
    primary: { background: "#111111", color: "#fff", boxShadow: `0 2px 8px ${COLORS.green5}40` },
    secondary: { background: COLORS.cream2, color: COLORS.deepGreen, border: `1px solid ${COLORS.green2}` },
    ghost: { background: "transparent", color: COLORS.green5, border: `1px solid ${COLORS.green3}` },
    danger: { background: "#C0392B", color: "#fff" },
    outline: { background: "transparent", color: COLORS.text, border: `1px solid ${COLORS.cream3}` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={disabled ? undefined : onClick}
      onMouseEnter={e => { if (!disabled) e.target.style.filter = "brightness(1.08)"; }}
      onMouseLeave={e => { e.target.style.filter = "none"; }}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, required, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
    {label && <label style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textMuted }}>{label}{required && " *"}</label>}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${COLORS.cream3}`,
        background: COLORS.white, fontSize: "14px", color: COLORS.text,
        outline: "none", transition: "border 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onFocus={e => e.target.style.borderColor = COLORS.green3}
      onBlur={e => e.target.style.borderColor = COLORS.cream3}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
    {label && <label style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textMuted }}>{label}</label>}
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{
        padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${COLORS.cream3}`,
        background: COLORS.white, fontSize: "14px", color: COLORS.text,
        outline: "none", resize: "vertical", fontFamily: "'DM Sans', sans-serif",
      }}
      onFocus={e => e.target.style.borderColor = COLORS.green3}
      onBlur={e => e.target.style.borderColor = COLORS.cream3}
    />
  </div>
);

const Card = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: COLORS.white, borderRadius: "16px",
    border: `1px solid ${COLORS.cream3}`, padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)", ...style
  }}>
    {children}
  </div>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "20px"
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-in" style={{
        background: COLORS.cream1, borderRadius: "20px",
        padding: "28px", width: "100%", maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 className="serif" style={{ fontSize: "20px", color: COLORS.deepGreen }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: COLORS.textMuted, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Auth Pages ───────────────────────────────────────────────────────────────
const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "Mentee" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all required fields"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    // Mock login - in production call /users/login or /users/register
    const mockUser = {
      id: "u1", username: form.username || "student_arjun",
      email: form.email, role: form.role,
      profile: { fullName: "Arjun Kumar", college: "IIT Delhi", year: "3rd Year", bio: "Aspiring software engineer", skills: ["React", "Node.js"], interests: ["AI", "Web Dev"] }
    };
    onLogin(mockUser);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{
      minHeight: "100vh", display: "flex", background: COLORS.cream1,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: `linear-gradient(160deg, #000000 0%, #2C2C2C 100%)`,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative circles */}
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            border: `1px solid rgba(255,255,255,0.1)`,
            width: `${200 + i * 120}px`, height: `${200 + i * 120}px`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }} />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "20px" }}>🌿</span>
            </div>
            <span className="serif" style={{ fontSize: "22px", color: "#fff", letterSpacing: "-0.5px" }}>MENTEE</span>
          </div>
          <h1 className="serif" style={{ fontSize: "42px", color: "#fff", lineHeight: 1.2, marginBottom: "20px" }}>
            Grow with the<br /><em>right mentor</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", lineHeight: 1.7, maxWidth: "360px" }}>
            Connect with industry professionals who've been where you want to go. Get guidance, feedback, and career support.
          </p>
          <div style={{ marginTop: "40px", display: "flex", gap: "28px" }}>
            {[["200+", "Mentors"], ["1.2k", "Sessions"], ["94%", "Satisfaction"]].map(([num, lbl]) => (
              <div key={lbl}>
                <div className="serif" style={{ fontSize: "26px", color: "#fff" }}>{num}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <div className="fade-in" style={{ width: "100%", maxWidth: "400px" }}>
          <h2 className="serif" style={{ fontSize: "28px", color: COLORS.deepGreen, marginBottom: "6px" }}>
            {mode === "login" ? "Welcome back" : "Join MENTEE"}
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: "14px", marginBottom: "32px" }}>
            {mode === "login" ? "Sign in to your account" : "Create your free account"}
          </p>

          {error && (
            <div style={{ background: "#FEE2E2", color: COLORS.error, padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mode === "register" && (
              <Input label="Full Name" value={form.username} onChange={f("username")} placeholder="Arjun Kumar" />
            )}
            <Input label="Email address" value={form.email} onChange={f("email")} type="email" placeholder="you@college.edu" required />
            <Input label="Password" value={form.password} onChange={f("password")} type="password" placeholder="••••••••" required />
            {mode === "register" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textMuted }}>I am a</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["Mentee", "Mentor"].map(r => (
                    <button key={r} onClick={() => setForm(p => ({ ...p, role: r }))}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "10px", cursor: "pointer",
                        border: `2px solid ${form.role === r ? COLORS.green4 : COLORS.cream3}`,
                        background: form.role === r ? COLORS.green1 : COLORS.white,
                        color: form.role === r ? COLORS.deepGreen : COLORS.textMuted,
                        fontWeight: 500, fontSize: "14px", transition: "all 0.2s",
                        fontFamily: "'DM Sans', sans-serif"
                      }}>
                      {r === "Mentee" ? "🎓 Mentee" : "👨‍💻 Mentor"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Btn onClick={handleSubmit} disabled={loading} style={{ marginTop: "6px", width: "100%", justifyContent: "center", padding: "13px" }}>
              {loading ? "⟳ Loading..." : mode === "login" ? "Sign in" : "Create account"}
            </Btn>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: COLORS.textMuted }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.green5, fontWeight: 600, fontSize: "14px" }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {/* Demo login helpers */}
          <div style={{ marginTop: "24px", padding: "14px", background: COLORS.cream2, borderRadius: "12px", border: `1px dashed ${COLORS.green2}` }}>
            <p style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Demo — quick login as</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[["Mentee", "student"], ["Mentor", "mentor"], ["Admin", "admin"]].map(([role, lbl]) => (
                <button key={role} onClick={() => onLogin({ id: `${lbl}1`, username: `demo_${lbl}`, email: `${lbl}@demo.com`, role, profile: { fullName: role === "Mentee" ? "Arjun Kumar" : role === "Mentor" ? "Sarah Chen" : "Admin User" } })}
                  style={{ padding: "5px 12px", borderRadius: "8px", border: `1px solid ${COLORS.green2}`, background: COLORS.white, cursor: "pointer", fontSize: "12px", color: COLORS.green5, fontWeight: 500 }}>
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
  const isMentor = user.role === "Mentor";
  const isAdmin = user.role === "Admin";

  const navItems = [
    { id: "dashboard", icon: "◉", label: "Dashboard" },
    ...(isMentor ? [] : [{ id: "find-mentors", icon: "⊕", label: "Find Mentors" }]),
    { id: "requests", icon: "◈", label: isMentor ? "Requests" : "My Requests" },
    { id: "chat", icon: "◎", label: "Messages" },
    ...(isAdmin ? [{ id: "users", icon: "◫", label: "Users" }] : []),
    { id: "profile", icon: "◯", label: "Profile" },
  ];

  return (
    <div style={{
      width: "220px", minHeight: "100vh", background: COLORS.white,
      borderRight: `1px solid ${COLORS.cream3}`,
      display: "flex", flexDirection: "column", padding: "0",
      position: "sticky", top: 0, flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${COLORS.cream3}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 34, height: 34, borderRadius: "10px", background: "#111111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img 
  src={logo}
  alt="Mentee"
  style={{ width: "20px", height: "20px" }}
/>
          </div>
          <span className="serif" style={{ fontSize: "20px", color: COLORS.deepGreen, letterSpacing: "-0.5px" }}>MENTEE</span>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.cream3}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar name={user.profile?.fullName || user.username} size={36} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>
              {user.profile?.fullName || user.username}
            </div>
            <div style={{ fontSize: "11px", color: COLORS.green4, fontWeight: 500 }}>{user.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: activeTab === item.id ? COLORS.green1 : "transparent",
              color: activeTab === item.id ? COLORS.deepGreen : COLORS.textMuted,
              fontWeight: activeTab === item.id ? 600 : 400,
              fontSize: "14px", marginBottom: "2px", textAlign: "left",
              transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif"
            }}
            onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = COLORS.cream2; }}
            onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: "16px", opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${COLORS.cream3}` }}>
        <button onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
            background: "transparent", color: COLORS.textMuted, fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = COLORS.error; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.textMuted; }}>
          ↩ Sign out
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ user }) => {
  const stats = user.role === "Mentor"
    ? [{ label: "Total Requests", val: 12, icon: "◈" }, { label: "Pending", val: 3, icon: "◉", color: COLORS.warning }, { label: "Active", val: 6, icon: "✓", color: COLORS.green4 }, { label: "Completed", val: 3, icon: "⊛", color: COLORS.green5 }]
    : [{ label: "Requests Sent", val: 4, icon: "◈" }, { label: "Pending", val: 1, icon: "◉", color: COLORS.warning }, { label: "Accepted", val: 2, icon: "✓", color: COLORS.green4 }, { label: "Completed", val: 1, icon: "⊛", color: COLORS.green5 }];

  return (
    <div className="fade-in" style={{ padding: "32px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 className="serif" style={{ fontSize: "28px", color: COLORS.deepGreen }}>
          Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user.profile?.fullName?.split(" ")[0] || user.username} 👋
        </h1>
        <p style={{ color: COLORS.textMuted, marginTop: "4px", fontSize: "15px" }}>
          {user.role === "Mentor" ? "Here's your mentorship activity overview" : "Track your mentorship journey"}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "20px" }} className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "11px", color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{s.label}</div>
                <div className="serif" style={{ fontSize: "32px", color: s.color || COLORS.deepGreen }}>{s.val}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: COLORS.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: s.color || COLORS.green4 }}>
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Recent Requests */}
        <Card style={{ padding: "0" }}>
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${COLORS.cream3}` }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text }}>Recent Requests</h3>
          </div>
          <div>
            {MOCK_REQUESTS.slice(0, 3).map((req, i) => (
              <div key={req._id} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px",
                borderBottom: i < 1 ? `1px solid ${COLORS.cream3}` : "none"
              }}>
                <Avatar name={req.mentee.profile.fullName} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: COLORS.text }}>{req.subject}</div>
                  <div style={{ fontSize: "12px", color: COLORS.textMuted }}>{req.mentee.profile.fullName}</div>
                </div>
                <Badge status={req.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Tips / Info */}
        <Card style={{ background: `linear-gradient(135deg, ${COLORS.green5} 0%, ${COLORS.deepGreen} 100%)`, border: "none" }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.7, marginBottom: "12px" }}>
              {user.role === "Mentor" ? "Mentor Tips" : "Getting Started"}
            </div>
            <h3 className="serif" style={{ fontSize: "20px", marginBottom: "12px", fontStyle: "italic" }}>
              {user.role === "Mentor" ? "Make your profile stand out" : "Your first step"}
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {(user.role === "Mentor"
                ? ["Keep your availability updated", "Respond to requests within 48h", "Share your expertise tags"]
                : ["Browse available mentors", "Send a personalized request", "Prepare questions for your session"]
              ).map((tip, i) => (
                <li key={i} style={{ fontSize: "13px", opacity: 0.85, display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: COLORS.green2, fontWeight: "bold", flexShrink: 0 }}>→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── Find Mentors ─────────────────────────────────────────────────────────────
const FindMentors = ({ user }) => {
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestModal, setRequestModal] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", helpWith: [] });
  const [sent, setSent] = useState(false);

  const HELP_OPTIONS = ["Career Guidance", "Academic Help", "Internship Advice", "Interview Preparation", "Skill Development", "Resume Review", "Industry Insights"];

  const filtered = MOCK_MENTORS.filter(m =>
    m.profile.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.profile.company.toLowerCase().includes(search.toLowerCase()) ||
    m.profile.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleHelp = (h) => {
    setForm(p => ({ ...p, helpWith: p.helpWith.includes(h) ? p.helpWith.filter(x => x !== h) : [...p.helpWith, h] }));
  };

  const sendRequest = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSent(true);
    setTimeout(() => { setRequestModal(false); setSent(false); setForm({ subject: "", message: "", helpWith: [] }); }, 1500);
  };

  return (
    <div className="fade-in" style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="serif" style={{ fontSize: "28px", color: COLORS.deepGreen }}>Find a Mentor</h1>
        <p style={{ color: COLORS.textMuted, marginTop: "4px" }}>Browse available mentors and request guidance</p>
      </div>

      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍  Search by name, company, or skill..."
        style={{
          width: "100%", maxWidth: "500px", padding: "12px 16px", borderRadius: "12px",
          border: `1.5px solid ${COLORS.cream3}`, background: COLORS.white, fontSize: "14px",
          marginBottom: "24px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: COLORS.text
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
        {filtered.map((mentor, i) => (
          <Card key={mentor._id} className="fade-in" style={{ padding: "22px", transition: "transform 0.2s, box-shadow 0.2s", animationDelay: `${i * 0.05}s` }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
            <div style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
              <Avatar name={mentor.profile.fullName} size={50} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", color: COLORS.text }}>{mentor.profile.fullName}</div>
                <div style={{ fontSize: "13px", color: COLORS.textMuted }}>{mentor.profile.position}</div>
                <div style={{ fontSize: "12px", color: COLORS.green4, fontWeight: 500 }}>@ {mentor.profile.company}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  fontSize: "11px", padding: "3px 8px", borderRadius: "20px",
                  background: mentor.profile.availability ? COLORS.green1 : "#FEE2E2",
                  color: mentor.profile.availability ? COLORS.green5 : COLORS.error,
                  fontWeight: 500
                }}>
                  {mentor.profile.availability ? "Available" : "Busy"}
                </span>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: COLORS.textMuted, lineHeight: 1.6, marginBottom: "14px" }}>
              {mentor.profile.bio}
            </p>

            <div style={{ marginBottom: "16px" }}>
              {mentor.profile.expertise.map(e => <Tag key={e}>{e}</Tag>)}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: COLORS.textMuted }}>{mentor.profile.yearsOfExperience} yrs experience</span>
              <Btn small disabled={!mentor.profile.availability} onClick={() => { setSelectedMentor(mentor); setRequestModal(true); }}>
                Request Mentorship
              </Btn>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={requestModal} onClose={() => setRequestModal(false)} title={`Request ${selectedMentor?.profile?.fullName}`}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <div className="serif" style={{ fontSize: "20px", color: COLORS.deepGreen }}>Request sent!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="Subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Career guidance for SWE roles" />
            <Textarea label="Message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell the mentor what you're looking for..." rows={4} />
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textMuted, display: "block", marginBottom: "8px" }}>Help with</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {HELP_OPTIONS.map(h => (
                  <button key={h} onClick={() => toggleHelp(h)}
                    style={{
                      padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "12px",
                      border: `1.5px solid ${form.helpWith.includes(h) ? COLORS.green4 : COLORS.cream3}`,
                      background: form.helpWith.includes(h) ? COLORS.green1 : COLORS.white,
                      color: form.helpWith.includes(h) ? COLORS.deepGreen : COLORS.textMuted,
                      fontWeight: form.helpWith.includes(h) ? 600 : 400,
                      transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif"
                    }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <Btn variant="outline" onClick={() => setRequestModal(false)}>Cancel</Btn>
              <Btn onClick={sendRequest} disabled={!form.subject || !form.message}>Send Request</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─── Requests ─────────────────────────────────────────────────────────────────
const Requests = ({ user }) => {
  const [filter, setFilter] = useState("All");
  const [selectedReq, setSelectedReq] = useState(null);

  const statuses = ["All", "Pending", "Accepted", "Rejected", "Completed"];
  const filtered = filter === "All" ? MOCK_REQUESTS : MOCK_REQUESTS.filter(r => r.status === filter);

  return (
    <div className="fade-in" style={{ padding: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="serif" style={{ fontSize: "28px", color: COLORS.deepGreen }}>
          {user.role === "Mentor" ? "Mentorship Requests" : "My Requests"}
        </h1>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px", flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: "7px 16px", borderRadius: "20px", border: `1.5px solid ${filter === s ? COLORS.green4 : COLORS.cream3}`,
              background: filter === s ? COLORS.green1 : COLORS.white,
              color: filter === s ? COLORS.deepGreen : COLORS.textMuted,
              fontWeight: filter === s ? 600 : 400, cursor: "pointer", fontSize: "13px",
              transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif"
            }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.textMuted }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
            <div>No requests found</div>
          </div>
        ) : (
          filtered.map((req, i) => (
            <Card key={req._id} className="fade-in" style={{ padding: "20px", animationDelay: `${i * 0.05}s`, cursor: "pointer" }}
              onClick={() => setSelectedReq(req)}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <Avatar name={user.role === "Mentor" ? req.mentee.profile.fullName : req.mentor.profile.fullName} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: COLORS.text }}>{req.subject}</span>
                    <Badge status={req.status} />
                  </div>
                  <div style={{ fontSize: "13px", color: COLORS.textMuted }}>
                    {user.role === "Mentor" ? `From: ${req.mentee.profile.fullName}` : `To: ${req.mentor.profile.fullName}`}
                    {" · "}
                    <span>{new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div style={{ marginTop: "6px" }}>
                    {req.helpWith.map(h => <Tag key={h}>{h}</Tag>)}
                  </div>
                </div>
                {user.role === "Mentor" && req.status === "Pending" && (
                  <div style={{ display: "flex", gap: "8px" }} onClick={e => e.stopPropagation()}>
                    <Btn small>Accept</Btn>
                    <Btn small variant="ghost">Decline</Btn>
                  </div>
                )}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: COLORS.cream2, borderRadius: "10px", fontSize: "13px", color: COLORS.textMuted, lineHeight: 1.6 }}>
                {req.message}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
const Chat = ({ user }) => {
  const [activeChat, setActiveChat] = useState("m1");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [connected, setConnected] = useState(true);
  const messagesEndRef = useRef(null);

  const contacts = user.role === "Mentor"
    ? [{ id: "u1", name: "Arjun Kumar", role: "Mentee", lastMsg: "Thank you so much!", time: "2m ago", unread: 2 }]
    : [{ id: "m1", name: "Sarah Chen", role: "Mentor @ Google", lastMsg: "Let's schedule a call", time: "5m ago", unread: 1 }];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now(), sender: user.id, text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(p => [...p, msg]);
    setInput("");

    // Simulate typing + reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(p => [...p, {
        id: Date.now() + 1, sender: activeChat,
        text: "Thanks for the message! I'll get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    }, 2000);
  };

  return (
    <div className="fade-in" style={{ padding: "32px", height: "calc(100vh - 40px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 className="serif" style={{ fontSize: "28px", color: COLORS.deepGreen }}>Messages</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? COLORS.green4 : "#ccc", animation: connected ? "pulse 2s infinite" : "none" }} />
          <span style={{ fontSize: "12px", color: COLORS.textMuted }}>{connected ? "Connected via Socket.io" : "Connecting..."}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", gap: "16px", overflow: "hidden" }}>
        {/* Contacts */}
        <Card style={{ width: "240px", padding: "0", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.cream3}` }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Chats</span>
          </div>
          {contacts.map(c => (
            <div key={c.id} onClick={() => setActiveChat(c.id)}
              style={{
                padding: "14px 16px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center",
                background: activeChat === c.id ? COLORS.green1 : "transparent",
                borderLeft: activeChat === c.id ? `3px solid ${COLORS.green4}` : "3px solid transparent",
                transition: "all 0.15s"
              }}>
              <Avatar name={c.name} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "13px", color: COLORS.text }}>{c.name}</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span style={{ fontSize: "11px", color: COLORS.textMuted }}>{c.time}</span>
                {c.unread > 0 && (
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: COLORS.green4, color: "#fff", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </Card>

        {/* Chat window */}
        <Card style={{ flex: 1, padding: "0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.cream3}`, display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar name={contacts[0]?.name} size={36} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: COLORS.text }}>{contacts[0]?.name}</div>
              <div style={{ fontSize: "12px", color: COLORS.green4 }}>{contacts[0]?.role}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
              <Btn small variant="ghost">📅 Schedule</Btn>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg) => {
              const isMe = msg.sender === user.id || msg.sender === "u1";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", animation: "slideIn 0.2s ease" }}>
                  <div style={{
                    maxWidth: "65%", padding: "10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isMe ? COLORS.green5 : COLORS.cream2,
                    color: isMe ? "#fff" : COLORS.text,
                    fontSize: "14px", lineHeight: 1.5
                  }}>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px", textAlign: "right" }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: COLORS.cream2, display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green3, animation: `pulse 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 16px", borderTop: `1px solid ${COLORS.cream3}`, display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type a message... (Enter to send)"
              style={{
                flex: 1, padding: "11px 14px", borderRadius: "12px",
                border: `1.5px solid ${COLORS.cream3}`, background: COLORS.cream1,
                fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif", color: COLORS.text,
                resize: "none"
              }}
              onFocus={e => e.target.style.borderColor = COLORS.green3}
              onBlur={e => e.target.style.borderColor = COLORS.cream3}
            />
            <Btn onClick={sendMessage} style={{ padding: "11px 18px" }}>
              Send ↑
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── Profile ──────────────────────────────────────────────────────────────────
const Profile = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user.profile, fullName: user.profile?.fullName || "" });

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fade-in" style={{ padding: "32px", maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h1 className="serif" style={{ fontSize: "28px", color: COLORS.deepGreen }}>Your Profile</h1>
        <Btn variant={editing ? "primary" : "secondary"} onClick={() => setEditing(e => !e)}>
          {editing ? "Save changes" : "✏ Edit profile"}
        </Btn>
      </div>

      {/* Profile header */}
      <Card style={{ marginBottom: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
        <Avatar name={form.fullName || user.username} size={72} />
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: COLORS.text }}>{form.fullName || user.username}</h2>
          <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>{user.email}</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <Tag>{user.role}</Tag>
            {form.college && <Tag>{form.college}</Tag>}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { label: "Full Name", key: "fullName", placeholder: "Your name" },
            ...(user.role === "Mentee" ? [
              { label: "College", key: "college", placeholder: "IIT Delhi" },
              { label: "Branch", key: "branch", placeholder: "Computer Science" },
            ] : [
              { label: "Company", key: "company", placeholder: "Google" },
              { label: "Position", key: "position", placeholder: "Senior Engineer" },
            ]),
            { label: "LinkedIn", key: "linkedin", placeholder: "linkedin.com/in/..." },
            { label: "GitHub", key: "github", placeholder: "github.com/..." },
          ].map(({ label, key, placeholder }) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textMuted }}>{label}</label>
              {editing ? (
                <input value={form[key] || ""} onChange={f(key)} placeholder={placeholder}
                  style={{ padding: "9px 12px", borderRadius: "10px", border: `1.5px solid ${COLORS.cream3}`, background: COLORS.white, fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={e => e.target.style.borderColor = COLORS.green3}
                  onBlur={e => e.target.style.borderColor = COLORS.cream3}
                />
              ) : (
                <div style={{ fontSize: "14px", color: form[key] ? COLORS.text : COLORS.cream3, padding: "9px 0" }}>
                  {form[key] || "—"}
                </div>
              )}
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textMuted }}>Bio</label>
            {editing ? (
              <textarea value={form.bio || ""} onChange={f("bio")} rows={3} placeholder="Tell mentors about yourself..."
                style={{ padding: "9px 12px", borderRadius: "10px", border: `1.5px solid ${COLORS.cream3}`, background: COLORS.white, fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => e.target.style.borderColor = COLORS.green3}
                onBlur={e => e.target.style.borderColor = COLORS.cream3}
              />
            ) : (
              <div style={{ fontSize: "14px", color: form.bio ? COLORS.text : COLORS.cream3, lineHeight: 1.6 }}>
                {form.bio || "No bio added yet."}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dashboard");

  const renderTab = () => {
    switch (tab) {
      case "dashboard": return <Dashboard user={user} />;
      case "find-mentors": return <FindMentors user={user} />;
      case "requests": return <Requests user={user} />;
      case "chat": return <Chat user={user} />;
      case "profile": return <Profile user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  if (!user) return (
    <>
      <style>{globalStyles}</style>
      <AuthPage onLogin={setUser} />
    </>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.cream1 }}>
        <Sidebar user={user} activeTab={tab} setActiveTab={setTab} onLogout={() => setUser(null)} />
        <main style={{ flex: 1, overflow: "auto", minHeight: "100vh" }}>
          {renderTab()}
        </main>
      </div>
    </>
  );
}