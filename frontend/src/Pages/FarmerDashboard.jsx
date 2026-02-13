import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, CheckCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";

const FarmerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch Bookings API
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Loading UI
  if (loading) {
    return <p className="text-center py-10">Loading bookings...</p>;
  }

  // ✅ Error UI
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }
  const formatHoursMinutes = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background-dark dark:bg-background-dark p-6 lg:p-10 font-display text-[#1f3d2b]">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8">
        {/* KPI Cards */}
        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Total Rentals */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-lg">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>

              <p className="text-sm text-gray-500">Total Rentals</p>

              <h3 className="text-3xl font-bold text-gray-900">
                {bookings.length}
              </h3>
            </div>
          </div>

          {/* Total Hours */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-lg">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>

              <p className="text-sm text-gray-500">Hours Logged</p>

              <h3 className="text-3xl font-bold text-gray-900">
                {formatHoursMinutes(
                  bookings.reduce((acc, b) => acc + (b.total_hours || 0), 0),
                )}
              </h3>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-lg">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>

              <p className="text-sm text-gray-500">Active Bookings</p>

              <h3 className="text-3xl font-bold text-gray-900">
                {bookings.filter((b) => b.booking_status === "accepted").length}
              </h3>
            </div>
          </div>

          {/* Total Earnings */}
          {/* Booking History Card */}
          <div
            onClick={() => navigate("/booking-history")}
            className="cursor-pointer group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-lg"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-50 group-hover:scale-110"></div>

            <div className="relative z-10 flex flex-col gap-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <History className="w-6 h-6 text-purple-600" />
              </div>

              <p className="text-sm text-gray-500">Booking History</p>

              <h3 className="text-xl font-semibold text-gray-900">
                View All Bookings →
              </h3>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Machine
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Amount Paid
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          booking.machine_id?.images?.[0]?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={booking.machine_id?.machine_name || "Machine"}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="font-semibold text-sm">
                        {booking.machine_id?.machine_name || "Unknown Machine"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">{booking._id}</td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {booking.total_hours} Hours
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-yellow-600">
                      ₹{booking.total_amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.booking_status,
                        )}`}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={
                      booking.machine_id?.images?.[0]?.url ||
                      "https://via.placeholder.com/150"
                    }
                    alt={booking.machine_id?.machine_name || "Machine"}
                    className="w-12 h-12 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {booking.machine_id?.machine_name}
                    </div>
                    <div className="text-xs text-gray-500">{booking._id}</div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.booking_status,
                    )}`}
                  >
                    {booking.booking_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div>{booking.total_hours} Hours</div>
                  </div>
                </div>

                <div className="pt-3 border-t mt-3">
                  <div className="text-lg font-semibold text-yellow-600">
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
