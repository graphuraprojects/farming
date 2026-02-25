import { useState, useEffect } from "react";
import InputGrid from "./InputGrid";
import DeliveryForm from "./DeliveryForm";
import Section from "./Section";
import Row from "./Row";
import { MoveLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import axios from "axios";

const API_BASE = ``;

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState("delivery");

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  if (bookings.length === 0) return <p>No booking data found</p>;

  const currentBooking = bookings[bookings.length - 1];

  const durationText =
    currentBooking?.durationDisplay ||
    `${currentBooking?.hoursDecimal || 0} hr`;

  const subtotal = Number(currentBooking?.total || 0);
  const shipping = Number(deliveryMode === "delivery" ? 0 : 0);
  const totalAmount = Math.round((subtotal + shipping) * 100) / 100;

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/api/users/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.data;

        const nameParts = user.name?.split(" ") || [];

        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address?.street || "",
          city: user.address?.city || "",
          zipCode: user.address?.zip || "",
        }));
      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name required";
    if (!formData.phone) newErrors.phone = "Phone required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.address) newErrors.address = "Address required";
    if (!formData.city) newErrors.city = "City required";
    if (!formData.zipCode) newErrors.zipCode = "Zip required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SAVE ADDRESS ================= */

  const saveAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      // Wrap geolocation in Promise so we can await it
      const getLocation = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              reject(error);
            },
          );
        });

      const { latitude, longitude } = await getLocation();

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      await axios.put(
        `${API_BASE}/api/users/address`,
        {
          street: formData.address,
          city: formData.city,
          zip: formData.zipCode,
          state: "Delhi",
          country: "India",
          latitude,
          longitude,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Address + location saved successfully");
    } catch (error) {
      console.log("Address save error:", error);
      alert("Please allow location access to continue.");
      throw error;
    }
  };

  /* ================= PAYMENT ================= */

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

    if (!validateForm()) return;

    try {
      /* ⭐ SAVE ADDRESS FIRST */
      await saveAddress();

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const createRes = await fetch(
        `${API_BASE}/api/admin/payments/create-order`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            booking_id: bookingId,
            // total_amount: totalAmount,
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

        /* ⭐ PREFILL USER DATA */
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },

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
              hoursBooked: durationText,
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

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-10">
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

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Contact Information" value="1">
              <InputGrid
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </Section>

            <Section title="Delivery Method" value="2">
              <DeliveryForm
                deliveryMode={deliveryMode}
                setDeliveryMode={setDeliveryMode}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </Section>
          </div>

          <div className="bg-white rounded-xl shadow p-5 h-fit sticky top-10 overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e8e6]">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#131614]">
                Order Summary
              </h2>
              <CreditCard className="text-[#1f3d2b] w-5 h-5" />
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {currentBooking && (() => {
                  console.log("[Checkout] Booking image value:", currentBooking.image);
                  return (
                <div key={currentBooking.id} className="flex gap-3">
                  {currentBooking.image && typeof currentBooking.image === "string" && currentBooking.image.length > 30 ? (
                    <img
                      src={currentBooking.image}
                      alt={currentBooking.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-2xl shrink-0">
                      🚜
                    </div>
                  )}

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
              );
              })()}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
            </div>

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
