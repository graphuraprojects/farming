import React from "react";
import {
  Download,
  Printer,
  User,
  Building,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function Invoice() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-4 py-2 flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-3">
            <div className="text-2xl">🌾</div>
            <span className="text-xl font-bold text-gray-900">AgriRent</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-300 transition-colors">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <div className="cursor-pointer w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-yellow-700" />
            </div>
          </div>
        </div>
      </header>

      {/* Invoice Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-12">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Invoice
              </h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Invoice ID:{" "}
                  <span className="font-medium text-gray-900">
                    #INV-2023-0892
                  </span>
                </p>
                <p>
                  Date:{" "}
                  <span className="font-medium text-gray-900">
                    October 24, 2023
                  </span>
                </p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                PAID
              </span>
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                <User className="w-4 h-4" />
                Billed To
              </div>
              <div className="text-gray-900">
                <p className="font-bold text-lg mb-2">John Doe</p>
                <p className="text-sm text-gray-600">123 Farm Road</p>
                <p className="text-sm text-gray-600">Green Valley, IA 50301</p>
                <p className="text-sm text-gray-600">john.doe@farms.com</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                <Building className="w-4 h-4" />
                Service Provider
              </div>
              <div className="text-gray-900">
                <p className="font-bold text-lg mb-2">
                  Midwest Equipment Rentals
                </p>
                <p className="text-sm text-gray-600">456 Tractor Lane</p>
                <p className="text-sm text-gray-600">Ames, IA 50010</p>
                <p className="text-sm text-gray-600">
                  support@midwestrentals.com
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Machine Name
                  </th>
                  <th className="text-right py-4 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Rate (H)
                  </th>
                  <th className="text-right py-4 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Duration
                  </th>
                  <th className="text-right py-4 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Transport
                  </th>
                  <th className="text-right py-4 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-2">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      John Deere 8R 410
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      Advanced Precision Skies
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900">
                    $250.00
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900">
                    10.0 Hours
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900">
                    $150.00
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-900">
                    $2,650.00
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-2">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      Heavy Duty Disc Harrow
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      Soil Preparation Tool
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900">
                    $85.00
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900">
                    10.0 Hours
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900">
                    $50.00
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-900">
                    $900.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex justify-end mb-8 sm:mb-12">
            <div className="w-full sm:w-96 bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">$3,550.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  Platform Fee
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    INCL
                  </span>
                </span>
                <span className="font-medium text-gray-900">$35.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium text-gray-900">$177.50</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900 uppercase tracking-wide">
                  Total Paid
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  $3,727.50
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium">SECURED TRANSACTION</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>OCTOBER 24, 2023 @ 14:32</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 px-4">
              Thank you for supporting sustainable farming with AgriRent. If you
              have any questions regarding this invoice, please reach out to our
              24/7 support line.
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={() => setCurrentPage("bookings")}
              className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
