import React from "react";

const Specs = ({ data, setData, next, prev }) => {
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "pricePerHour" && value < 0) value = 0;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !data.fuelType ||
      !data.category ||
      !data.pricePerHour ||
      data.transport === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (parseFloat(data.pricePerHour) < 100) {
      alert("Price per hour must be at least ₹100");
      return;
    }

    next();
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Specifications & Pricing
          </h1>
          <p className="text-gray-600">
            Define your machine details and rental price
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={data.fuelType}
                  onChange={handleChange}
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                >
                  <option value="">Select fuel type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Category
                </label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  className="px-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                >
                  <option value="">Select category</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Seeder">Seeder</option>
                  <option value="Baler">Baler</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Rental Pricing
            </h2>

            <div className="max-w-md">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 text-sm">
                  Price Per Hour
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={data.pricePerHour}
                    onChange={handleChange}
                    placeholder="Enter hourly rate"
                    min="100"
                    step="1"
                    onWheel={(e) => e.target.blur()}
                    className="w-full pl-8 pr-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  You will receive{" "}
                  <span className="font-semibold text-[#03a74f]">95%</span> of
                  the total amount after each booking
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label className="font-medium text-gray-700 text-sm">
                  Transport Fee
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
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
                    className="w-full pl-8 pr-4 py-3 border-[1.5px] rounded-lg border-gray-300 bg-white focus:border-[#03a74f] focus:ring-1 focus:ring-[#03a74f] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={prev}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#03a74f] hover:bg-[#028a42] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg"
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
