import { useState } from "react";
import InputGrid from "./InputGrid";
import DeliveryForm from "./DeliveryForm";
import Section from "./section";
import Row from "./Row";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const [deliveryMode, setDeliveryMode] = useState("delivery");
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  if (bookings.length === 0) return <p>No booking data found</p>;
  // pick only the last booking (the one just added)
  const currentBooking = bookings[bookings.length - 1];

  // Subtotal from booked machines
  const subtotal = currentBooking ? currentBooking.total : 0;
  // Discount
  // const discount = subtotal * 0.1;

  // Shipping based on deliveryMode
  const shipping = deliveryMode === "delivery" ? 1000 : 0;

  // Final total
  const totalAmount = subtotal + shipping; // define totalAmount

  const handlePayment = async () => {
    try {
      // 1. Create Razorpay order from backend
      const res = await fetch(
        "http://localhost:5000/api/admin/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking_id: currentBooking._id,
          }),
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Payment failed");
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Farmer Machine Booking",
        description: "Machine Rental Payment",
        order_id: data.order_id,

        handler: async function (response) {
          // 3. Verify payment
          await fetch("http://localhost:5000/api/admin/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              booking_id: currentBooking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          alert("Payment successful 🎉");
        },

        theme: {
          color: "#03a74f",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment error");
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
                      Hours: {currentBooking.hours}
                    </p>
                  </div>

                  <p className="font-bold">₹{currentBooking.total}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              {/* <Row label="Discount (10%)" value={`-₹${discount.toFixed(2)}`} /> */}
              <Row label="Shipping" value={`₹${shipping.toFixed(2)}`} />
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
