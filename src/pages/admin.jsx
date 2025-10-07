import { useState } from "react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/theme/default.css";
import { Header } from "../components/Header.jsx";
import ProfileButton from "../components/ProfileButton.jsx";
import { NavigationTab } from "../components/NavigationTab.jsx";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { Picker } from "../components/Picker.jsx";
import { Table } from "../components/Table.jsx";
import { TextField } from "../components/TextField.jsx";

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
    <div className="flex flex-col space-y-8 p-2 items-center w-full">
      <div className="w-full max-w-5xl p-3 flex flex-col md:flex-row items-center justify-center gap-6 border rounded-lg border-black/20 bg-white">
        <Picker text="Fecha de" options={statuses} onChange={setStatus} />

        <div className="flex p-4 items-center relative">
          <Calendar range={range} setRange={setRange} />
          <div className="flex flex-col ml-4">
            <span className="text-sm font-medium">Desde - Hasta</span>
            <span className="text-gray-500 text-sm font-normal font-primary">
              {`${format(range[0].startDate, "dd/MM/yy")} - ${format(
                range[0].endDate,
                "dd/MM/yy"
              )}`}
            </span>
          </div>
        </div>

        <Button text="Buscar" style="secondary" />
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <Table headers={headers} info={user}>
          <div className="flex flex-col items-center justify-center space-y-2 flex-1">
            <Button text="No se presento" style="bg-red-500 text-white w-full" />
          </div>
        </Table>
      </div>

      <div className="flex justify-center mt-6 space-x-4 w-full">
        <Button
          text="Hacer una reserva"
          style="primary"
          onClick={() => navigate("/")}
        />
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
    <main className="p-6 flex flex-col lg:flex-row flex-1 overflow-hidden space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="bg-white p-4 rounded-lg border-black/20 shadow-lg flex-1 overflow-x-auto">
        <h1 className="text-xl font-bold mb-4 text-center">Calendario de Reservas</h1>

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
              <th className="w-20 bg-gray-200 border border-gray-300 p-1 text-xs">Hab.</th>
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
                <td className="w-20 bg-gray-100 border border-gray-300 p-1 font-medium">{room}</td>
                {days.map((_, index) => {
                  const cellDate = getCellDate(date, index);
                  const res = getReservation(room, cellDate);
                  const blocked = isRoomBlocked(room, cellDate);

                  return (
                    <td
                      key={room + index}
                      className={`border border-gray-300 p-1 text-[11px] ${
                        res ? "bg-green-300 font-semibold" : blocked ? "bg-red-300 font-semibold" : "bg-white"
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
        <select className="border p-2 w-full mb-4" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          {rooms.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>

        <label className="block text-xs mb-2">Desde:</label>
        <input type="date" className="border p-2 w-full mb-4 h-8" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />

        <label className="block text-xs mb-2">Hasta:</label>
        <input type="date" className="border p-2 w-full mb-4 h-8" value={toDate} onChange={(e) => setToDate(e.target.value)} />

        <div className="flex space-x-2">
          <Button text="Cerrar" onClick={handleBlockRoom} style={"exit"}/>
          <Button text="Abrir" style="secondary" onClick={handleUnblockRoom} />
        </div>
      </div>
    </main>
  );
}

function Clients() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const statuses = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"];
  const headers = [
    "Nombre del cliente",
    "Tipo de documento",
    "Número de documento",
    "País de nacimiento",
    "Telefono",
    "Correo electronico",
  ];
  const user = [
    ["Cemelmin chaperra ", "Cédula de ciudadanía", "10203001310", "Veneco Hpta", "+59 300000", "usuario1@example.com"],
    ["Cliente B", "Pasaporte", "PA1234567", "Colombia", "+57 3200000000", "clienteB@example.com"],
  ];

  const [documento, setDocumento] = useState("");
  const [pais, setPais] = useState("");

  return (
    <div className="flex flex-col space-y-8 p-6 w-full">
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col md:flex-row items-center justify-center gap-6 border rounded-lg border-black/20 bg-white">
        <Picker text="Tipo de documento" options={statuses} onChange={setStatus} />


            <TextField placeholder="Número de documento" 
            type="text" required={true} 
            value={documento} 
            onChange={(e) => setDocumento(e.target.value)} 
            className="border border-black/30 rounded-lg p-2"/>

            <TextField placeholder="País de nacimiento" 
            type="text" required={true} value={pais} 
            onChange={(e) => setPais(e.target.value)} />


        <Button text="Buscar" style="secondary" />
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <Table headers={headers} info={user}>
        </Table>
      </div>

      <div className="flex justify-center mt-6 w-full">
        <Button text="Registrar un cliente" 
        style="primary" 
        onClick={() => navigate("/registUser")} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [nav, setNav] = useState(0);

  const options = [
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
    {
      id: "clientes",
      title: "Gestionar Clientes",
      icon: "/src/assets/icons/users.svg",
    },
  ];

  const renderContent = () => {
    switch (nav) {
      case 0:
        return <Reservations />;
      case 1:
        return <Schedule />;
      case 2:
        return <Clients />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
      <Header>
        <ProfileButton toPag={"/loginAdmin"} />
      </Header>

      <main className="bg-secondary flex-1 flex flex-col items-center p-8 space-y-8 w-full">
        <NavigationTab state={nav} setState={setNav} options={options} />

        <div className="w-fit  bg-white rounded-xl  shadow p-4">{renderContent()}</div>
      </main>
      <Footer />
    </div>
  );
}