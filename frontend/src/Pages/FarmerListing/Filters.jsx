import { SlidersHorizontal, Search } from 'lucide-react';

const Filters = ({ filters, setFilters, resetFilters, typeCounts }) => {
  return (
    <div className="bg-white rounded-xl border border-[#e6e8e6] p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#131614] flex items-center gap-2 mb-6">
        <SlidersHorizontal size={20} className="text-[#1f3d2b]" />
        Filters
      </h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-main mb-2">Search</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6d7e74]">
            <Search size={20} />
          </span>
          <input className="w-full pl-9 pr-3 py-2.5 bg-[#fdfdf9] border border-[#e6e8e6] rounded-lg text-sm font-medium focus:ring-[#1f3d2b] focus:border-[#1f3d2b]" placeholder="Model, brand, or ID" 
          type="text"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }/>
        </div>
      </div>

      <hr className="border-[#e6e8e6] mb-6"></hr>

      {/* Distance */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#131614] mb-3">Distance Radius</label>
        <div className="flex gap-2 mb-2">
        <input className="w-full px-3 py-2 bg-white border border-[#e6e8e6] rounded-lg text-sm font-medium focus:ring-[#1f3d2b] focus:border-[#1f3d2b]" 
          type="number"
          value={filters.distance}
          onChange={(e) =>
            setFilters({ ...filters, distance: e.target.value })
          }
        />
        <span className="flex items-center justify-center px-3 bg-[#fdfdf9] border border-[#e6e8e6] rounded-lg text-sm font-medium text-[#6d7e74]">miles</span>
        </div>
        {/* <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-3">
        <div className="bg-primary h-1.5 rounded-full"></div>
        </div> */}
      </div>

      <hr className="border-[#e6e8e6] mb-6"></hr>

      {/* Price */}
      <div className='mb-6'>
        <label className="block text-sm font-semibold text-[#131614] mb-3">Max Price (₹/hr)</label>
        <input
          type="range"
          min="50"
          max="2000"
          value={filters.price}
          onChange={(e) =>
            setFilters({ ...filters, price: Number(e.target.value) })
          }
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1f3d2b]"
          style={{
            background: `linear-gradient(
              to right,
              #1f3d2b 0%,
              #1f3d2b ${(filters.price / 2000) * 100}%,
              #e5e7eb ${(filters.price / 2000) * 100}%,
              #e5e7eb 100%
            )`,
          }}
        />
        <p className="bg-background-light text-sm font-medium text-[#6d7e74]">₹{filters.price}</p>
      </div>

      <hr className="border-[#e6e8e6] mb-6"></hr>

      {/* TYPE CHECKBOX */}
      <div className="space-y-3 mb-6">
        <p className="block text-sm font-semibold text-[#131614] mb-3">Machine Type</p>

        {["Tractors", "Harvesters", "Sprayers"].map((type) => (
          <label
            key={type}
            className="flex justify-between items-center cursor-pointer group-only:"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={() => {
                  const updated = filters.type.includes(type)
                    ? filters.type.filter((t) => t !== type)
                    : [...filters.type, type];

                  setFilters({ ...filters, type: updated });
                }}
                className="accent-[#1f3d2b] size-4"
              />
              <span className="text-sm text-[#131614] group-hover:text-[#1f3d2b] transition-colors">{type}</span>
            </div>
            <span className="text-sm font-medium text-[#6d7e74]">
              ({typeCounts[type] || 0})
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={resetFilters}
        className="w-full bg-gray-200 py-2 rounded hover:bg-[#14532d] hover:text-white duration-400 transition cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;