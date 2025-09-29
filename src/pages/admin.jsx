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

function Reservations() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);

  const statuses = [
    { id: "confirmed", label: "Confirmadas" },
    { id: "cancelled", label: "Canceladas" },
    { id: "pending", label: "Pendientes" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-black/20 rounded-xl p-3 flex flex-col md:flex-row items-center gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 min-w-[150px]"
        >
          <option value="" disabled hidden>
            Fecha de
          </option>
          <option value="" disabled>
            Fecha de
          </option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>


        <div className="flex-1" />
        

        <div className="flex p-4 items-center relative">
          <div>
            <Icon
              name={"Calendar"}
              alt="Calendario"
              style="size-12 cursor-pointer hover:scale-110 transition active:scale-90"
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

          <div className="flex flex-col ml-4">
            <span className="text-sm font-medium">Check In - Check Out</span>
            <span className="text-gray-500 text-sm font-normal font-primary">
              {`${format(range[0].startDate, "dd/MM/yy")} - ${format(
                range[0].endDate,
                "dd/MM/yy"
              )}`}
            </span>
          </div>
        </div>


        <div className="flex-1" />


        <Button
          text="Buscar"
          style="bg-blue-500 text-white px-4 py-2 rounded-lg"
        />

      </div>
      <div className="w-full bg-white rounded-lg border border-black/20 overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header: 8 títulos */}
          <div className="grid grid-cols-8 gap-2 bg-gray-100 p-3 border-b border-black/10">
            <div className="text-sm font-semibold text-center">Nombre del cliente</div>
            <div className="text-sm font-semibold text-center">Fecha de entrada</div>
            <div className="text-sm font-semibold text-center">Fecha de salida</div>
            <div className="text-sm font-semibold text-center">Habitacion(es)</div>
            <div className="text-sm font-semibold text-center">Fecha de reservación</div>
            <div className="text-sm font-semibold text-center">Estado de reserva</div>
            <div className="text-sm font-semibold text-center">Precio</div>
            <div className="text-sm font-semibold text-center">Acciones</div>
          </div>

          <div className="divide-y divide-black/10">
              <div className="grid grid-cols-8 gap-2 items-center p-3">
                <div className="text-sm text-center">Juan Gonzalez</div>
                <div className="text-sm text-center">29/11/2025</div>
                <div className="text-sm text-center">31/11/2025</div>
                <div className="text-sm text-center">Pericos</div>
                <div className="text-sm text-center">30/09/2025</div>
                <div className="text-sm text-center text-green-500">Comfirmada</div>
                <div className="text-sm text-center">$840.000</div>

                <div className="flex flex-col items-center justify-center space-y-2">
                  <Button 
                    text="Modificar"
                    style="bg-blue-500 text-white w-full"
                    
                  />
                  <Button 
                    text="Cancelar"
                    style="bg-red-500 text-white w-full"
                    
                  />
                </div>
              </div>
            
          </div>
        </div>
      </div>

      {/* Botón centrado debajo */}
      <div className="flex justify-center mt-6">
        <Button 
          text="Hacer una reserva"
          style="bg-green-500 text-white px-6 py-2"
          onClick={() =>navigate("/bookings")}
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
    { id: "reservas", title: "Administrar Reservas", icon: "/src/assets/icons/List.svg" },
    { id: "habitaciones", title: "Gestionar Habitaciones", icon: "/src/assets/icons/bed-double.svg" },
    { id: "clientes", title: "Gestionar Clientes", icon: "/src/assets/icons/users.svg" },
  ];

  const renderContent = () => {
    switch (nav) {
      case 0: return <Reservations />;
      case 1: return <Rooms />;
      case 2: return <Clients />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
      <Header>
        <ProfileButton toPag={"/loginAdmin"} />
      </Header>

      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center p-8 space-y-8 w-full">
        <NavigationTab state={nav} setState={setNav} options={options} />

        {/* Área que cambia según nav */}
        <div className="w-full max-w-[1100px] bg-white rounded-xl p-6 shadow">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}