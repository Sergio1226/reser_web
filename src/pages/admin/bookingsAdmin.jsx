import { useState } from "react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/theme/default.css";
import { Header } from "../../components/Header.jsx";
import ProfileButton from "../../components/ProfileButton.jsx";
import { NavigationTab } from "../../components/NavigationTab.jsx";
import { Button } from "../../components/Button.jsx";
import { SmallFooter } from "../../components/Footer.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import { Picker } from "../../components/Picker.jsx";
import { Table } from "../../components/Table.jsx";
import { TextField } from "../../components/TextField.jsx";

export default function BookingAdmin() {
  const [nav, setNav] = useState(0);
  const navigate = useNavigate();

  const options = [
    {
      id: "agregar",
      title: "Agregar reserva",
      icon: "/src/assets/icons/Booking.svg",
    },
    {
      id: "reservas",
      title: "Gestionar Reservas",
      icon: "/src/assets/icons/List.svg",
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: "/src/assets/icons/calendar.svg",
    },
  ];

  const renderContent = () => {
    switch (nav) {
      case 0:
        return <Reservations />;
      case 1:
        return <Reservations />;
      case 2:
        return <Schedule />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gradient_1 to-secondary min-h-screen flex flex-col font-primary">
      <Header>
        <div className="flex flex-col justify-center items-center space-y-2 mt-4 mr-8">
          <Button
            text="Atrás"
            style="exit"
            onClick={() => {
              navigate("/dashboard");
            }}
            iconName="Back"
          />
          <ProfileButton toPag={"/login"} />
        </div>
      </Header>
      <main className="flex flex-col flex-1 items-center p-8">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-black-200 overflow-hidden ">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 ">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Administracion de Reservas
              </h1>
              <p className="text-green-100 text-center">
                Gestiona tus reservas de manera fácil y rápida.
              </p>
            </div>
            <div className="py-4 mt-6 flex justify-center items-center">
              <NavigationTab state={nav} setState={setNav} options={options} />
            </div>

            <div className="px-8 py-2">{renderContent()}</div>
          </div>
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}

function Reservations() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const statuses = ["Confirmado", "Cancelado", "Pendiente"];
  const headers = [
    "Nombre del cliente",
    "Fecha de entrada",
    "Fecha de salida",
    "Habitacion(es)",
    "Fecha de reservación",
    "Estado de reserva",
    "Precio",
  ];
  const user = [
    [
      "Cliente A",
      "29/11/2025",
      "31/11/2025",
      "Pericos",
      "30/09/2025",
      "Confirmada",
      "$840.000",
    ],
    [
      "Cliente B",
      "29/11/2025",
      "31/11/2025",
      "Pericos",
      "30/09/2025",
      "Confirmada",
      "$840.000",
    ],
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg  mx-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          Reservas de clientes
        </h2>
        <p className="text-blue-100">
          Gestiona y visualiza todas las reservas del hospedaje
        </p>
      </div>

      <div className="flex flex-col space-y-6 p-6 md:p-8 items-center w-full">
        <div className="w-full max-w-6xl p-6 flex flex-col md:flex-row items-center justify-center gap-6 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <div className="flex-shrink-0">
            <Picker text="Fecha de" options={statuses} onChange={setStatus} />
          </div>

          <div className="flex p-4 items-center relative bg-white rounded-lg shadow-sm border border-gray-200">
            <Calendar range={range} setRange={setRange} />
            <div className="flex flex-col ml-4">
              <span className="text-sm font-semibold text-gray-700">
                Desde - Hasta
              </span>
              <span className="text-gray-600 text-sm font-medium">
                {`${format(range[0].startDate, "dd/MM/yy")} - ${format(
                  range[0].endDate,
                  "dd/MM/yy"
                )}`}
              </span>
            </div>
          </div>

          <Button text="Buscar" style="secondary" />
        </div>

        <Table headers={headers} info={user}>
          <div className="flex flex-col items-center justify-center space-y-2 flex-1 p-2">
            <Button
              text="No se presentó"
              style="bg-red-500 hover:bg-red-600 text-white w-full transition-colors duration-200 shadow-md"
            />
          </div>
        </Table>

        <div className="flex justify-center mt-8 space-x-4 w-full">
          <Button
            text="Hacer una reserva"
            style="primary"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    </div>
  );
}

function Schedule() {
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
      {
        room: selectedRoom,
        from,
        to,
      },
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
    <div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg  mx-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📅</span>
          Calendario de reservas
        </h2>
        <p className="text-blue-100">
          Visualiza las reservas de habitaciones por semana
        </p>
      </div>
      <main className="p-4 md:p-6 flex flex-col lg:flex-row flex-1 overflow-hidden space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex-1 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Calendario de Reservas
          </h1>

          <div className="flex mb-6 items-center justify-center space-x-4">
            <Button
              iconName={"Back"}
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 7);
                setDate(newDate);
              }}
              style={"shadow-md hover:shadow-lg transition-shadow"}
            />
            <h2 className="text-center px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md">
              Semana del {date.toLocaleDateString()}
            </h2>
            <Button
              iconName={"Next"}
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 7);
                setDate(newDate);
              }}
              style={"shadow-md hover:shadow-lg transition-shadow"}
            />
          </div>

          <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-md">
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
                  <tr key={room} className="hover:bg-gray-50 transition-colors">
                    <td className="w-20 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 p-2 font-bold text-gray-700">
                      {room}
                    </td>
                    {days.map((_, index) => {
                      const cellDate = getCellDate(date, index);
                      const res = getReservation(room, cellDate);
                      const blocked = isRoomBlocked(room, cellDate);

                      return (
                        <td
                          key={room + index}
                          className={`border border-gray-300 p-2 text-[11px] font-medium transition-all ${
                            res
                              ? "bg-gradient-to-br from-green-300 to-emerald-400 text-gray-800 font-bold shadow-inner"
                              : blocked
                              ? "bg-gradient-to-br from-red-300 to-rose-400 text-gray-800 font-bold shadow-inner"
                              : "bg-white text-gray-600 hover:bg-blue-50"
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
        </div>

        <div className="w-full lg:w-72 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border-2 border-gray-200 flex-shrink-0">
          <h2 className="font-bold text-lg mb-6 text-gray-800 pb-3 border-b-2 border-indigo-500">
            Gestión de Habitaciones
          </h2>

          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Habitación:
          </label>
          <select
            className="border-2 border-gray-300 rounded-lg p-3 w-full mb-5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white shadow-sm"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                Habitación {room}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Desde:
          </label>
          <input
            type="date"
            className="border-2 border-gray-300 rounded-lg p-3 w-full mb-5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none shadow-sm"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Hasta:
          </label>
          <input
            type="date"
            className="border-2 border-gray-300 rounded-lg p-3 w-full mb-6 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none shadow-sm"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <div className="flex flex-col space-y-3">
            <Button
              text="Cerrar Habitación"
              onClick={handleBlockRoom}
              style={"exit w-full shadow-md hover:shadow-lg transition-all"}
            />
            <Button
              text="Abrir Habitación"
              style="secondary w-full shadow-md hover:shadow-lg transition-all"
              onClick={handleUnblockRoom}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Clients() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const statuses = [
    "Cédula de ciudadanía",
    "Cédula de extranjería",
    "Pasaporte",
  ];
  const headers = [
    "Nombre del cliente",
    "Tipo de documento",
    "Número de documento",
    "País de nacimiento",
    "Telefono",
    "Correo electronico",
  ];
  const user = [
    [
      "Cemelmin chaperra ",
      "Cédula de ciudadanía",
      "10203001310",
      "Veneco Hpta",
      "+59 300000",
      "usuario1@example.com",
    ],
    [
      "Cliente B",
      "Pasaporte",
      "PA1234567",
      "Colombia",
      "+57 3200000000",
      "clienteB@example.com",
    ],
  ];

  const [documento, setDocumento] = useState("");
  const [pais, setPais] = useState("");

  return (
    <div className="flex flex-col space-y-6 p-6 md:p-8 w-full">
      <div className="w-full max-w-6xl mx-auto p-6 flex flex-col md:flex-row items-center justify-center gap-6 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md">
        <div className="flex-shrink-0">
          <Picker
            text="Tipo de documento"
            options={statuses}
            onChange={setStatus}
          />
        </div>

        <TextField
          placeholder="Número de documento"
          type="text"
          required={true}
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          className="border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none shadow-sm bg-white"
        />

        <TextField
          placeholder="País de nacimiento"
          type="text"
          required={true}
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className="border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none shadow-sm bg-white"
        />

        <Button text="Buscar" style="secondary" />
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <Table headers={headers} info={user}></Table>
        </div>
      </div>

      <div className="flex justify-center mt-8 w-full">
        <Button
          text="Registrar un cliente"
          style="primary"
          onClick={() => navigate("/registUser")}
        />
      </div>
    </div>
  );
}
