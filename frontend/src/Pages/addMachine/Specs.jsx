import React from "react";
import { color, gradientBg, shadow } from "../../theme";

const Specs = ({ data, setData, next, prev }) => {
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "pricePerDay" && value < 0) value = 0;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !data.fuelType ||
      !data.category ||
      !data.pricePerDay ||
      data.transport === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (parseFloat(data.pricePerDay) < 100) {
      alert("Price per day must be at least ₹100");
      return;
    }

    next();
  };


return (
  <div className="min-h-screen flex justify-center px-2 sm:px-4 py-8">
    
    <div className="w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: color.text }}>
          Specifications & Pricing
        </h1>
        <p className="text-sm" style={{ color: color.textSoft }}>
          Define your machine details and rental price
        </p>
      </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
            <h2 className="text-base font-bold mb-5" style={{ color: color.text }}>
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={data.fuelType}
                  onChange={handleChange}
                  className="px-4 py-3.5 rounded-xl bg-white text-sm outline-none transition-all duration-200"
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                >
                  <option value="">Select fuel type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Category
                </label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  className="px-4 py-3.5 rounded-xl bg-white text-sm outline-none transition-all duration-200"
                  style={{ border: `1.5px solid ${color.inputBorder}` }}
                  onFocus={(e) => e.target.style.borderColor = color.emerald}
                  onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                >
                  <option value="">Select category</option>
                  <option value="Tractors">Tractor</option>
                  <option value="Harvesters">Harvester</option>
                  <option value="Rotavators">Rotavator</option>
                  <option value="Seeders">Seeder</option>
                  <option value="Balers">Baler</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6" style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}>
            <h2 className="text-base font-bold mb-5" style={{ color: color.text }}>
              Rental Pricing
            </h2>

            <div className="max-w-md">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Price Per Day
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium" style={{ color: color.textSoft }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={data.pricePerDay}
                    onChange={handleChange}
                    placeholder="Enter daily rate"
                    min="100"
                    step="1"
                    onWheel={(e) => e.target.blur()}
                    className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-white text-sm outline-none transition-all duration-200"
                    style={{ border: `1.5px solid ${color.inputBorder}` }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-xl p-4" style={{ background: color.paleGreen, border: `1px solid ${color.border}` }}>
                <p className="text-sm" style={{ color: color.textSoft }}>
                  You will receive{" "}
                  <span className="font-semibold" style={{ color: color.emerald }}>95%</span> of
                  the total amount after each booking
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label className="font-medium text-sm" style={{ color: color.text }}>
                  Transport Fee
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium" style={{ color: color.textSoft }}>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="transport"
                    value={data.transport}
                    onChange={handleChange}
                    placeholder="Enter transport fee"
                    min="0"
                    step="1"
                    className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-white text-sm outline-none transition-all duration-200"
                    style={{ border: `1.5px solid ${color.inputBorder}` }}
                    onFocus={(e) => e.target.style.borderColor = color.emerald}
                    onBlur={(e) => e.target.style.borderColor = color.inputBorder}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prev}
              className="px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{ border: `2px solid ${color.border}`, color: color.text }}
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{ background: gradientBg(color.emerald, color.forest), boxShadow: `0 4px 16px ${color.emerald}30` }}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specs;
