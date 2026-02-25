import { useState, useEffect } from "react";
import InputGrid from "./InputGrid";
import DeliveryForm from "./DeliveryForm";
import Section from "./Section";
import Row from "./Row";
import { MoveLeft, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

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

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  if (bookings.length === 0) return <p>No booking data found</p>;

  const currentBooking = bookings[bookings.length - 1];
  const bookingId = currentBooking?.bookingId;

  const durationText =
    currentBooking?.durationDisplay ||
    `${currentBooking?.hoursDecimal || 0} hr`;

  const subtotal = Number(currentBooking?.total || 0);
  const totalAmount = Math.round(subtotal * 100) / 100;

  /* ================= FETCH USER DATA ================= */

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Profile
        const profileRes = await axios.get(
          `${API_BASE}/api/users/my-profile`,
          { headers }
        );

        const user = profileRes.data.data;
        const nameParts = user.name?.split(" ") || [];

        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
        }));

        // Default address
        const addressRes = await axios.get(
          `/api/users/addresses/default`,
          { headers }
        );

        const defaultAddress = addressRes.data.data;

        if (defaultAddress) {
          setHasSavedAddress(true);
          setFormData((prev) => ({
            ...prev,
            address: defaultAddress.street || "",
            city: defaultAddress.city || "",
            zipCode: defaultAddress.zip || "",
          }));
        } else {
          setHasSavedAddress(false);
        }
      } catch (err) {
        console.log("User data fetch error:", err);
        setHasSavedAddress(false);
      }
    };

    fetchUserData();
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

  /* ================= LIVE LOCATION ================= */

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLiveLocation({ latitude, longitude });

        console.log("Live location:", latitude, longitude);
      },
      () => alert("Location permission denied")
    );
  };

  /* ================= SAVE ADDRESS ================= */

  const saveAddress = async () => {
    if (hasSavedAddress) return;

    const token = localStorage.getItem("token");

    await axios.post(
      `/api/users/addresses`,
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
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {
    if (!bookingId) {
      alert("Invalid booking.");
      return;
    }

    if (!validateForm()) return;

    try {
      await saveAddress();

      const token = localStorage.getItem("token");

      const createRes = await fetch(
        `/api/admin/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
          }),
        }
      );

      const data = await createRes.json();

      if (!createRes.ok) {
        alert(data?.message || "Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Farmer Machine Booking",
        order_id: data.order_id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response) {
          await fetch(`/api/admin/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              booking_id: bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          navigate(`/booking-confirmation/${response.razorpay_order_id}`);
        },
        theme: { color: "#03a74f" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed.");
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

          <h1 className="text-4xl font-bold text-[#131614] mb-2">
            Checkout
          </h1>

          <p className="text-gray-600">
            Complete your order with secure payment
          </p>
        </div>

        {!hasSavedAddress && (
          <div className="flex justify-end mb-4">
            <button
              onClick={getLiveLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              📍 Use Live Location
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
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

          <div className="bg-white rounded-xl shadow p-6 sticky top-10">
            <h2 className="text-xl font-bold mb-4 flex justify-between">
              Order Summary <CreditCard />
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <img
                  src={currentBooking.image}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold">{currentBooking.name}</h3>
                  <p className="text-sm text-gray-500">
                    {currentBooking.startDate}
                  </p>
                  <p className="text-sm">{durationText}</p>
                </div>
              </div>

              <Row label="Subtotal" value={`₹${subtotal}`} />

              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <button
                onClick={handlePayment}
                className="w-full mt-4 bg-[#03a74f] text-white py-3 rounded-lg font-semibold"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}