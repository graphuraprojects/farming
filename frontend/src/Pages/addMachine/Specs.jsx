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
    if (!data.fuelType || !data.category || !data.pricePerHour) {
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
    <div className="max-w-200 mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900">
        Machine Specifications & Pricing
      </h1>

      <p className="text-gray-500 mt-1">
        Define your machine details and rental price.
      </p>

      <div className="bg-white rounded-xl border border-gray-300 shadow-lg mt-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-5">
          <span className="text-[#03a74f] text-lg">⚙️</span>

          <h2 className="font-semibold text-gray-800">
            Technical Specifications
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Fuel Type
            </label>

            <select
              name="fuelType"
              value={data.fuelType}
              onChange={handleChange}
              className="
                p-2 border rounded-md bg-white
                border-gray-300
                focus:border-[#03a74f]
                focus:outline-none
              "
            >
              <option value="">Select fuel type</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={data.category}
              onChange={handleChange}
              className="
                p-2 border rounded-md bg-white
                border-gray-300
                focus:border-[#03a74f]
                focus:outline-none
              "
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

      {/* pricing */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-lg mt-6 p-6">
        <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-5">
          <span className="text-[#03a74f] text-lg">💰</span>

          <h2 className="font-semibold text-gray-800">Rental Pricing</h2>
        </div>

        <div className="max-w-sm">
          <label className="text-sm font-medium text-gray-700">
            Price Per Hour (₹)
          </label>

          <input
            type="number"
            name="pricePerHour"
            value={data.pricePerHour}
            onChange={handleChange}
            placeholder="e.g. 250"
            min="100"
            step="1"
            onWheel={(e) => e.target.blur()}
            className="
              mt-1 w-full p-2 border rounded-md bg-white
              border-gray-300
              focus:border-[#03a74f]
              focus:outline-none
            "
          />
        </div>

        {/* Info Text */}
        <p className="text-sm text-gray-500 mt-3">
          You will receive{" "}
          <span className="font-medium text-gray-700">95%</span> of the total
          amount after each booking.
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          className="
            px-6 py-2 border-2 rounded-md cursor-pointer
            text-gray-700 hover:bg-white hover:text-black hover:-translate-y-2 transition-transform duration-300 active:scale-95 hover:border-white
          "
          onClick={prev}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="
            px-6 py-2 rounded-md
            bg-[#03a74f] text-white cursor-pointer
            hover:bg-[#38864b] hover:-translate-y-2 transition-transform duration-300 active:scale-95
          "
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default Specs;
