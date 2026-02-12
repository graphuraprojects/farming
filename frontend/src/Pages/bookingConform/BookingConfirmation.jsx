import React, { useState, useEffect } from "react";
import MachineDetailsCard from "./MachineDetailsCard";
import { Link, useParams } from "react-router-dom";

/**
 * ==========================================
 * BACKEND SETUP FOR MULTIPLE MACHINES
 * ==========================================
 * 1. Set 'IS_LIVE' to true when API is ready.
 * 2. If backend field names change, update them in the 'cleanedData' mapping below.
 */
const IS_LIVE = false;
const API_BASE_URL = "http://localhost:5000/api/bookings";

const BookingConfirmation = () => {
  const { id, orderId: orderIdParam } = useParams();
  const orderId = orderIdParam || id || "ORD-9921";

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        let rawData;

        const paymentData = localStorage.getItem("paymentConfirmationData");
        if (paymentData) {
          const parsed = JSON.parse(paymentData);
          rawData = {
            order_id: parsed.orderId,
            status: "Confirmed",
            payment_status: parsed.paymentStatus,
            machines: [
              {
                id: parsed.orderId,
                name: parsed.machineName || "Machine",
                image_url: parsed.machineImage,
                start_date: parsed.bookingDate || "",
                end_date: parsed.bookingDate || "",
                usage_hours: parsed.hoursBooked || 0,
                price: parsed.totalPrice,
                location: "To be confirmed",
              },
            ],
            next_steps: [
              { title: "Contact Owner", desc: "Check inbox for details." },
              { title: "Digital Key", desc: "Available in your dashboard." },
              { title: "Insurance", desc: "Documents sent to email." },
            ],
          };
          localStorage.removeItem("paymentConfirmationData");
        } else {
          const codData = localStorage.getItem("codOrder");
          if (codData) {
            rawData = JSON.parse(codData);
          } else if (IS_LIVE) {
            const response = await fetch(`${API_BASE_URL}/${orderId}`);
            if (!response.ok) throw new Error("Failed to load your order.");
            rawData = await response.json();
          } else {
            rawData = await simulateCheckoutResponse();
          }
        }

        const cleanedData = {
          orderId: rawData.order_id || rawData.id || orderId,
          status: rawData.status || "Pending Approval",
          paymentStatus: rawData.payment_status || "paid",
          machines: (rawData.machines || []).map((m) => ({
            id: m.id || Math.random(),
            cardProps: {
              machineName: m.name || m.title,
              description: m.description || m.desc || "",
              rentalDates:
                `${m.start_date || ""} - ${m.end_date || ""}`.trim() ||
                "Date pending",
              totalUsage: `${m.usage_hours ?? 0} Hours`,
              pickupLocation:
                m.location || rawData.global_location || "To be confirmed",
              imageUrl: m.image_url || m.img || "",
            },
          })),
          nextSteps: rawData.next_steps || [
            { title: "Payment Complete", desc: "✓ Payment has been verified." },
            {
              title: "Awaiting Approval",
              desc: "Owner will review your request.",
            },
            { title: "Track Status", desc: "Check 'My Bookings' for updates." },
          ],
        };

        setOrderData(cleanedData);
      } catch (err) {
        setError(err?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#03a74f]">
        Processing Order...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <style>{`
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } }
        .animate-pop { animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>

      <div className="min-h-screen w-full bg-[#fafaf7] text-[#2b2b2b] font-['Inter',sans-serif] pb-20">
        <div className="max-w-[800px] mx-auto pt-10 px-4 space-y-10">
          {/* HEADER */}
          {/* <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center rounded-full bg-[#03a74f] text-white w-20 h-20 shadow-xl animate-pop">
              <span className="material-symbols-outlined text-[48px]">check</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Booking {orderData.status}!</h1>
              <p className="text-[#5b6e58] font-medium">Order Reference: #{orderData.orderId}</p>
              <p className="text-sm text-[#03a74f] mt-1 font-bold">{orderData.machines.length} Machines Reserved</p>
            </div>
          </div> */}
          {/* HEADER */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center rounded-full bg-[#03a74f] text-white w-20 h-20 shadow-xl animate-pop">
              <span className="material-symbols-outlined text-[48px]">
                check
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Payment Successful!
              </h1>
              <p className="text-[#5b6e58] font-medium">
                Order Reference: #{orderData.orderId}
              </p>
              <p className="text-sm text-amber-600 mt-1 font-bold bg-amber-50 inline-block px-3 py-1 rounded-full">
                ⏳ Awaiting Owner Approval
              </p>
            </div>
          </div>

          {/* LIST OF MACHINES */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold border-b border-[#03a74f]/10 pb-2">
              Machine Details
            </h2>
            {orderData.machines.map((item, index) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-2 -top-2 bg-[#03a74f] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-md">
                  {index + 1}
                </div>
                <MachineDetailsCard details={item.cardProps} />
              </div>
            ))}
          </div>

          {/* NEXT STEPS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orderData.nextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-[#03a74f]/10 shadow-sm"
                >
                  <h4 className="font-bold text-[#2b2b2b]">{step.title}</h4>
                  <p className="text-[#5b6e58] text-xs mt-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* <Link to={`/invoice/${orderData.orderId}`} className="flex-1">
              <button className="w-full bg-[#03a74f] text-white rounded-xl h-14 font-bold flex items-center justify-center gap-2 shadow-lg">
                <span className="material-symbols-outlined">visibility</span> View Invoice
              </button>
            </Link> */}
            <Link to="/booking-history" className="flex-1">
              <button className="w-full bg-[#03a74f]/10 text-[#03a74f] rounded-xl h-14 font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">
                  dashboard_customize
                </span>{" "}
                My Bookings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

// --- SIMULATING MULTIPLE MACHINES FROM CHECKOUT ---
const simulateCheckoutResponse = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        order_id: "ORD-9921",
        status: "Confirmed",
        global_location: "GreenValley Hub, Sector 4, CA",
        machines: [
          {
            id: 101,
            name: "John Deere 8R 410",
            description: "High-performance tractor",
            start_date: "Oct 12",
            end_date: "Oct 15",
            usage_hours: 72,
            image_url:
              "https://www.deere.com/assets/images/region-4/products/tractors/row-crop-tractors/8r-8rt-row-crop-tractors/8r-410/8r_410_r4f063847_large_660c917945cea0af3aeb242ddf4c52b9540ef7cc.jpg",
          },
          {
            id: 102,
            name: "Caterpillar 320 Excavator",
            description: "Medium hydraulic excavator",
            start_date: "Oct 12",
            end_date: "Oct 18",
            usage_hours: 144,
            image_url:
              "https://media.istockphoto.com/id/1978669262/photo/excavator-on-the-construction-site.webp?a=1&b=1&s=612x612&w=0&k=20&c=2NuqqvCw2dLKz5nyEJrIaLJmdEpru27XyfX5Apad6RY=",
          },
        ],
        next_steps: [
          { title: "Contact Owner", desc: "Check inbox for details." },
          { title: "Digital Key", desc: "Available in your dashboard." },
          { title: "Insurance", desc: "Documents sent to email." },
        ],
      });
    }, 400);
  });
};

export default BookingConfirmation;
