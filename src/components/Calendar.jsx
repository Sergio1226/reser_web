import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon.jsx";
import { DateRange, Calendar as CalendarComponent } from "react-date-range";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";


export function Calendar({ range, setRange ,minDate=new Date()}) {
  const [showCalendar, setShowCalendar] = useState(false);
   const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={ref} >
      <Icon
        name={"calendar"}
        alt="Calendario"
        style=" size-item cursor-pointer hover:scale-110 transition active:scale-90"
        onClick={() => setShowCalendar(!showCalendar)}
      />
      {showCalendar && (
        <div className="absolute shadow-lg rounded-lg bg-white z-10">
         <DateRange
  editableDateInputs={true}
  onChange={(item) => {
    const { startDate, endDate } = item.selection;

    if (startDate.getTime() === endDate.getTime()) {
      const adjustedEnd = addDays(endDate, 1);
      setRange([{ startDate, endDate: adjustedEnd, key: "selection" }]);
    } else {
      setRange([item.selection]);
    }

    if (startDate !== endDate) setShowCalendar(false);
  }}
  moveRangeOnFirstSelection={false}
  ranges={range}
  minDate={minDate}
  locale={es}
/>
        </div>
      )}
    </div>
  );
}

export function CalendarSingle({ date, setDate, label ,hasIcon=true}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={ref} className="relative w-full">
      <div
        className="flex items-center gap-2 cursor-pointer "
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {hasIcon && <Icon name={"calendar"}  />}
        <span className={`text-gray-600 text-sm font-bold select-none ${label}`}>
          {format(date, "dd/MM/yy")}
        </span>
      </div>

      {showCalendar && (
        <div className="absolute bottom-full mt-2 right-0 z-50 bg-white rounded-lg shadow-2xl border border-gray-200">
          <CalendarComponent
            date={date}
            onChange={(newDate) => {
              setDate(newDate);
              setShowCalendar(false);
            }}
            locale={es}
            color="#2563eb"
          />
        </div>
      )}
    </div>
  );
}