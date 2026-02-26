import { SlidersHorizontal, Search } from "lucide-react";
import { useEffect } from "react";
import { color, gradientBg } from "../../theme";

const Filters = ({ filters, setFilters, resetFilters, typeCounts }) => {
  useEffect(() => {
    console.log("===== FILTERS STATE UPDATED =====");
    console.log("Search:", filters.search);
    console.log("Price:", filters.price);
    console.log("Distance:", filters.distance);
    console.log("Type:", filters.type);
    console.log("=================================");
  }, [filters]);

  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: `1px solid ${color.border}` }}
    >
      <h2 className="text-base font-bold flex items-center gap-2 mb-6" style={{ color: color.text }}>
        <SlidersHorizontal size={18} style={{ color: color.emerald }} />
        Filters
      </h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: color.text }}>
          Search
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3" style={{ color: color.textSoft }}>
            <Search size={18} />
          </span>
          <input
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
            placeholder="Model, brand, or ID"
            type="text"
            value={filters.search}
            style={{ background: color.bg, border: `1px solid ${color.border}` }}
            onFocus={(e) => e.target.style.borderColor = color.emerald}
            onBlur={(e) => e.target.style.borderColor = color.border}
            onChange={(e) => {
              console.log("🔍 Search changed:", e.target.value);
              setFilters({ ...filters, search: e.target.value });
            }}
          />
        </div>
      </div>

      <hr style={{ borderColor: color.border }} className="mb-6" />

      {/* Distance */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: color.text }}>
          Distance Radius
        </label>
        <div className="flex gap-2 mb-2">
          <input
            className="w-full px-3 py-2 bg-white rounded-xl text-sm outline-none transition-all duration-200"
            type="number"
            value={filters.distance}
            style={{ border: `1px solid ${color.border}` }}
            onFocus={(e) => e.target.style.borderColor = color.emerald}
            onBlur={(e) => e.target.style.borderColor = color.border}
            onChange={(e) => {
              console.log("📍 Distance changed:", e.target.value);
              setFilters({
                ...filters,
                distance: Number(e.target.value),
              });
            }}
          />
          <span
            className="flex items-center justify-center px-3 rounded-xl text-sm font-medium"
            style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.textSoft }}
          >
            miles
          </span>
        </div>
      </div>

      <hr style={{ borderColor: color.border }} className="mb-6" />

      {/* Price */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: color.text }}>
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
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
          style={{
            accentColor: color.emerald,
            background: `linear-gradient(
              to right,
              ${color.emerald} 0%,
              ${color.emerald} ${(filters.price / 2500) * 100}%,
              #e5e7eb ${(filters.price / 2500) * 100}%,
              #e5e7eb 100%
            )`,
          }}
        />

        <p className="text-sm font-semibold mt-2" style={{ color: color.emerald }}>
          ₹{filters.price}
        </p>
      </div>

      <hr style={{ borderColor: color.border }} className="mb-6" />

      {/* Machine Type */}
      <div className="space-y-3 mb-6">
        <p className="block text-sm font-medium mb-3" style={{ color: color.text }}>
          Machine Type
        </p>

        {["Tractors", "Harvesters", "Balers", "Seeders", "Rotavators"].map(
          (type) => (
            <label
              key={type}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
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
                  className="size-4 rounded"
                  style={{ accentColor: color.emerald }}
                />
                <span className="text-sm" style={{ color: color.text }}>{type}</span>
              </div>

              <span className="text-xs font-medium" style={{ color: color.textSoft }}>
                ({typeCounts[type] || 0})
              </span>
            </label>
          ),
        )}
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          console.log("🔄 Reset filters clicked");
          resetFilters();
        }}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        style={{
          background: color.paleGreen,
          color: color.emerald,
          border: `1px solid ${color.border}`,
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
