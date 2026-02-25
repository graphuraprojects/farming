import {
  CircleGauge,
  Calendar,
  MapPin,
  MoveRight,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/drq2a0262/image/upload/f_webp/v1769270928/home-banner_lkkcdb";

const isValidImage = (url) => {
  return url && typeof url === "string" && url.startsWith("http");
};

const MachineCard = ({ item }) => {
  const navigate = useNavigate();

  console.log("Rendering MachineCard:", item);

  const goToDetails = () => {
    navigate(`/machine-details/${item.id}`);
  };

  const imageSrc = isValidImage(item.image) ? item.image : PLACEHOLDER_IMAGE;

  return (
    <div
      onClick={goToDetails}
      className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageSrc}
          alt={item.name || "Machine"}
        />

        {item.verified && (
          <span className="bg-[#1f3d2b] absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <BadgeCheck size={15} />
            VERIFIED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#131614] leading-tight">
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-text-subtle mb-4">
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <CircleGauge size={15} />
            {item.hp} HP
          </span>

          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <Calendar size={15} />
            {item.year}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
          <div className="flex justify-between">
            <p className="text-xs text-[#6d7e74] font-medium flex items-center gap-1">
              <MapPin size={15} />
              {item.distance} miles away
            </p>

            <p className="text-xs text-[#6d7e74]">{item.location}</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-[#dca738] font-black text-xl">
            ₹{item.price}
            <span className="text-xs text-[#6d7e74] font-medium">/day</span>
          </p>

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // ⭐ prevents card click
              navigate(`/machine-details/${item.id}`);
            }}
            className="flex items-center gap-1 text-sm text-[#1f3d2b] font-medium"
          >
            View Details <MoveRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
