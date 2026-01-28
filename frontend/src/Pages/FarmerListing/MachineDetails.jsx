import { useParams } from "react-router-dom";
import machines from "./machineDetails.js";
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
};

const specLabels = {
  power: "Engine Power",
  fuel: "Fuel Type",
  hours: "Operating Hours",
  weight: "Machine Weight",
  drive: "Drive Type",
  hitch: "Hitch Category",
};

const MachineDetails = () => {
  const { id } = useParams();
  const machine = machines.find((m) => m.id === id);

  if (!machine) return <p>Machine not found</p>;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#8080801a]">
      {/* BREADCRUMB */}
      <p className="text-sm text-gray-500 mb-4">
        Machinery / Tractors /{" "}
        <span className="text-black">{machine.name}</span>
      </p>

      {/* IMAGE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-lg overflow-hidden mb-8 group/gallery">
        <img
          src={machine.images[0]}
          className="col-span-1 md:col-span-2 row-span-2 relative w-full object-cover h-full rounded-lg cursor-pointer hover:scale-105 transition-transform duration-500"
        />
        {machine.images.slice(1).map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-full bg-cover bg-center cursor-pointer hover:scale-105 transition-transform duration-500 rounded-lg object-cover"
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
                {machine.name} - {machine.model} Model
              </h1>
              <div className="flex gap-5 hover:bg-gray-100 transition-colors text-[#131614]">
                <Share2 />
                <Heart />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-[#131614]">
              <Star size={16} className="fill-[#1f3d2b]" />
              <span className="font-bold">{machine.rating}</span>
              <span className="underline decoration-1 underline-offset-2 cursor-pointer">
                ({machine.reviews} reviews)
              </span>

              <span className="text-[#6d7e74]">•</span>

              <div className="flex items-center gap-1 text-[#6d7e74]">
                <span className="material-symbols-outlined text-lg">
                  <MapPin size={16} />
                </span>
                <span>{machine.location}</span>
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
                  Hosted by {machine.host}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[#6d7e74]">
                  <span>Joined {machine.join}</span>
                  <span>•</span>
                  <span>Response rate: {machine.responseRate}%</span>
                </div>
              </div>
            </div>
            <button className="hidden sm:block text-[#1f3d2b] font-semibold text-sm hover:underline">
              Contact Owner
            </button>
          </div>

          {/* SPECS */}
          <h2 className="text-xl font-bold text-[#131614]">
            Technical Specifications
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(machine.specs).map(([key, value]) => (
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
            ))}
          </div>

          <hr className="border-[#dee3e0]"></hr>

          {/* ABOUT */}
          <h2 className="text-xl font-bold text-[#131614]">
            About this machine
          </h2>
          <div className="text-[#6d7e74] leading-relaxed">
            {machine.description.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {/* RIGHT BOOKING CARD */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#dee3e0] overflow-hidden h-fit">
          <div className="p-6 border-b border-[#dee3e0]">
            <div className="flex items-baseline justify-between">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-[#131614]">
                  ₹{machine.pricePerDay}
                </span>
                <span className="text-[#6d7e74] text-sm font-medium">
                  / day
                </span>
              </div>
              <div className="text-xs font-semibold text-[#1f3d2b] bg-green-50 px-2 py-1 rounded">
                Best Value
              </div>
            </div>
          </div>

          <div class="p-6 flex flex-col gap-5">
            <div class="border border-[#dee3e0] rounded-xl overflow-hidden">
              <div class="grid grid-cols-2 divide-x divide-[#dee3e0] border-b border-[#dee3e0]">
                <div class="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors">
                  <label class="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    Start Date
                  </label>
                  <div class="text-sm font-medium text-[#131614] mt-1">
                    Oct 24, 2023
                  </div>
                </div>

                <div class="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors">
                  <label class="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    End Date
                  </label>
                  <div class="text-sm font-medium text-[#131614] mt-1">
                    Oct 27, 2023
                  </div>
                </div>
              </div>

              <div class="p-3 hover:bg-[#f9faf7] cursor-pointer transition-colors flex items-center justify-between">
                <div>
                  <label class="block text-[10px] uppercase font-bold text-[#6d7e74] tracking-wider">
                    Duration
                  </label>
                  <div class="text-sm font-medium text-[#131614] mt-1">
                    3 Days
                  </div>
                </div>
                <span class="material-symbols-outlined text-[#6d7e74]">
                  <ChevronDown />
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  class="mt-1 w-4 h-4 accent-[#1f3d2b] text-[#1f3d2b] bg-gray-100 border-gray-300 rounded focus:ring-[#1f3d2b]"
                  type="checkbox"
                />
                <div class="text-sm">
                  <span class="font-medium text-[#131614] block group-hover:text-[#1f3d2b] transition-colors">
                    Include Operator
                  </span>
                  <span class="text-[#6d7e74] text-xs">
                    Certified driver (+$350/day)
                  </span>
                </div>
              </label>
              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  checked
                  class="mt-1 w-4 h-4 accent-[#1f3d2b] text-[#1f3d2b] bg-gray-100 border-gray-300 rounded focus:ring-[#1f3d2b]"
                  type="checkbox"
                />
                <div class="text-sm">
                  <span class="font-medium text-[#131614] block group-hover:text-[#1f3d2b] transition-colors">
                    Logistics &amp; Transport
                  </span>
                  <span class="text-[#6d7e74] text-xs">
                    Delivery to site (+$150)
                  </span>
                </div>
              </label>
            </div>
            <button class="w-full bg-[#162e20e3] hover:bg-[#162e20] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 group">
              <span class="material-symbols-outlined text-lg group-hover:animate-pulse">
                <Calendar size={16} />
              </span>
              Book Now
            </button>
            <p class="text-center text-xs text-[#6d7e74]">
              You won't be charged yet
            </p>
            {/* <div class="flex flex-col gap-2 pt-2 text-sm text-[#131614] dark:text-gray-300">
              <div class="flex justify-between">
                <span class="underline decoration-dotted decoration-sage cursor-help">
                  $1,200 x 3 days
                </span>
                <span>$3,600</span>
              </div>
              <div class="flex justify-between">
                <span class="underline decoration-dotted decoration-sage cursor-help">
                  Transport Fee
                </span>
                <span>$150</span>
              </div>
              <div class="flex justify-between">
                <span class="underline decoration-dotted decoration-sage cursor-help">
                  Service Fee
                </span>
                <span>$125</span>
              </div>
            </div>
            <hr class="border-[#dee3e0] dark:border-gray-700" />
            <div class="flex justify-between items-center text-[#131614] dark:text-white font-bold text-lg">
              <span>Total</span>
              <span>$3,875</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;