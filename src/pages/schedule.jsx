import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";

const rooms = ["101", "102", "103", "104"];
const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const initialReservations = [
  { room: "101", day: "Lun", guest: "Carlos" },
  { room: "102", day: "Mar", guest: "Ana" },
  { room: "103", day: "Vie", guest: "Pedro" },
  { room: "104", day: "Dom", guest: "Lucía" },
];

export default function Schedule() {
  const [reservations] = useState(initialReservations);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full h-screen bg-gray-500 flex flex-col">
      <Header>
        <Button
          text="Atrás"
          style="w-fit bg-button_secondary"
          onClick={() => navigate(-1)}
          iconName="Back"
        />
      </Header>

      <main className="p-8 bg-secondary flex flex-col flex-1 overflow-auto">
        <div className="bg-white p-6 rounded-lg border-black/20 shadow-lg w-full overflow-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Calendario de Reservas
          </h1>
          <div className="flex m-4 items-center justify-center space-x-4">
            <Button
              iconName={"Back"}
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 1);
                setDate(newDate);
              }}
              style={"shadow-none"}
              />
            <h2 className="text-center p-4 bg-secondary rounded-md">
              {date.toLocaleDateString()}
            </h2>
            <Button
              iconName={"Next"}
              onClick={() => {
                  const newDate = new Date(date);
                  newDate.setDate(date.getDate() + 1);
                  setDate(newDate);
                }}
                style={"shadow-none"}
            />
          </div>
          <div className="flex ">
            <div className="w-36 bg-gray-200 font-semibold flex items-center justify-center border p-2">
              Habitación
            </div>
            {days.map((day, index) => (
              <div
                key={day}
                className={`flex-1 min-w-[100px]  font-semibold flex items-center justify-center border p-2 border border-black/10 ${
                  index === (date.getDay() + 6) % 7
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {rooms.map((room) => (
            <div key={room} className="flex border-b">
              <div className="w-36 bg-gray-100 font-medium flex items-center justify-center border p-2">
                {room}
              </div>
              {days.map((day) => {
                const res = reservations.find(
                  (r) => r.room === room && r.day === day
                );
                return (
                  <div
                    key={room + day}
                    className={`flex-1 min-w-[100px] border text-xs flex items-center justify-center ${
                      res ? "bg-green-300 font-semibold" : "bg-white"
                    }`}
                  >
                    {res ? res.guest : "Libre"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
