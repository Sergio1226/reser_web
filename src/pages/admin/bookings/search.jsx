import { useState, useRef } from "react";
import RoomCard from "../../../components/RoomCard.jsx";
import { Button } from "../../../components/Button.jsx";
import { Icon } from "../../../components/Icon.jsx";
import { Counter } from "../../../components/Counter.jsx";
import { Calendar } from "../../../components/Calendar.jsx";
import { usePopup } from "../../../utils/PopupContext.jsx";
import { Loading } from "../../../components/Animate.jsx";
import { searchAvailableRooms } from "../../../utils/useSearchRooms.js";
import { format, addDays } from "date-fns";

export default function SearchBookingsAdmin({ setNav }) {
  const { openPopup } = usePopup();
  const sendRef = useRef(null);

  const [countAdults, setCountAdults] = useState(1);
  const [countChildrens, setCountChildrens] = useState(0);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedServices] = useState([]);

  const calculateNights = () => {
    const start = range[0].startDate;
    const end =
      range[0].startDate.getTime() === range[0].endDate.getTime()
        ? addDays(range[0].endDate, 1)
        : range[0].endDate;
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const subtotal = selectedRooms.reduce(
    (sum, r) => sum + (r.precio || 0) * calculateNights(),
    0
  );

  const handleSearchRooms = async () => {
    setSearchLoading(true);
    setSearched(true);
    setSelectedRooms([]);

    const combos = await searchAvailableRooms({
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      countAdults,
      countChildrens,
      countRooms: 1,
      openPopup,
    });

    const uniqueRooms = [];
    const ids = new Set();
    combos.forEach((combo) =>
      combo.forEach((r) => {
        if (!ids.has(r.id)) {
          ids.add(r.id);
          uniqueRooms.push(r);
        }
      })
    );

    setAvailableRooms(uniqueRooms);
    setSearchLoading(false);
  };

  const handleToggleRoom = (room) => {
    setSelectedRooms((prev) =>
      prev.some((r) => r.id === room.id)
        ? prev.filter((r) => r.id !== room.id)
        : [...prev, room]
    );
  };

  const handleContinue = () => {
    if (selectedRooms.length === 0) {
      openPopup("Debes seleccionar al menos una habitación", "warning");
      return;
    }

    const adjustedEndDate =
      range[0].startDate.getTime() === range[0].endDate.getTime()
        ? addDays(range[0].endDate, 1)
        : range[0].endDate;

    localStorage.setItem(
      "rangeSeleccionado",
      JSON.stringify({
        startDate: range[0].startDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      })
    );

    localStorage.setItem(
      "reservaHuespedes",
      JSON.stringify({
        adultos: countAdults,
        ninos: countChildrens,
      })
    );

    localStorage.setItem(
      "habitacionesSeleccionadas",
      JSON.stringify(selectedRooms.map((r) => Number(r.id)))
    );

    const serviciosFormato = {};
    selectedServices.forEach((s) => {
      serviciosFormato[s.id] = s.cantidad;
    });

    localStorage.setItem(
      "serviciosAdicionalesAdmin",
      JSON.stringify(serviciosFormato)
    );

    localStorage.setItem("reservaSubtotal", String(subtotal || 0));

    setNav(1);
  };

  const endDate =
    range[0].startDate.getTime() === range[0].endDate.getTime()
      ? addDays(range[0].endDate, 1)
      : range[0].endDate;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          🔍 Buscar Habitaciones Disponibles (Admin)
        </h2>

        <div className="flex flex-col lg:flex-row gap-4 justify-center lg:items-stretch">
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4">
            <Calendar range={range} setRange={setRange} />
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-slate-700 text-center">
                Check In - Check Out
              </span>
              <span className="text-slate-500 text-sm text-center">
                {`${format(range[0].startDate, "dd/MM/yy")} - ${format(
                  endDate,
                  "dd/MM/yy"
                )}`}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                {calculateNights()} noche(s)
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <Icon
                name="guest"
                alt="Huespedes"
                style="size-8 text-blue-600 flex-shrink-0"
              />
              <div className="flex flex-col space-y-2 w-full">
                <div className="text-sm font-semibold text-slate-700 text-center">
                  Huéspedes
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">Adultos</span>
                  <Counter
                    count={countAdults}
                    setCount={setCountAdults}
                    min={1}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">Niños</span>
                  <Counter
                    count={countChildrens}
                    setCount={setCountChildrens}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            text={searchLoading ? "Buscando..." : "Buscar Habitaciones"}
            style="primary"
            iconName="search"
            onClick={handleSearchRooms}
            disabled={searchLoading}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col flex-1 space-y-6">
          {searchLoading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
              <Loading />
              <p className="text-slate-600 font-medium">
                🔄 Buscando habitaciones disponibles...
              </p>
            </div>
          ) : availableRooms.length > 0 ? (
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200 shadow-md">
              <h3 className="text-lg font-bold text-blue-800 mb-4">
                Habitaciones Disponibles ({availableRooms.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRooms.map((room) => {
                  const isSelected = selectedRooms.some(
                    (r) => r.id === room.id
                  );
                  const capacity = room.capacidad_total;
                  const bedType = (room.habitaciones_camas || []).map((hc) => ({
                    tipo: hc?.camas?.nombre || "Cama sin nombre",
                    cantidad: hc?.cantidad || 0,
                  }));
                  const services = (
                    room.habitaciones_caracteristicas || []
                  ).map((hc) => ({
                    icon: hc.caracteristicas?.icono || "wifi",
                    label: hc.caracteristicas?.nombre || "Servicio",
                  }));

                  return (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-100 shadow-md"
                          : "border-slate-300 bg-white hover:shadow-md hover:border-blue-300"
                      }`}
                    >
                      <RoomCard
                        id={room.id}
                        price={room.precio ?? 0}
                        imageNames={[`${room.id}.jpeg`, `${room.id}_Bano.jpeg`]}
                        services={services}
                        description={room.descripcion ?? "Sin descripción"}
                        capacity={capacity}
                        bedType={bedType}
                        plus
                        onClick={() => handleToggleRoom(room)}
                        selected={isSelected}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : searched ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
              <p className="text-slate-600 font-medium text-xl mb-2">😕</p>
              <p className="text-slate-600 font-medium">
                No hay habitaciones disponibles
              </p>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
              <p className="text-slate-400 font-medium text-xl mb-2">🔍</p>
              <p className="text-slate-400 font-medium">
                Realiza una búsqueda para ver habitaciones disponibles
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-80" ref={sendRef}>
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
                Resumen de Reserva
              </h3>

              {selectedRooms.length > 0 ? (
                <>
                  <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-600 mb-2">
                      Habitaciones ({selectedRooms.length})
                    </p>
                    {selectedRooms.map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between text-sm text-slate-700"
                      >
                        <span>#{r.id}</span>
                        <span className="font-semibold text-slate-800">
                          $
                          {(r.precio * calculateNights()).toLocaleString(
                            "es-CO"
                          )}
                        </span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between">
                      <span className="text-sm text-slate-600">Subtotal:</span>
                      <span className="font-bold text-slate-800">
                        ${subtotal.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-slate-600 mb-2">
                      Total a pagar:
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      ${subtotal.toLocaleString("es-CO")}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      COP ({calculateNights()} noche
                      {calculateNights() > 1 ? "s" : ""})
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <p className="text-slate-400">
                    No hay habitaciones seleccionadas
                  </p>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Button
                  text="Continuar"
                  style="primary"
                  iconName="next"
                  onClick={handleContinue}
                  disabled={selectedRooms.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
