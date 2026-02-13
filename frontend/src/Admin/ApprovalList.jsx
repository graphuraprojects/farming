import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      return { label: "Rejected", color: "bg-red-100 text-red-700" };
    }
    if (machine.isApproved) {
      return { label: "Approved", color: "bg-green-100 text-green-700" };
    }
    return { label: "Pending Review", color: "bg-yellow-100 text-yellow-700" };
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col bg-white rounded-2xl shadow-lg p-4 sm:p-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                Machine Approvals
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Review and approve machine listings
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                All Machines
              </h2>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <span className="hidden sm:inline text-xs">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span>☰</span>
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg animate-slide-down">
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
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterStatus === filter.value
                          ? "bg-green-800 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
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
              <div className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-800 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600">
                Loading machines...
              </p>
            </div>
          ) : machines.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-gray-500">
              <p className="text-base sm:text-lg font-medium">
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
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase">
                    <div className="col-span-4">Machine Info</div>
                    <div className="col-span-2">Owner</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Submitted</div>
                    <div className="col-span-2">Status</div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {currentMachines.map((machine, index) => {
                      const statusInfo = getStatusInfo(machine);
                      return (
                        <div
                          key={machine._id}
                          onClick={() => handleViewDetails(machine._id)}
                          className="grid grid-cols-12 px-6 gap-4 py-4 items-center hover:bg-gray-50 transition-colors animate-fade-in cursor-pointer"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                              <div className="font-semibold text-gray-900 truncate text-sm">
                                {machine.machine_name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {machine.model} • {machine.model_year}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <div className="font-medium text-gray-900 text-sm truncate">
                              {machine.owner_id?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {machine.owner_id?._id || "N/A"}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 truncate max-w-full">
                              {machine.category}
                            </span>
                          </div>

                          <div className="col-span-2 text-xs sm:text-sm text-gray-600">
                            {formatDate(machine.createdAt)}
                          </div>

                          <div className="col-span-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
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
              <div className="lg:hidden divide-y divide-gray-200">
                {currentMachines.map((machine, index) => {
                  const statusInfo = getStatusInfo(machine);
                  return (
                    <div
                      key={machine._id}
                      onClick={() => handleViewDetails(machine._id)}
                      className="p-4 hover:bg-gray-50 transition-colors animate-fade-in cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {machine.machine_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {machine.model} • {machine.model_year}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusInfo.color}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">
                            Owner
                          </div>
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {machine.owner_id?.name || "Unknown"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">
                            Category
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 truncate max-w-full">
                            {machine.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        Submitted {formatDate(machine.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, machines.length)} of {machines.length}{" "}
                    machine{machines.length !== 1 ? "s" : ""}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
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
                                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-all ${
                                  currentPage === pageNumber
                                    ? "bg-green-800 text-white"
                                    : "border border-gray-300 text-gray-700 hover:bg-white"
                                }`}
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
                                className="px-1 text-gray-400"
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
                        className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
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

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
