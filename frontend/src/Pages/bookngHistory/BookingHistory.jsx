import React, { useState } from "react";
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

// Sample data
const bookingsData = [
  {
    id: 1,
    machine: "John Deere 8R 410",
    type: "Heavy Duty Tractor",
    bookingId: "#AR-9921",
    date: "Oct 12, 2023",
    duration: "24 Hours",
    amount: "$1,250.00",
    status: "Completed",
    image: "🚜",
  },
  {
    id: 2,
    machine: "Class Lexion 8900",
    type: "Combine Harvester",
    bookingId: "#AR-9854",
    date: "Oct 08, 2023",
    duration: "72 Hours",
    amount: "$4,800.00",
    status: "In-Transit",
    image: "🚜",
  },
  {
    id: 3,
    machine: "Case IH Magnum 340",
    type: "Utility Tractor",
    bookingId: "#AR-9712",
    date: "Sep 28, 2023",
    duration: "12 Hours",
    amount: "$650.00",
    status: "Cancelled",
    image: "🚜",
  },
  {
    id: 4,
    machine: "Kubota M7-172",
    type: "Compact Tractor",
    bookingId: "#AR-9688",
    date: "Sep 22, 2023",
    duration: "48 Hours",
    amount: "$1,920.00",
    status: "Completed",
    image: "🚜",
  },
];

export default function BookingHistory() {
  const [currentPage, setCurrentPage] = useState("bookings");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In-Transit":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Rentals
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                42
              </span>
              <span className="text-xs sm:text-sm text-gray-500">units</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Hours Logged
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                1,280
              </span>
              <span className="text-xs sm:text-sm text-gray-500">hrs</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                Active Bookings
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                03
              </span>
              <span className="text-xs sm:text-sm text-gray-500">rentals</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Search Machine
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID or Name..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Machine Type
              </label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>All Types</option>
                  <option>Tractor</option>
                  <option>Harvester</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Status
              </label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>Any Status</option>
                  <option>Completed</option>
                  <option>In-Transit</option>
                  <option>Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <span className="hidden sm:inline">Apply Filters</span>
                <span className="sm:hidden">Apply</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Machine
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Booking ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Duration
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Amount Paid
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookingsData.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {booking.image}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {booking.machine}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.duration}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-yellow-600">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setCurrentPage("invoice");
                        }}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Details
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {bookingsData.map((booking) => (
              <div key={booking.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {booking.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm mb-0.5">
                      {booking.machine}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {booking.type}
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {booking.bookingId}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="text-gray-900">{booking.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-gray-900">{booking.duration}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 cursor-pointer">
                  <div className="text-lg font-semibold text-yellow-600">
                    {booking.amount}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setCurrentPage("invoice");
                    }}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
                  >
                    Details
                    <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              Showing results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer rounded transition-colors">
                Previous
              </button>
              {/* <button className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded font-medium">
                1
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                3
              </button> */}
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-100 rounded transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                🌾 AgriRent Enterprise
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                © 2024 AgriRent SaaS. All rights reserved. Precision in Every
                Acre.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}