import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";

const rooms = ["101", "102", "103", "104"];
const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const initialReservations = [
  {
    room: "101",
    guest: "Carlos",
    startDate: "2025-09-29",
    endDate: "2025-09-30", 
  },
  {
    room: "102",
    guest: "Ana",
    startDate: "2025-09-30",
    endDate: "2025-10-01",
  },
];

export default function Schedule() {
  const [reservations] = useState(initialReservations);
  const [blockedRooms, setBlockedRooms] = useState([]);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const normalizeDate = (d) => {
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

  const handleBlockRoom = () => {
    if (!fromDate || !toDate) return;

    const from = normalizeDate(fromDate);
    const to = normalizeDate(toDate);

    setBlockedRooms([
      ...blockedRooms,
      { room: selectedRoom, from, to },
    ]);
  };

  const handleUnblockRoom = () => {
    if (!fromDate || !toDate) return;

    const from = normalizeDate(fromDate);
    const to = normalizeDate(toDate);

    setBlockedRooms(
      blockedRooms.flatMap((block) => {
        if (block.room !== selectedRoom) return [block];

        if (block.to < from || block.from > to) return [block];

        const newBlocks = [];

        if (block.from < from) {
          newBlocks.push({
            room: block.room,
            from: block.from,
            to: new Date(from.getTime() - 86400000),
          });
        }

        if (block.to > to) {
          newBlocks.push({
            room: block.room,
            from: new Date(to.getTime() + 86400000),
            to: block.to,
          });
        }

        return newBlocks;
      })
    );
  };

  const isRoomBlocked = (room, cellDate) => {
    return blockedRooms.some((block) => {
      if (block.room !== room) return false;
      return cellDate >= block.from && cellDate <= block.to;
    });
  };

  const getReservation = (room, cellDate) => {
    return reservations.find((res) => {
      if (res.room !== room) return false;
      const start = normalizeDate(res.startDate);
      const end = normalizeDate(res.endDate);
      return cellDate >= start && cellDate < end;
    });
  };

  return (

      <main className="p-6 bg-secondary flex flex-col lg:flex-row flex-1 overflow-hidden space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="bg-white p-4 rounded-lg border-black/20 shadow-lg flex-1 overflow-x-auto">
          <h1 className="text-xl font-bold mb-4 text-center">
            Calendario de Reservas
          </h1>

          <div className="flex mb-4 items-center justify-center space-x-4">
            <Button
              iconName={"Back"}
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 7);
                setDate(newDate);
              }}
              style={"shadow-none"}
            />
            <h2 className="text-center px-3 py-1 bg-secondary rounded-md text-xs">
              Semana del {date.toLocaleDateString()}
            </h2>
            <Button
              iconName={"Next"}
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 7);
                setDate(newDate);
              }}
              style={"shadow-none"}
            />
          </div>

          <table className="table-fixed w-full border-collapse border border-gray-300 text-center text-xs">
            <thead>
              <tr>
                <th className="w-20 bg-gray-200 border border-gray-300 p-1 text-xs">
                  Hab.
                </th>
                {days.map((day, index) => {
                  const cellDate = getCellDate(date, index);
                  return (
                    <th
                      key={day}
                      className={`border border-gray-300 p-1 text-[10px] leading-tight break-words ${
                        cellDate.toDateString() === new Date().toDateString()
                          ? "bg-green-400"
                          : "bg-gray-100"
                      }`}
                    >
                      {day}
                      <br />
                      {cellDate.toLocaleDateString()}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room}>
                  <td className="w-20 bg-gray-100 border border-gray-300 p-1 font-medium">
                    {room}
                  </td>
                  {days.map((_, index) => {
                    const cellDate = getCellDate(date, index);
                    const res = getReservation(room, cellDate);
                    const blocked = isRoomBlocked(room, cellDate);

                    return (
                      <td
                        key={room + index}
                        className={`border border-gray-300 p-1 text-[11px] ${
                          res
                            ? "bg-green-300 font-semibold"
                            : blocked
                            ? "bg-red-300 font-semibold"
                            : "bg-white"
                        }`}
                      >
                        {res ? res.guest : blocked ? "Cerrada" : "Libre"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-64 bg-white p-4 rounded-lg shadow-md flex-shrink-0">
          <h2 className="font-bold text-base mb-4">Gestión de Habitaciones</h2>
          <label className="block text-xs mb-2">Habitación:</label>
          <select
            className="border p-2 w-full mb-4"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          <label className="block text-xs mb-2">Desde:</label>
          <input
            type="date"
            className="border p-2 w-full mb-4 h-8"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <label className="block text-xs mb-2">Hasta:</label>
          <input
            type="date"
            className="border p-2 w-full mb-4 h-8"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <div className="flex space-x-2">
            <Button text="Cerrar" onClick={handleBlockRoom} />
            <Button
              text="Abrir"
              style="bg-green-500 hover:bg-green-600"
              onClick={handleUnblockRoom}
            />
          </div>
        </div>
      </main>

  );
}


