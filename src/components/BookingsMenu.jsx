import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BookingsMenu({state}) {
    const [active, setActive] = useState(state);
    const navigate = useNavigate();


    return (
        <div
            className="w-[900px] h-44 pl-8 pr-3 py-3 bg-white rounded-xl shadow-[0px_6px_12px_0px_rgba(19,94,172,0.12)] outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center space-x-5"
            onMouseLeave={() => setActive(state)}
        >

            <button
                className="w-72 h-24 flex flex-col items-center justify-center relative"
                onMouseEnter={() => setActive("realizar")}
                onClick={() => navigate("/bookings")}
            >
                <div className="flex items-center justify-center space-x-4 flex-1">
                    <img src="src/assets/icons/Booking.svg" className="w-10 h-10 mb-1" />
                    <span className="text-[26px] font-medium text-neutral-700">
                    Realizar Reservas
                    </span>
                </div>
                <div
                className={`w-full h-3 transition-colors ${
                    active === "realizar" ? "bg-green-900" : "bg-button_bookings"
                }`}
                ></div>
                
            </button>

            <button
                className="w-72 h-24 flex flex-col items-center justify-center relative"
                onMouseEnter={() => setActive("visualizar")}
                onClick={() => navigate("/seeBookings")}
            >
                <div className="flex items-center justify-center space-x-4 flex-1">
                    <img src="src/assets/icons/List.svg" className="w-10 h-10 mb-1" />
                    <span className="text-[26px] font-medium text-neutral-700">
                    Visualizar Reservas
                    </span>
                </div>
                <div
                className={`w-full h-3 transition-colors ${
                    active === "visualizar" ? "bg-green-900" : "bg-button_bookings"
                }`}
                ></div>
            </button>
        </div>
    )

}