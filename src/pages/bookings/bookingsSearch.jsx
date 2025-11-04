import RoomCard from "../../components/RoomCard.jsx";
import { Button } from "../../components/Button.jsx";
import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Counter } from "../../components/Counter.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { Loading } from "../../components/Animate.jsx";
import { getRooms, createBooking } from "../../utils/Api.jsx";

const imagesUrl = (roomId) => {
  return `https://njhzehbjmqyoghfiyxtr.supabase.co/storage/v1/object/public/Images/rooms/${roomId}.jpeg`;
};

export default function BookingSearch({
  showReservationSummary,
  setShowReservationSummary,
}) {
  const { openPopup } = usePopup();
  const [countAdults, setCountAdults] = useState(1);
  const [countChildrens, setCountChildrens] = useState(0);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleRoom = (roomId) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const calculateNights = () => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSelectedRoomsData = () => {
    return selectedRooms.map((id) => availableRooms.find((r) => r.id === id));
  };

  const calculateTotal = () => {
    const roomsData = getSelectedRoomsData();
    const nights = calculateNights();
    return roomsData.reduce(
      (sum, room) => sum + (room?.precio || 0) * nights,
      0
    );
  };

  const calculateCapacity = () => {
    return selectedRooms.reduce((sum, roomId) => {
      const room = availableRooms.find((r) => r.id === roomId);
      return sum + (room?.capacidad_total || 0);
    }, 0);
  };

  async function handleSearch() {
    try {
      setSearchLoading(true);
      setSearched(true);
      setShowReservationSummary(false);
      setSelectedRooms([]);

      const start = range[0].startDate.toISOString().slice(0, 10);
      const end = range[0].endDate.toISOString().slice(0, 10);
      const people = countAdults + countChildrens;
      const available = await getRooms(start, end, people);

      setAvailableRooms(available);
    } catch (err) {
      console.error("Error buscando habitaciones:", err);
      openPopup(
        `❌ Error al buscar habitaciones:\n${err.message || err}`,
        "warning"
      );
      setAvailableRooms([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function handleShowReservationSummary() {
    if (selectedRooms.length === 0) {
      openPopup("⚠️ Debes seleccionar al menos una habitación", "warning");
      return;
    }
    setShowReservationSummary(true);
  }

  function handleRemoveRoom(roomId) {
    setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
  }

  async function handleConfirmReservation() {
    if (selectedRooms.length === 0) {
      openPopup("⚠️ Debes seleccionar al menos una habitación", "warning");
      return;
    }
    try {
      setLoading(true);
      const { error } = await createBooking(
        range[0].startDate.toISOString().slice(0, 10),
        range[0].endDate.toISOString().slice(0, 10),
        countAdults,
        countChildrens,
        selectedRooms
      );

      if (error) throw error;
      setSelectedRooms([]);
      openPopup(" Reserva confirmada exitosamente", "success");
    } catch (err) {
      console.error("Error al confirmar la reserva:", err);
      openPopup(
        `❌ Error al confirmar la reserva:\n${err.message || err}`,
        "warning"
      );
    } finally {
      setShowReservationSummary(false);
      setLoading(false);
    }
  }

  if (showReservationSummary) {
    const roomsData = getSelectedRoomsData();
    const nights = calculateNights();
    const total = calculateTotal();
    const capacity = calculateCapacity();

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Resumen de tu Reserva</h2>
              <p className="text-blue-100">
                Revisa los detalles antes de confirmar
              </p>
            </div>
            <Button
              text="Volver"
              style="exit"
              iconName="back"
              onClick={() => setShowReservationSummary(false)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Información de la Estadía
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Calendar" style="size-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Check-in</p>
                <p className="font-semibold text-slate-700">
                  {formatDate(range[0].startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Calendar" style="size-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Check-out</p>
                <p className="font-semibold text-slate-700">
                  {formatDate(range[0].endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="guest" style="size-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Huespedes Maximos</p>
                <p className="font-semibold text-slate-700">
                  {capacity} persona{capacity > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="moon" style="size-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Noches</p>
                <p className="font-semibold text-slate-700">{nights}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Habitaciones Seleccionadas ({roomsData.length})
          </h3>
          <div className="space-y-4">
            {roomsData.map((room) => {
              if (!room) return null;

              const capacity = room.capacidad_total;
              const bedType = (room.habitaciones_camas || []).map((hc) => ({
                tipo: hc?.camas?.nombre || "Cama sin nombre",
                cantidad: hc?.cantidad || 0,
              }));

              return (
                <div
                  key={room.id}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={imagesUrl(room.id)}
                      alt={room.descripcion}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {room.descripcion}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Icon name="guest" style="size-4" />
                              {capacity} personas
                            </span>
                            <span>
                              {bedType.map((bed, idx) => (
                                <span key={idx}>
                                  {bed.cantidad}x {bed.tipo}
                                  {idx < bedType.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveRoom(room.id)}
                          className="bg-red-200 hover:bg-red-400 p-2 rounded-lg transition-colors animation-fade"
                          title="Eliminar habitación"
                        >
                          <Icon name="exit" style="size-5 mr-0" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-3 pt-3 border-t border-slate-200">
                        <div className="text-sm text-slate-600">
                          ${room.precio.toLocaleString()} COP x {nights} noches
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                          ${(room.precio * nights).toLocaleString()} COP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                Total a Pagar
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {roomsData.length} habitación{roomsData.length > 1 ? "es" : ""}{" "}
                × {nights} noche{nights > 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-700">
                ${total.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">COP</div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center mb-4 items-center justify-center  flex-col">
              <Loading />
              <p className="text-sm text-slate-600 ml-2">Cargando...</p>
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <Button
                text="Atras"
                style="exit"
                iconName="back"
                onClick={() => {
                  setShowReservationSummary(false);
                }}
              />
              <Button
                text="Cancelar Todo"
                style="secondary"
                iconName="exit"
                onClick={() => {
                  setSelectedRooms([]);
                  setShowReservationSummary(false);
                }}
              />
              <Button
                text="Confirmar Reserva"
                style="primary"
                iconName="check"
                onClick={handleConfirmReservation}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  const exactCapacityRooms = availableRooms.filter(
    (room) => room.capacidad_total === countAdults + countChildrens
  );

  const higherCapacityRooms = availableRooms.filter(
    (room) => room.capacidad_total > countAdults + countChildrens
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg p-6 ">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          Habitaciones Disponibles
        </h2>

        <div className="flex  gap-6 justify-center">
          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow justify-center items-center flex w-fit">
            <Calendar range={range} setRange={setRange} />
            <div className="flex flex-col ">
              <span className="text-sm font-semibold text-slate-700 text-center">
                Check In - Check Out
              </span>
              <span className="text-slate-500 text-sm text-center">
                {`${formatDate(range[0].startDate)} - ${formatDate(
                  range[0].endDate
                )}`}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow w-fit">
            <div className="flex items-start gap-3">
              <Icon
                name="guest"
                alt="Huéspedes"
                style="size-8 text-blue-600 flex-shrink-0"
              />
              <div className="flex flex-col space-y-2 flex-1">
                <div className="text-sm font-semibold text-slate-700">
                  Huéspedes
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 mr-2">Adultos</span>
                  <Counter
                    count={countAdults}
                    setCount={setCountAdults}
                    min={1}
                    max={7}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 mr-2">Niños</span>
                  <Counter
                    count={countChildrens}
                    setCount={setCountChildrens}
                    min={0}
                    max={7}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            text={searchLoading ? "Buscando..." : "Buscar Habitaciones"}
            style="primary"
            iconName="search"
            onClick={handleSearch}
            disabled={searchLoading}
          />
        </div>
      </div>

      <div className="space-y-6">
        {searchLoading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
            <Loading />
            <p className="text-slate-600 font-medium">
              Buscando habitaciones disponibles...
            </p>
          </div>
        ) : availableRooms.length > 0 ? (
          <>
            {exactCapacityRooms.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-md">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    ✓
                  </span>
                  Habitaciones Perfectas ({countAdults + countChildrens}{" "}
                  huéspedes)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exactCapacityRooms.map((room) => {
                    const capacity = room.capacidad_total;
                    const bedType = (room.habitaciones_camas || []).map(
                      (hc) => ({
                        tipo: hc?.camas?.nombre || "Cama sin nombre",
                        cantidad: hc?.cantidad || 0,
                      })
                    );

                    const services = (
                      room.habitaciones_caracteristicas || []
                    ).map((hc) => ({
                      icon: hc.caracteristicas?.icono || "wifi",
                      label: hc.caracteristicas?.nombre || "Servicio",
                    }));

                    return (
                      <div className=" p-4 bg-white rounded-xl shadow-md border border-green-300 hover:shadow-lg transition-shadow">
                        <RoomCard
                          key={room.id}
                          id={room.id}
                          price={room.precio ?? 0}
                          image={imagesUrl(room.id)}
                          services={services}
                          description={
                            room.descripcion ?? "Sin descripción disponible"
                          }
                          capacity={capacity}
                          bedType={bedType}
                          onClick={() => handleRoom(room.id)}
                          state={selectedRooms.includes(room.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {higherCapacityRooms.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200 shadow-md">
                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    +
                  </span>
                  Habitaciones con Capacidad Superior
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {higherCapacityRooms.map((room) => {
                    const capacity = room.capacidad_total;
                    const bedType = (room.habitaciones_camas || []).map(
                      (hc) => ({
                        tipo: hc?.camas?.nombre || "Cama sin nombre",
                        cantidad: hc?.cantidad || 0,
                      })
                    );

                    const services = (
                      room.habitaciones_caracteristicas || []
                    ).map((hc) => ({
                      icon: hc.caracteristicas?.icono || "wifi",
                      label: hc.caracteristicas?.nombre || "Servicio",
                    }));

                    return (
                      <div className=" p-4 bg-white rounded-xl shadow-md border border-blue-300 hover:shadow-lg transition-shadow">
                        <RoomCard
                          key={room.id}
                          id={room.id}
                          price={room.precio ?? 0}
                          image={imagesUrl(room.id)}
                          services={services}
                          description={
                            room.descripcion ?? "Sin descripción disponible"
                          }
                          capacity={capacity}
                          bedType={bedType}
                          onClick={() => handleRoom(room.id)}
                          state={selectedRooms.includes(room.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : searched ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
            <p className="text-slate-600 font-medium">
              No hay habitaciones disponibles con los criterios seleccionados.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Intenta modificar las fechas o el número de huéspedes.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
            <p className="text-slate-400 font-medium">
              Realiza una búsqueda para ver habitaciones disponibles.
            </p>
          </div>
        )}
        {selectedRooms.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Button
              text="Reservar Ahora"
              style="primary"
              iconName="contactForm"
              onClick={handleShowReservationSummary}
            />
          </div>
        )}
      </div>
    </div>
  );
}
