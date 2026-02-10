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
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);

  const hasShownAlert = useRef(false);

  // LOGIN CHECK
  useEffect(() => {
    if (hasShownAlert.current) return;

    const token = localStorage.getItem("token");

    if (!token) {
      hasShownAlert.current = true;
      alert("Login first");
      navigate("/login");
    }
  }, []);

  // FETCH INVOICE
  useEffect(() => {
    fetch(`/api/invoice/booking/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setInvoice(data.invoice))
      .catch((err) => console.error(err));
  }, [bookingId]);

  // PDF DOWNLOAD
  const downloadPDF = async () => {
    const element = document.getElementById("invoice-page");

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

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
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0">
        <div className="max-w-5xl mx-auto py-3 flex justify-between">
          <span className="text-xl font-bold">AgriRent</span>

          <div className="flex gap-2">
            <button
              onClick={downloadPDF}
              className="bg-green-500 text-white px-4 py-2 rounded flex gap-2"
            >
              <Download size={16} /> Download PDF
            </button>

            <button
              onClick={() => window.print()}
              className="border px-4 py-2 rounded flex gap-2"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto p-8 bg-white mt-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Invoice</h1>

        <p>Invoice ID: {invoice.invoiceId}</p>
        <p>Date: {new Date(invoice.paymentTime).toDateString()}</p>

        {/* BILLING */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-bold mb-2">Billed To</h3>
            <p>{invoice.farmerId.name}</p>
            <p>{invoice.farmerId.email}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Service Provider</h3>
            <p>{invoice.ownerId.name}</p>
            <p>{invoice.ownerId.email}</p>
          </div>
        </div>

        {/* ITEMS */}
        <table className="w-full mt-8">
          <thead>
            <tr className="border-b">
              <th className="text-left">Machine</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Hours</th>
              <th className="text-right">Transport</th>
              <th className="text-right">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td>{item.machineName}</td>
                <td className="text-right">₹{item.ratePerHour}</td>
                <td className="text-right">{item.hours}</td>
                <td className="text-right">₹{item.transportCharge}</td>
                <td className="text-right">₹{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="mt-8 w-80 ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{invoice.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{invoice.platformFee}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>₹{invoice.tax}</span>
          </div>

          <div className="flex justify-between font-bold border-t mt-2 pt-2">
            <span>Total</span>
            <span>₹{invoice.totalAmount}</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-black flex items-center gap-2 justify-center"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
