import { useState } from "react";
import "react-date-range/dist/styles.css";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/theme/default.css";
import  Header  from "../../components/Header.jsx";
import { NavigationTab } from "../../components/NavigationTab.jsx";
import { Button } from "../../components/Button.jsx";
import { SmallFooter } from "../../components/Footer.jsx";
import { Reservations } from "./reservationsAdmin.jsx";
import { Schedule } from "./schedule.jsx";
import { UserAuth } from "../../utils/AuthContext.jsx";
import { BookingsAdmin } from "./bookings/bookingsSearch.jsx";
import { useSize } from "../../utils/SizeContext.jsx";

export default function BookingAdmin() {
  const [nav, setNav] = useState(0);
  const navigate = useNavigate();

  const {isMobile}= useSize();
  const { signOut } = UserAuth();

  const options = [
    {
      id: "agregar",
      title: "Agregar reserva",
      icon: "booking",
    },
    {
      id: "reservas",
      title: "Visualizar Reservas",
      icon: "list",
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: "calendar",
    },
  ];

  const renderContent = () => {
    switch (nav) {
      case 0:
        return <BookingsAdmin />;
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
        <div className={`flex flex-row md:flex-col h-full items-center justify-center ${isMobile ? " space-x-2":"space-y-2"} mt-4 mr-8`}>
          <Button
            text="Modulos"
            style="primary"
            className="w-full flex justify-center items-center text-centerr"
            onClick={() => {
              navigate("/dashboard");
            }}
            iconName="box"
            />
          <Button
            text="Cerrar Sesion" 
            style="exit"
            className="w-full"
            onClick={() => {
              signOut().then(() => navigate("/"));
            }}
            iconName="signOut"
          />
        </div>
      </Header>
      <main className="flex flex-col flex-1 items-center p-8">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-black-200 ">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-t-2xl ">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Modulo de Reservas
              </h1>
              <p className="text-green-100 text-center">
                Gestiona las reservas de manera fácil y rápida.
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