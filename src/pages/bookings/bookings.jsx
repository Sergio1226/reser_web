import { Footer } from "../../components/Footer.jsx";
import { Header } from "../../components/Header.jsx";
import ProfileButton from "../../components/ProfileButton.jsx";
import { NavigationTab } from "../../components/NavigationTab.jsx";
import { useState } from "react";
import BookingSearch from "./bookingsSearch.jsx";
import BookingList from "./bookingsList.jsx";

const options = [
  {
    title: "Realizar Reserva",
    icon: "src/assets/icons/Booking.svg",
  },
  {
    title: "Visualizar Reservas",
    icon: "src/assets/icons/List.svg",
  },
];

export default function Bookings() {
  const [nav, setNav] = useState(0);
  const [showReservationSummary, setShowReservationSummary] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-primary bg-gradient-to-br from-gradient_1 to-secondary">
      <Header>
        <ProfileButton toPag={"/login"} />
      </Header>

      <main className="flex flex-col flex-1 items-center p-8">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-black-200 overflow-hidden ">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 ">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Sistema de Reservas
              </h1>
              <p className="text-green-100 text-center">
                Gestiona tus reservas de manera fácil y rápida.
              </p>
            </div>
            <div className="py-4 mt-6 flex justify-center items-center">
              {!showReservationSummary && (
                <NavigationTab
                  state={nav}
                  setState={setNav}
                  options={options}
                />
              )}
            </div>

            <div className="p-8">
              {nav === 0 && (
                <BookingSearch
                  showReservationSummary={showReservationSummary}
                  setShowReservationSummary={setShowReservationSummary}
                />
              )}
              {nav === 1 && <BookingList />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
