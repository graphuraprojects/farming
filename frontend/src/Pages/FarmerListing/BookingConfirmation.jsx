import React, { useState, useEffect } from "react";
import MachineDetailsCard from "./MachineCard";
import { Link, useParams } from "react-router-dom";

/**
 * ==========================================
 * BACKEND SETUP FOR MULTIPLE MACHINES
 * ==========================================
 * 1. Set 'IS_LIVE' to true when API is ready.
 * 2. If backend field names change, update them in the 'cleanedData' mapping below.
 */
const IS_LIVE = false;
const API_BASE_URL = "https://your-backend-api.com/api/order-summary";

const BookingConfirmation = () => {
  const { id } = useParams();

  console.log("📦 BookingConfirmation Loaded");
  console.log("📦 URL Param ID:", id);

  const orderId = id;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log("🚀 Fetch Order Started");
        console.log("➡️ orderId:", orderId);

        setLoading(true);
        let rawData;

        const codData = localStorage.getItem("codOrder");

        console.log("🧾 COD LocalStorage:", codData);

        if (codData) {
          rawData = JSON.parse(codData);
          console.log("✅ Using COD Data:", rawData);
        } else {
          console.log("⚠️ Using Simulation Data");
          rawData = await simulateCheckoutResponse();
        }

        console.log("📥 Raw Order Data:", rawData);

        const cleanedData = {
          bookingId: rawData.bookingId || rawData._id,
          status: rawData.status || "Confirmed",
          machines: (rawData.machines || []).map((m) => ({
            id: m.id || Math.random(),
            cardProps: {
              machineName: m.name || m.title,
              description: m.description || m.desc,
              rentalDates: `${m.start_date} - ${m.end_date}`,
              totalUsage: `${m.usage_hours} Hours`,
              pickupLocation: m.location || rawData.global_location,
              imageUrl: m.image_url || m.img,
            },
          })),
          nextSteps: rawData.next_steps || [],
        };

        console.log("🧹 Cleaned Order Data:", cleanedData);
        console.log("🧾 Raw Booking Data:", rawData);
        console.log(
          "🧾 Extracted Booking ID:",
          rawData.bookingId || rawData._id,
        );

        setOrderData(cleanedData);
      } catch (err) {
        console.error("❌ Order Fetch Error:", err);
        setError(err.message);
      } finally {
        console.log("🏁 Order Fetch Completed");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div>Processing Order...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Booking {orderData.status}</h2>

      <Link to={`/invoice/${orderData.bookingId}`}>
        <button>View Invoice</button>
      </Link>
    </div>
  );
};

// --- SIMULATING MULTIPLE MACHINES FROM CHECKOUT ---
const simulateCheckoutResponse = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookingId: "698b1d55be25f64771dccc14",
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
