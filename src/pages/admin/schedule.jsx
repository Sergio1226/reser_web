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
      if (res.room_id !== room) return false;
      const start = normalizeDate(res.start_date);
      const end = normalizeDate(res.end_date);
      return cellDate >= start && cellDate <= end;
    });
  };
  const getCheckoutReservation = (room, cellDate) => {
    return reservations.find((res) => {
      if (res.room_id !== room) return false;
      const end = normalizeDate(res.end_date);
      return cellDate.getTime() === end.getTime();
    });
  };
  const getCheckinReservation = (room, cellDate) => {
    return reservations.find((res) => {
      if (res.room_id !== room) return false;
      const start = normalizeDate(res.start_date);
      return cellDate.getTime() === start.getTime();
    });
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mx-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📅</span>
          Calendario de reservas
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
              <div className="rounded-lg border-2 border-gray-200 shadow-md overflow-hidden">
                <table className="table-fixed w-full border-collapse text-center text-xs">
                  <thead>
                    <tr>
                      <th className="w-20 bg-gradient-to-br from-gray-700 to-gray-800 text-white border border-gray-400 p-2 text-sm font-bold">
                        Hab.
                      </th>
                      {days.map((day, index) => {
                        const cellDate = getCellDate(date, index);
                        const isToday =
                          cellDate.toDateString() === new Date().toDateString();
                        return (
                          <th
                            key={day}
                            className={`border border-gray-300 p-2 text-xs leading-tight break-words font-semibold transition-colors ${
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
                      <tr
                        key={room}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="w-20 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 p-2 font-bold text-gray-700">
                          {room}
                        </td>
                        {days.map((_, index) => {
                          const cellDate = getCellDate(date, index);
                          const checkoutRes = getCheckoutReservation(
                            room,
                            cellDate
                          );
                          const checkinRes = getCheckinReservation(
                            room,
                            cellDate
                          );
                          const res = getReservation(room, cellDate);

                          let cellContent;
                          let cellClass =
                            "border border-gray-300 p-0 text-[11px] font-medium transition-all relative";
                          if (
                            checkoutRes &&
                            checkinRes &&
                            (checkoutRes.start_date !== checkinRes.start_date ||
                              checkoutRes.end_date !== checkinRes.end_date)
                          ) {
                            cellContent = (
                              <div className="flex h-full">
                                <div className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-r-lg text-[10px]">
                                  {checkoutRes.guest}
                                </div>
                                <div className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-l-lg text-[10px]">
                                  {checkinRes.guest}
                                </div>
                              </div>
                            );
                          } else if (res) {
                            const start = normalizeDate(res.start_date);
                            const end = normalizeDate(res.end_date);

                            const isStart =
                              cellDate.getTime() === start.getTime();
                            const isEnd = cellDate.getTime() === end.getTime();

                            if (isStart && isEnd) {
                              cellContent = (
                                <div className="flex h-full">
                                  <div className="w-1/2 bg-white"></div>
                                  <div className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-l-lg">
                                    {res.guest}
                                  </div>
                                </div>
                              );
                            } else if (isStart) {
                              cellContent = (
                                <div className="flex h-full">
                                  <div className="w-1/2 bg-white"></div>
                                  <div className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-l-lg">
                                    {res.guest}
                                  </div>
                                </div>
                              );
                            } else if (isEnd) {
                              cellContent = (
                                <div className="flex h-full">
                                  <div className="w-1/2 bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-gray-800 font-bold py-2 rounded-r-lg">
                                    {res.guest}
                                  </div>
                                  <div className="w-1/2 bg-white"></div>
                                </div>
                              );
                            } else {
                              cellContent = (
                                <div className="bg-gradient-to-br from-green-300 to-emerald-400 text-gray-800 font-bold flex items-center justify-center py-2 h-full">
                                  {res.guest}
                                </div>
                              );
                            }
                          } else {
                            cellContent = (
                              <div className="bg-white text-gray-600 hover:bg-blue-50 flex items-center justify-center py-2 h-full">
                                Libre
                              </div>
                            );
                          }

                          return (
                            <td key={room + index} className={cellClass}>
                              {cellContent}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
