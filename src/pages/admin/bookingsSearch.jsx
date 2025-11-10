import RoomCard from "../../components/RoomCard.jsx";
import { Button } from "../../components/Button.jsx";
import { useState, useEffect, useRef } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Counter } from "../../components/Counter.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { Loading } from "../../components/Animate.jsx";
import { searchAvailableRooms } from "../../utils/useSearchRooms.js";
import { format, addDays } from "date-fns";
import { useExtraServices } from "../../utils/useExtraServices.js";
import { getClientByEmail } from "../../utils/Api.jsx";
import { useConfirmReservation } from "../../utils/useConfirmReservation.js";

export function BookingsAdmin(){
  const [nav,setNav] = useState(0);
  const render=()=>{
    switch (nav) {
      case 0:
        return <SearchBookingsAdmin setNav={setNav} />;
      case 1:
        return <ExtraServices setNav={setNav} />;
      case 2:
        return <AdminSelectClient setNav={setNav} />;
      case 3:
        return <AdminConfirmReservation setNav={setNav} />;
      default:
        return <SearchBookingsAdmin setNav={setNav} />;
    }
  }
  return render();
}

function SearchBookingsAdmin({ setNav }) {
  const { openPopup } = usePopup();

  const sendRef = useRef(null);

  const [countAdults, setCountAdults] = useState(1);
  const [countChildrens, setCountChildrens] = useState(0);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const storedSubtotal = Number(localStorage.getItem("reservaSubtotal") || 0);
  const subtotal = storedSubtotal ?? 0;

  const { services: additionalServices } = useExtraServices(subtotal);

  const [selectedServices, setSelectedServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  useEffect(() => {
    const loadAdditionalServices = async () => {
      setServicesLoading(true);
      try {
        setServicesLoading(false);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        openPopup("Error al cargar servicios adicionales", "error");
        setServicesLoading(false);
      }
    };

    loadAdditionalServices();
  }, [openPopup]);

  const handleSearchRooms = async () => {
    setSearchLoading(true);
    setSearched(true);
    setSelectedRooms([]);

    const allCombos = await searchAvailableRooms({
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      countAdults,
      countChildrens,
      countRooms:1,
      openPopup,
    });

    const uniqueRooms = [];
    const roomIds = new Set();

    allCombos.forEach((combo) => {
      combo.forEach((room) => {
        if (!roomIds.has(room.id)) {
          roomIds.add(room.id);
          uniqueRooms.push(room);
        }
      });
    });

    setAvailableRooms(uniqueRooms);
    setSearchLoading(false);
  };

  const handleToggleRoom = (room) => {
    setSelectedRooms((prev) => {
      const exists = prev.find((r) => r.id === room.id);
      if (exists) {
        return prev.filter((r) => r.id !== room.id);
      } else {
        return [...prev, room];
      }
    });
  };

  const calculateNights = () => {
    const start = range[0].startDate;
    const end =
      range[0].startDate.getTime() === range[0].endDate.getTime()
        ? addDays(range[0].endDate, 1)
        : range[0].endDate;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const totalRoomsPrice = selectedRooms.reduce(
    (sum, r) => sum + (r.precio || 0) * calculateNights(),
    0
  );

  const totalServicesPrice = selectedServices.reduce(
    (sum, s) => sum + s.precio * s.cantidad,
    0
  );

  const totalPrice = totalRoomsPrice + totalServicesPrice;

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
      "habitacionesSeleccionadas",
      JSON.stringify(
        selectedRooms.map((r) => Number(r.id))
      )
    );

    const serviciosFormato = {};
    selectedServices.forEach((s) => {
      serviciosFormato[s.id] = s.cantidad;
    });

    localStorage.setItem(
      "serviciosAdicionalesAdmin",
      JSON.stringify(serviciosFormato)
    );

    localStorage.setItem("reservaSubtotal", String(totalRoomsPrice || 0));

    setNav(1);
  };

  const endDate =
    range[0].startDate.getTime() === range[0].endDate.getTime()
      ? addDays(range[0].endDate, 1)
      : range[0].endDate;

  return (
    <div className="space-y-6 ">
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          Buscar Habitaciones Disponibles (Admin)
        </h2>

        <div className="flex flex-col lg:flex-row gap-4 justify-center lg:items-stretch">
          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-center gap-4 ">
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

          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-center">
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
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                
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
                      className={`border rounded-lg p-3 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-100 shadow-md"
                          : "border-slate-300 bg-white hover:shadow-md hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-start ">
                        <div className="w-full">
                          <RoomCard
                            id={room.id}
                            price={room.precio ?? 0}
                            imageNames={[
                              `${room.id}.jpeg`,
                              `${room.id}_Bano.jpeg`,
                            ]}
                            services={services}
                            description={
                              room.descripcion ?? "Sin descripción disponible"
                            }
                            capacity={capacity}
                            bedType={bedType}
                            plus
                            onClick={() => handleToggleRoom(room)}
                            selected={isSelected}
                            disabled={false}
                          />
                        </div>
                      </div>
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
              <p className="text-sm text-slate-500 mt-2">
                Intenta modificar las fechas o el número de huéspedes
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
                    <div className="space-y-2">
                      {selectedRooms.map((room) => (
                        <div
                          key={room.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-slate-700">#{room.id}</span>
                          <span className="font-semibold text-slate-800">
                            $
                            {(room.precio * calculateNights()).toLocaleString(
                              "es-CO"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-sm text-slate-600">Subtotal:</span>
                      <span className="font-bold text-slate-800">
                        ${totalRoomsPrice.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-600 mb-2">
                        Servicios Adicionales
                      </p>
                      <div className="space-y-2">
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-slate-700">
                              {service.nombre} x{service.cantidad}
                            </span>
                            <span className="font-semibold text-slate-800">
                              $
                              {(
                                service.precio * service.cantidad
                              ).toLocaleString("es-CO")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          Subtotal:
                        </span>
                        <span className="font-bold text-slate-800">
                          ${totalServicesPrice.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <p className="text-sm text-slate-600 mb-2">
                      Total a pagar:
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      ${totalPrice.toLocaleString("es-CO")}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      COP ({calculateNights()} noche
                      {calculateNights() > 1 ? "s" : ""})
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg p-6 mb-4 shadow-sm text-center">
                  <p className="text-slate-400">
                    No hay habitaciones seleccionadas
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Selecciona al menos una habitación para continuar
                  </p>
                </div>
              )}

              <Button
                text="Continuar"
                style="primary"
                iconName="next"
                onClick={handleContinue}
                disabled={selectedRooms.length === 0}
                className={`w-full ${
                  selectedRooms.length === 0
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminExtraServices({ setNav }) {
  const storedSubtotal = Number(localStorage.getItem("reservaSubtotal") || 0);
  const subtotal = storedSubtotal ?? 0;

  const preSelectedServices = JSON.parse(
    localStorage.getItem("serviciosAdicionalesAdmin") || "{}"
  );

  const {
    services,
    selected,
    loading,
    setServiceCount,
    totalServicios,
    totalGeneral,
  } = useExtraServices(subtotal, preSelectedServices);

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <p className="text-slate-600 font-medium">
          Cargando servicios adicionales...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">🛎️</span>
          Servicios Adicionales (Admin)
        </h2>
        <p className="text-blue-100">
          Revisa y ajusta los servicios adicionales para esta reserva
        </p>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
          <p className="text-slate-600">
            No hay servicios adicionales disponibles
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">
                    {s.nombre}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{s.descripcion}</p>
                  <p className="text-lg font-semibold text-blue-700 mt-2">
                    ${s.precio.toLocaleString()} COP
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 font-medium">
                    Cantidad:
                  </span>
                  <Counter
                    count={selected[s.id] || 0}
                    setCount={(val) => setServiceCount(s.id, val)}
                    min={0}
                    max={1000}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Resumen de Costos
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Subtotal habitaciones:
            </span>
            <span className="text-slate-800 font-semibold">
              ${subtotal.toLocaleString()} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Servicios adicionales:
            </span>
            <span className="text-slate-800 font-semibold">
              ${totalServicios.toLocaleString()} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-3 mt-2">
            <span className="text-xl font-bold text-green-800">
              TOTAL A PAGAR:
            </span>
            <span className="text-2xl font-bold text-green-700">
              ${totalGeneral.toLocaleString()} COP
            </span>
          </div>
        </div>

      </div>
        <div className="flex gap-3 justify-center items-center py-4 flex-col md:flex-row ">
          <Button
            style="exit"
            iconName="back"
            className="w-fit"
            text="Cancelar"
            onClick={() => setNav(0)}
            />
          <Button
            className="w-fit"
            style="primary"
            text="Seleccionar Cliente"
            iconName="next"
            onClick={() => {
              const resumen = {
                subtotalHabitaciones: subtotal,
                subtotalServicios: totalServicios,
                totalGeneral,
                serviciosSeleccionados: selected,
              };
              localStorage.setItem("reservaDatos", JSON.stringify(resumen));
              setNav(2);
            }}
          />
        </div>
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
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
      </div>

        <div className="flex flex-col md:flex-row gap-3 justify-center py-4 ">
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
              setNav(2);
            }}
          />
        </div>
    </div>
  );
}


export function AdminSelectClient({ setNav }) {
  const { openPopup } = usePopup();
  const [email, setEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [clientFound, setClientFound] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearchClient = async () => {
    if (!email || !email.includes("@")) {
      openPopup("Por favor ingresa un correo válido", "warning");
      setEmail("");
      setClientFound(null);
      setSearched(true);
      return;
    }

    setSearchLoading(true);
    setSearched(true);
    setClientFound(null);

    try {
      const data = await getClientByEmail(email);
      console.log(data)
      setClientFound(data);
    } catch (error) {
      console.error("Error al buscar cliente:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleConfirmClient = () => {
    if (!clientFound) {
      openPopup("Debes buscar y seleccionar un cliente", "warning");
      return;
    }

    localStorage.setItem("clienteSeleccionado", JSON.stringify(clientFound));
    setNav(3);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-4">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">👤</span>
          Seleccionar Cliente
        </h2>
        <p className="text-green-100">
          Busca al cliente por su correo electrónico para asignarle la reserva
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Buscar Cliente
        </h3>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchClient()}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Button
            text={searchLoading ? "Buscando..." : "Buscar"}
            style="primary"
            iconName="search"
            onClick={handleSearchClient}
            disabled={searchLoading}
          />
        </div>

        {searchLoading && (
          <div className="text-center py-8">
            <Loading />
            <p className="text-slate-600 mt-2">Buscando cliente...</p>
          </div>
        )}

        {!searchLoading && searched && !clientFound && (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-xl mb-2">😕</p>
            <p className="text-slate-600 font-medium">
              No se encontró ningún cliente con ese correo
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Verifica el correo e intenta nuevamente
            </p>
          </div>
        )}

        {clientFound && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-green-800 mb-3">
                  Cliente Encontrado
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Nombre:
                    </span>
                    <span className="text-sm text-slate-600">
                      {clientFound.primer_nombre} {clientFound.primer_apellido}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Correo:
                    </span>
                    <span className="text-sm text-slate-600">
                      {clientFound.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Documento:
                    </span>
                    <span className="text-sm text-slate-600">
                      {clientFound.documento || "No registrado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Resumen de la Reserva
        </h3>

        {(() => {
          const reservaDatos = JSON.parse(
            localStorage.getItem("reservaDatos") || "{}"
          );
          return (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-700">Habitaciones:</span>
                <span className="font-semibold text-slate-800">
                  ${(reservaDatos.subtotalHabitaciones || 0).toLocaleString()}{" "}
                  COP
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-700">Servicios adicionales:</span>
                <span className="font-semibold text-slate-800">
                  ${(reservaDatos.subtotalServicios || 0).toLocaleString()} COP
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3 mt-2">
                <span className="text-lg font-bold text-green-800">TOTAL:</span>
                <span className="text-2xl font-bold text-green-700">
                  ${(reservaDatos.totalGeneral || 0).toLocaleString()} COP
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          style="exit"
          text="Cancelar"
          iconName="back"
          onClick={() => setNav(0)}
        />
        <Button
          style="primary"
          text="Confirmar y Crear Reserva"
          iconName="check"
          onClick={handleConfirmClient}
          disabled={!clientFound}
          className={!clientFound ? "opacity-60 cursor-not-allowed" : ""}
        />
      </div>
    </div>
  );
}

function AdminConfirmReservation({ setNav }) {
  const [loading, setLoading] = useState(false);
  const {handleConfirmWithEmail} = useConfirmReservation(setNav);

  const rangeData = JSON.parse(localStorage.getItem("rangeSeleccionado") || "{}");
  const habitacionesData = JSON.parse(localStorage.getItem("habitacionesSeleccionadas") || "[]");
  const huespedesData = JSON.parse(localStorage.getItem("reservaHuespedes") || "{}");
  const serviciosData = JSON.parse(localStorage.getItem("serviciosAdicionalesAdmin") || "{}");
  const reservaDatos = JSON.parse(localStorage.getItem("reservaDatos") || "{}");
  const clienteData = JSON.parse(localStorage.getItem("clienteSeleccionado") || "{}");

  const startDate = rangeData.startDate ? new Date(rangeData.startDate) : null;
  const endDate = rangeData.endDate ? new Date(rangeData.endDate) : null;

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">✅</span>
          Confirmar Reserva
        </h2>
        <p className="text-blue-100">
          Revisa todos los detalles antes de confirmar la reserva
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Información del Cliente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Nombre completo</p>
            <p className="font-semibold text-slate-800">
              {clienteData.primer_nombre} {clienteData.segundo_nombre || ""} {clienteData.primer_apellido} {clienteData.segundo_apellido || ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Correo electrónico</p>
            <p className="font-semibold text-slate-800">{clienteData.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Documento</p>
            <p className="font-semibold text-slate-800">
              {clienteData.documento || "No registrado"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Fechas y Huéspedes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">Check-in</p>
            <p className="font-semibold text-slate-800">
              {startDate ? format(startDate, "dd/MM/yyyy") : "No definido"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Check-out</p>
            <p className="font-semibold text-slate-800">
              {endDate ? format(endDate, "dd/MM/yyyy") : "No definido"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Noches</p>
            <p className="font-semibold text-slate-800">
              {calculateNights()} noche{calculateNights() > 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Adultos</p>
            <p className="font-semibold text-slate-800">
              {huespedesData.adultos || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Niños</p>
            <p className="font-semibold text-slate-800">
              {huespedesData.ninos || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🛏️</span>
          Habitaciones Seleccionadas
        </h3>
        <div className="space-y-2">
          { habitacionesData.length > 0 ? (
            habitacionesData.map((room, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="font-medium text-slate-800">
                  Habitación #{room}
                </span>
                <span className="text-sm text-slate-600">
                  {calculateNights()} noche{calculateNights() > 1 ? "s" : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No hay habitaciones seleccionadas</p>
          )}
        </div>
      </div>

      {Object.keys(serviciosData).length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🛎️</span>
            Servicios Adicionales
          </h3>
          <div className="space-y-2">
            {Object.entries(serviciosData).map(([serviceId, cantidad]) => (
              cantidad > 0 && (
                <div
                  key={serviceId}
                  className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="font-medium text-slate-800">
                    Servicio ID: {serviceId}
                  </span>
                  <span className="text-sm text-slate-600">
                    Cantidad: {cantidad}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-300 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          Resumen de Costos
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Subtotal Habitaciones:
            </span>
            <span className="font-semibold text-slate-800">
              ${(reservaDatos.subtotalHabitaciones || 0).toLocaleString("es-CO")} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Servicios Adicionales:
            </span>
            <span className="font-semibold text-slate-800">
              ${(reservaDatos.subtotalServicios || 0).toLocaleString("es-CO")} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-4 bg-white rounded-lg px-4 mt-2">
            <span className="text-xl font-bold text-green-800">
              TOTAL A PAGAR:
            </span>
            <span className="text-3xl font-bold text-green-700">
              ${(reservaDatos.totalGeneral || 0).toLocaleString("es-CO")} COP
            </span>
          </div>
        </div>
      </div>

      <div className=" p-6">
        {loading ? (
          <div className="text-center py-8">
            <Loading />
            <p className="text-slate-600 mt-4 font-medium">
              Creando reserva...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Por favor espera un momento
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              style="exit"
              text="Cancelar"
              iconName="back"
              onClick={() => setNav(0)}
            />
            <Button
              style="primary"
              text="Confirmar Reserva"
              iconName="check"
              onClick={()=>handleConfirmWithEmail().then(() => setNav(0))}
              className="sm:px-8"
            />
          </div>
        )}
      </div>
    </div>
  );
}