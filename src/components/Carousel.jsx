import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ images = [], height = "h-48", className = "" }) {
  const [current, setCurrent] = useState(0);

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (current + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex];
    }
  }, [current, images]);

  if (images.length === 0) return null;

  return (
    <div className={`relative w-full ${className} rounded-2xl overflow-hidden`}>
      <img
        src={images[current]}
        alt={`Imagen ${current + 1}`}
        className={`w-full ${height} object-contain transition-all duration-300 bg-gray-100`}
        loading="lazy"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}