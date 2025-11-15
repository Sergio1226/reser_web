import { useEffect, useState, useRef } from "react";
import { Button } from "../../components/Button.jsx";
import { CalendarSingle } from "../../components/Calendar.jsx";
import { getAllRoomsIds, getAllBookings } from "../../utils/Api.jsx";
import { Loading } from "../../components/Animate.jsx";

export function Schedule() {
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedReservation, setClickedReservation] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipPlacement, setTooltipPlacement] = useState("top");
  const tooltipRef = useRef(null);

  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const fetchRooms = async () => {
    const rooms = await getAllRoomsIds();
    setRooms(rooms);
  };

  const fetchBookings = async () => {
    const bookings = await getAllBookings();
    setReservations(bookings);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const normalizeDate = (d) => {
    if (typeof d === "string" && d.includes("-")) {
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  const getCellDate = (baseDate, index) => {
    const cellDate = new Date(baseDate);
    const day = cellDate.getDay();
    const diffToMonday = (day + 6) % 7;
    cellDate.setDate(cellDate.getDate() - diffToMonday + index);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate;
  };

  const getReservation = (room, cellDate) => {
    return reservations.find((res) => {
      if (!Array.isArray(res.habitaciones) || !res.habitaciones.includes(room))
        return false;
      const start = normalizeDate(res.start_date);
      const end = normalizeDate(res.end_date);
      return cellDate >= start && cellDate <= end;
    });
  };

  const getCheckinReservation = (room, cellDate) => {
    return reservations.find((res) => {
      if (!Array.isArray(res.habitaciones) || !res.habitaciones.includes(room))
        return false;
      const start = normalizeDate(res.start_date);
      return cellDate.getTime() === start.getTime();
    });
  };

  const getCheckoutReservation = (room, cellDate) => {
    return reservations.find((res) => {
      if (!Array.isArray(res.habitaciones) || !res.habitaciones.includes(room))
        return false;
      const end = normalizeDate(res.end_date);
      return cellDate.getTime() === end.getTime();
    });
  };

  /** CLICK en una reserva — NO hover */
  const handleClickReservation = (e, res, room) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const preferTop = spaceAbove > 120 || spaceAbove > spaceBelow;

    const centerX = rect.left + rect.width / 2;
    const clampedX = Math.min(Math.max(centerX, 12), window.innerWidth - 12);
    const posY = preferTop ? rect.top : rect.bottom;

    setTooltipPos({ x: clampedX, y: posY });
    setTooltipPlacement(preferTop ? "top" : "bottom");

    const start = normalizeDate(res.start_date);
    const end = normalizeDate(res.end_date);

    setClickedReservation({
      guest: res.guest,
      room,
      checkIn: start.toLocaleDateString(),
      checkOut: end.toLocaleDateString(),
    });
  };

  const closeReservationModal = () => setClickedReservation(null);

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mx-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📅</span> Calendario de reservas
        </h2>
        <p className="text-blue-100">
          Visualiza las reservas de habitaciones por semana
        </p>
      </div>

      {loading ? (
        <div className="w-full max-w-6xl mx-auto flex justify-center flex-col items-center py-8">
          <Loading />
          <p className="mt-4 text-gray-600">Buscando reservas...</p>
        </div>
      ) : (
        <main className="p-4 md:p-6 flex flex-col lg:flex-row flex-1 space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex-1">
            <h1 className="text-2xl font-bold mb-2 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calendario de Reservas
            </h1>

            <h3 className="text-center text-gray-600 mb-6 text-sm font-semibold">
              Semana del {(() => {
                const monday = getCellDate(date, 0);
                return monday.toLocaleDateString();
              })()}
            </h3>

            <div className="flex mb-6 items-center justify-center space-x-4">
              <Button
                iconName={"back"}
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setDate(date.getDate() - 7);
                  setDate(newDate);
                }}
              />
              <h2 className="text-center px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold">
                <CalendarSingle
                  date={date}
                  setDate={setDate}
                  label="text-white"
                  hasIcon={false}
                />
              </h2>
              <Button
                iconName={"next"}
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setDate(date.getDate() + 7);
                  setDate(newDate);
                }}
              />
            </div>

            {reservations.length === 0 ? (
              <p className="text-gray-600 text-center">
                No hay reservas para mostrar
              </p>
            ) : (
              <div className="w-full overflow-x-auto shadow-md rounded-lg relative">
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse text-center text-xs border-2 border-gray-200">
                    <thead>
                      <tr>
                        <th className="min-w-[80px] w-20 bg-gray-800 text-white border p-2 text-sm font-bold sticky left-0 z-20">
                          Hab.
                        </th>
                        {days.map((day, index) => {
                          const cellDate = getCellDate(date, index);
                          const isToday =
                            cellDate.toDateString() ===
                            new Date().toDateString();
                          return (
                            <th
                              key={day}
                              className={`min-w-[120px] border p-2 text-xs font-semibold ${
                                isToday
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {day}
                              <br />
                              <span className="text-[10px]">
                                {cellDate.toLocaleDateString()}
                              </span>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody>
                      {rooms.map((room) => (
                        <tr key={room}>
                          <td className="min-w-[80px] w-20 bg-gray-100 border p-2 font-bold sticky left-0 z-10">
                            {room}
                          </td>

                          {days.map((_, index) => {
                            const cellDate = getCellDate(date, index);
                            const checkoutRes = getCheckoutReservation(room, cellDate);
                            const checkinRes = getCheckinReservation(room, cellDate);
                            const res = getReservation(room, cellDate);

                            let cellContent;

                            const createCell = (r, roundClass) => (
                              <div
                                onClick={(e) => handleClickReservation(e, r, room)}
                                className={`flex h-full min-h-[40px] bg-green-400 text-gray-800 font-bold items-center justify-center py-2 cursor-pointer truncate px-1 ${roundClass}`}
                              >
                                {r.guest.split(" ")[0]}
                              </div>
                            );

                            if (checkoutRes && checkinRes) {
                              cellContent = (
                                <div className="flex h-full min-h-[40px]">
                                  {createCell(checkoutRes, "rounded-r-lg w-1/2")}
                                  {createCell(checkinRes, "rounded-l-lg w-1/2")}
                                </div>
                              );
                            } else if (res) {
                              const start = normalizeDate(res.start_date);
                              const end = normalizeDate(res.end_date);
                              const isStart =
                                cellDate.getTime() === start.getTime();
                              const isEnd = cellDate.getTime() === end.getTime();

                              if (isStart && isEnd)
                                cellContent = createCell(res, "rounded-lg");
                              else if (isStart)
                                cellContent = createCell(res, "rounded-l-lg");
                              else if (isEnd)
                                cellContent = createCell(res, "rounded-r-lg");
                              else cellContent = createCell(res, "");
                            } else {
                              cellContent = (
                                <div className="bg-white text-gray-600 flex items-center justify-center py-2 min-h-[40px]">
                                  Libre
                                </div>
                              );
                            }

                            return (
                              <td
                                key={room + index}
                                className="min-w-[120px] border p-0 text-[11px]"
                              >
                                {cellContent}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {clickedReservation && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
                      onClick={closeReservationModal}
                  >
                    <div
                      className="bg-white rounded-xl shadow-xl p-6 w-80 animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-lg font-bold mb-2 text-gray-800">
                        {clickedReservation.guest}
                      </h2>

                      <p className="text-gray-700">
                        <span className="font-semibold">Habitación:</span>{" "}
                        {clickedReservation.room}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Check-in:</span>{" "}
                        {clickedReservation.checkIn}
                      </p>
                      <p className="text-gray-700 mb-4">
                        <span className="font-semibold">Check-out:</span>{" "}
                        {clickedReservation.checkOut}
                      </p>

                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg shadow"
                        onClick={closeReservationModal}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}