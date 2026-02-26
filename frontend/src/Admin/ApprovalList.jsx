import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { color, shadow, gradientBg } from "../theme";

export default function ApprovalList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = `/api`;
  const ITEMS_PER_PAGE = 7;

  const fetchMachines = async (sort = "newest", status = "all") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/machines/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch machines");

      const result = await response.json();

      let filteredMachines = result.data || [];

      // Filter by status
      if (status === "pending") {
        filteredMachines = filteredMachines.filter(
          (m) => !m.isApproved && !m.rejection_reason,
        );
      } else if (status === "approved") {
        filteredMachines = filteredMachines.filter((m) => m.isApproved);
      } else if (status === "rejected") {
        filteredMachines = filteredMachines.filter((m) => m.rejection_reason);
      }

      // Sort
      if (sort === "newest") {
        filteredMachines.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      } else if (sort === "oldest") {
        filteredMachines.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      }

      setMachines(filteredMachines);
      setCurrentPage(1); // Reset to first page when filters change
      setError(null);
    } catch (err) {
      console.error("Error fetching machines:", err);
      setError("Unable to load machines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (machineId) => {
    navigate(`/admin/machines/${machineId}`);
  };

  const getStatusInfo = (machine) => {
    if (machine.rejection_reason) {
      return { label: "Rejected", dotColor: color.danger, bgColor: "#fef2f2", textColor: color.danger };
    }
    if (machine.isApproved) {
      return { label: "Approved", dotColor: color.emerald, bgColor: color.paleGreen, textColor: color.emerald };
    }
    return { label: "Pending Review", dotColor: "#ca8a04", bgColor: "#fef9c3", textColor: "#ca8a04" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hrs ago`;
    } else if (diffDays === 1) {
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(machines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMachines = machines.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchMachines(sortBy, filterStatus);
  }, [sortBy, filterStatus]);

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: color.bg, minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col bg-white rounded-2xl p-4 sm:p-6 gap-3" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
            <div>
              <h1
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mb-1"
                style={{ backgroundImage: gradientBg(color.forest, color.emerald), WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Machine Approvals
              </h1>
              <p className="text-xs sm:text-sm" style={{ color: color.textSoft }}>
                Review and approve machine listings
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "#fef2f2", border: `1px solid #fecaca`, color: color.danger }}>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
          <div className="px-4 sm:px-6 py-4" style={{ borderBottom: `1px solid ${color.border}`, background: color.bg }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <h2 className="text-base sm:text-lg font-bold" style={{ color: color.text }}>
                All Machines
              </h2>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: color.textSoft }}>
                  <span className="hidden sm:inline text-xs">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-none rounded-xl px-3 py-2 text-xs sm:text-sm outline-none transition-all"
                    style={{ border: `1.5px solid ${color.inputBorder}` }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200"
                  style={{ border: `1.5px solid ${color.inputBorder}`, color: color.text }}
                >
                  <span>☰</span>
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="mt-4 p-3 sm:p-4 rounded-xl" style={{ background: "white", border: `1px solid ${color.border}` }}>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All Machines" },
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                      style={
                        filterStatus === filter.value
                          ? { background: gradientBg(color.emerald, color.forest), color: "white" }
                          : { background: "white", color: color.text, border: `1px solid ${color.inputBorder}` }
                      }
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: color.paleGreen, borderTopColor: color.emerald }}></div>
              <p className="mt-4 text-sm" style={{ color: color.textSoft }}>
                Loading machines...
              </p>
            </div>
          ) : machines.length === 0 ? (
            <div className="p-8 sm:p-12 text-center" style={{ color: color.textSoft }}>
              <p className="text-base sm:text-lg font-semibold">
                No machines found
              </p>
              <p className="text-xs sm:text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ background: color.bg, borderBottom: `1px solid ${color.border}`, color: color.textSoft }}>
                    <div className="col-span-4">Machine Info</div>
                    <div className="col-span-2">Owner</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Submitted</div>
                    <div className="col-span-2">Status</div>
                  </div>

                  <div style={{ borderTop: "none" }}>
                    {currentMachines.map((machine, index) => {
                      const statusInfo = getStatusInfo(machine);
                      return (
                        <div
                          key={machine._id}
                          onClick={() => handleViewDetails(machine._id)}
                          className="grid grid-cols-12 px-6 gap-4 py-4 items-center transition-colors duration-200 cursor-pointer hover:bg-gray-50"
                          style={{ borderBottom: index < currentMachines.length - 1 ? `1px solid ${color.border}` : "none" }}
                        >
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: color.bg }}>
                              {machine.images && machine.images.length > 0 ? (
                                <img
                                  src={machine.images[0].url}
                                  alt={machine.machine_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  🚜
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold truncate text-sm" style={{ color: color.text }}>
                                {machine.machine_name}
                              </div>
                              <div className="text-xs truncate" style={{ color: color.textSoft }}>
                                {machine.model} • {machine.model_year}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <div className="font-medium text-sm truncate" style={{ color: color.text }}>
                              {machine.owner_id?.name || "Unknown"}
                            </div>
                            <div className="text-xs truncate" style={{ color: color.textSoft }}>
                              {machine.owner_id?._id || "N/A"}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold truncate max-w-full" style={{ background: color.paleGreen, color: color.emerald }}>
                              {machine.category}
                            </span>
                          </div>

                          <div className="col-span-2 text-xs sm:text-sm" style={{ color: color.textSoft }}>
                            {formatDate(machine.createdAt)}
                          </div>

                          <div className="col-span-2">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{ background: statusInfo.bgColor, color: statusInfo.textColor }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.dotColor }}></span>
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {currentMachines.map((machine, index) => {
                  const statusInfo = getStatusInfo(machine);
                  return (
                    <div
                      key={machine._id}
                      onClick={() => handleViewDetails(machine._id)}
                      className="p-4 transition-colors cursor-pointer hover:bg-gray-50"
                      style={{ borderBottom: index < currentMachines.length - 1 ? `1px solid ${color.border}` : "none" }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: color.bg }}>
                          {machine.images && machine.images.length > 0 ? (
                            <img
                              src={machine.images[0].url}
                              alt={machine.machine_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🚜
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate" style={{ color: color.text }}>
                            {machine.machine_name}
                          </div>
                          <div className="text-xs truncate" style={{ color: color.textSoft }}>
                            {machine.model} • {machine.model_year}
                          </div>
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mt-1"
                            style={{ background: statusInfo.bgColor, color: statusInfo.textColor }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.dotColor }}></span>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs mb-0.5" style={{ color: color.textSoft }}>
                            Owner
                          </div>
                          <div className="font-medium text-sm truncate" style={{ color: color.text }}>
                            {machine.owner_id?.name || "Unknown"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs mb-0.5" style={{ color: color.textSoft }}>
                            Category
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold truncate max-w-full" style={{ background: color.paleGreen, color: color.emerald }}>
                            {machine.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs mt-2" style={{ color: color.textSoft }}>
                        Submitted {formatDate(machine.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4" style={{ borderTop: `1px solid ${color.border}`, background: color.bg }}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm" style={{ color: color.textSoft }}>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, machines.length)} of {machines.length}{" "}
                    machine{machines.length !== 1 ? "s" : ""}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ border: `1px solid ${color.inputBorder}` }}
                      >
                        <ChevronLeft className="w-4 h-4" style={{ color: color.textSoft }} />
                      </button>

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Show first page, last page, current page, and pages around current
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className="min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all"
                                style={
                                  currentPage === pageNumber
                                    ? { background: gradientBg(color.emerald, color.forest), color: "white" }
                                    : { border: `1px solid ${color.inputBorder}`, color: color.text }
                                }
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNumber}
                                className="px-1"
                                style={{ color: color.textSoft }}
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ border: `1px solid ${color.inputBorder}` }}
                      >
                        <ChevronRight className="w-4 h-4" style={{ color: color.textSoft }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
