import { SlidersHorizontal, Search } from "lucide-react";
import { useEffect } from "react";

const Filters = ({ filters, setFilters, resetFilters, typeCounts }) => {
  // 🔥 Log every time filters change
  useEffect(() => {
    console.log("===== FILTERS STATE UPDATED =====");
    console.log("Search:", filters.search);
    console.log("Price:", filters.price);
    console.log("Distance:", filters.distance);
    console.log("Type:", filters.type);
    console.log("=================================");
  }, [filters]);

  return (
    <div className="bg-white rounded-xl border border-[#e6e8e6] p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#131614] flex items-center gap-2 mb-6">
        <SlidersHorizontal size={20} className="text-[#1f3d2b]" />
        Filters
      </h2>

      {/* 🔎 Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-main mb-2">
          Search
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6d7e74]">
            <Search size={20} />
          </span>
          <input
            className="w-full pl-9 pr-3 py-2.5 bg-[#fdfdf9] border border-[#e6e8e6] rounded-lg text-sm font-medium focus:ring-[#1f3d2b] focus:border-[#1f3d2b]"
            placeholder="Model, brand, or ID"
            type="text"
            value={filters.search}
            onChange={(e) => {
              console.log("🔍 Search changed:", e.target.value);
              setFilters({ ...filters, search: e.target.value });
            }}
          />
        </div>
      </div>

      <hr className="border-[#e6e8e6] mb-6" />

      {/* 📍 Distance */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#131614] mb-3">
          Distance Radius
        </label>
        <div className="flex gap-2 mb-2">
          <input
            className="w-full px-3 py-2 bg-white border border-[#e6e8e6] rounded-lg text-sm font-medium focus:ring-[#1f3d2b] focus:border-[#1f3d2b]"
            type="number"
            value={filters.distance}
            onChange={(e) => {
              console.log("📍 Distance changed:", e.target.value);
              setFilters({
                ...filters,
                distance: Number(e.target.value),
              });
            }}
          />
          <span className="flex items-center justify-center px-3 bg-[#fdfdf9] border border-[#e6e8e6] rounded-lg text-sm font-medium text-[#6d7e74]">
            miles
          </span>
        </div>
      </div>

      <hr className="border-[#e6e8e6] mb-6" />

      {/* 💰 Price */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#131614] mb-3">
          Max Price (₹/day)
        </label>

        <input
          type="range"
          min="50"
          max="2500"
          value={filters.price}
          onChange={(e) => {
            console.log("💰 Price changed:", e.target.value);
            setFilters({
              ...filters,
              price: Number(e.target.value),
            });
          }}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1f3d2b]"
          style={{
            background: `linear-gradient(
              to right,
              #1f3d2b 0%,
              #1f3d2b ${(filters.price / 2500) * 100}%,
              #e5e7eb ${(filters.price / 2500) * 100}%,
              #e5e7eb 100%
            )`,
          }}
        />

        <p className="text-sm font-medium text-[#6d7e74] mt-2">
          ₹{filters.price}
        </p>
      </div>

      <hr className="border-[#e6e8e6] mb-6" />

      {/* 🏷 Machine Type */}
      <div className="space-y-3 mb-6">
        <p className="block text-sm font-semibold text-[#131614] mb-3">
          Machine Type
        </p>

        {["Tractors", "Harvesters", "Balers", "Seeders", "Rotavators"].map(
          (type) => (
            <label
              key={type}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => {
                    const updated = filters.type.includes(type)
                      ? filters.type.filter((t) => t !== type)
                      : [...filters.type, type];

                    console.log("🏷 Type toggled:", type);
                    console.log("New type array:", updated);

                    setFilters({ ...filters, type: updated });
                  }}
                  className="accent-[#1f3d2b] size-4"
                />
                <span className="text-sm text-[#131614]">{type}</span>
              </div>

              <span className="text-sm font-medium text-[#6d7e74]">
                ({typeCounts[type] || 0})
              </span>
            </label>
          ),
        )}
      </div>

      {/* 🔄 Reset */}
      <button
        onClick={() => {
          console.log("🔄 Reset filters clicked");
          resetFilters();
        }}
        className="w-full bg-gray-200 py-2 rounded hover:bg-[#14532d] hover:text-white transition cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
