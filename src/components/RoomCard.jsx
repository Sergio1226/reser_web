import { useState } from "react";
import { Bath, Tv, Mountain, ShowerHead} from "lucide-react";
import { Plus, Minus } from "lucide-react";

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
  image,
  services,
  description,
  capacity,
  bedType,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <div className="border rounded-xl shadow-md overflow-hidden mb-6 m-2 bg-white">
      <img src={image} alt={`Habitación ${id}`} className="w-full h-48 object-cover" />
      
      <div className="p-4">
        <h2 className="text-xl font-semibold">Habitación {id}</h2>

        <p className="text-gray-600 text-sm mb-2">
          Capacidad: <span className="font-medium">{capacity} personas</span>
        </p>

        {bedType && bedType.length > 0 && (
          <p className="text-gray-600 text-sm mb-2">
            🛏️{" "}
            {bedType.map((b, i) => (
              <span key={i} className="font-medium">
                {b.cantidad}x {b.tipo}
                {i < bedType.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}

        <div className="flex flex-wrap gap-4 my-2">
          {services.map((s, i) => {
            const Icon = iconMap[s.label];
            return (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                {Icon ? <Icon size={18} /> : "•"} {}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">{price.toLocaleString()} COP</p>

          <button
            className={`p-2 rounded ${
              selected
                ? "bg-red-400 text-white hover:bg-red-600"
                : "bg-secondary hover:bg-gray-300"
            }`}
            onClick={() => setSelected(!selected)}
          >
            {selected ? <Minus size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="px-4 pb-4 text-sm text-gray-600">
          <p className="whitespace-pre-line">
            {description || "Sin descripción disponible."}
          </p>
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
