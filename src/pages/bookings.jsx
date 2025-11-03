import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import ProfileButton from "../components/ProfileButton.jsx";
import RoomCard from "../components/RoomCard.jsx";
import { Button } from "../components/Button.jsx";
import { NavigationTab } from "../components/NavigationTab.jsx";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Icon } from "../components/Icon.jsx";
import { Counter } from "../components/Counter.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { usePopup } from "../utils/PopupContext.jsX"; 
import { searchAvailableRooms } from "../utils/useSearchRooms";
import { useState } from "react";
import { useExtraServices } from "../utils/useExtraServices";
import { useUserBookings } from "../utils/useUserBookings";
import { useConfirmReservation } from "../utils/useConfirmReservation";
import { supabase } from "../utils/supabase";

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

  return (
    <div className=" min-h-screen flex flex-col font-primary">
      <Header>
        <ProfileButton toPag={"/login"} />
      </Header>

      <main className="bg-secondary flex flex-col flex-1 items-center justify-center p-8 space-y-8 shadow-lg ">
        {nav < 2 && (
          <NavigationTab state={nav} setState={setNav} options={options} />
        )}
        {nav === 0 && <BookingSearch setNav={setNav} />}
        {nav === 1 && <BookingTable />}
        {nav === 2 && <ExtraServices setNav={setNav} />}
        {nav === 3 && <ConfirmReservation setNav={setNav} />}
      </main>

      <Footer />
    </div>
  );
}

function BookingSearch({ setNav }) {
  const { openPopup } = usePopup();

  const [countAdults, setCountAdults] = useState(1);
  const [countChildrens, setCountChildrens] = useState(0);
  const [countRooms, setCountRooms] = useState(1);
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
  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleSelectCombo = (combo) => {
    const isSame = selectedCombo === combo;
    setSelectedCombo(isSame ? null : combo);

    if (isSame) {
      localStorage.removeItem("rangeSeleccionado");
      localStorage.removeItem("habitacionesSeleccionadas");
    } else {
      localStorage.setItem(
        "rangeSeleccionado",
        JSON.stringify({
          startDate: range[0].startDate.toISOString(),
          endDate: range[0].endDate.toISOString(),
        })
      );
      localStorage.setItem(
        "habitacionesSeleccionadas",
        JSON.stringify({
          habitaciones: combo.map((r) => Number(r.id)),
          adultos: Number(countAdults),
          ninos: Number(countChildrens),
        })
      );
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearched(true);
    setSelectedCombo(null);
    localStorage.removeItem("rangeSeleccionado");
    localStorage.removeItem("habitacionesSeleccionadas");

    const validCombos = await searchAvailableRooms({
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      countAdults,
      countChildrens,
      countRooms,
      openPopup,
    });

    setAvailableRooms(validCombos);
    setSearchLoading(false);
  };

  const totalPrice =
    selectedCombo?.reduce((sum, r) => sum + (r.precio || 0), 0) || 0;

  const recommendedCombos = availableRooms
    .filter((combo) => {
      const totalCap = combo.reduce((s, r) => s + r.capacidad_total, 0);
      return totalCap >= countAdults + countChildrens &&
            totalCap <= countAdults + countChildrens + 1;
    })
    .sort((a, b) => {
      const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
      const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
      return capA - capB;
    })
    .slice(0, 10);

  const otherCombos = availableRooms
    .filter((combo) => {
      const totalCap = combo.reduce((s, r) => s + r.capacidad_total, 0);
      return totalCap > countAdults + countChildrens + 1;
    })
    .sort((a, b) => {
      const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
      const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
      return capA - capB;
    })
    .slice(0, 10);

  return (
    <div className="flex flex-col border border-black/20 rounded-lg space-y-5 bg-primary shadow-md p-8">

      <div className="flex md:flex-row flex-col bg-white border border-black/20 rounded-lg justify-center shadow-md">
        <div className="flex p-4 items-center relative">
          <Calendar range={range} setRange={setRange} />
          <div className="flex flex-col ml-4">
            <span className="text-sm font-medium">Check In - Check Out</span>
            <span className="text-gray-500 text-sm font-normal font-primary">
              {`${format(range[0].startDate, "dd/MM/yy")} - ${format(range[0].endDate, "dd/MM/yy")}`}
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4 p-4 border-l border-black/20">
          <Icon name="Guest" alt="Huespedes" style="size-item" />
          <div className="flex flex-col [&>*]:justify-center [&>*]:text-center space-y-2 ml-2">
            <div className="text-neutral-700 text-sm font-medium">Número de Huéspedes</div>
            <div className="text-zinc-500 text-base font-medium">Adultos</div>
            <Counter count={countAdults} setCount={setCountAdults} min={1} />
            <div className="text-zinc-500 text-base font-medium">Niños</div>
            <Counter count={countChildrens} setCount={setCountChildrens} min={0} />
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4 p-4 border-l border-black/20">
          <Icon name="Bed" alt="Habitaciones" style="size-item" />
          <div className="flex flex-col space-y-2 ml-2">
            <div className="text-neutral-700 text-sm font-medium">Número de Habitaciones</div>
            <Counter count={countRooms} setCount={setCountRooms} min={1} />
          </div>
        </div>

        <div className="flex items-center justify-center p-4 border-l border-black/20">
          <Button
            text={searchLoading ? "Buscando..." : "Buscar"}
            style="secondary"
            iconName="Search"
            onClick={handleSearch}
            disabled={searchLoading}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative">
        <div className="flex-1 grid md:grid-cols-2 p-4 gap-4">
          {searchLoading ? (
            <p className="text-center text-gray-500 col-span-2">🔄 Buscando habitaciones...</p>
          ) : availableRooms.length > 0 ? (
            <>

              {recommendedCombos.length > 0 ? (
                <div className="col-span-2 text-green-700 font-semibold mb-2">Opciones Recomendadas</div>
              ) : (
                <div className="col-span-2 text-gray-500 text-center mb-2">No hay opciones recomendadas</div>
              )}

              {recommendedCombos.map((combo, idx) => {
                const totalCap = combo.reduce((s, r) => s + r.capacidad_total, 0);
                return (
                  <div
                    key={combo.map(r => r.id).join("-")}
                    className="border border-green-300 rounded-lg p-3 mb-4 shadow-sm bg-green-50"
                  >
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      Opción {idx + 1} – Capacidad total: {totalCap} personas
                    </div>

                    <div className="flex justify-center mb-3">
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedCombo === combo
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => handleSelectCombo(combo)}
                      >
                        {selectedCombo === combo ? "Quitar opción" : "Seleccionar opción"}
                      </button>
                    </div>

                    {combo.map((r) => {
                      const capacity = r.capacidad_total;
                      const bedType = (r.habitaciones_camas || []).map((hc) => ({
                        tipo: hc?.camas?.nombre || "Cama sin nombre",
                        cantidad: hc?.cantidad || 0,
                      }));

                      const services = (r.habitaciones_caracteristicas || []).map((hc) => ({
                        icon: hc.caracteristicas?.icono || "wifi",
                        label: hc.caracteristicas?.nombre || "Servicio",
                      }));

                      return (
                        <div key={r.id} className="mb-2">
                          <RoomCard
                            id={r.id}
                            price={r.precio ?? 0}
                            imageNames={[`${r.id}.jpeg`, `${r.id}_Bano.jpeg`]}
                            services={services}
                            description={r.descripcion ?? "Sin descripción disponible"}
                            capacity={capacity}
                            bedType={bedType}
                            selected={selectedCombo === combo}
                            disabled={!!selectedCombo && selectedCombo !== combo}
                            onSelect={() => setSelectedCombo(selectedCombo === combo ? null : combo)}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {otherCombos.length > 0 ? (
                <div className="col-span-2 text-blue-700 font-semibold mt-6 mb-2">Otras Opciones</div>
              ) : (
                <div className="col-span-2 text-gray-500 text-center mt-6 mb-2">No hay otras opciones</div>
              )}

              {otherCombos.map((combo, idx) => {
                const totalCap = combo.reduce((s, r) => s + r.capacidad_total, 0);
                return (
                  <div
                    key={combo.map(r => r.id).join("-")}
                    className="border border-blue-200 rounded-lg p-3 mb-4 shadow-sm bg-blue-50"
                  >
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      Opción {idx + 1} – Capacidad total: {totalCap} personas
                    </div>

                    <div className="flex justify-center mb-3">
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedCombo === combo
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => handleSelectCombo(combo)}
                      >
                        {selectedCombo === combo ? "Quitar opción" : "Seleccionar opción"}
                      </button>
                    </div>

                    {combo.map((r) => {
                      const capacity = r.capacidad_total;
                      const bedType = (r.habitaciones_camas || []).map((hc) => ({
                        tipo: hc?.camas?.nombre || "Cama sin nombre",
                        cantidad: hc?.cantidad || 0,
                      }));

                      const services = (r.habitaciones_caracteristicas || []).map((hc) => ({
                        icon: hc.caracteristicas?.icono || "wifi",
                        label: hc.caracteristicas?.nombre || "Servicio",
                      }));

                      return (
                        <div key={r.id} className="mb-2">
                          <RoomCard
                            id={r.id}
                            price={r.precio ?? 0}
                            imageNames={[`${r.id}.jpeg`, `${r.id}_Bano.jpeg`]}
                            services={services}
                            description={r.descripcion ?? "Sin descripción disponible"}
                            capacity={capacity}
                            bedType={bedType}
                            selected={selectedCombo === combo}
                            disabled={!!selectedCombo && selectedCombo !== combo}
                            onSelect={() => setSelectedCombo(selectedCombo === combo ? null : combo)}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ) : searched ? (
            <p className="text-center text-gray-600 col-span-2">
              😕 No hay habitaciones disponibles con los criterios seleccionados.
            </p>
          ) : (
            <p className="text-center text-gray-400 col-span-2">
              🔍 Realiza una búsqueda para ver habitaciones disponibles.
            </p>
          )}
        </div>

        <div className="md:w-1/4">
          <div className="sticky top-6">
            <div className="p-4 border border-green-300 bg-green-50 rounded-lg shadow-lg text-center max-w-sm mx-auto">
              <h3 className="text-base font-semibold text-green-700 mb-2">Opción seleccionada</h3>

              {selectedCombo ? (
                <>
                  <p className="text-gray-700">
                    <span className="font-medium">Habitaciones:</span>{" "}
                    {selectedCombo.map((r) => `#${r.id}`).join(", ")}
                  </p>
                  <p className="text-gray-800 text-2xl font-bold mt-3">
                    💰 ${totalPrice.toLocaleString("es-CO")}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No hay opción seleccionada</p>
              )}

              <Button
                text="Continuar"
                style="primary"
                iconName="Next"
                onClick={() => {
                  localStorage.setItem("reservaSubtotal", String(totalPrice || 0));
                  setNav(2);
                }}
                disabled={!selectedCombo}
                className={`mt-4 w-full ${!selectedCombo ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingTable() {
  const { bookings, loading, refetchBookings } = useUserBookings();
  const { openPopup } = usePopup();
  const [cancelling, setCancelling] = useState(null);

  const headers = [
    { label: "Reservado en", key: "reservedOn" },
    { label: "Check-In", key: "checkIn" },
    { label: "Check-Out", key: "checkOut" },
    { label: "Habitación", key: "room" },
    { label: "Fecha de reserva", key: "reservationDate" },
    { label: "Estado de reserva", key: "status" },
    { label: "Precio", key: "price" },
  ];

  const handleCancel = async (booking) => {
    const now = new Date();

    // Parsear manualmente la fecha de check-in (YYYY-MM-DD)
    const [year, month, day] = booking.checkIn.split("-").map(Number);
    const checkInDate = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isTodayCheckIn = checkInDate.getTime() === today.getTime();
    const canCancel = checkInDate.getTime() > today.getTime() || (isTodayCheckIn && now.getHours() < 14);

    if (!canCancel) {
      openPopup("❌ No se puede cancelar después de las 2 PM del día de check-in.", "error");
      return;
    }

    try {
      setCancelling(booking.id);

      const { data, error } = await supabase
        .from("reservas")
        .update({ estado_reserva: "Cancelada" })
        .eq("id", Number(booking.id)); // asegurarse que sea número

      console.log("data:", data);
      console.log("error:", error);

      if (error) throw error;

      openPopup("✅ Reserva cancelada con éxito.", "success");

      // Si refetchBookings no existe, usa otra forma de actualizar las reservas
      if (refetchBookings) refetchBookings();

    } catch (err) {
      console.error(err);
      openPopup("❌ Error al cancelar la reserva.", "error");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 font-medium text-gray-600">
        Cargando tus reservas...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-6 font-medium text-gray-600">
        No tienes reservas registradas.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto overflow-x-auto rounded-lg border border-black/20">
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-base font-semibold text-center px-6 py-4 border-b border-black/10 break-words"
              >
                {header.label}
              </th>
            ))}
            <th className="text-base font-semibold text-center px-6 py-4 border-b border-black/10">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr
              key={index}
              className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              {headers.map((header, i) => (
                <td
                  key={i}
                  className="text-center px-6 py-4 border-b border-black/10 break-words"
                  style={{ minWidth: "120px" }}
                >
                  {booking[header.key] ?? "—"}
                </td>
              ))}
              <td className="text-center px-6 py-4 border-b border-black/10">
                {booking.status === "Confirmada" ? (
                  <Button
                    style="bg-red-400 text-white font-semibold px-4 py-2"
                    onClick={() => handleCancel(booking)}
                    disabled={cancelling === booking.id}
                  >
                    {cancelling === booking.id ? "Cancelando..." : "CANCELAR"}
                  </Button>
                ) : (
                  <span className="text-gray-500 font-semibold">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function ExtraServices({ setNav, navState }) {
  const storedSubtotal = Number(localStorage.getItem("reservaSubtotal") || 0);
  const subtotal = navState?.subtotal ?? storedSubtotal ?? 0;

  const {
    services,
    selected,
    loading,
    setServiceCount,
    totalServicios,
    totalGeneral,
  } = useExtraServices(subtotal);

  if (loading) {
    return (
      <div className="text-center py-6 font-medium">
        Cargando servicios adicionales...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-primary border border-black/20 rounded-lg shadow-md p-4">
      <h2 className="text-center text-lg font-semibold mb-2">
        Servicios adicionales
      </h2>

      {services.length === 0 ? (
        <p className="text-center text-sm text-gray-600">
          No hay servicios adicionales disponibles.
        </p>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white p-3 rounded-lg shadow-md flex flex-col gap-1"
            >
              <h3 className="font-medium">{s.nombre}</h3>
              <p className="text-sm text-gray-600">{s.descripcion}</p>
              <p className="text-sm font-semibold">
                Precio: {s.precio.toLocaleString()} COP
              </p>
              <div className="flex items-center justify-center mt-2">
                <Counter
                  count={selected[s.id] || 0}
                  setCount={(val) => setServiceCount(s.id, val)}
                  min={0}
                  max={1000}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-2 border-t border-gray-300">
        <div className="flex justify-between font-medium">
          <span>Subtotal habitaciones:</span>
          <span>{subtotal.toLocaleString()} COP</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Servicios adicionales:</span>
          <span>{totalServicios.toLocaleString()} COP</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>TOTAL A PAGAR:</span>
          <span>{totalGeneral.toLocaleString()} COP</span>
        </div>
      </div>

      <div className="flex items-center justify-center mt-3 py-4 space-x-2">
        <Button style="exit" iconName="back" text="Atrás" onClick={() => setNav(0)} />
        <Button
          style="primary"
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
        >
          Continuar con la reserva
        </Button>
      </div>
    </div>
  );
}


function ConfirmReservation({ setNav }) {
  const { resumen, serviciosInfo, handleConfirm } = useConfirmReservation(setNav);
  const { subtotalHabitaciones, serviciosSeleccionados, totalGeneral } = resumen;

  return (
    <div className="max-w-lg mx-auto bg-primary p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Confirmar Reserva</h2>

      <div className="text-left space-y-3 mb-6">
        <p>
          <strong>Subtotal habitaciones:</strong>{" "}
          {subtotalHabitaciones.toLocaleString()} COP
        </p>

        <p><strong>Servicios adicionales:</strong></p>
        {Object.entries(serviciosSeleccionados).length > 0 ? (
          <ul className="ml-4 list-disc">
            {Object.entries(serviciosSeleccionados).map(([id, count]) => {
              if (count <= 0) return null;
              const info = serviciosInfo[id];
              const precio = info?.precio || 0;
              const subtotalServicio = precio * count;

              return (
                <li key={id}>
                  {info
                    ? `${info.nombre} — ${precio.toLocaleString()} COP × ${count} = ${subtotalServicio.toLocaleString()} COP`
                    : `Servicio #${id} — ${count} unidad${count > 1 ? "es" : ""}`}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="ml-4 text-gray-600">Ninguno</p>
        )}

        <p className="font-bold text-lg mt-2">
          Total: {totalGeneral.toLocaleString()} COP
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button style="exit" text="Atrás" onClick={() => setNav(2)} />
        <Button style="primary" text="Confirmar Reserva" onClick={handleConfirm} />
      </div>
    </div>
  );
}
