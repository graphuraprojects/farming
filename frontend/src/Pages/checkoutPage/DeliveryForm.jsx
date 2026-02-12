import React from "react";
import { ChevronDown } from 'lucide-react';
import { Truck } from 'lucide-react';
import { Building2 } from 'lucide-react';
// import { useState } from "react";


const DeliveryForm = ({ deliveryMode, setDeliveryMode, formData, setFormData, errors }) => {
  // Inside your Checkout component:
// const [deliveryMode, setDeliveryMode] = useState("delivery"); // default delivery
const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex p-1.5 bg-gray-100 rounded-xl w-full sm:w-fit">
  {/* Delivery Option */}
  <label className="flex-1 sm:flex-none cursor-pointer relative">
    <input
      type="radio"
      name="delivery_mode"
      className="peer sr-only"
      checked={deliveryMode === "delivery"}
      onChange={() => setDeliveryMode("delivery")}
    />
    <div className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#1f3d2b] transition-all peer-checked:bg-white peer-checked:text-[#1f3d2b] peer-checked:shadow-sm flex items-center justify-center gap-2">
      <Truck className="text-lg" />
      Delivery
    </div>
  </label>

  {/* Pickup Option: show only if delivery is NOT selected */}
  {deliveryMode !== "delivery" && (
    <label className="flex-1 sm:flex-none cursor-pointer relative">
      <input
        type="radio"
        name="delivery_mode"
        className="peer sr-only"
        checked={deliveryMode === "pickup"}
        onChange={() => setDeliveryMode("pickup")}
      />
      <div className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#1f3d2b] transition-all peer-checked:bg-white peer-checked:text-[#1f3d2b] peer-checked:shadow-sm flex items-center justify-center gap-2">
        <Building2 className="text-lg" />
        Pickup
      </div>
    </label>
  )}
</div>


      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
            Delivery Date
          </label>
          <input
            className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
            type="date"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
            Time Slot
          </label>
          <div className="relative">
            <select className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#1f3d2b]-main appearance-none cursor-pointer">
              <option>9:00 AM - 12:00 PM</option>
              <option>1:00 PM - 5:00 PM</option>
              <option>6:00 PM - 9:00 PM</option>
            </select>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
            Street Address
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
            type="text"
            placeholder="Enter Your Address"
          />

          {errors.address && (
          <p className="text-red-500 text-xs">{errors.address}</p>
        )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
            City
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
            type="text"
            placeholder="Enter Your City"
          />
          {errors.city && (
          <p className="text-red-500 text-xs">{errors.city}</p>
        )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
            Zip Code
          </label>
          <input
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all placeholder:text-gray-400 text-[#6d7e74]-main"
            type="text"
            placeholder="Enter ZIP Code"
          />
          {errors.zipCode && (
          <p className="text-red-500 text-xs">{errors.zipCode}</p>
        )}
        </div>

        {/* <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6d7e74] ml-1">
            Country
          </label>
          <div className="relative">
            <select
              required
              defaultValue=""
              className="w-full h-12 px-4 rounded-xl border border-[#6d7e74] bg-white focus:border-[#6d7e74] focus:ring-1 focus:ring-[#6d7e74] outline-none transition-all text-[#6d7e74]-main appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select Country
              </option>
              <option value="US">United States</option>
              <option value="IN">India</option>
              <option value="UK">United Kingdom</option>
            </select>

            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1f3d2b] pointer-events-none" />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DeliveryForm;
