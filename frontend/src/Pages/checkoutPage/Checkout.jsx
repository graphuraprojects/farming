import { useState, useEffect } from "react";
import InputGrid from "./InputGrid";
import DeliveryForm from "./DeliveryForm";
import Section from "./Section";
import Row from "./Row";
import { MoveLeft, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Checkout() {
  const navigate = useNavigate();

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
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState("delivery");
  const [paying, setPaying] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  /* ================= BOOKING DATA ================= */

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  if (bookings.length === 0) return <p>No booking data found</p>;

  const currentBooking = bookings[bookings.length - 1];
  const bookingId = currentBooking?.bookingId;

  const totalDays = currentBooking?.totalDays || 0;
  const durationText = `${totalDays} day${totalDays !== 1 ? "s" : ""}`;

  const rentAmount = Number(currentBooking?.rent || 0);
  const transportAmount = Number(currentBooking?.transport || 0);
  const distanceKm = currentBooking?.distanceKm || 0;

  const subtotal = Number(currentBooking?.total || 0);
  const totalAmount = Math.round(subtotal * 100) / 100;

  // Safe image — never pass undefined/empty to <img src>
  const bookingImage =
    currentBooking?.image && currentBooking.image.startsWith("http")
      ? currentBooking.image
      : null;

  /* ================= FETCH USER DATA ================= */

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        const profileRes = await axios.get(`${API_BASE}/api/users/my-profile`, {
          headers,
        });

        const user = profileRes.data.data;
        const nameParts = user.name?.split(" ") || [];

        const addresses = user.addresses || [];

        setUserAddresses(addresses);

        let selectedAddress = null;
        let defaultIndex = 0;

        if (addresses.length > 0) {
          const foundIndex = addresses.findIndex((a) => a.isDefault);
          defaultIndex = foundIndex !== -1 ? foundIndex : 0;

          setSelectedAddressIndex(defaultIndex);
          selectedAddress = addresses[defaultIndex];
          setHasSavedAddress(true);
        }

        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
          address: selectedAddress?.street || "",
          city: selectedAddress?.city || "",
          zipCode: selectedAddress?.zip || "",
        });
      } catch (err) {
        console.error("User data fetch error:", err);
      }
    };

    fetchUserData();
  }, []);

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= LIVE LOCATION ================= */

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLiveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        alert("Location captured successfully!");
      },
      () => alert("Location permission denied. Please allow access."),
    );
  };

  /* ================= SAVE ADDRESS ================= */

  const saveAddress = async () => {
    if (hasSavedAddress) return;

    const token = localStorage.getItem("token");

    await axios.post(
      `${API_BASE}/api/users/addresses`,
      {
        label: "Primary",
        street: formData.address,
        city: formData.city,
        state: "Delhi",
        zip: formData.zipCode,
        country: "India",
        latitude: liveLocation?.latitude || null,
        longitude: liveLocation?.longitude || null,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {
    // Guard: booking ID
    if (!bookingId) {
      alert("Missing booking information. Please try again.");
      return;
    }

    // Guard: Razorpay SDK
    if (!window.Razorpay) {
      alert("Payment gateway failed to load. Please refresh and try again.");
      return;
    }

    // Guard: Razorpay key
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      alert("Payment configuration error. Please contact support.");
      return;
    }

    // Validate form fields
    if (!validateForm()) return;

    setPaying(true);

    try {
      // 1. Save address if not already saved
      await saveAddress();

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 2. Create Razorpay order
      const createRes = await fetch(
        `${API_BASE}/api/admin/payments/create-order`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            booking_id: bookingId,
            total_amount: totalAmount,
          }),
        },
      );

      const data = await createRes.json();

      if (!createRes.ok) {
        alert(data?.message || "Failed to create payment order.");
        setPaying(false);
        return;
      }

      // 3. Open Razorpay popup
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Farmer Machine Booking",
        order_id: data.order_id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response) {
          try {
            // 4. Verify payment
            const verifyRes = await fetch(
              `${API_BASE}/api/admin/payments/verify`,
              {
                method: "POST",
                headers,
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
              alert(verifyData?.message || "Payment verification failed.");
              setPaying(false);
              return;
            }

            // 5. Save confirmation data for next page
            localStorage.setItem(
              "paymentConfirmationData",
              JSON.stringify({
                machineName: currentBooking?.name,
                machineImage: currentBooking?.image,
                bookingDate: currentBooking?.startDate,
                duration: durationText,
                totalPrice: totalAmount,
                orderId: response.razorpay_order_id,
                paymentStatus: "paid",
              }),
            );

            // 6. Navigate to confirmation
            navigate(`/booking-confirmation/${response.razorpay_order_id}`);
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert("Payment verification failed. Please contact support.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
        theme: { color: "#03a74f" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp) => {
        console.error("Payment failed:", resp.error);
        alert("Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert(err?.message || "Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  /* ================= UI ================= */

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

        {!hasSavedAddress && (
          <div className="flex justify-end mb-4">
            <button
              onClick={getLiveLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              📍 Use Live Location
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Contact Information" value="1">
              <InputGrid
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            </Section>

            {/* ✅ ADD ADDRESS SELECTOR HERE */}
            {userAddresses.length > 0 && (
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold mb-3 text-[#131614]">
                  Select Delivery Address
                </h3>

                <div className="flex flex-wrap gap-2">
                  {userAddresses.map((addr, index) => (
                    <button
                      key={addr._id || index}
                      onClick={() => {
                        setSelectedAddressIndex(index);

                        setFormData((prev) => ({
                          ...prev,
                          address: addr.street || "",
                          city: addr.city || "",
                          zipCode: addr.zip || "",
                        }));
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${
                        index === selectedAddressIndex
                          ? "bg-[#03a74f] text-white border-[#03a74f]"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {addr.label || `Address ${index + 1}`}
                      {addr.isDefault && " ⭐"}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-5 h-fit sticky top-10 overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e8e6]">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#131614]">
                Order Summary
              </h2>
              <CreditCard className="text-[#1f3d2b] w-5 h-5" />
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              <div className="flex gap-3">
                {bookingImage ? (
                  <img
                    src={bookingImage}
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
            </div>

            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <Row
                label={`Rent (${totalDays} day${totalDays !== 1 ? "s" : ""})`}
                value={`₹${rentAmount.toFixed(2)}`}
              />

              <Row
                label={`Transport (${distanceKm} km)`}
                value={`₹${transportAmount.toFixed(2)}`}
              />
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span className="text-gray-600">Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying}
              className="w-full mt-5 bg-[#03a74f] text-white py-3 rounded-lg hover:bg-[#38864b] cursor-pointer flex justify-center items-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <CreditCard className="text-white w-5 h-5" />
              {paying ? "Processing..." : "Proceed to Payment →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
