import { Footer } from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import ProfileButton from "../../components/ProfileButton.jsx";
import { Button } from "../../components/Button.jsx";
import { NavigationTab } from "../../components/NavigationTab.jsx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Counter } from "../../components/Counter.jsx";
import { useState } from "react";
import { useExtraServices } from "../../utils/useExtraServices";
import { useConfirmReservation } from "../../utils/useConfirmReservation";
import { useNavigate } from "react-router-dom";
import { BookingSearch } from "./bookingsSearch.jsx";
import { BookingTable } from "./bookingsList.jsx";
import { useSize } from "../../utils/SizeContext.jsx";

const options = [
  {
    title: "Realizar Reserva",
    icon: "booking",
  },
  {
    title: "Gestionar Reservas",
    icon: "list",
  },
];

export default function Bookings() {
  const navigate = useNavigate();
  const [nav, setNav] = useState(0);
  const {isMobile}=useSize();

  return (
    <div className="min-h-screen max-w-full flex flex-col font-primary bg-gradient-to-br from-slate-50 to-slate-100 m-0 overflow-x-hidden">
      <Header>
        <div className={`flex flex-row md:flex-col justify-center items-center ${isMobile ? " space-x-2":"space-y-2"} mt-4 mr-8 w-full`}>
          <Button
            text="Atrás"
            style="exit"
            onClick={() => {
              navigate("/");
            }}
            iconName="back"
          />
          <ProfileButton toPag={"/login"} />
        </div>
      </Header>

      <main className="flex flex-col flex-1 items-center p-4 sm:p-8 overflow-x-hidden w-full">
        <div className="w-full max-w-7xl max-w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-x-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-8">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Modulo de Reservas
              </h1>
              <p className="text-green-100 text-center">
                Realiza y Gestiona tus reservas de manera fácil y rápida
              </p>
            </div>

            {nav < 2 && (
              <div className="py-6 flex justify-center items-center border-b border-slate-200">
                <NavigationTab
                  state={nav}
                  setState={setNav}
                  options={options}
                />
              </div>
            )}

            <div className="p-8">
              {nav === 0 && <BookingSearch setNav={setNav} />}
              {nav === 1 && <BookingTable />}
              {nav === 2 && <ExtraServices setNav={setNav} />}
              {nav === 3 && <ConfirmReservation setNav={setNav} />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ExtraServices({ setNav }) {
  const storedSubtotal = Number(localStorage.getItem("reservaSubtotal") || 0);
  const subtotal = storedSubtotal ?? 0;

  const huespedes = JSON.parse(
    localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
  );
  const totalHuespedes = (huespedes.adultos || 1) + (huespedes.ninos || 0);

  const { services, selected, loading, setServiceCount, totalServicios, totalGeneral } =
    useExtraServices(subtotal);

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <p className="text-slate-600 font-medium">Cargando servicios adicionales...</p>
      </div>
    );
  }

  const desayuno = services.find((s) => s.nombre === "Desayuno");
  const parqueadero = services.find((s) => s.nombre === "Parqueadero");
  const senderismo = services.find((s) => s.nombre === "Senderismo");

  const getLabel = (s) => {
    if (s.id === desayuno?.id) return "por huésped";
    if (s.id === parqueadero?.id) return "por vehículo";
    if (s.id === senderismo?.id) return "por persona";
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">🛎️</span>Servicios Adicionales
        </h2>
        <p className="text-blue-100">Mejora tu experiencia con nuestros servicios extras</p>
      </div>

      <div className="space-y-4">
        {desayuno && (
        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{desayuno.nombre}</h3>
            <p className="text-sm text-gray-500">{desayuno.descripcion}</p>
            <p className="text-lg font-semibold text-blue-700 mt-1">
              ${desayuno.precio.toLocaleString()} COP <span className="text-sm text-gray-500">/ por persona</span>
            </p>
          </div>
          <button
            className={`px-4 py-2 rounded ${
              selected[desayuno.id] ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white`}
            onClick={() =>
              setServiceCount(desayuno.id, selected[desayuno.id] ? 0 : totalHuespedes)
            }
          >
            {selected[desayuno.id] ? "Quitar desayuno" : `Agregar desayuno para ${totalHuespedes} huéspedes`}
          </button>
        </div>
      )}

      {services
        .filter((s) => s.id !== desayuno?.id)
        .map((s) => {
          let maxCount = 1000;

          if (s.id === senderismo?.id) maxCount = totalHuespedes;
          if (s.id === parqueadero?.id) maxCount = totalHuespedes;

          return (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{s.nombre}</h3>
                  <p className="text-sm text-slate-600 mt-1">{s.descripcion}</p>
                  <p className="text-lg font-semibold text-blue-700 mt-2">
                    ${s.precio.toLocaleString()} COP{" "}
                    {getLabel(s) && <span className="text-sm text-gray-500">/ {getLabel(s)}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 font-medium">Cantidad:</span>
                  <Counter
                    count={selected[s.id] || 0}
                    setCount={(val) => setServiceCount(s.id, val)}
                    min={0}
                    max={maxCount}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">Resumen de Costos</h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">Subtotal habitaciones:</span>
            <span className="text-slate-800 font-semibold">${subtotal.toLocaleString()} COP</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">Servicios adicionales:</span>
            <span className="text-slate-800 font-semibold">${totalServicios.toLocaleString()} COP</span>
          </div>
          <div className="flex justify-between items-center py-3 mt-2">
            <span className="text-xl font-bold text-green-800">TOTAL A PAGAR:</span>
            <span className="text-2xl font-bold text-green-700">${totalGeneral.toLocaleString()} COP</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Button style="exit" iconName="back" text="Atrás" onClick={() => setNav(0)} />
          <Button
            style="primary"
            text="Continuar con la reserva"
            iconName="next"
            onClick={() => {
              const resumen = {
                subtotalHabitaciones: subtotal,
                subtotalServicios: totalServicios,
                totalGeneral,
                serviciosSeleccionados: selected,
              };
              localStorage.setItem("reservaDatos", JSON.stringify(resumen));
              setNav(3);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ConfirmReservation({ setNav }) {
  const { resumen, serviciosInfo, handleConfirm } = useConfirmReservation(setNav);

  // Info de habitaciones y fechas
  const habitaciones = JSON.parse(localStorage.getItem("habitacionesSeleccionadas") || "[]");
  const range = JSON.parse(
    localStorage.getItem("rangeSeleccionado") ||
      JSON.stringify({
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
  );
  const huespedes = JSON.parse(
    localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
  );

  const { subtotalHabitaciones, serviciosSeleccionados, totalGeneral } = resumen;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">✅</span>
          Confirmar Reserva
        </h2>
        <p className="text-green-100">
          Revisa los detalles finales antes de confirmar
        </p>
      </div>

      {/* Resumen completo */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Resumen Final</h3>

        {/* Fechas y huéspedes */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
          <p className="text-sm text-slate-600">Check-In:</p>
          <p className="text-slate-800 font-medium">
            {new Date(range.startDate).toLocaleDateString("es-CO")}
          </p>
          <p className="text-sm text-slate-600 mt-2">Check-Out:</p>
          <p className="text-slate-800 font-medium">
            {new Date(range.endDate).toLocaleDateString("es-CO")}
          </p>
          <p className="text-sm text-slate-600 mt-2">Huéspedes:</p>
          <p className="text-slate-800 font-medium">
            {huespedes.adultos} adultos, {huespedes.ninos} niños
          </p>
        </div>

        {/* Habitaciones seleccionadas */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-600 mb-2">Habitaciones seleccionadas:</p>
          {habitaciones.length > 0 ? (
            <ul className="list-disc list-inside text-slate-800 font-medium">
              {habitaciones.map((id) => (
                <li key={id}>Habitación #{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic">No se seleccionaron habitaciones</p>
          )}
          <p className="text-sm text-slate-600 mt-2">Subtotal habitaciones:</p>
          <p className="text-slate-800 font-semibold">${subtotalHabitaciones.toLocaleString()} COP</p>
        </div>

        {/* Servicios adicionales */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-sm font-bold text-slate-700 mb-3">
            Servicios adicionales:
          </p>

          {Object.entries(serviciosSeleccionados).length > 0 &&
          Object.values(serviciosSeleccionados).some((count) => count > 0) ? (
            <ul className="space-y-2">
              {Object.entries(serviciosSeleccionados).map(([id, count]) => {
                if (count <= 0) return null;
                const info = serviciosInfo[id];
                const precio = info?.precio || 0;
                const subtotalServicio = precio * count;

                return (
                  <li
                    key={id}
                    className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0"
                  >
                    <div>
                      <span className="font-medium text-slate-800">
                        {info?.nombre || `Servicio #${id}`}
                      </span>
                      <span className="text-sm text-slate-600 ml-2">
                        × {count}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-700">
                      ${subtotalServicio.toLocaleString()} COP
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500 italic">
              No se seleccionaron servicios adicionales
            </p>
          )}
        </div>

        {/* Total general */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-800">
              Total Final:
            </span>
            <span className="text-3xl font-bold text-green-700">
              ${totalGeneral.toLocaleString()} COP
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          style="exit"
          text="Atrás"
          iconName="back"
          onClick={() => setNav(2)}
        />
        <Button
          style="primary"
          text="Confirmar Reserva"
          iconName="check"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
}
