import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Tractor,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  Home,
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

  if (user.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "approvals", label: "Machine Approvals", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-green-900 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-green-800">
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
                <Tractor size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">AgriRent</h1>
                <p className="text-xs text-green-300">Admin Panel</p>
              </div>
            </div> */}
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? "bg-green-800 shadow-md"
                          : "hover:bg-green-800/50"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-green-800 space-y-2">
            <Link to="/">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-800/50 transition-all">
                <Home size={20} />
                <span className="font-medium">Back to Home</span>
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-800/50 transition-all text-red-300 hover:text-red-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm lg:hidden sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
            <div className="w-10"></div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "approvals" && <MachineApprovals />}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const DashboardContent = () => {
  const stats = [
    {
      label: "Total Transactions",
      value: "₹8.5L",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Admin Commission",
      value: "₹42,500",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Active Machines",
      value: "156",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Currently Booked",
      value: "43",
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
    { month: "Jul", revenue: 72000 },
    { month: "Aug", revenue: 85000 },
    { month: "Sep", revenue: 78000 },
    { month: "Oct", revenue: 92000 },
    { month: "Nov", revenue: 88000 },
    { month: "Dec", revenue: 95000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
          Dashboard
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Overview of your platform performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div
                    className={`p-2.5 sm:p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className={`${stat.iconColor} w-5 h-5 sm:w-6 sm:h-6`}
                    />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-20"></div>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                    {stat.value}
                  </p>
                </div>
              </div>

              <div
                className={`absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
            Monthly Revenue
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Track your earnings over time
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <div
            style={{ minWidth: "500px", width: "100%", height: "300px" }}
            className="sm:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03a74f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#03a74f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "11px", fontWeight: "500" }}
                  interval={0}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                  height={window.innerWidth < 640 ? 60 : 30}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "11px", fontWeight: "500" }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#03a74f"
                  strokeWidth={2.5}
                  dot={{ fill: "#03a74f", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  fill="url(#colorRevenue)"
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MachineApprovals = () => {
  return (
    <>
      {/* Approval List Component */}
      <ApprovalList />
    </>
  );
};

export default AdminDashboard;
