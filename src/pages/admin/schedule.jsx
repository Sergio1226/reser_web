import { useEffect, useState } from "react";
import { Button } from "../../components/Button.jsx";
import { CalendarSingle } from "../../components/Calendar.jsx";
import { getAllRoomsIds, getAllBookings } from "../../utils/Api.jsx";
import { Loading } from "../../components/Animate.jsx";

export function Schedule() {
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredReservation, setHoveredReservation] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

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

  const handleTooltip = (e, res, room) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y - 10 });
    const start = normalizeDate(res.start_date);
    const end = normalizeDate(res.end_date);
    setHoveredReservation({
      guest: res.guest,
      room,
      checkIn: start.toLocaleDateString(),
      checkOut: end.toLocaleDateString(),
    });
  };

  const hideTooltip = () => setHoveredReservation(null);

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
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calendario de Reservas
            </h1>

            <div className="flex mb-6 items-center justify-center space-x-4">
              <Button
                iconName={"back"}
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setDate(date.getDate() - 7);
                  setDate(newDate);
                }}
                className={"shadow-none hover:shadow-none"}
              />
              <h2 className="text-center px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 hover:-translate-y-0.5">
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
                className={"shadow-none hover:shadow-none"}
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
                        <th className="min-w-[80px] w-20 bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-400 p-2 text-sm font-bold sticky left-0 z-20">
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
                              className={`min-w-[120px] border border-gray-300 p-2 text-xs leading-tight font-semibold transition-colors ${
                                isToday
                                  ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md"
                                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700"
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
                        <tr key={room} className="hover:bg-gray-50 transition-colors">
                          <td className="min-w-[80px] w-20 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 p-2 font-bold text-gray-700 sticky left-0 z-10">
                            {room}
                          </td>

                          {days.map((_, index) => {
                            const cellDate = getCellDate(date, index);
                            const checkoutRes = getCheckoutReservation(room, cellDate);
                            const checkinRes = getCheckinReservation(room, cellDate);
                            const res = getReservation(room, cellDate);

                            let cellContent;

                            if (
                              checkoutRes &&
                              checkinRes &&
                              (checkoutRes.start_date !== checkinRes.start_date ||
                                checkoutRes.end_date !== checkinRes.end_date)
                            ) {

                              cellContent = (
                                <div className="flex h-full min-h-[40px]">
                                  <div
                                    onMouseEnter={(e) => handleTooltip(e, checkoutRes, room)}
                                    onMouseLeave={hideTooltip}
                                    className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-r-lg text-[10px] cursor-pointer truncate px-1"
                                    title={checkoutRes.guest}
                                  >
                                    {checkoutRes.guest.split(" ")[0]}
                                  </div>
                                  <div
                                    onMouseEnter={(e) => handleTooltip(e, checkinRes, room)}
                                    onMouseLeave={hideTooltip}
                                    className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-l-lg text-[10px] cursor-pointer truncate px-1"
                                    title={checkinRes.guest}
                                  >
                                    {checkinRes.guest.split(" ")[0]}
                                  </div>
                                </div>
                              );
                            } else if (res) {

                              const start = normalizeDate(res.start_date);
                              const end = normalizeDate(res.end_date);
                              const isStart = cellDate.getTime() === start.getTime();
                              const isEnd = cellDate.getTime() === end.getTime();

                              if (isStart && isEnd) {
                                cellContent = (
                                  <div
                                    onMouseEnter={(e) => handleTooltip(e, res, room)}
                                    onMouseLeave={hideTooltip}
                                    className="flex h-full min-h-[40px] bg-gradient-to-br from-green-300 to-emerald-400 text-gray-800 font-bold items-center justify-center py-2 rounded-lg cursor-pointer"
                                  >
                                    {res.guest.split(" ")[0]}
                                  </div>
                                );
                              } else if (isStart) {
                                cellContent = (
                                  <div
                                    onMouseEnter={(e) => handleTooltip(e, res, room)}
                                    onMouseLeave={hideTooltip}
                                    className="flex h-full min-h-[40px] bg-gradient-to-br from-green-300 to-emerald-400 text-gray-800 font-bold items-center justify-center py-2 rounded-l-lg cursor-pointer"
                                  >
                                    {res.guest.split(" ")[0]}
                                  </div>
                                );
                              } else if (isEnd) {
                                cellContent = (
                                  <div
                                    onMouseEnter={(e) => handleTooltip(e, res, room)}
                                    onMouseLeave={hideTooltip}
                                    className="flex h-full min-h-[40px] bg-gradient-to-br from-green-300 to-emerald-400 text-gray-800 font-bold items-center justify-center py-2 rounded-r-lg cursor-pointer"
                                  >
                                    {res.guest.split(" ")[0]}
                                  </div>
                                );
                              } else {
                                cellContent = (
                                  <div
                                    onMouseEnter={(e) => handleTooltip(e, res, room)}
                                    onMouseLeave={hideTooltip}
                                    className="bg-gradient-to-br from-green-300 to-emerald-400 text-gray-800 font-bold flex items-center justify-center py-2 h-full min-h-[40px] cursor-pointer"
                                  >
                                    {res.guest.split(" ")[0]}
                                  </div>
                                );
                              }
                            } else {
                              cellContent = (
                                <div className="bg-white text-gray-600 hover:bg-blue-50 flex items-center justify-center py-2 h-full min-h-[40px]">
                                  Libre
                                </div>
                              );
                            }

                            return (
                              <td
                                key={room + index}
                                className="min-w-[120px] border border-gray-300 p-0 text-[11px] font-medium relative"
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

                {hoveredReservation && (
                  <div
                    className="absolute bg-white border border-gray-300 rounded-lg shadow-xl px-4 py-2 text-xs text-gray-800 z-50 transition-all duration-150"
                    style={{
                      top: tooltipPos.y - 40,
                      left: tooltipPos.x,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <p className="font-bold text-sm">{hoveredReservation.guest}</p>
                    <p>Habitación: {hoveredReservation.room}</p>
                    <p>Check-in: {hoveredReservation.checkIn}</p>
                    <p>Check-out: {hoveredReservation.checkOut}</p>
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