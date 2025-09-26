import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BookingsMenu({ state, options }) {
  const [active, setActive] = useState(state);
  const navigate = useNavigate();

  return (
    <div
      className="w-[900px] h-44 pl-8 pr-3 py-3 bg-white rounded-xl shadow-[0px_6px_12px_0px_rgba(19,94,172,0.12)] outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center space-x-5 border-2 border-black"
      onMouseLeave={() => setActive(state)}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          className="w-72 h-24 flex flex-col items-center justify-center relative"
          onMouseEnter={() => setActive(opt.id)}
          onClick={() => navigate(opt.route)}
        >
          <div className="flex items-center justify-center space-x-4 flex-1">
            <img src={opt.icon} className="w-10 h-10 mb-1" alt={opt.title} />
            <span className="text-[26px] font-medium text-neutral-700">
              {opt.title}
            </span>
          </div>
          <div
            className={`w-full h-3 transition-colors ${
              active === opt.id ? "bg-green-900" : "bg-button_bookings"
            }`}
          ></div>
        </button>
      ))}
    </div>
  );
}