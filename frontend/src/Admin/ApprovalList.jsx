import { useState, useEffect } from "react";
import { IndianRupee } from "lucide-react";

export default function ApprovalList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [machines, setMachines] = useState([]);
  const [totalMachines, setTotalMachines] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRegion, setFilterRegion] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // API base URL
  const API_BASE_URL = `http://localhost:5000/api`;

  // Fetch machines with pagination and filters
  const fetchMachines = async (page = 1, sort = "newest", region = "all") => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
      });

      // Add region filter if not "all"
      if (region !== "all") {
        queryParams.append("state", region);
      }

      const response = await fetch(`${API_BASE_URL}/machines?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch machines: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Filter for pending approvals (isApproved: false)
        const pendingMachines = result.data.filter(
          (machine) => machine.isApproved === false,
        );

        // Sort machines based on sortBy
        let sortedMachines = [...pendingMachines];
        switch (sort) {
          case "newest":
            sortedMachines.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            break;
          case "oldest":
            sortedMachines.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            );
            break;
          case "region":
            sortedMachines.sort((a, b) =>
              a.address?.state?.localeCompare(b.address?.state),
            );
            break;
          default:
            break;
        }

        setMachines(sortedMachines);
        setTotalMachines(result.count || sortedMachines.length);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching machines:", err);
      setError(err.message || "Unable to load machines. Please try again.");
      setMachines([]);
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
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: true }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to approve machine");
      }

      // Refresh data
      await fetchMachines(currentPage, sortBy, filterRegion);

      // Show success notification
      alert("Machine approved successfully!");
    } catch (err) {
      console.error("Error approving machine:", err);
      alert("Failed to approve machine. Please try again.");
    }
  };

  // Reject machine
  const handleRejectMachine = async (machineId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");

    if (reason === null) return; // User cancelled

    try {
      const response = await fetch(
        `${API_BASE_URL}/machines/${machineId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isApproved: false,
            rejection_reason: reason || "Rejected by admin",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reject machine");
      }

      // Refresh data
      await fetchMachines(currentPage, sortBy, filterRegion);

      alert("Machine rejected successfully!");
    } catch (err) {
      console.error("Error rejecting machine:", err);
      alert("Failed to reject machine. Please try again.");
    }
  };

  // Export data
  const handleExportData = async () => {
    try {
      // Create CSV from current machines data
      const csvHeaders = [
        "ID",
        "Machine Name",
        "Model",
        "Owner",
        "Region",
        "Category",
        "Price/Hour",
        "Submitted",
        "Status",
      ];

      const csvRows = machines.map((machine) => [
        machine._id,
        machine.machine_name,
        machine.model,
        machine.owner_id?.name || "N/A",
        machine.address?.state,
        machine.address?.city,
        machine.address?.street,
        machine.category,
        `₹${machine.price_per_hour}`,
        new Date(machine.createdAt).toLocaleDateString(),
        machine.isApproved ? "Approved" : "Pending",
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
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
    await fetchMachines(currentPage, sortBy, filterRegion);
  };

  // Initial data load
  useEffect(() => {
    fetchMachines(currentPage, sortBy, filterRegion);
  }, [currentPage, sortBy, filterRegion]);

  // Helper function to get status display
  const getStatusDisplay = (machine) => {
    if (machine.isApproved) {
      return {
        label: "Approved",
        color: "bg-green-100 text-green-700",
      };
    } else if (machine.rejection_reason) {
      return {
        label: "Rejected",
        color: "bg-red-100 text-red-700",
      };
    } else {
      return {
        label: "Pending Review",
        color: "bg-yellow-100 text-yellow-700",
      };
    }
  };

  // Helper function to get region color
  const getRegionColor = (state) => {
    const colors = {
      MH: "bg-blue-100 text-blue-700",
      GJ: "bg-purple-100 text-purple-700",
      PB: "bg-green-100 text-green-700",
      KA: "bg-pink-100 text-pink-700",
      TG: "bg-indigo-100 text-indigo-700",
      TN: "bg-orange-100 text-orange-700",
    };
    return colors[state] || "bg-gray-100 text-gray-700";
  };

  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // Helper function to get machine icon
  const getMachineIcon = (category) => {
    const icons = {
      Tractor: "🚜",
      Harvester: "🌾",
      Plough: "🔧",
      Sprayer: "💦",
      Seeder: "🌱",
      Rotavator: "⚙️",
    };
    return icons[category] || "🚜";
  };

  // Get owner type based on available data
  const getOwnerType = (machine) => {
    // You can customize this based on your business logic
    if (machine.owner_id?.verified) return "Verified Farmer";
    if (machine.owner_id?.type === "business") return "Agri-Business";
    return "Registered User";
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
              Verification Queue ({machines.length} pending)
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
                {["MH", "GJ", "PB", "KA", "TG", "TN"].map((state) => (
                  <button
                    key={state}
                    onClick={() => setFilterRegion(state)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterRegion === state
                        ? "bg-green-800 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {state}
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
        ) : machines.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            {/* <div className="text-6xl mb-4">✅</div> */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              No pending machine approvals at the moment.
            </p>
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
                    key={machine._id}
                    className="grid grid-cols-12 px-6 gap-2 py-4 items-center hover:bg-gray-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Machine Info */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                        {getMachineIcon(machine.category)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {machine.machine_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {machine.model} • {machine.registration_no}
                        </div>
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="col-span-2">
                      <div className="font-medium text-gray-900">
                        {machine.owner_id?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getOwnerType(machine)}
                      </div>
                    </div>

                    {/* Region */}
                    <div className="col-span-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRegionColor(machine.address.state)}`}
                      >
                        {machine.address.city}, {machine.address.state}
                      </span>
                    </div>

                    {/* Submitted */}
                    <div className="col-span-2 text-sm text-gray-600">
                      {getTimeAgo(machine.createdAt)}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusDisplay(machine).color}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        {getStatusDisplay(machine).label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          // View details - you can implement a modal or navigate to detail page
                          alert(
                            `Machine Details:\n\nName: ${machine.machine_name}\nModel: ${machine.model}\nYear: ${machine.model_year}\nCategory: ${machine.category}\nFuel: ${machine.fuel_type}\nPrice: ₹${machine.price_per_hour}/hr\nOwner: ${machine.owner_id?.name}\nAddress: ${machine.address.street}, ${machine.address.city}`,
                          );
                        }}
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
                        onClick={() => handleRejectMachine(machine._id)}
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
                        onClick={() => handleApproveMachine(machine._id)}
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
                  key={machine._id}
                  className="p-4 hover:bg-gray-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Machine Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                      {getMachineIcon(machine.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {machine.machine_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {machine.model} • {machine.registration_no}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusDisplay(machine).color}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      {getStatusDisplay(machine).label}
                    </span>
                  </div>

                  {/* Machine Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Owner</div>
                      <div className="font-medium text-gray-900">
                        {machine.owner_id?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getOwnerType(machine)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Region</div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRegionColor(machine.address.state)}`}
                      >
                        {machine.address.city}, {machine.address.state}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    Submitted {getTimeAgo(machine.createdAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        alert(
                          `Machine Details:\n\nName: ${machine.machine_name}\nModel: ${machine.model}\nYear: ${machine.model_year}\nCategory: ${machine.category}\nFuel: ${machine.fuel_type}\nPrice: ₹${machine.price_per_hour}/hr\nOwner: ${machine.owner_id?.name}\nAddress: ${machine.address.street}, ${machine.address.city}`,
                        );
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRejectMachine(machine._id)}
                      className="px-3 py-2 border border-red-300 bg-red-50 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveMachine(machine._id)}
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
                Showing {machines.length} of {totalMachines} pending requests
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
                  disabled={machines.length < 10}
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
