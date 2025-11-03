import { useState, useEffect } from "react";
import { Bath, Tv, Mountain, ShowerHead, ChevronLeft, ChevronRight } from "lucide-react";
import Carousel from "./Carousel";

const iconMap = {
  "Baño privado": Bath,
  "Baño compartido": ShowerHead,
  "TV": Tv,
  "Agua caliente": ShowerHead,
  "Vista a la montaña": Mountain,
};

export default function RoomCard({
  id,
  price,
  imageNames = [],
  services = [],
  description,
  capacity,
  bedType = [],
  selected = false,
  disabled = false,
  onSelect
}) {
  const SUPABASE_URL = "https://njhzehbjmqyoghfiyxtr.supabase.co/storage/v1/object/public/Images/rooms/";

  const images =
    imageNames.length > 0
      ? imageNames.map((name) => `${SUPABASE_URL}${name}`)
      : [`${SUPABASE_URL}default_room.jpeg`];

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`border rounded-xl shadow-md overflow-hidden mb-6 m-2 bg-white ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <Carousel images={images} height="h-48" />

      <div className="p-4">
        <h2 className="text-xl font-semibold">Habitación {id}</h2>

        <p className="text-gray-600 text-sm mb-2">
          Capacidad: <span className="font-medium">{capacity} personas</span>
        </p>

        {bedType.length > 0 && (
          <p className="text-gray-600 text-sm mb-2">
            🛏️{" "}
            {bedType.map((b, i) => (
              <span key={i} className="font-medium">
                {b.cantidad}x {b.tipo}{i < bedType.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}

        <div className="flex flex-wrap gap-4 my-2">
          {services.map((s, i) => {
            const Icon = iconMap[s.label];
            return (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                {Icon ? <Icon size={18} /> : "•"}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold">{price.toLocaleString()} COP</p>
        </div>
      </div>

      {showDetails && (
        <div className="px-4 pb-4 text-sm text-gray-600">
          <p className="whitespace-pre-line">{description || "Sin descripción disponible."}</p>
        </div>
      )}

      <div className="p-4 flex justify-center">
        <button
          className="px-4 py-2 rounded-lg bg-black text-white text-sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </div>
  );
}