import {
  CircleGauge,
  Calendar,
  MapPin,
  MoveRight,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { color, shadow, gradientBg } from "../../theme";

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
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: shadow.sm, border: `1px solid ${color.border}` }}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          src={imageSrc}
          alt={item.name || "Machine"}
        />

        {item.verified && (
          <span
            className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: gradientBg(color.emerald, color.forest) }}
          >
            <BadgeCheck size={14} />
            VERIFIED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold leading-tight" style={{ color: color.text }}>
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 text-xs mb-4" style={{ color: color.textSoft }}>
          <span
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: color.paleGreen }}
          >
            <CircleGauge size={14} style={{ color: color.emerald }} />
            {item.hp} HP
          </span>

          <span
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: color.paleGreen }}
          >
            <Calendar size={14} style={{ color: color.emerald }} />
            {item.year}
          </span>
        </div>

        <div className="mt-auto pt-3" style={{ borderTop: `1px dashed ${color.border}` }}>
          <div className="flex justify-between">
            <p className="text-xs font-medium flex items-center gap-1" style={{ color: color.textSoft }}>
              <MapPin size={14} />
              {item.distance} miles away
            </p>
            <p className="text-xs" style={{ color: color.textSoft }}>{item.location}</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center pt-2">
          <p className="font-extrabold text-xl" style={{ color: color.warmGold }}>
            ₹{item.price}
            <span className="text-xs font-medium ml-0.5" style={{ color: color.textSoft }}>/day</span>
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/machine-details/${item.id}`);
            }}
            className="flex items-center gap-1 text-sm font-semibold transition-colors duration-200 group-hover:gap-2"
            style={{ color: color.emerald }}
          >
            View Details <MoveRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
