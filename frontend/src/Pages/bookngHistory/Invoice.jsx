import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  Printer,
  User,
  Building,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Invoice() {
  const { bookingId } = useParams(); // route: /invoice/:bookingId
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  // 🔹 Fetch invoice from backend
  useEffect(() => {
    fetch(`/api/invoice/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setInvoice(data))
      .catch((err) => console.error(err));
  }, [bookingId]);

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

  // 🔹 Download PDF (same UI)
  const downloadPDF = async () => {
    const element = document.getElementById("invoice-page");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Invoice-${invoice.invoiceId}.pdf`);
  };

  if (!invoice) {
    return <div className="p-10 text-center">Loading Invoice...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" id="invoice-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-4 py-2 flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-3">
            <div className="text-2xl">🌾</div>
            <span className="text-xl font-bold text-gray-900">AgriRent</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={downloadPDF}
              className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-yellow-700" />
            </div>
          </div>
        </div>
      </header>

      {/* Invoice Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-12">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold mb-2">Invoice</h1>
              <p className="text-sm">
                Invoice ID:{" "}
                <span className="font-medium">#{invoice.invoiceId}</span>
              </p>
              <p className="text-sm">
                Date:{" "}
                <span className="font-medium">
                  {new Date(invoice.paymentTime).toDateString()}
                </span>
              </p>
            </div>
            <span className="mt-4 sm:mt-0 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
              {invoice.paymentStatus}
            </span>
          </div>

          {/* Billing */}
          <div className="grid sm:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                <User className="w-4 h-4" /> BILLED TO
              </div>
              <p className="font-bold text-lg">{invoice.user.name}</p>
              <p className="text-sm text-gray-600">{invoice.user.address}</p>
              <p className="text-sm text-gray-600">{invoice.user.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                <Building className="w-4 h-4" /> SERVICE PROVIDER
              </div>
              <p className="font-bold text-lg">{invoice.provider.name}</p>
              <p className="text-sm text-gray-600">
                {invoice.provider.address}
              </p>
              <p className="text-sm text-gray-600">{invoice.provider.email}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3">Machine Name</th>
                  <th className="text-right">Rate</th>
                  <th className="text-right">Hours</th>
                  <th className="text-right">Transport</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3">
                      <p className="font-semibold">{item.machineName}</p>
                      <p className="text-xs text-gray-500 italic">
                        {item.description}
                      </p>
                    </td>
                    <td className="text-right">₹{item.ratePerHour}</td>
                    <td className="text-right">{item.hours}</td>
                    <td className="text-right">₹{item.transportCharge}</td>
                    <td className="text-right font-semibold">
                      ₹{item.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-12">
            <div className="w-96 bg-gray-50 p-6 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{invoice.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{invoice.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({invoice.taxPercent}%)</span>
                <span>₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span className="text-yellow-600">
                  ₹{invoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-sm text-gray-500">
            <div className="flex justify-center items-center gap-2 mb-2 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              SECURED TRANSACTION
              <Clock className="w-4 h-4 ml-2" />
            </div>
            Thank you for supporting sustainable farming with AgriRent.
          </div>

          {/* Back */}
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
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
