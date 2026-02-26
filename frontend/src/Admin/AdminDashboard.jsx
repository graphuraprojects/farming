import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Users,
  TrendingUp,
  Package,
  Calendar,
  Home,
  IndianRupee,
} from "lucide-react";
import logo from "../assets/logo1.webp";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ApprovalList from "./ApprovalList";
import UserManagement from "./UserManagement";
import { color, shadow, gradientBg } from "../theme";

/* ============================
   ADMIN DASHBOARD
============================ */

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/404");
    }
  }, [user.role, navigate]);

  if (user.role !== "admin") return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "approvals", label: "Machine Approvals", icon: CheckCircle },
    { id: "UserManagement", label: "User Management", icon: Users },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: color.bg }}>
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 text-white transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: `linear-gradient(180deg, ${color.deepForest} 0%, ${color.forest} 100%)` }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6" style={{ borderBottom: `1px solid ${color.emerald}30` }}>
            <img src={logo} alt="logo" className="max-h-10" />
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                      style={
                        isActive
                          ? { background: `${color.emerald}25`, color: color.paleGreen, boxShadow: `0 0 20px ${color.emerald}15` }
                          : { color: "rgba(255,255,255,0.7)" }
                      }
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = `${color.emerald}15`; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 space-y-1.5" style={{ borderTop: `1px solid ${color.emerald}30` }}>
            <Link to="/">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${color.emerald}15`}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <Home size={18} /> Back to Home
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ color: "#fca5a5" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header
          className="lg:hidden sticky top-0 z-40"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${color.border}` }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h1 className="font-bold text-sm" style={{ color: color.text }}>Admin Dashboard</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "approvals" && <ApprovalList />}
          {activeTab === "UserManagement" && <UserManagement />}
        </main>
      </div>
    </div>
  );
};

/* ============================
   DASHBOARD CONTENT (Dynamic)
============================ */

const DashboardContent = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("🔥 Fetching analytics...");

        const res = await axios.get(`/api/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Full API Response:", res.data);
        console.log("📊 Analytics Data:", res.data.data);
        console.log("📈 Monthly Revenue Data:", res.data.data?.monthlyRevenue);

        setAnalytics(res.data.data);
      } catch (err) {
        console.log("❌ Analytics Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (analytics) {
      console.log("🧾 Analytics State Updated:", analytics);
      console.log("📉 Graph Data Being Passed:", analytics.monthlyRevenue);
    }
  }, [analytics]);

  if (loading || !analytics)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-3 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: color.paleGreen, borderTopColor: color.emerald }} />
          <p className="text-sm font-medium" style={{ color: color.textSoft }}>Loading dashboard...</p>
        </div>
      </div>
    );

  const stats = [
    {
      label: "Total Transactions",
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      iconBg: color.paleGreen,
      iconColor: color.emerald,
      accentBg: color.paleGreen,
    },
    {
      label: "Admin Commission",
      value: `₹${analytics.adminEarnings.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: "#fff7ed",
      iconColor: "#ea580c",
      accentBg: "#fff7ed",
    },
    {
      label: "Total Bookings",
      value: analytics.totalBookings,
      icon: Package,
      iconBg: "#f3e8ff",
      iconColor: "#9333ea",
      accentBg: "#f3e8ff",
    },
    {
      label: "Completed Bookings",
      value: analytics.completedBookings,
      icon: Calendar,
      iconBg: "#ecfdf5",
      iconColor: color.lush,
      accentBg: "#ecfdf5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
            >
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full transition-transform group-hover:scale-110"
                style={{ background: stat.accentBg }}
              />

              <div className="relative z-10 flex flex-col gap-1">
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: stat.iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.iconColor }} />
                </div>

                <p className="text-sm" style={{ color: color.textSoft }}>{stat.label}</p>
                <p className="text-3xl font-bold" style={{ color: color.text }}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAPH */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: color.text }}>Monthly Revenue</h3>

        {console.log("🎯 Rendering Graph With:", analytics.monthlyRevenue)}

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={analytics.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.border} />
            <XAxis dataKey="month" tick={{ fill: color.textSoft, fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: color.textSoft, fontSize: 12 }} />
            <Tooltip
              formatter={(v) => `₹${v.toLocaleString()}`}
              contentStyle={{
                background: "white",
                border: `1px solid ${color.border}`,
                borderRadius: "12px",
                boxShadow: shadow.md,
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={color.emerald}
              strokeWidth={3}
              dot={{ fill: color.emerald, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: color.emerald, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
