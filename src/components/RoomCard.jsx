import { useState } from "react";
import { Bath, Wifi, Tv } from "lucide-react";

const icons = {
  bath: Bath,
  wifi: Wifi,
  tv: Tv,
};

export default function RoomCard({ name, price, image, services, description, details }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border rounded-xl shadow-md overflow-hidden mb-6 m-2 bg-white">

      <img src={image} alt={name} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h2 className="text-xl font-semibold">{name}</h2>
        <div className="flex flex-wrap gap-4 my-2">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                {Icon && <Icon size={18} />}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-lg font-bold">{price.toLocaleString()} COP</p>
      </div>

      {showDetails && (
        <div className="px-4 pb-4 text-sm text-gray-600">
          <p className="mb-2">{description}:</p>
          <ul className="list-disc list-inside space-y-1">
            {details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
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