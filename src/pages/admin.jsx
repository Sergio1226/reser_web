import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/theme/default.css";
import { Header } from "../components/Header.jsx";
import ProfileButton from "../components/ProfileButton.jsx";
import { NavigationTab } from "../components/NavigationTab.jsx";
import { Icon } from "../components/Icon.jsx";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { Picker } from "../components/Picker.jsx";
import { Table } from "../components/Table.jsx";
import Schedule from "./schedule.jsx";

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
       "Ch homosexual",
       "29/11/2025",
       "31/11/2025",
       "Pericos",
       "30/09/2025",
       "Confirmada",
       "$840.000",
    ],
    [
       "Ch gay",
       "29/11/2025",
       "31/11/2025",
       "Pericos",
       "30/09/2025",
       "Confirmada",
       "$840.000",
    ],
  ];

  return (  
    <div className="flex flex-col space-y-8 p-2 items-center">
      <div className="w-fit  p-3 flex flex-col md:flex-row items-center justify-center space-x-4 border rounded-lg border-black/20">
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

        <Button
          text="Buscar"
          style="bg-blue-500 text-white px-4 py-2 rounded-lg"
        />
      </div>
      <Table headers={headers} info={user}>
        <div className="flex flex-col items-center justify-center space-y-2 flex-1">
          <Button text="No se presento" style="bg-red-500 text-white w-full" />
        </div>
      </Table>
      <div className="flex justify-center mt-6 space-x-4">
        <Button
          text="Hacer una reserva"
          style="bg-green-500 text-white px-6 py-2"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

function Rooms() {
  return <div className="p-4">Contenido: Gestionar Habitaciones</div>;
}

function Clients() {
  return <div className="p-4">Contenido: Gestionar Clientes</div>;
}

export default function AdminPage() {
  const [nav, setNav] = useState(0);

  const options = [
    {
      id: "reservas",
      title: "Administrar Reservas",
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

        <div className="w-fit  bg-white rounded-xl  shadow p-4">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
