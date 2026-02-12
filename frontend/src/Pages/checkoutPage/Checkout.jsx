import { useState } from "react";
import InputGrid from "./InputGrid";
import DeliveryForm from "./DeliveryForm";
import Section from "./section";
import Row from "./Row";
import { MoveLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function Checkout() {
  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState("delivery");
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  if (bookings.length === 0) return <p>No booking data found</p>;
  const currentBooking = bookings[bookings.length - 1];
  const durationText =
    currentBooking?.durationDisplay ||
    `${currentBooking?.hoursDecimal || 0} hr`;

  const subtotal = Number(currentBooking?.total || 0);
  const shipping = Number(deliveryMode === "delivery" ? 1000 : 0);
  const totalAmount = Math.round((subtotal + shipping) * 100) / 100;

  const handlePayment = async () => {
    const bookingId = currentBooking?.bookingId;

    if (!bookingId) {
      alert("Missing booking information. Please try again.");
      return;
    }

    if (!window.Razorpay) {
      alert("Payment gateway failed to load. Please refresh and try again.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      alert("Payment configuration error. Please contact support.");
      return;
    }

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const createRes = await fetch(
        `${API_BASE}/api/admin/payments/create-order`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            booking_id: bookingId,
            total_amount: totalAmount,
          }),
        },
      );

      const data = await createRes.json();

      if (!createRes.ok) {
        alert(data?.message || "Failed to create order");
        return;
      }

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Farmer Machine Booking",
        order_id: data.order_id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API_BASE}/api/admin/payments/verify`,
              {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({
                  booking_id: bookingId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              alert(verifyData?.message || "Verification failed");
              return;
            }

            const confirmationData = {
              machineName: currentBooking?.name,
              machineImage: currentBooking?.image,
              bookingDate: currentBooking?.startDate,
              hoursBooked:
                currentBooking?.durationDisplay ||
                `${currentBooking?.hoursDecimal} hr`,

              totalPrice: totalAmount,
              orderId: response.razorpay_order_id,
              paymentStatus: "paid",
            };

            localStorage.setItem(
              "paymentConfirmationData",
              JSON.stringify(confirmationData),
            );

            navigate(`/booking-confirmation/${response.razorpay_order_id}`);
          } catch (verifyErr) {
            alert("Verification failed. Please contact support.");
          }
        },

        prefill: {
          name: "Customer",
          email: "customer@email.com",
        },

        theme: { color: "#03a74f" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", () => {
        alert("Payment Failed");
      });

      rzp.open();
    } catch (err) {
      alert(err?.message || "Payment error. Please try again.");
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#6d7e74] hover:text-[#1f3d2b] transition-colors mb-6 group"
          >
            <MoveLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#131614] mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete your order with secure payment
          </p>
        </div>

        {/* LEFT SECTION */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Contact Information" value="1">
              <InputGrid />
            </Section>

            <Section title="Delivery Method" value="2">
              <DeliveryForm
                deliveryMode={deliveryMode}
                setDeliveryMode={setDeliveryMode}
              />
            </Section>

            {/* <Section title="Payment Method" value="3">
              <PaymentForm />
            </Section> */}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-xl shadow p-5 h-fit sticky top-10 overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e8e6]">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#131614]">
                Order Summary
              </h2>
              <CreditCard className="text-[#1f3d2b] w-5 h-5" />
            </div>

            {/* Scrollable Items */}
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {currentBooking && (
                <div key={currentBooking.id} className="flex gap-3">
                  <img
                    src={currentBooking.image}
                    alt={currentBooking.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-[13px]">
                      {currentBooking.name}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      Date: {currentBooking.startDate}
                    </p>
                    <p className="text-[12px] font-semibold">
                      Duration: {durationText}
                    </p>
                  </div>

                  <p className="font-bold">₹{currentBooking.total}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              {/* <Row label="Shipping" value={`₹${Number(shipping).toFixed(2)}`} /> */}
            </div>

            {/* <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div> */}

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span className="text-gray-600">Total</span>
              <span className="text-[15px] sm:text-[16px]">₹{totalAmount}</span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-5 bg-[#03a74f] text-white py-3 rounded-lg hover:bg-[#38864b] cursor-pointer flex justify-center items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <CreditCard className="text-white w-5 h-5" />
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
