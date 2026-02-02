import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, RefreshCcw, Lock, CheckCircle } from "lucide-react";

export default function WithdrawEarnings() {
  const navigate = useNavigate();
  const [availableBalance, setAvailableBalance] = useState(12450);
  const [amount, setAmount] = useState(12450);
  const [refreshing, setRefreshing] = useState(false);
  const processingFee = 2.5;

  const formattedAmount = useMemo(() => formatCurrency(amount), [amount]);
  const formattedBalance = useMemo(() => formatCurrency(availableBalance), [availableBalance]);
  const netPayout = useMemo(() => Math.max(amount - processingFee, 0), [amount]);
  const formattedNetPayout = useMemo(() => formatCurrency(netPayout), [netPayout]);

  const handleQuickSelect = (percent) => {
    const value = Math.round(availableBalance * percent) / 100;
    setAmount(Number(value.toFixed(2)));
  };

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      const variation = Math.round((Math.random() * 500 - 250) * 100) / 100;
      const nextBalance = Math.max(0, Number((availableBalance + variation).toFixed(2)));
      setAvailableBalance(nextBalance);
      setAmount((prev) => Math.min(prev, nextBalance));
      setRefreshing(false);
    }, 800);
  };

  const isInvalidAmount = amount <= 0 || amount > availableBalance;

  const handleConfirm = () => {
    if (isInvalidAmount) return;
    navigate("/withdrawal-success", {
      state: {
        amount,
        fee: processingFee,
        netPayout,
        bank: "Business Checking Account",
        accountMask: "JP Morgan Chase •••• 8829"
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7f7f7] to-white text-[#1a1a1a]">

      {/* Content */}
      <main className="max-w-[860px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm text-gray-500">Earnings / <span className="text-gray-700">Withdrawal</span></p>

        <h1 className="mt-3 text-[26px] sm:text-[32px] leading-tight font-semibold text-[#0f5132]">Withdraw Earnings</h1>
        <p className="mt-2 text-[15px] text-gray-600">
          Securely transfer your rental income to your verified business bank account.
        </p>

        {/* Available Balance */}
        <div className="mt-8 bg-white rounded-2xl border-2 border-[#e8e8e8] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div>
            <p className="text-xs tracking-widest text-gray-500">AVAILABLE FOR WITHDRAWAL</p>
            <p className="mt-1 text-[34px] font-semibold text-[#d6a545]">{formattedBalance}</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="group flex items-center gap-2 border rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a74f]"
          >
            <RefreshCcw size={16} className={`transition-transform duration-300 ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`} />
            {refreshing ? "Refreshing..." : "Refresh Balance"}
          </button>
        </div>

        {/* Withdrawal Details */}
        <div className="mt-10 bg-white rounded-2xl border-2 border-[#e8e8e8] p-5 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold">Withdrawal Details</h2>

          {/* Amount */}
          <div className="mt-6">
            <p className="text-sm text-gray-600">Amount to Withdraw</p>
            <div className="mt-3 bg-[#f7f7f7] rounded-lg p-4 text-xl font-semibold shadow-inner">
              <span className="text-[#d6a545] mr-2">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="bg-transparent outline-none w-full sm:w-[160px] text-[#1a1a1a] font-semibold"
                aria-label="Withdrawal amount"
              />
            </div>
            {isInvalidAmount ? (
              <p className="mt-2 text-xs text-red-600">Enter an amount between $0.01 and {formattedBalance}.</p>
            ) : null}
          </div>

          {/* Quick Buttons */}
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            <button type="button" onClick={() => handleQuickSelect(25)} className="border rounded-lg py-2 text-sm bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5">25%</button>
            <button type="button" onClick={() => handleQuickSelect(50)} className="border rounded-lg py-2 text-sm bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5">50%</button>
            <button type="button" onClick={() => handleQuickSelect(100)} className="bg-[#03a74f] hover:bg-[#38864b] transition-all duration-300 text-white rounded-lg py-2 text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5">All Funds</button>
          </div>

          {/* Destination */}
          <div className="mt-10"><p className="text-sm text-gray-600">Destination Account</p>
            <div className="mt-2 border-2 border-[#e8e8e8] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">🏦</div>
                <div>
                  <p className="font-medium">Business Checking Account</p>
                  <p className="text-sm text-gray-500">JP Morgan Chase •••• 8829</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium bg-[#e8f5e9] text-[#0f5132] px-3 py-1 rounded-full">
                <CheckCircle size={14} /> VERIFIED
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Funds will be deposited within 2–3 business days.</p>
          </div>

          {/* Summary */}
          <div className="mt-8 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white/70 hover:bg-white transition-colors">
            <p className="text-xs text-gray-500">TRANSACTION SUMMARY</p>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Withdrawal Amount" value={formattedAmount} />
              <Row label="Processing Fee" value={`-${formatCurrency(processingFee)}`} muted />
            </div>
            <hr className="my-4" />
            <Row label="Net Payout" value={formattedNetPayout} strong />
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isInvalidAmount}
            className="mt-10 w-full bg-[#03a74f] hover:bg-[#38864b] transition-all duration-300 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a74f] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0"
          >
            <Lock size={18} /> Confirm Withdrawal
          </button>

          <p className="mt-3 text-xs text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck size={14} /> Bank-level 256-bit encryption secure transaction
          </p>
        </div>

        {/* Recent Payouts */}
        <div className="mt-12"><div className="flex justify-between items-center">
            <h3 className="font-semibold">Recent Payouts</h3>
            <span className="text-sm text-gray-600">View All</span>
          </div>

          <div className="mt-4 space-y-3">
            <Payout amount="$8,120.00" date="Oct 24, 2023" />
            <Payout amount="$4,400.00" date="Oct 12, 2023" />
          </div>
        </div>

      </main>
    </div>
  );
}

function Row({ label, value, muted, strong }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <span className={muted ? "text-gray-500" : "text-gray-700"}>{label}</span>
      <span className={strong ? "font-semibold text-[#0f5132]" : "text-gray-700"}>{value}</span>
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

function Payout({ amount, date }) {
  return (
    <div className="bg-white border-2 border-[#e8e8e8] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <CheckCircle className="text-green-600" size={20} />
        <div>
          <p className="font-medium">Payout to Chase Bank</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <p className="font-medium">{amount}</p>
    </div>
  );
}
