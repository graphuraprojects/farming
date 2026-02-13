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
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-green-900 text-white transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-green-800">
            <img src={logo} alt="logo" />
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                        activeTab === item.id
                          ? "bg-green-800 shadow-md"
                          : "hover:bg-green-800/50"
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-green-800 space-y-2">
            <Link to="/">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-800/50">
                <Home size={20} /> Back to Home
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-800/50 text-red-300"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm lg:hidden sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h1 className="font-bold">Admin Dashboard</h1>
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
    return <p className="text-center py-10">Loading dashboard...</p>;

  const stats = [
    {
      label: "Total Transactions",
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Admin Commission",
      value: `₹${analytics.adminEarnings.toLocaleString()}`,
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Total Bookings",
      value: analytics.totalBookings,
      icon: Package,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Completed Bookings",
      value: analytics.completedBookings,
      icon: Calendar,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
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
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <Icon className={`${stat.iconColor}`} />
                </div>
              </div>

              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* GRAPH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4">Monthly Revenue</h3>

        {console.log("🎯 Rendering Graph With:", analytics.monthlyRevenue)}

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={analytics.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#03a74f"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
