import { useState, useEffect } from "react";
import { IndianRupee } from "lucide-react";

export default function FarmingDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [machines, setMachines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRegion, setFilterRegion] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulated API base URL - replace with your actual backend URL
  const API_BASE_URL = "https://api";

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Fallback to demo data
      setStats({
        totalCommission: 142890.0,
        commissionGrowth: 12,
        activeRegions: 14,
        newRegions: 2,
        pendingApprovals: 23,
        activeMachines: 1240,
        machineGrowth: 8,
      });
    }
  };

  // Fetch machines with pagination and filters
  const fetchMachines = async (page = 1, sort = "newest", region = "all") => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        sort,
        ...(region !== "all" && { region }),
      });

      const response = await fetch(
        `${API_BASE_URL}/machines/pending?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch machines");

      const data = await response.json();
      setMachines(data.machines);
      setError(null);
    } catch (err) {
      console.error("Error fetching machines:", err);
      setError("Unable to load machines. Please try again.");

      // Fallback to demo data
      setMachines([
        {
          id: "M-2023-861",
          name: "John Deere 5050D",
          owner: "Ravi Patel",
          ownerType: "Verified Farmer",
          region: "Gujarat",
          submitted: "2 hrs ago",
          status: "pending_review",
          icon: "🚜",
        },
        {
          id: "M-2023-864",
          name: "Kubota Harvester DC-68",
          owner: "Anik Singh",
          ownerType: "New Registration",
          region: "Punjab",
          submitted: "5 hrs ago",
          status: "pending_review",
          icon: "🚜",
        },
        {
          id: "M-2023-842",
          name: "Mahindra Rotavator",
          owner: "Lakshmi Devi",
          ownerType: "Verified Farmer",
          region: "Karnataka",
          submitted: "1 day ago",
          status: "docs_missing",
          icon: "🚜",
        },
        {
          id: "M-2023-776",
          name: "Happy Seeder 10-Row",
          owner: "Vikram Reddy",
          ownerType: "Agri-Business",
          region: "Telangana",
          submitted: "2 days ago",
          status: "pending_review",
          icon: "🚜",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Approve machine
  const handleApproveMachine = async (machineId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/machines/${machineId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to approve machine");

      // Refresh data
      await fetchMachines(currentPage, sortBy, filterRegion);
      await fetchStats();

      // Show success notification (you can integrate a toast library)
      alert("Machine approved successfully!");
    } catch (err) {
      console.error("Error approving machine:", err);
      alert("Failed to approve machine. Please try again.");
    }
  };

  // Delete/Reject machine
  const handleDeleteMachine = async (machineId) => {
    if (!confirm("Are you sure you want to reject this machine?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/machines/${machineId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete machine");

      // Refresh data
      await fetchMachines(currentPage, sortBy, filterRegion);
      await fetchStats();

      alert("Machine rejected successfully!");
    } catch (err) {
      console.error("Error deleting machine:", err);
      alert("Failed to reject machine. Please try again.");
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/machines/export`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to export data");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `machines-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting data:", err);
      alert("Failed to export data. Please try again.");
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchStats(),
      fetchMachines(currentPage, sortBy, filterRegion),
    ]);
  };

  // Initial data load
  useEffect(() => {
    fetchStats();
    fetchMachines(currentPage, sortBy, filterRegion);
  }, [currentPage, sortBy, filterRegion]);

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending_review: {
        label: "Pending Review",
        color: "bg-yellow-100 text-yellow-700",
      },
      docs_missing: {
        label: "Docs Missing",
        color: "bg-orange-100 text-orange-700",
      },
      approved: { label: "Approved", color: "bg-green-100 text-green-700" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
    };
    return statusMap[status] || statusMap["pending_review"];
  };

  const getRegionColor = (region) => {
    const colors = {
      Gujarat: "bg-blue-100 text-blue-700",
      Punjab: "bg-purple-100 text-purple-700",
      Karnataka: "bg-green-100 text-green-700",
      Telangana: "bg-pink-100 text-pink-700",
      Maharashtra: "bg-indigo-100 text-indigo-700",
      "Tamil Nadu": "bg-orange-100 text-orange-700",
    };
    return colors[region] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <div className="flex flex-col bg-white rounded-2xl shadow-lg p-6 sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Pending Machine Approvals
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Detailed specifications and owner verification status requiring
              action.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Platform Commission */}
          <div
            className="bg-white !rounded-2xl cursor-pointer p-4 sm:p-6 !shadow-lg hover:shadow-xl border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs sm:text-sm text-gray-600">
                Total Platform Commission
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
            <div className="flex items-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              <IndianRupee />
              {stats.totalCommission.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-green-600">
              <span className="mr-1">↗</span>
              <span className="font-medium">+{stats.commissionGrowth}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Active Regions */}
          <div
            className="bg-white rounded-2xl p-4 cursor-pointer sm:p-6 shadow-lg border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs sm:text-sm text-gray-600">
                Active Regions
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🗺️</span>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {stats.activeRegions} Districts
            </div>
            <div className="flex items-center text-xs sm:text-sm text-green-600">
              <span className="font-medium">+ {stats.newRegions} New</span>
              <span className="text-gray-500 ml-1">this week</span>
            </div>
          </div>

          {/* Pending Approvals */}
          <div
            className="bg-white rounded-2xl cursor-pointer p-4 sm:p-6 shadow-lg border border-gray-200 border-l-4 border-l-orange-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs sm:text-sm text-gray-600">
                Pending Approvals
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {stats.pendingApprovals} Requests
            </div>
            <div className="flex items-center text-xs sm:text-sm text-red-600">
              <span className="mr-1">⚠️</span>
              <span className="font-medium">Action Required</span>
            </div>
          </div>

          {/* Total Active Machines */}
          <div
            className="bg-white rounded-2xl p-4 cursor-pointer sm:p-6 shadow-lg border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs sm:text-sm text-gray-600">
                Total Active Machines
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚜</span>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {stats.activeMachines.toLocaleString()}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-green-600">
              <span className="mr-1">↗</span>
              <span className="font-medium">+{stats.machineGrowth}%</span>
              <span className="text-gray-500 ml-1">growth</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Verification Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
        {/* Queue Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Verification Queue
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="region">Region</option>
                  <option value="status">Status</option>
                </select>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                <span>☰</span>
                Filter
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportData}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-800 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-900 transition-all shadow-sm hover:shadow"
              >
                <span>↓</span>
                Export
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-slide-down">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterRegion("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterRegion === "all"
                      ? "bg-green-800 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All Regions
                </button>
                {[
                  "Gujarat",
                  "Punjab",
                  "Karnataka",
                  "Telangana",
                  "Maharashtra",
                ].map((region) => (
                  <button
                    key={region}
                    onClick={() => setFilterRegion(region)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterRegion === region
                        ? "bg-green-800 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-800 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading machines...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto p-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase">
                <div className="col-span-3">Machine Info</div>
                <div className="col-span-2">Owner</div>
                <div className="col-span-2">Region</div>
                <div className="col-span-2">Submitted</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                {machines.map((machine, index) => (
                  <div
                    key={machine.id}
                    className="grid grid-cols-12 px-6 gap-2 py-4 items-center hover:bg-gray-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Machine Info */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                        {machine.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {machine.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {machine.id}
                        </div>
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="col-span-2">
                      <div className="font-medium text-gray-900">
                        {machine.owner}
                      </div>
                      <div className="text-xs text-gray-500">
                        {machine.ownerType}
                      </div>
                    </div>

                    {/* Region */}
                    <div className="col-span-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRegionColor(machine.region)}`}
                      >
                        {machine.region}
                      </span>
                    </div>

                    {/* Submitted */}
                    <div className="col-span-2 text-sm text-gray-600">
                      {machine.submitted}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusDisplay(machine.status).color}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        {getStatusDisplay(machine.status).label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center gap-2">
                      <button
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="View Details"
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMachine(machine.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Reject"
                      >
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleApproveMachine(machine.id)}
                        className="px-3 py-1 bg-green-800 text-white rounded text-xs font-medium hover:bg-green-900 transition-all transform hover:scale-105"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {machines.map((machine, index) => (
                <div
                  key={machine.id}
                  className="p-4 hover:bg-gray-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Machine Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                      {machine.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {machine.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {machine.id}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusDisplay(machine.status).color}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      {getStatusDisplay(machine.status).label}
                    </span>
                  </div>

                  {/* Machine Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Owner</div>
                      <div className="font-medium text-gray-900">
                        {machine.owner}
                      </div>
                      <div className="text-xs text-gray-500">
                        {machine.ownerType}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Region</div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRegionColor(machine.region)}`}
                      >
                        {machine.region}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    Submitted {machine.submitted}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteMachine(machine.id)}
                      className="px-3 py-2 border border-red-300 bg-red-50 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveMachine(machine.id)}
                      className="flex-1 px-3 py-2 bg-green-800 text-white rounded-lg text-sm font-medium hover:bg-green-900 transition-all transform active:scale-95"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {machines.length} of {stats?.pendingApprovals || 0}{" "}
                requests
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                >
                  <span>‹ Prev</span>
                </button>
                <div className="px-4 py-1.5 bg-green-800 text-white rounded-lg font-medium text-sm">
                  {currentPage}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>Next ›</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
