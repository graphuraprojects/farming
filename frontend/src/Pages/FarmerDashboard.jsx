import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, CheckCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { color, shadow, gradientBg } from "../theme";

const FarmerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await axios.get(`/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res?.data?.data || []);
      } catch (err) {
        console.log(err.response?.data);
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking,
  );
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { background: color.paleGreen, color: color.emerald };
      case "accepted":
        return { background: "#dbeafe", color: "#2563eb" };
      case "cancelled":
      case "rejected":
        return { background: "#fef2f2", color: color.danger };
      case "pending":
        return { background: "#fef9c3", color: "#ca8a04" };
      default:
        return { background: "#f3f4f6", color: "#6b7280" };
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: color.bg }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 border-3 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: color.paleGreen,
              borderTopColor: color.emerald,
            }}
          />
          <p className="font-medium" style={{ color: color.textSoft }}>
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: color.bg }}
      >
        <p className="font-medium" style={{ color: color.danger }}>
          {error}
        </p>
      </div>
    );
  }

  const formatDays = (totalDays) => {
    return `${totalDays} day${totalDays !== 1 ? "s" : ""}`;
  };

  const kpiCards = [
    {
      label: "Total Rentals",
      value: bookings.length,
      icon: Calendar,
      iconBg: color.paleGreen,
      iconColor: color.emerald,
      accentBg: color.paleGreen,
    },
    {
      label: "Days Logged",
      value: formatDays(
        bookings.reduce((acc, b) => acc + (b.total_days || 0), 0),
      ),
      icon: Clock,
      iconBg: "#fff7ed",
      iconColor: "#ea580c",
      accentBg: "#fff7ed",
    },
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.booking_status === "accepted").length,
      icon: CheckCircle,
      iconBg: color.paleGreen,
      iconColor: color.emerald,
      accentBg: color.paleGreen,
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: color.bg }}>
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: color.text }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: color.textSoft }}>
            Overview of your rental activity
          </p>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: shadow.sm,
                  border: `1px solid ${color.border}`,
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full transition-transform group-hover:scale-110"
                  style={{ background: kpi.accentBg }}
                />

                <div className="relative z-10 flex flex-col gap-1">
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: kpi.iconBg }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: kpi.iconColor }}
                    />
                  </div>

                  <p className="text-sm" style={{ color: color.textSoft }}>
                    {kpi.label}
                  </p>

                  <h3
                    className="text-3xl font-bold"
                    style={{ color: color.text }}
                  >
                    {kpi.value}
                  </h3>
                </div>
              </div>
            );
          })}

          {/* Booking History Card */}
          <div
            onClick={() => navigate("/booking-history")}
            className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              boxShadow: shadow.sm,
              border: `1px solid ${color.border}`,
            }}
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-50 transition-transform group-hover:scale-110" />

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <History className="w-6 h-6 text-purple-600" />
              </div>

              <p className="text-sm" style={{ color: color.textSoft }}>
                Booking History
              </p>

              <h3
                className="text-lg font-semibold flex items-center gap-1"
                style={{ color: color.text }}
              >
                View All Bookings
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </h3>
            </div>
          </div>
        </section>

        {/* Table */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: color.bg }}>
                <tr style={{ borderBottom: `1px solid ${color.border}` }}>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: color.textSoft }}
                  >
                    Machine
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: color.textSoft }}
                  >
                    Booking ID
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: color.textSoft }}
                  >
                    Date
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: color.textSoft }}
                  >
                    Duration
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: color.textSoft }}
                  >
                    Amount Paid
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: color.textSoft }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentBookings.map((booking, idx) => (
                  <tr
                    key={booking._id}
                    className="transition-colors hover:bg-gray-50"
                    style={{
                      borderBottom:
                        idx < bookings.length - 1
                          ? `1px solid ${color.border}`
                          : "none",
                    }}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          booking.machine_id?.images?.[0]?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={booking.machine_id?.machine_name || "Machine"}
                        className="w-12 h-12 object-cover rounded-xl"
                      />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: color.text }}
                      >
                        {booking.machine_id?.machine_name || "Unknown Machine"}
                      </span>
                    </td>

                    <td
                      className="px-6 py-4 text-sm font-mono"
                      style={{ color: color.textSoft }}
                    >
                      {booking._id.slice(-8)}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: color.text }}
                    >
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>

                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: color.text }}
                    >
                      {booking.total_days} Days
                    </td>

                    <td
                      className="px-6 py-4 text-sm font-bold"
                      style={{ color: color.warmGold }}
                    >
                      ₹{booking.total_amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                        style={getStatusColor(booking.booking_status)}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pb-6 px-6">
                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40"
                  style={{ borderColor: color.border }}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition"
                    style={{
                      background:
                        currentPage === i + 1 ? color.emerald : "white",
                      color: currentPage === i + 1 ? "white" : color.text,
                      border: `1px solid ${color.border}`,
                    }}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40"
                  style={{ borderColor: color.border }}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            {currentBookings.map((booking, idx) => (
              <div
                key={booking._id}
                className="p-4"
                style={{
                  borderBottom:
                    idx < bookings.length - 1
                      ? `1px solid ${color.border}`
                      : "none",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={
                      booking.machine_id?.images?.[0]?.url ||
                      "https://via.placeholder.com/150"
                    }
                    alt={booking.machine_id?.machine_name || "Machine"}
                    className="w-12 h-12 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <div
                      className="font-semibold text-sm"
                      style={{ color: color.text }}
                    >
                      {booking.machine_id?.machine_name}
                    </div>
                    <div
                      className="text-xs font-mono"
                      style={{ color: color.textSoft }}
                    >
                      {booking._id.slice(-8)}
                    </div>
                  </div>

                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                    style={getStatusColor(booking.booking_status)}
                  >
                    {booking.booking_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs" style={{ color: color.textSoft }}>
                      Date
                    </div>
                    <div style={{ color: color.text }}>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs" style={{ color: color.textSoft }}>
                      Duration
                    </div>
                    <div style={{ color: color.text }}>
                      {booking.total_days} Days
                    </div>
                  </div>
                </div>

                <div
                  className="pt-3 mt-3"
                  style={{ borderTop: `1px solid ${color.border}` }}
                >
                  <div
                    className="text-lg font-bold"
                    style={{ color: color.warmGold }}
                  >
                    ₹{booking.total_amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
