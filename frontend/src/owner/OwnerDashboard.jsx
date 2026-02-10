import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState("month");
  const [requests, setRequests] = useState([]);
  const [fleetItems, setFleetItems] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [currentStats, setCurrentStats] = useState({
    revenue: "₹0",
    revenueTrend: "+0.0%",
    activeTrend: "+0.0%",
    pendingTrend: "+0.0%",
    maintenanceTrend: "+0.0%",
  });
  const [chartSeriesData, setChartSeriesData] = useState({
    revenue: [0, 0, 0, 0],
    projected: [0, 0, 0, 0],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Owner";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatPercent = (value) => {
    const sign = value < 0 ? "-" : "+";
    const magnitude = Math.abs(value).toFixed(1);
    return `${sign}${magnitude}%`;
  };

  const formatShortDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) {
      return "TBD";
    }

    const startText = formatShortDate(start);
    const endText = formatShortDate(end);
    if (!startText || !endText) {
      return "TBD";
    }

    return `${startText} - ${endText}`;
  };

  const formatDuration = (start, end) => {
    if (!start || !end) {
      return "TBD";
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return "TBD";
    }

    const diffMs = Math.max(endDate - startDate, 0);
    const diffDays = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1);
    return `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
  };

  const buildChartSeries = (trendData) => {
    const values = Array.isArray(trendData)
      ? trendData.map((item) => Math.round((item?.revenue || 0) / 1000))
      : [];
    const trimmed = values.slice(-4);
    while (trimmed.length < 4) {
      trimmed.unshift(0);
    }

    return {
      revenue: trimmed,
      projected: trimmed.map((value) => Math.round(value * 1.1)),
    };
  };

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setErrorMessage("");
        const headers = getAuthHeaders();
        const [fleetResponse, requestsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/owner/fleet/list`, { headers }),
          axios.get(`${API_BASE_URL}/owner/bookings/pending-requests`, {
            headers,
          }),
        ]);

        const mappedFleet = (fleetResponse.data || []).map((machine) => ({
          id: machine._id,
          img:
            machine.images?.[0]?.url ||
            "https://via.placeholder.com/64?text=Machine",
          name: machine.machine_name || machine.model || "Machine",
          type: machine.category || machine.model || "Machine",
          enabled: machine.availability_status !== false,
        }));

        const mappedRequests = (requestsResponse.data || []).map((booking) => ({
          id: booking._id,
          farmer: booking.farmer_id?.name || "Farmer",
          farm: booking.farmer_id?.address?.city || "Independent",
          machine: booking.machine_id?.machine_name || "Machine",
          machineType: booking.machine_id?.category || "Machine",
          dates: formatDateRange(booking.start_time, booking.end_time),
          duration: formatDuration(booking.start_time, booking.end_time),
          avatar: booking.farmer_id?.profile_pic?.url,
        }));

        setFleetItems(mappedFleet);
        setRequests(mappedRequests);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to load owner dashboard data.";
        setErrorMessage(message);
      }
    };

    fetchOverview();
  }, []);

  useEffect(() => {
    const fetchRangeStats = async () => {
      try {
        setErrorMessage("");
        const headers = getAuthHeaders();
        const [revenueResponse, trendResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/owner/dashboard/total-revenue`, {
            headers,
            params: { range: activeRange },
          }),
          axios.get(`${API_BASE_URL}/owner/dashboard/earnings-trend`, {
            headers,
            params: { range: activeRange },
          }),
        ]);

        const totalRevenue = revenueResponse.data?.totalRevenue || 0;
        setCurrentStats((prev) => ({
          ...prev,
          revenue: formatCurrency(totalRevenue),
          revenueTrend: prev.revenueTrend || formatPercent(0),
        }));
        setChartSeriesData(buildChartSeries(trendResponse.data));
      } catch (error) {
        const message =
          error?.response?.data?.message || "Failed to load earnings data.";
        setErrorMessage(message);
      }
    };

    fetchRangeStats();
  }, [activeRange]);

  const hasShownAlert = useRef(false);

useEffect(() => {
  if (hasShownAlert.current) return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    hasShownAlert.current = true;
    alert("Login first");
    navigate("/404", { replace: true });
  }
}, []);

  useEffect(() => {
    setCurrentStats((prev) => ({
      ...prev,
      activeTrend: prev.activeTrend || formatPercent(0),
      pendingTrend: prev.pendingTrend || formatPercent(0),
      maintenanceTrend: prev.maintenanceTrend || formatPercent(0),
    }));
  }, [fleetItems, requests]);

  const activeCount = fleetItems.filter((item) => item.enabled).length;
  const totalCount = fleetItems.length;
  const unavailableCount = totalCount - activeCount;
  const pendingCount = requests.length;

  const trendMeta = (value) => {
    const isDown = value.startsWith("-");
    return {
      tone: isDown ? "down" : "up",
      direction: isDown ? "down" : "up",
    };
  };

  const rangeButtonClass = (range) =>
    activeRange === range
      ? "px-5 py-2 rounded-lg bg-[#03a74f] text-white text-sm shadow-sm hover:bg-[#38864b] hover:shadow-md transition-all"
      : "px-5 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-gray-300 hover:text-[#131614] transition-colors";

  const handleRequestAction = async (id, action) => {
    try {
      const headers = getAuthHeaders();
      const endpoint = action === "accept" ? "approve" : "reject";
      await axios.patch(
        `${API_BASE_URL}/owner/bookings/${id}/${endpoint}`,
        {},
        { headers },
      );
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update booking request.";
      setErrorMessage(message);
    }
  };

  const handleToggleFleet = async (id) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.patch(
        `${API_BASE_URL}/owner/fleet/${id}/availability`,
        {},
        { headers },
      );
      const availability = response.data?.availability_status;
      setFleetItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                enabled:
                  typeof availability === "boolean"
                    ? availability
                    : !item.enabled,
              }
            : item,
        ),
      );
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update availability.";
      setErrorMessage(message);
    }
  };

  const chartSeries = chartSeriesData;
  const chartWidth = 800;
  const chartHeight = 280;
  const chartPaddingX = 24;
  const chartPaddingY = 24;
  const chartValues = [...chartSeries.revenue, ...chartSeries.projected];
  const chartMin = Math.min(...chartValues);
  const chartMax = Math.max(...chartValues);
  const chartRange = chartMax - chartMin || 1;

  const buildPoints = (values) =>
    values.map((value, index) => {
      const x =
        chartPaddingX +
        (index * (chartWidth - chartPaddingX * 2)) / (values.length - 1 || 1);
      const y =
        chartHeight -
        chartPaddingY -
        ((value - chartMin) / chartRange) * (chartHeight - chartPaddingY * 2);
      return { x, y, value, index };
    });

  const buildSmoothPath = (points) => {
    if (points.length < 2) {
      return "";
    }

    const tension = 0.6;
    const path = [`M${points[0].x},${points[0].y}`];

    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const prev = points[i - 1] || current;
      const nextNext = points[i + 2] || next;

      const cp1x = current.x + (next.x - prev.x) * tension * 0.2;
      const cp1y = current.y + (next.y - prev.y) * tension * 0.2;
      const cp2x = next.x - (nextNext.x - current.x) * tension * 0.2;
      const cp2y = next.y - (nextNext.y - current.y) * tension * 0.2;

      path.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`);
    }

    return path.join(" ");
  };

  const revenuePoints = buildPoints(chartSeries.revenue);
  const revenuePath = buildSmoothPath(revenuePoints);
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  return (
    <div className="min-h-screen bg-white font-['Manrope',sans-serif] text-[#1a1a1a]">
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="pointer-events-none absolute top-40 -left-24 h-64 w-64 rounded-full bg-[#f7f7f7] blur-3xl opacity-70" />
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Welcome back, {userName}</h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your fleet today.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/farmer-dashboard">
              <button
                className={rangeButtonClass("month")}
                onClick={() => setActiveRange("month")}
              >
                Farmer Dashboard
              </button>
            </Link>

            {/* <button
              className={rangeButtonClass("last")}
              onClick={() => setActiveRange("last")}
            >
              Last Month
            </button>
            <button
              className={rangeButtonClass("ytd")}
              onClick={() => setActiveRange("ytd")}
            >
              Year to Date
            </button> */}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <Stat
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#1E3D2B]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M7 8h10" />
                <path d="M7 12h6" />
              </svg>
            }
            title="Total Revenue"
            value={currentStats.revenue}
            trendValue={currentStats.revenueTrend}
            trendTone={trendMeta(currentStats.revenueTrend).tone}
            trendDirection={trendMeta(currentStats.revenueTrend).direction}
            iconBg="bg-[#ECF6F0]"
            accentTone="green"
          />
          <Stat
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#1E3D2B]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12h3l2-4h6l2 4h3" />
                <circle cx="7" cy="16" r="2.5" />
                <circle cx="17" cy="16" r="2.5" />
                <path d="M9 8V6a2 2 0 0 1 2-2h2" />
              </svg>
            }
            title="Active Machines"
            value={
              <>
                {activeCount}
                <span className="text-sm text-gray-400">/{totalCount}</span>
              </>
            }
            trendValue={currentStats.activeTrend}
            trendTone={trendMeta(currentStats.activeTrend).tone}
            trendDirection={trendMeta(currentStats.activeTrend).direction}
            iconBg="bg-[#F1F5F3]"
            accentTone="green"
          />
          <Stat
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#B45309]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="12" height="16" rx="2" />
                <path d="M9 8h6" />
                <path d="M9 12h4" />
                <circle cx="16" cy="16" r="1.5" />
              </svg>
            }
            title="Pending Requests"
            value={pendingCount}
            iconBg="bg-[#FFF3E8]"
            trendValue={currentStats.pendingTrend}
            trendTone={trendMeta(currentStats.pendingTrend).tone}
            trendDirection={trendMeta(currentStats.pendingTrend).direction}
            accentTone="orange"
          />
          <Stat
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#2563EB]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-7.4 7.4H7v-3.3z" />
                <path d="M7 17h3.3" />
              </svg>
            }
            title="Maintenance Due"
            value={unavailableCount}
            sub={unavailableCount === 1 ? "machine" : "machines"}
            iconBg="bg-[#EAF2FF]"
            trendValue={currentStats.maintenanceTrend}
            trendTone={trendMeta(currentStats.maintenanceTrend).tone}
            trendDirection={trendMeta(currentStats.maintenanceTrend).direction}
            accentTone="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="flex flex-col gap-6">
            {/* CHART */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[360px] transition-all duration-300 hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#131614]">
                    Earnings Performance
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Revenue trend over the last 30 days
                  </p>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <span className="flex items-center gap-2 font-medium text-[#131614]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#03a74f]" />{" "}
                    Revenue
                  </span>
                  <span className="flex items-center gap-2 font-medium text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />{" "}
                    Projected
                  </span>
                </div>
              </div>
              <div className="relative w-full flex-1 min-h-[220px] flex flex-col">
                <svg
                  className="w-full flex-1"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                >
                  <line
                    stroke="#EDF1EE"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="280"
                    y2="280"
                  />
                  <line
                    stroke="#F0F3F1"
                    strokeDasharray="4 6"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="210"
                    y2="210"
                  />
                  <line
                    stroke="#F0F3F1"
                    strokeDasharray="4 6"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="140"
                    y2="140"
                  />
                  <line
                    stroke="#F0F3F1"
                    strokeDasharray="4 6"
                    strokeWidth="1"
                    x1="0"
                    x2="800"
                    y1="70"
                    y2="70"
                  />
                  <path
                    d={revenuePath}
                    fill="none"
                    stroke="#03a74f"
                    strokeLinecap="round"
                    strokeWidth="2.6"
                  />
                  {revenuePoints.map((point) => (
                    <circle
                      key={`point-${point.index}`}
                      cx={point.x}
                      cy={point.y}
                      r={point.index === revenuePoints.length - 1 ? 4 : 3.5}
                      fill={
                        point.index === revenuePoints.length - 1
                          ? "#03a74f"
                          : "white"
                      }
                      stroke="#03a74f"
                      strokeWidth={
                        point.index === revenuePoints.length - 1 ? "0" : "2"
                      }
                    />
                  ))}
                  {revenuePoints.map((point) => (
                    <circle
                      key={`hover-${point.index}`}
                      cx={point.x}
                      cy={point.y}
                      r="10"
                      fill="transparent"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          x: point.x,
                          y: point.y,
                          label: weekLabels[point.index],
                          value: chartSeries.revenue[point.index],
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </svg>
                {hoveredPoint && (
                  <div
                    className="pointer-events-none absolute rounded-lg bg-white px-3 py-2 text-xs shadow-md border border-gray-200"
                    style={{
                      left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                      top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                      transform: "translate(-50%, -110%)",
                    }}
                  >
                    <p className="text-gray-500">{hoveredPoint.label}</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      ₹{hoveredPoint.value}k
                    </p>
                  </div>
                )}
                <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium">
                  {weekLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* BOOKINGS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#131614]">
                  Booking Requests
                </h3>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#1E3D2B] hover:underline"
                  onClick={() => navigate("/booking-history")}
                >
                  View All
                </button>
              </div>
              <div className="md:hidden p-5">
                {requests.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No pending booking requests.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {requests.map((request) => {
                      const initials =
                        request.initials ||
                        request.farmer
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();

                      return (
                        <div
                          key={request.id}
                          className="rounded-xl border border-gray-100 p-4 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            {request.avatar ? (
                              <div
                                className="w-10 h-10 rounded-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url('${request.avatar}')`,
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                                {initials}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-[#131614]">
                                {request.farmer}
                              </p>
                              <p className="text-xs text-gray-400">
                                {request.farm}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-medium text-[#131614]">
                              {request.machine}
                            </p>
                            <p className="text-xs text-gray-400">
                              {request.machineType}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                            <span className="text-sm font-medium text-[#131614]">
                              {request.dates}
                            </span>
                            <span>{request.duration}</span>
                          </div>
                          <div className="mt-4 flex gap-3">
                            <button
                              className="flex-1 px-2 py-1.5 text-sm font-medium text-red-600 border border-red-100 rounded-lg hover:text-red-700 transition-colors"
                              onClick={() =>
                                handleRequestAction(request.id, "reject")
                              }
                            >
                              Reject
                            </button>
                            <button
                              className="flex-1 px-4 py-1.5 rounded-lg bg-[#03a74f] hover:bg-[#38864b] text-white text-sm font-medium shadow-sm transition-colors"
                              onClick={() =>
                                handleRequestAction(request.id, "accept")
                              }
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Machine
                      </th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.length === 0 ? (
                      <tr>
                        <td
                          className="px-8 py-8 text-sm text-gray-500"
                          colSpan={4}
                        >
                          No pending booking requests.
                        </td>
                      </tr>
                    ) : (
                      requests.map((request) => {
                        const initials =
                          request.initials ||
                          request.farmer
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                          <tr
                            key={request.id}
                            className="group hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                {request.avatar ? (
                                  <div
                                    className="w-9 h-9 rounded-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url('${request.avatar}')`,
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                                    {initials}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-[#131614]">
                                    {request.farmer}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {request.farm}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <p className="text-sm font-medium text-[#131614]">
                                {request.machine}
                              </p>
                              <p className="text-xs text-gray-400">
                                {request.machineType}
                              </p>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#131614]">
                                  {request.dates}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {request.duration}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  className="px-2 py-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                  onClick={() =>
                                    handleRequestAction(request.id, "reject")
                                  }
                                >
                                  Reject
                                </button>
                                <button
                                  className="px-4 py-1.5 rounded-lg bg-[#03a74f] hover:bg-[#38864b] text-white text-sm font-medium shadow-sm transition-colors"
                                  onClick={() =>
                                    handleRequestAction(request.id, "accept")
                                  }
                                >
                                  Accept
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FLEET */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[360px] flex flex-col gap-4 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#131614]">My Fleet</h2>
              <button
                className="text-[#131614] hover:bg-gray-100 p-2 rounded-full transition-colors"
                type="button"
                onClick={() => navigate("/add-machine")}
                aria-label="Add machine"
              >
                +
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {fleetItems.map((item) => (
                <Fleet
                  key={item.id}
                  img={item.img}
                  name={item.name}
                  type={item.type}
                  enabled={item.enabled}
                  onToggle={() => handleToggleFleet(item.id)}
                />
              ))}
            </div>

            <button
              className="w-full py-2.5 text-sm font-medium text-gray-600 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              type="button"
              onClick={() => navigate("/machine-listing")}
            >
              View All Machines
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({
  icon,
  title,
  value,
  badge,
  sub,
  badgeTone,
  iconBg,
  badgeIcon,
  trendValue,
  trendTone,
  trendDirection,
  trendLabel = "vs last month",
  accentTone,
}) {
  const badgeStyles = {
    green: "bg-[#EAF8EF] text-[#1E7A46]",
    orange: "bg-[#FFF1E5] text-[#D97706]",
  };
  const trendStyles = {
    up: "bg-[#EAF8EF] text-[#1E7A46]",
    down: "bg-[#FEECEC] text-[#B91C1C]",
  };
  const accentStyles = {
    green: "bg-[#ECF6F0]",
    blue: "bg-[#EAF2FF]",
    orange: "bg-[#FFF3E8]",
  };

  const trendIcon =
    trendDirection === "down" ? (
      <svg
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14" />
        <path d="M19 12l-7 7-7-7" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    );

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div
        className={`pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full opacity-70 ${
          accentStyles[accentTone] || "bg-gray-100"
        }`}
      />
      <div className="flex justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${
            iconBg || "bg-[#F1F5F3]"
          } flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
        {badge && (
          <span
            className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
              badgeStyles[badgeTone] || "bg-gray-100 text-gray-600"
            }`}
          >
            {badgeIcon && <span className="inline-flex">{badgeIcon}</span>}
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold">
        {value}
        {sub && <span className="text-sm text-gray-400"> {sub}</span>}
      </h3>
      {trendValue && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
              trendStyles[trendTone] || "bg-gray-100 text-gray-600"
            }`}
          >
            {trendIcon}
            {trendValue}
          </span>
          <span className="text-gray-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

function Fleet({ img, name, type, extra, enabled, onToggle }) {
  const colors = {
    Available: "bg-[#e8f5e9] text-[#16a34a]",
    Unavailable: "bg-[#f7f7f7] text-[#8a9089]",
  };
  const dotColors = {
    Available: "bg-[#16a34a]",
    Unavailable: "bg-[#8a9089]",
  };
  const status = enabled ? "Available" : "Unavailable";

  return (
    <div className="p-4 rounded-lg border border-gray-100 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex gap-3">
        <img src={img} className="w-14 h-14 rounded-md object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className="font-bold text-[#131614] truncate">{name}</p>
            <button
              type="button"
              onClick={onToggle}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                enabled ? "bg-[#03a74f]" : "bg-gray-200 border border-gray-200"
              }`}
              aria-pressed={enabled}
              aria-label={`Set ${name} as ${enabled ? "Unavailable" : "Available"}`}
            >
              <span className="sr-only">Toggle availability</span>
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  enabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-2">{type}</p>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
            {status}
          </span>
          {extra && (
            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M3 9h18" />
              </svg>
              {extra}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
