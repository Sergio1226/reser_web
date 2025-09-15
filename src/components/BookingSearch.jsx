import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export function BookingSearch(){

    const [showCalendar, setShowCalendar] = useState(false);
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
                src="src/assets/calendar.png"
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
                <span className="text-neutral-700 text-sm font-medium font-['Poppins']">
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
        <div className="flex-1"></div>
        <div className="flex-1"></div>
        <div className="flex-1"></div>
        <div className="flex-1"></div>
    </div>
    )

}