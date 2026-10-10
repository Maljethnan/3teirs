import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

// ═══════════════════════════════════════
// صفحة تسجيل الدخول
// ═══════════════════════════════════════
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ username, role: "Admin" }));
        onLogin();
      } else {
        setError("بيانات الاعتماد غير صحيحة");
      }
    } catch (err) {
      setError("لا يمكن الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "2rem", margin: "1rem", background: "white", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#4f46e5", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔒</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "1rem", color: "#1e293b" }}>تسجيل الدخول</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>نظام إدارة التذاكر</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} dir="rtl" style={{ padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "1rem", outline: "none" }} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} dir="rtl" style={{ padding: "0.75rem 1rem", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "1rem", outline: "none" }} />
          {error && <div style={{ padding: "0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: 8, fontSize: "0.875rem" }}>⚠️ {error}</div>}
          <button type="submit" disabled={loading} style={{ padding: "0.875rem", background: loading ? "#94a3b8" : "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0", textAlign: "center", fontSize: "0.75rem", color: "#94a3b8" }}>بيانات الاختبار: admin / admin123</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// شريط التنقل
// ═══════════════════════════════════════
function Navbar({ currentPage, setCurrentPage, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: "📊" },
    { id: "tickets", label: "التذاكر", icon: "🎫" },
    { id: "settings", label: "الإعدادات", icon: "⚙️" },
  ];

  return (
    <nav style={{ background: "#1e293b", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <span style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>🎫 نظام التذاكر</span>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{ padding: "0.5rem 1rem", background: currentPage === item.id ? "#4f46e5" : "transparent", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>مرحبًا، {user.username}</span>
        <button onClick={onLogout} style={{ padding: "0.4rem 1rem", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}>خروج</button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════
// لوحة التحكم
// ═══════════════════════════════════════
function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>جارٍ التحميل...</div>;

  const statusColors = { "مفتوحة": "#3b82f6", "قيد المعالجة": "#f59e0b", "مغلقة": "#22c55e" };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem" }}>{stats?.message || "مرحبًا!"}</h2>

      {/* بطاقات الإحصائيات */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "إجمالي التذاكر", value: 3, color: "#4f46e5" },
          { label: "مفتوحة", value: 1, color: "#3b82f6" },
          { label: "قيد المعالجة", value: 1, color: "#f59e0b" },
          { label: "مغلقة", value: 1, color: "#22c55e" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* جدول التذاكر الأخيرة */}
      <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem" }}>آخر التذاكر</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>المعرف</th>
              <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>العنوان</th>
              <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.tickets || []).map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem", color: "#1e293b" }}>#{ticket.id}</td>
                <td style={{ padding: "0.75rem", color: "#1e293b" }}>{ticket.title}</td>
                <td style={{ padding: "0.75rem" }}>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.75rem", background: `${statusColors[ticket.status]}20`, color: statusColors[ticket.status] }}>{ticket.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// صفحة التذاكر
// ═══════════════════════════════════════
function TicketsPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>إدارة التذاكر</h2>
        <button style={{ padding: "0.6rem 1.2rem", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>+ تذكرة جديدة</button>
      </div>
      <div style={{ background: "white", borderRadius: 12, padding: "3rem", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", color: "#94a3b8" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎫</div>
        <p>سيتم إضافة قائمة التذاكر الكاملة قريبًا</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// صفحة الإعدادات
// ═══════════════════════════════════════
function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users");
  const users = [
    { id: 1, name: "admin", email: "admin@ticketing.local", role: "مدير النظام", status: "نشط" },
    { id: 2, name: "ahmed", email: "ahmed@ticketing.local", role: "عامل دعم", status: "نشط" },
    { id: 3, name: "sara", email: "sara@ticketing.local", role: "مشرف", status: "معطل" },
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem" }}>الإعدادات</h2>

      {/* تبويبات الإعدادات */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
        {[
          { id: "users", label: "إدارة المستخدمين", icon: "👥" },
          { id: "system", label: "إعدادات النظام", icon: "🖥️" },
          { id: "notifications", label: "الإشعارات", icon: "🔔" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "0.5rem 1rem", background: activeTab === tab.id ? "#4f46e5" : "transparent", color: activeTab === tab.id ? "white" : "#64748b", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 6 }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>المستخدمون ({users.length})</h3>
            <button style={{ padding: "0.5rem 1rem", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem" }}>+ إضافة مستخدم</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>الاسم</th>
                <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>البريد الإلكتروني</th>
                <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>الدور</th>
                <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>الحالة</th>
                <th style={{ padding: "0.75rem", textAlign: "right", color: "#64748b", fontSize: "0.8rem" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.75rem", color: "#1e293b", fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: "0.75rem", color: "#64748b" }}>{user.email}</td>
                  <td style={{ padding: "0.75rem", color: "#1e293b" }}>{user.role}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.75rem", background: user.status === "نشط" ? "#dcfce7" : "#fee2e2", color: user.status === "نشط" ? "#16a34a" : "#dc2626" }}>{user.status}</span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <button style={{ padding: "0.3rem 0.6rem", background: "#f1f5f9", border: "none", borderRadius: 4, cursor: "pointer", marginRight: 4, fontSize: "0.8rem" }}>✏️ تعديل</button>
                    <button style={{ padding: "0.3rem 0.6rem", background: "#fee2e2", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.8rem" }}>🗑️ حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "system" && (
        <div style={{ background: "white", borderRadius: 12, padding: "3rem", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", color: "#94a3b8" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖥️</div>
          <p>إعدادات النظام قيد التطوير</p>
        </div>
      )}

      {activeTab === "notifications" && (
        <div style={{ background: "white", borderRadius: 12, padding: "3rem", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", color: "#94a3b8" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
          <p>إعدادات الإشعارات قيد التطوير</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// التطبيق الرئيسي
// ═══════════════════════════════════════
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage />;
      case "tickets": return <TicketsPage />;
      case "settings": return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}
