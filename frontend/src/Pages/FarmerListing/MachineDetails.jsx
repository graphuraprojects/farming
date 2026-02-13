import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import machines from "./machineDetails.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  ShieldCheck,
  CircleGauge,
  Fuel,
  Settings,
  Weight,
  Clock8,
  Tractor,
  ChevronDown,
  Calendar,
} from "lucide-react";

const specIcons = {
  power: <CircleGauge className="text-[#6d7e74]" />,
  fuel: <Fuel className="text-[#6d7e74]" />,
  hours: <Clock8 className="text-[#6d7e74]" />,
  weight: <Weight className="text-[#6d7e74]" />,
  drive: <Settings className="text-[#6d7e74]" />,
  hitch: <Tractor className="text-[#6d7e74]" />,

  model: <Tractor className="text-[#6d7e74]" />,
  model_year: <Calendar className="text-[#6d7e74]" />,
  fuel_type: <Fuel className="text-[#6d7e74]" />,
  category: <Settings className="text-[#6d7e74]" />,
};

const specLabels = {
  power: "Engine Power",
  fuel: "Fuel Type",
  hours: "Operating Hours",
  weight: "Machine Weight",
  drive: "Drive Type",
  hitch: "Hitch Category",

  model: "Model",
  model_year: "Model Year",
  fuel_type: "Fuel Type",
  category: "Category",
};

const MachineDetails = () => {
  const { id } = useParams();
  // const machine = machines.find((m) => m.id === id);

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    totalHoursDecimal: 0, // needed for price calculation
  });
  const [includeOperator, setIncludeOperator] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/machines`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // find machine by id from URL
        const found = res.data.data.find((m) => m._id === id);

        setMachine(found);
      } catch (err) {
        console.error("Error fetching machine:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id]);

  useEffect(() => {
    if (!startTime || !endTime) return;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    if (endMinutes > startMinutes) {
      const diffMinutes = endMinutes - startMinutes;

      const hrs = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;

      setDuration({
        hours: hrs,
        minutes: mins,
        totalHoursDecimal: diffMinutes / 60, // for price
      });
    } else {
      setDuration({
        hours: 0,
        minutes: 0,
        totalHoursDecimal: 0,
      });
    }
  }, [startTime, endTime]);

  if (loading) {
    return <p className="text-center py-20">Loading machine details...</p>;
  }

  if (!machine) {
    return <p className="text-center py-20">Machine not found</p>;
  }

  const today = new Date().toISOString().split("T")[0];

  const durationDecimal = duration.totalHoursDecimal;

  const operatorTotal = includeOperator
    ? (machine.operatorFeePerHour || 0) * duration.totalHoursDecimal
    : 0;

  const rentTotal = durationDecimal * machine.price_per_hour;

  const grandTotal =
    Number(rentTotal || 0) +
    Number(operatorTotal || 0) +
    Number(machine.transport || 0) +
    Number(machine.serviceFee || 0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = user?.role === "owner";
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BREADCRUMB */}
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/machine-listing">Machinery / </Link>
        <span className="text-black">{machine.machine_name}</span>
      </p>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-lg overflow-hidden mb-8 group/gallery">
        <img
          src={machine.images?.[0]?.url}
          className="col-span-1 md:col-span-2 row-span-2 relative w-full object-cover h-full rounded-lg cursor-pointer hover:scale-105 transition-transform duration-500"
        />
        {machine.images?.slice(1).map((img, i) => (
          <img
            key={i}
            src={img.url}
            className="w-full h-full bg-cover bg-center cursor-pointer hover:scale-105 transition-transform duration-500 rounded-lg object-cover hidden md:block "
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4 border-b border-[#dee3e0] pb-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#131614]">
                {machine.machine_name} - {machine.model} Model
              </h1>
              {/* <div className="flex gap-5 text-[#131614]">
                <Share2 />
                <Heart />
              </div> */}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-[#131614]">
              {/* <Star size={16} className="fill-[#1f3d2b]" /> */}
              {/* <span className="font-bold">{machine.rating}</span> */}
              {/* <span className="underline decoration-1 underline-offset-2 cursor-pointer">
                ({machine.reviews} reviews)
              </span> */}

              {/* <span className="text-[#6d7e74]">•</span> */}

              <div className="flex items-center gap-1 text-[#6d7e74]">
                <MapPin size={16} />
                <span>
                  {machine.address &&
                  typeof machine.address === "object" &&
                  machine.address.city
                    ? `${machine.address.city}${machine.address.state ? ", " + machine.address.state : ""}`
                    : typeof machine.address === "string"
                      ? machine.address
                      : "Location"}
                </span>
              </div>

              <span className="text-[#6d7e74]">•</span>

              <div className="bg-green-100 text-[#1f3d2b] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                Available Now
              </div>
            </div>
          </div>

          {/* HOST */}
          <div className="flex items-center justify-between border-b border-[#dee3e0] pb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="size-14 rounded-full overflow-hidden border-2 border-white shadow-sm"
                  data-alt="Owner portrait photo"
                >
                  <img
                    alt="Owner"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMKwaMMSYrr-iReM7KGlvF67Y5EKUgYLvJpjhzLIOUOOUKOooIytnjUb-Ygw5inZ5G4zy9COgG6opaxj-XOLjDtxBjXlaALo1BHAVMqO1XZXUbbgHHPznXFTwdFfufaD30C0XDvl1xD9-Q0xPc-Yqmhn1CJf7nA6TRdMC1nlvth0KTM6ANXI8wgajcWVASb8X2Rov1JyfXpmQt-_VRgUUuIKyxtKQ_pNaPJaR6H_9NSc4-yJQFKfFgTOrV8VPUrGhK9egWGRaMCL9H"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                  <div className="bg-[#1f3d2b] text-white p-1 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] filled">
                      <ShieldCheck size={16} />
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#131614]">
                  Owner
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#6d7e74]">
                  <span>{machine.owner_id.name}</span>
                </div>
              </div>
            </div>
            {/* <button className="hidden sm:block text-[#1f3d2b] font-semibold text-sm hover:underline">
              Contact Owner
            </button> */}
          </div>

          {/* SPECS */}
          <h2 className="text-xl font-bold text-[#131614]">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {machine.specs && Object.keys(machine.specs).length > 0 ? (
              Object.entries(machine.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white p-4 rounded-xl border border-[#dee3e0] flex flex-col gap-2"
                >
                  <div className="text-xl">{specIcons[key]}</div>

                  <div className="flex flex-col">
                    <p className="text-xs text-[#6d7e74] uppercase font-semibold tracking-wider">
                      {specLabels[key] ?? key}
                    </p>
                    <p className="text-base font-bold text-[#131614]">
                      {value}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No specifications available</p>
              </div>
            )}
          </div>

          <hr className="border-[#dee3e0]"></hr>

          {/* ABOUT */}
          {/* <h2 className="text-xl font-bold text-[#131614]">
            About this machine
          </h2>
          <div className="text-[#6d7e74] leading-relaxed">
            {machine.description ? (
              Array.isArray(machine.description) ? (
                machine.description.map((line, index) => (
                  <p key={index}>{line}</p>
                ))
              ) : (
                <p>{machine.description}</p>
              )
            ) : (
              <p>No description available for this machine.</p>
            )}
          </div> */}
        </div>

        {/* RIGHT BOOKING CARD */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#dee3e0] overflow-hidden h-fit lg:sticky lg:top-6">
          <div className="p-6 border-b border-[#dee3e0]">
            <div className="flex items-baseline justify-between">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-[#131614]">
                  ₹{machine.price_per_hour}
                </span>
                <span className="text-[#6d7e74] text-sm font-medium">
                  / hours
                </span>
              </div>
              <div className="text-xs font-semibold text-primary bg-green-50 px-2 py-1 rounded">
                Best Value
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="border border-[#dee3e0] rounded-xl overflow-hidden">
              <div className="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors border-b border-[#dee3e0]">
                <label className="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                  Start Date
                </label>
                <div className="text-sm font-medium text-[#131614] mt-1">
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-sm bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-[#dee3e0] border-b border-[#dee3e0]">
                {/* START TIME */}
                <div className="p-3 hover:bg-[#f9faf7] transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full mt-2 text-sm bg-transparent outline-none"
                  />
                </div>

                {/* END TIME */}
                <div className="p-3 hover:bg-[#f9faf7] transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full mt-2 text-sm bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 divide-x divide-[#dee3e0]">
                <div className="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    Number of Hours
                  </label>
                  <div className="text-sm font-medium text-[#131614] mt-1">
                    <input
                      type="text"
                      value={`${duration.hours} hr ${duration.minutes} min`}
                      readOnly
                      className="w-full mt-2 text-sm bg-transparent outline-none border border-[#dee3e0] rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* <div className="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    End Date
                  </label>
                  <div className="text-sm font-medium text-[#131614] mt-1">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      disabled={!startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-sm bg-transparent outline-none"
                    />

                  </div>
                </div> */}
              </div>

              {/* <div className="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors flex items-center justify-between">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    Duration
                  </label>
                  <div className="text-sm font-medium text-[#131614] mt-1">
                    {hours > 0 ? `${hours} Hours` : "Enter hours"}
                  </div>
                </div>
              </div> */}
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  className="mt-1 w-4 h-4 accent-[#1f3d2b] text-[#1f3d2b] bg-gray-100 border-gray-300 rounded focus:ring-[#1f3d2b]"
                  type="checkbox"
                  checked={includeOperator}
                  onChange={(e) => setIncludeOperator(e.target.checked)}
                />
                <div className="text-sm">
                  <span className="font-medium text-[#131614] block group-hover:text-primary transition-colors">
                    Include Operator
                  </span>
                  <span className="text-[#6d7e74] text-xs">
                    Certified driver (+₹{machine.operatorFeePerHour}/hour)
                  </span>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  defaultChecked
                  className="mt-1 w-4 h-4 accent-[#1f3d2b] text-[#1f3d2b] bg-gray-100 border-gray-300 rounded focus:ring-[#1f3d2b]"
                  type="checkbox"
                />
                <div className="text-sm">
                  <span className="font-medium text-[#131614] block group-hover:text-primary transition-colors">
                    Logistics &amp; Transport
                  </span>
                  <span className="text-[#6d7e74] text-xs">
                    Delivery to site (+₹{machine.transport})
                  </span>
                </div>
              </label>
            </div>

            <button
              onClick={async () => {
                // 🚫 Stop ONLY owner
                if (isOwner) {
                  alert("Owners cannot book their own or other machines.");
                  return;
                }

                if (
                  !startDate ||
                  !startTime ||
                  !endTime ||
                  duration.totalHoursDecimal <= 0
                ) {
                  alert("Please select date and time range.");
                  return;
                }

                const token = localStorage.getItem("token");

                if (!token) {
                  alert("Please login to book a machine.");
                  navigate("/login");
                  return;
                }

                try {
                  const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/bookings/create`,
                    {
                      machine_id: machine._id,
                      start_date: startDate,
                      start_time: startTime,
                      end_time: endTime,
                      total_hours: duration.totalHoursDecimal,
                      total_amount: grandTotal,
                    },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );

                  if (!res.data?.success) {
                    alert(res.data?.message || "Failed to create booking.");
                    return;
                  }

                  const booking = res.data.data?.booking;

                  const newBooking = {
                    bookingId: booking._id,
                    machineId: machine._id,
                    name: machine.machine_name,
                    image: machine.images?.[0]?.url,
                    startDate,
                    hours: duration.totalHoursDecimal,
                    total: grandTotal,
                  };

                  const existing =
                    JSON.parse(localStorage.getItem("bookings")) || [];

                  localStorage.setItem(
                    "bookings",
                    JSON.stringify([...existing, newBooking]),
                  );

                  navigate("/checkout");
                } catch (err) {
                  alert(
                    err.response?.data?.message ||
                      "Failed to create booking. Please try again.",
                  );
                }
              }}
              className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 group
    ${
      isOwner
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : "bg-[#03a74f] hover:bg-[#38864b] text-white active:scale-[0.98]"
    }
  `}
            >
              <Calendar size={20} />
              {isOwner ? "Owners Cannot Book" : "Book Now"}
            </button>

            {/* <button
              onClick={() => {
                const codOrder = {
                  order_id: `COD-${Date.now()}`,
                  status: "Confirmed (Cash on Delivery)",
                  global_location:
                    typeof machine.address === "string"
                      ? machine.address
                      : machine.address?.city || "Farm Location",

                  machines: [
                    {
                      id: machine._id,
                      name: machine.machine_name,
                      description: machine.model,
                      start_date: startDate,
                      end_date: startDate,
                      usage_hours: duration.totalHoursDecimal,

                      image_url: machine.images?.[0]?.url,
                      price: grandTotal,
                    },
                  ],

                  next_steps: [
                    {
                      title: "Owner Confirmation",
                      desc: "Owner will call you shortly.",
                    },
                    { title: "Prepare Cash", desc: "Pay at delivery time." },
                    {
                      title: "Machine Delivery",
                      desc: "On selected date & time.",
                    },
                  ],
                };

                // 🔐 store COD order
                localStorage.setItem("codOrder", JSON.stringify(codOrder));

                // 🚀 redirect
                navigate(`/booking-confirmation/${codOrder.order_id}`);
              }}
              className="w-full bg-[#03a74f] hover:bg-[#38864b] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">
                <Calendar size={20} />
              </span>
              Cash on Delivery
            </button> */}

            {/* <p className="text-center text-xs text-[#6d7e74]">
              You won't be charged yet
            </p> */}

            <div className="flex flex-col gap-2 pt-2 text-sm text-[#131614]">
              <div className="flex justify-between">
                <span className="underline decoration-dotted decoration-sage cursor-help">
                  ₹{machine.price_per_hour} x {duration.hours} hr{" "}
                  {duration.minutes} min
                </span>
                <span>₹{rentTotal}</span>
              </div>

              {includeOperator && (
                <div className="flex justify-between">
                  <span className="underline decoration-dotted decoration-sage cursor-help">
                    Operator Fee (₹{machine.operatorFeePerHour} ×{" "}
                    {duration.hours} hr {duration.minutes} min hour)
                  </span>
                  <span>₹{operatorTotal}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="underline decoration-dotted decoration-sage cursor-help">
                  Transport Fee
                </span>
                <span>₹{machine.transport}</span>
              </div>

              <div className="flex justify-between">
                <span className="underline decoration-dotted decoration-sage cursor-help">
                  Service Fee
                </span>
                <span>₹{machine.serviceFee}</span>
              </div>
            </div>

            <hr className="border-[#dee3e0] dark:border-gray-700" />

            <div className="flex justify-between items-center text-[#131614] font-bold text-lg">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
