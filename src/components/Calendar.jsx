import { useState } from "react";
import {Icon} from "./Icon.jsx";
import { DateRange } from "react-date-range";

export function Calendar({ range, setRange }) {
  const [showCalendar, setShowCalendar] = useState(false);
  return (
    <div>
      <Icon
        name={"Calendar"}
        alt="Calendario"
        style=" size-item cursor-pointer hover:scale-110 transition active:scale-90"
        onClick={() => setShowCalendar(!showCalendar)}
      />            
      {showCalendar && (
        <div className="absolute shadow-lg rounded-lg bg-white z-10">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setRange([item.selection]);
              if (item.selection.startDate !== item.selection.endDate) {
                setShowCalendar(false);
              }
            }}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
        </div>
      )}
    </div>
  );
}
