import { useLocation, useNavigate } from "react-router-dom";
import { Check, Download, ArrowLeft, Wallet } from "lucide-react";

export default function WithdrawalSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 4250, fee = 2.5, netPayout = 4247.5, bank = "Business Checking Account", accountMask = "Global Agri Bank (**** 1234)" } = location.state || {};
  const formattedAmount = formatCurrency(amount);
  const formattedFee = formatCurrency(fee);
  const formattedNet = formatCurrency(netPayout);
  const receiptDate = new Date();
  const formattedDate = receiptDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formattedTime = receiptDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7f7f7] to-white text-[#1a1a1a] flex flex-col">

      <style>{`
        .receipt-print { display: none; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff; }
          nav, footer { display: none !important; }
          main { padding: 0 !important; }
          .no-print { display: none !important; }
          .receipt-print { display: block !important; margin: 0 auto; }
          .receipt-shell { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
          @page { margin: 18mm; }
        }
      `}</style>


      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12 sm:px-6">

        <div className="no-print mt-10 sm:mt-14 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0f5132] flex items-center justify-center shadow-lg ring-4 ring-[#e8f5e9] transition-all duration-300 hover:scale-105">
          <Check className="text-white w-10 h-10" strokeWidth={3} />
        </div>

        <h1 className="no-print mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold text-[#0f5132] text-center">
          Withdrawal Initiated
        </h1>
        <p className="no-print mt-2 text-gray-600 text-sm sm:text-base text-center max-w-xl">
          Your funds are being securely transferred to your account.
        </p>

        {/* Card */}
        <div className="no-print mt-8 sm:mt-10 w-full max-w-2xl bg-white border-2 border-[#e8e8e8] rounded-2xl shadow-md p-5 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">

          {/* Transaction Success Banner */}
          <div className="bg-[#f7f7f7] rounded-xl py-5 sm:py-6 flex flex-col items-center shadow-inner">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <Wallet size={22} className="text-gray-600" />
            </div>
            <span className="mt-3 text-xs tracking-widest text-gray-600">
              TRANSACTION SUCCESS
            </span>
          </div>

          {/* Amount */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs text-gray-500 tracking-widest">
              WITHDRAWAL AMOUNT
            </p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-[#d6a545] drop-shadow-sm">
              {formattedAmount}
            </p>
          </div>

          <hr className="my-8 sm:my-10" />

          {/* Details */}
          <div className="space-y-4 sm:space-y-5 text-sm">
            <DetailRow label="Transaction ID" value="#AG-98234-RT" />
            <DetailRow label="Destination Bank" value={accountMask || bank} />
            <DetailRow label="Estimated Arrival" value="Within 24–48 hours" />
            <DetailRow
              label="Current Status"
              value={
                <span className="flex items-center gap-2 text-[#0f5132] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0f5132]" />
                  Processing
                </span>
              }
            />
          </div>

          {/* Actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => alert("Status: Processing. Estimated arrival within 24–48 hours.")}
              className="w-full sm:flex-1 bg-[#03a74f] hover:bg-[#38864b] transition-all duration-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a74f]"
            >
              Track Status
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:flex-1 border border-gray-300 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a74f]"
            >
              <Download size={18} />
              Download PDF Receipt
            </button>
          </div>
        </div>

        {/* Printable Receipt */}
        <div className="receipt-print mt-8 w-full max-w-2xl">
          <div className="receipt-shell bg-white border-2 border-[#e8e8e8] rounded-2xl shadow-md p-5 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mt-1">Withdrawal Receipt</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>{formattedDate}</p>
                <p>{formattedTime}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#f7f7f7] p-4 sm:p-5">
              <p className="text-xs text-gray-500 tracking-widest">WITHDRAWAL AMOUNT</p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#d6a545]">{formattedAmount}</p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <ReceiptRow label="Transaction ID" value="#AG-98234-RT" />
              <ReceiptRow label="Destination Bank" value={accountMask || bank} />
              <ReceiptRow label="Processing Fee" value={`-${formattedFee}`} />
              <ReceiptRow label="Net Payout" value={formattedNet} strong />
              <ReceiptRow label="Status" value="Processing" />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
              This receipt confirms your withdrawal request. Funds will be deposited within 24–48 hours.
            </div>
          </div>
        </div>

        <hr className="no-print mt-12 w-full max-w-2xl border-gray-200" />

        {/* Security */}
        <div className="no-print mt-10 text-center max-w-xl">
          <p className="font-medium text-gray-700 flex justify-center items-center gap-2">
            🛡️ Enterprise Grade Security
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Your security is our priority. This transaction is protected by bank-grade
            encryption and AgriRent’s secure payout protocols.
          </p>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="no-print mt-8 flex items-center gap-2 text-[#0f5132] font-medium hover:text-[#0b4027] transition-colors hover:translate-x-0.5"
        >
          <ArrowLeft size={18} />
          Return to Dashboard
        </button>

        
      </main>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

function ReceiptRow({ label, value, strong }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <span className="text-gray-500">{label}</span>
      <span className={strong ? "font-semibold text-[#0f5132]" : "text-gray-900 font-medium"}>{value}</span>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}
