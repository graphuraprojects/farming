import { useEffect, useState } from "react";
import axios from "axios";
import MachineCard from "./MachineCard";
import Filters from "./Filters";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { color, gradientBg } from "../../theme";

const ITEMS_PER_PAGE = 6;

const Listing = () => {
  const [filters, setFilters] = useState({
    search: "",
    price: 25000,
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

        const res = await axios.get(`/api/machines`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("[Listing] Full API response:", res.data);
        const machineData = res.data.data || [];
        console.log("Machines state:", machineData);
        setMachines(machineData);
      } catch (error) {
        console.error("Error fetching machines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const typeCounts = machines.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  console.log(
    "Machine prices:",
    machines.map((m) => m.price_per_day),
  );
  useEffect(() => {
    if (machines.length > 0) {
      console.log("FIRST MACHINE FULL OBJECT:", machines[0]);
    }
  }, [machines]);

  const filteredData = machines
    .map((m) => ({
      id: m._id,
      name: m.machine_name,
      price: Number(m.price_per_day) || 0,
      year: m.model_year,
      image: m.images?.[0]?.url,
      location: `${m.address?.street || ""}, ${m.address?.city || ""}, ${m.address?.state || ""}`,
      type: m.category,
      distance: 20,
      hp: 50,
      verified: true,
    }))
    .filter((item) =>
      (item.name || "").toLowerCase().includes(filters.search.toLowerCase()),
    )
    .filter((item) => item.price <= filters.price)
    .filter((item) => item.distance <= filters.distance)
    .filter((item) =>
      typeof item.price === "number" ? item.price <= filters.price : true,
    )
    .filter((item) =>
      filters.type.length === 0 ? true : filters.type.includes(item.type),
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32" style={{ background: color.bg }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: `${color.paleGreen}`, borderTopColor: color.emerald }} />
          <p className="font-medium" style={{ color: color.textSoft }}>Loading machines...</p>
        </div>
      </div>
    );
  }

  if (sort === "low-high") {
    filteredData.sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    filteredData.sort((a, b) => b.price - a.price);
  }

  console.log("Filtered data:", filteredData);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  console.log("Paginated data:", paginatedData);

  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          alt="Contact banner"
          className="w-full h-full object-cover object-center"
          src="https://img.freepik.com/premium-photo/two-working-gathering-harvest-machines-harvest-gathering-gold-field-dry-wheat_116317-7329.jpg"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${color.deepForest}cc 0%, ${color.forest}99 40%, rgba(0,0,0,0.4) 100%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <p className="text-xs font-semibold uppercase tracking-[4px] mb-3" style={{ color: color.gold }}>
            Browse Equipment
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            Certified machines, verified owners, flexible rentals
          </h1>
          <p className="max-w-2xl sm:text-lg text-sm text-gray-300 leading-relaxed">
            From small farms to big construction sites, we provide the right
            machine for every project.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ background: color.bg }}>
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: color.text }}>
              Available Machines
              <span className="text-xl font-bold ml-2" style={{ color: color.textSoft }}>({filteredData.length})</span>
            </h1>
            <p className="text-sm" style={{ color: color.textSoft }}>
              Browse premium agricultural machinery verified for enterprise use.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: color.textSoft }}>Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl text-sm font-medium py-2.5 pl-3 pr-10 outline-none transition-all duration-200 cursor-pointer"
              style={{ border: `1.5px solid ${color.border}`, background: "white" }}
              onFocus={(e) => e.target.style.borderColor = color.emerald}
              onBlur={(e) => e.target.style.borderColor = color.border}
            >
              <option value="recommended">Recommended</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* STICKY FILTER */}
            <div className="lg:sticky lg:top-20">
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
                <div className="col-span-full flex flex-col items-center py-20">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: color.paleGreen }}>
                    <ChevronRight size={24} style={{ color: color.emerald }} />
                  </div>
                  <p className="text-lg font-semibold" style={{ color: color.text }}>No machines found</p>
                  <p className="text-sm" style={{ color: color.textSoft }}>Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className="cursor-pointer px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={
                    currentPage === i + 1
                      ? { background: gradientBg(color.emerald, color.forest), color: "white" }
                      : { color: color.textSoft }
                  }
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default Listing;
