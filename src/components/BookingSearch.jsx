import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { Button } from "./Button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export function BookingSearch(){

    const [showCalendar, setShowCalendar] = useState(false);
    const [countAdults, setCountAdults] = useState(1);
    const [countChildrens, setCountChildrens] = useState(0);
    const [countRooms, setCountRooms] = useState(1);
    const [range, setRange] = useState([
        {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
        },
    ]);

    return(
    <div className="w-full h-32 flex flex-row bg-white divide-x-2 divide-black">
        <div className="flex-1 flex flex-row items-center space-x-4">

            <div className="relative">
                <img
                src="src/assets/icons/calendar.svg"
                alt="Calendario"
                className="w-20 h-10 cursor-pointer hover:scale-110 transition"
                onClick={() => setShowCalendar(!showCalendar)}
                />
                {showCalendar && (
                <div className="absolute top-12 left-0 shadow-lg rounded-lg bg-white p-2 z-10">
                    <DateRange
                    editableDateInputs={true}
                    onChange={(item) => {
                        setRange([item.selection]);
                        setShowCalendar(false);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    />
                </div>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-neutral-700 text-sm font-medium ">
                Check In - Check Out
                </span>
                <span className="text-zinc-400 text-sm font-normal font-['Poppins']">
                {`${format(range[0].startDate, "EEE dd MMM, yyyy")}  -  ${format(
                    range[0].endDate,
                    "EEE dd MMM, yyyy"
                )}`}
                </span>
            </div>
        </div>
        <div className="flex-1 flex flex-row items-center space-x-4">

            <img
                src="src/assets/icons/Guest.svg"
                alt="Huespedes"
                className="w-20 h-10"
            />

            <div className="flex flex-col">
                <div className="justify-start text-neutral-700 text-sm font-medium leading-normal">Numero de Huespedes</div>
                <div className="self-stretch justify-start text-zinc-500 text-base font-medium leading-loose">Adultos</div>
                <div className="flex flex-row">

                    <button
                        onClick={() => countAdults > 1 && setCountAdults(countAdults - 1)}
                        className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white text-sm font-bold"
                    >
                        -
                    </button>

                    <span className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-white border text-sm font-semibold">
                        {countAdults}
                    </span>

                    <button
                        onClick={() => setCountAdults(countAdults + 1)}
                        className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                    >
                        +
                    </button>

                </div>
                <div className="self-stretch justify-start text-zinc-500 text-base font-medium leading-loose">Niños</div>

                <div className="flex flex-row">

                    <button
                        onClick={() => countChildrens > 0 && setCountChildrens(countChildrens - 1)}
                        className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white text-sm font-bold"
                    >
                        -
                    </button>

                    <span className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-white border text-sm font-semibold">
                        {countChildrens}
                    </span>

                    <button
                        onClick={() => setCountChildrens(countChildrens + 1)}
                        className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                    >
                        +
                    </button>

                </div>

            </div>
            
        </div>
        <div className="flex-1 flex flex-row items-center space-x-4">

            <img
                src="src/assets/icons/bed.svg"
                alt="Habitaciones"
                className="w-20 h-10"
            />

            <div className="flex flex-col space-y-2">
                <div className="justify-start text-neutral-700 text-sm font-medium leading-normal">Numero de Habitaciones</div>

                <div className="flex flex-row">

                <button
                    onClick={() => countRooms > 1 && setCountRooms(countRooms - 1)}
                    className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white text-sm font-bold"
                >
                    -
                </button>

                <span className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-white border text-sm font-semibold">
                    {countRooms}
                </span>

                <button
                    onClick={() => setCountRooms(countRooms + 1)}
                    className="h-5 w-5 flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-bold"
                >
                    +
                </button>


                </div>
            
            </div>

            
        </div>

        <div className="flex-1 flex items-center justify-center">

            <Button
                text="Buscar"
                style="w-40 h-[50px] bg-secondary"
                onClick={() => navigate("/")}
                iconName="Search"
            />

        </div>
    </div>
    )

}