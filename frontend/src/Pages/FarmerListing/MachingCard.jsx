import {
  CircleGauge,
  Calendar,
  MapPin,
  MoveRight,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const MachineCard = ({ item }) => {
  return (
    <div className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div class="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.image}
          alt={item.name}
        />
        {item.verified && (
          <span className="bg-[#1f3d2b] absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <BadgeCheck size={15} />
            VERIFIED
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#131614] leading-tight">
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-text-subtle mb-4">
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">
              <CircleGauge size={15} />
            </span>{" "}
            {item.hp} HP{" "}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">
              <Calendar size={15} />
            </span>
            {item.year}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex justify-between">
              <p className="text-xs text-[#6d7e74] font-medium mb-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  <MapPin size={15} />
                </span>
                {item.distance} miles away
              </p>
              <p className="text-xs text-[#6d7e74]">{item.location}</p>
            </div>
            {/* <div class="text-right">
              <p class="text-[#dca738] font-black text-xl">${item.price}
                <span class="text-xs text-[#6d7e74] font-medium">/hr</span>
              </p>
            </div> */}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <p className="text-[#dca738] font-black text-xl">
            ₹{item.price}
            <span className="text-xs text-[#6d7e74] font-medium">/hr</span>
          </p>
          <button className="flex items-center gap-1 text-sm text-[#1f3d2b] font-medium cursor-pointer">
            <Link
              to={`/farmer/machine-details/${item.id}`}
              className="text-sm font-medium"
            >
              View Details
            </Link>
            <MoveRight size={15} />
            {/* View Details <MoveRight size={15} /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
