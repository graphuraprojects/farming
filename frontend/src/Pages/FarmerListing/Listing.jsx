import { useEffect, useState } from "react";
// import machines from "./Listing.js";
import axios from "axios";
import MachineCard from "./MachineCard";
import Filters from "./Filters";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const Listing = () => {
  const [filters, setFilters] = useState({
    search: "",
    price: 2500,
    distance: 100,
    type: [],
  });
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const categoryFromURL = queryParams.get("category");
useEffect(() => {
  if (categoryFromURL) {
    setFilters((prev) => ({
      ...prev,
      type: [categoryFromURL],
    }));
  }
}, [categoryFromURL]);

  const [sort, setSort] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/machines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setMachines(res.data.data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  // Reset page when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  // Count machines by type (for Tractors (3))
  const typeCounts = machines.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  //  FILTER
  const filteredData = machines
    .map((m) => ({
      id: m._id,
      name: m.machine_name,
      price: m.price_per_hour,
      year: m.model_year,
      image: m.images?.[0]?.url,
      location: `${m.address?.street || ""}, ${m.address?.city || ""}, ${m.address?.state || ""}`,
      type: m.category,
      distance: 20, // dummy
      hp: 50,
      verified: true,
    }))

    // SEARCH FILTER
    .filter((item) =>
      item.name.toLowerCase().includes(filters.search.toLowerCase()),
    )

    //PRICE FILTER
    .filter((item) => item.price <= filters.price)

    // DISTANCE FILTER
    .filter((item) => item.distance <= filters.distance)

    // TYPE FILTER
    .filter((item) =>
      filters.type.length === 0 ? true : filters.type.includes(item.type),
    );

  if (loading) {
    return <p className="text-center py-20">Loading machines...</p>;
  }

  // SORT
  if (sort === "low-high") {
    filteredData.sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    filteredData.sort((a, b) => b.price - a.price);
  }

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="relative w-full h-[65vh] overflow-hidden">
        <img
          alt="Contact banner"
          className="w-full h-full object-cover object-center"
          src="https://img.freepik.com/premium-photo/two-working-gathering-harvest-machines-harvest-gathering-gold-field-dry-wheat_116317-7329.jpg"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">
            Certified machines, verified owners, flexible rentals
          </h1>
          <p className="max-w-2xl sm:text-lg text-[12px] leading-relaxed">
            From small farms to big construction sites, we provide the right
            machine for every project.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#131614] text-4xl font-black tracking-tight">
              Available Machines
              <span className="text-2xl pl-1">({filteredData.length})</span>
            </h1>
            <p className="text-[#6d7e74] text-lg">
              Browse premium agricultural machinery verified for enterprise use.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#6d7e74]">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-select border border-[#e6e8e6] bg-white rounded-lg text-sm font-medium py-2 pl-3 pr-10 focus:ring-[#1f3d2b] focus:border-[#1f3d2b]"
            >
              <option value="recommended">Recommended</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20">Loading machines...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* STICKY FILTER */}
              <div className="lg:sticky lg:top-6">
                <Filters
                  filters={filters}
                  setFilters={setFilters}
                  typeCounts={typeCounts}
                  resetFilters={() =>
                    setFilters({
                      search: "",
                      price: 2500,
                      distance: 100,
                      type: [],
                    })
                  }
                />
              </div>
              {/* CARDS GRID */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedData.length ? (
                  paginatedData.map((item) => (
                    <MachineCard key={item.id} item={item} />
                  ))
                ) : (
                  <p>No machines found.</p>
                )}
              </div>
            </div>

            {/* PAGINATION BUTTONS */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                {/* LEFT ARROW */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`cursor-pointer px-3 py-2 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {/* PAGE NUMBERS */}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`cursor-pointer px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-[#1f3d2b] text-white font-bold"
                        : "hover:bg-gray-100 text-gray-500 font-medium"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* RIGHT ARROW */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`cursor-pointer px-3 py-2 rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Listing;
