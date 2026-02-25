import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  Printer,
  ChevronDown,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  User,
  Building,
} from "lucide-react";

export default function BookingHistory() {
  // const [currentPage, setCurrentPage] = useState("bookings");
  // const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ Dynamic State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setBookings(res.data.data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Booking History
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Detailed log of your agricultural machinery rentals and fleet
            management.
          </p>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase">
                    Machine
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase">
                    Booking ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase">
                    Duration
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase">
                    Amount Paid
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            booking.machine_id?.images?.length > 0
                              ? booking.machine_id.images[0]?.url
                              : "https://via.placeholder.com/150"
                          }
                          alt={booking.machine_id?.machine_name || "Machine"}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {booking.machine_id?.machine_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking._id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.total_days} Days
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-yellow-600">
                      ₹{booking.total_amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
          <div className="lg:hidden divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={
                      booking.machine_id?.images?.length > 0
                        ? booking.machine_id.images[0]?.url
                        : "https://via.placeholder.com/150"
                    }
                    alt={booking.machine_id?.machine_name || "Machine"}
                    className="w-12 h-12 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">
                      {booking.machine_id?.machine_name}
                    </div>

                    <div className="text-xs text-gray-500">{booking._id}</div>
                  </div>

                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
                    <div>{booking.total_days} Days</div>
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
}
