import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import ProfileButton from "../components/ProfileButton.jsx";
import RoomCard from "../components/RoomCard.jsx";
import { Button } from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { NavigationTab } from "../components/NavigationTab.jsx";
import { useState } from "react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Icon } from "../components/Icon.jsx";
import { Counter } from "../components/Counter.jsx";
import { Calendar } from "../components/Calendar.jsx";
import { Table } from "../components/Table.jsx";
import { supabase } from "../utils/supabase";
import { usePopup } from "../utils/PopupContext.jsX"; 

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
  const navigate = useNavigate();
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
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    try {
      setSearchLoading(true);
      setSearched(true);

      const start = new Date(range[0].startDate);
      const end = new Date(range[0].endDate);
      const people = countAdults + countChildrens;

      const { data: reservedData, error: errReserved } = await supabase
        .from("reservas_habitaciones")
        .select(`
          id_habitacion,
          reservas (
            id,
            fecha_entrada,
            fecha_salida,
            estado_reserva
          )
        `)
        .not("reservas.id", "is", null);

      if (errReserved) throw errReserved;

      const reservedIds = (reservedData || [])
      .filter((r) => {
        if (r.reservas?.estado_reserva !== "Confirmada") return false;

        const entrada = new Date(r.reservas.fecha_entrada);
        const salida = new Date(r.reservas.fecha_salida);

        const inicioBusqueda = new Date(start);
        const finBusqueda = new Date(end);

        entrada.setHours(0, 0, 0, 0);
        salida.setHours(0, 0, 0, 0);
        inicioBusqueda.setHours(0, 0, 0, 0);
        finBusqueda.setHours(0, 0, 0, 0);

        const seCruzan = entrada < finBusqueda && salida > inicioBusqueda;

        return seCruzan;
      })
      .map((r) => r.id_habitacion);

      let roomsQuery = supabase
        .from("habitaciones")
        .select(`
          id,
          descripcion,
          precio,
          estado_habitacion,
          habitaciones_camas (
            cantidad,
            camas ( id, nombre , capacidad )
          ),
          habitaciones_caracteristicas (
            caracteristicas ( id, nombre )
          )
        `)
        .eq("estado_habitacion", "Libre");

      if (reservedIds.length > 0) {
        roomsQuery = roomsQuery.not("id", "in", `(${reservedIds.join(",")})`);
      }

      const { data: roomsData, error: errRooms } = await roomsQuery;
      if (errRooms) throw errRooms;

      const allRooms = (roomsData || []).map((room) => {
        const capacidad_total = (room.habitaciones_camas || []).reduce((acc, hc) => {
          const camaCap = hc?.camas?.capacidad || 1;
          return acc + (hc.cantidad || 0) * camaCap;
        }, 0);
        return { ...room, capacidad_total };
      });

      function getCombinationsOfSize(arr, k) {
        const results = [];
        function helper(start, combo) {
          if (combo.length === k) {
            results.push(combo);
            return;
          }
          for (let i = start; i < arr.length; i++) {
            helper(i + 1, combo.concat(arr[i]));
          }
        }
        helper(0, []);
        return results;
      }

      const combos = getCombinationsOfSize(allRooms, countRooms);

      const validCombos = combos.filter(combo =>
        combo.reduce((sum, room) => sum + room.capacidad_total, 0) >= people
      );

      validCombos.sort((a, b) => {
        const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
        const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
        return (capA - people) - (capB - people);
      });

      setAvailableRooms(validCombos);

      if (validCombos.length === 0) {
        openPopup("⚠️ No hay combinaciones disponibles con esos criterios.", "info");
      } else {
        openPopup("✅ Se encontraron combinaciones de habitaciones disponibles.", "success");
      }

    } catch (err) {
      console.error("Error buscando habitaciones:", err);
      openPopup(`❌ Error al buscar habitaciones:\n${err.message || err}`, "warning");
      setAvailableRooms([]);
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col border border-black/20 rounded-lg space-y-5 bg-primary shadow-md p-8">

        <div className="flex md:flex-row flex-col bg-white border border-black/20 rounded-lg justify-center shadow-md">
          <div className="flex p-4 items-center relative">
            <Calendar range={range} setRange={setRange} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Check In - Check Out</span>
              <span className="text-gray-500 text-sm font-normal font-primary">
                {`${format(range[0].startDate, "dd/MM/yy")} - ${format(range[0].endDate, "dd/MM/yy")}`}
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center space-x-4 p-4 border-l border-black/20">
            <Icon name={"Guest"} alt="Huespedes" style="size-item " />
            <div className="flex flex-col [&>*]:justify-center [&>*]:text-center space-y-2">
              <div className="text-neutral-700 text-sm font-medium">Número de Huéspedes</div>
              <div className="text-zinc-500 text-base font-medium">Adultos</div>
              <Counter count={countAdults} setCount={setCountAdults} min={1} />
              <div className="text-zinc-500 text-base font-medium">Niños</div>
              <Counter count={countChildrens} setCount={setCountChildrens} min={0} />
            </div>
          </div>

          <div className="flex flex-row items-center space-x-4 p-4 border-l border-black/20">
            <Icon name={"Bed"} alt="Habitaciones" style="size-item " />
            <div className="flex flex-col space-y-2">
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

        <div className="grid md:grid-cols-2 p-4 gap-4">
          {searchLoading ? (
            <p className="text-center text-gray-500 col-span-2">
              🔄 Buscando habitaciones...
            </p>
          ) : availableRooms.length > 0 ? (
            <>
              <div className="col-span-2 text-green-700 font-semibold mb-2">
                Opciones exactas ({countAdults + countChildrens} huéspedes)
              </div>

              {availableRooms
                .filter(combo =>
                  combo.reduce((sum, r) => sum + r.capacidad_total, 0) === (countAdults + countChildrens)
                )
                .slice(0, 10)
                .map((combo, idx) => (
                  <div key={idx} className="border border-green-300 rounded-lg p-3 mb-4 shadow-sm bg-green-50">
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      Opción {idx + 1} – Capacidad total:{" "}
                      {combo.reduce((s, r) => s + r.capacidad_total, 0)} personas
                    </div>
                    {combo.map(r => {
                      const capacity = r.capacidad_total;
                      const bedType = (r.habitaciones_camas || []).map(hc => ({
                        tipo: hc?.camas?.nombre || "Cama sin nombre",
                        cantidad: hc?.cantidad || 0
                      }));

                      const services = (r.habitaciones_caracteristicas || []).map(hc => ({
                        icon: hc.caracteristicas?.icono || "wifi",
                        label: hc.caracteristicas?.nombre || "Servicio"
                      }));

                      return (
                        <div key={r.id} className="mb-2">
                          <RoomCard
                            id={r.id}
                            price={r.precio ?? 0}
                            image="https://via.placeholder.com/400x250?text=Habitación"
                            services={services}
                            description={r.descripcion ?? "Sin descripción disponible"}
                            capacity={capacity}
                            bedType={bedType}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}

              <div className="col-span-2 text-blue-700 font-semibold mt-6 mb-2">
                Otras opciones (capacidad superior)
              </div>

              {availableRooms
                .filter(combo =>
                  combo.reduce((sum, r) => sum + r.capacidad_total, 0) > (countAdults + countChildrens)
                )
            
                .filter(combo =>
                  combo.reduce((sum, r) => sum + r.capacidad_total, 0) === (countAdults + countChildrens + 1)
                )
                .sort((a, b) => {
                  const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
                  const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
                  return capA - capB;
                })
                .map((combo, idx) => (
                  <div
                    key={idx}
                    className="border border-blue-200 rounded-lg p-3 mb-4 shadow-sm bg-blue-50"
                  >
                    <div className="text-sm text-gray-600 font-semibold mb-2">
                      Opción {idx + 1} – Capacidad total:{" "}
                      {combo.reduce((s, r) => s + r.capacidad_total, 0)} personas
                    </div>
                    {combo.map(r => {
                      const capacity = r.capacidad_total;
                      const bedType = (r.habitaciones_camas || []).map(hc => ({
                        tipo: hc?.camas?.nombre || "Cama sin nombre",
                        cantidad: hc?.cantidad || 0,
                      }));

                      const services = (r.habitaciones_caracteristicas || []).map(hc => ({
                        icon: hc.caracteristicas?.icono || "wifi",
                        label: hc.caracteristicas?.nombre || "Servicio",
                      }));

                      return (
                        <div key={r.id} className="mb-2">
                          <RoomCard
                            id={r.id}
                            price={r.precio ?? 0}
                            image="https://via.placeholder.com/400x250?text=Habitación"
                            services={services}
                            description={r.descripcion ?? "Sin descripción disponible"}
                            capacity={capacity}
                            bedType={bedType}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
            </>
          ) : searched ? (
            <p className="text-center text-gray-600 col-span-2">
              😕 No hay combinaciones disponibles con los criterios seleccionados.
            </p>
          ) : (
            <p className="text-center text-gray-400 col-span-2">
              🔍 Realiza una búsqueda para ver habitaciones disponibles.
            </p>
          )}
        </div>
      </div>

      <Button
        text="Continuar"
        style="primary"
        onClick={() => setNav(2)}
        iconName="Next"
        disabled={!availableRooms.length}
      />
    </>
  );
}

function BookingTable() {
  const bookings = [
    [
      "19/04/2025",
      "21/05/2025",
      "25/05/2025",
      "Pericos",
      "20/04/2025",
      "Confirmada",
      "$600.000",
    ],
    [
      "23/04/2025",
      "17/02/2025",
      "27/05/2025",
      "Zanoha",
      "27/04/2025",
      "Confirmada",
      "$650.000",
    ],
    [
      "19/03/2025",
      "09/05/2025",
      "25/05/2025",
      "Duzgua",
      "20/04/2025",
      "Confirmada",
      "$530.000",
    ],
  ];
  const headers = [
    "Reservado en",
    "Check-In",
    "Check-Out",
    "Habitación",
    "Fecha de reserva",
    "Estado de reserva",
    "Precio",
  ];

  return (
    <div className="w-3/4">
      <Table headers={headers} info={bookings}>
        <div className=" flex flex-col items-center justify-center flex-1">
          <Button style={"bg-red-400 text-white font-semibold"}>
            CANCELAR
          </Button>
        </div>
      </Table>
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <tr className="border-b [&>*]:p-4 text-center">
      <td>{booking.reservedOn}</td>
      <td>{booking.checkIn}</td>
      <td>{booking.checkOut}</td>
      <td>{booking.room}</td>
      <td>{booking.reservationDate}</td>
      <td className=" text-green-700 font-medium">{booking.status}</td>
      <td>{booking.price}</td>
    </tr>
  );
}

function ExtraServices({ setNav }) {
  const reservationCode = "12345";
  const services = [
    {
      id: 1,
      name: "Senderismo",
      description: "Paseo a pie por el páramo de Ocetá",
      price: 40000,
      unit: "Persona",
    },
    {
      id: 2,
      name: "Desayuno",
      description: "Comida casera hecha para comenzar el día",
      price: 10000,
      unit: "Persona",
    },
    {
      id: 3,
      name: "Parqueadero",
      description: "Espacio seguro para tu vehículo",
      price: 10000,
      unit: "Vehículo",
    },
    {
      id: 4,
      name: "Paseo",
      description: "Tour por el pueblo",
      price: 10000,
      unit: "Persona",
    },
  ];

  const [selected, setSelected] = useState({});

  const setServiceCount = (id, value) => {
    setSelected((prev) => {
      if (value <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: value };
    });
  };

  const total = services.reduce((acc, s) => {
    const qty = selected[s.id] || 0;
    return acc + qty * s.price;
  }, 0);

  return (
    <div className="max-w-md mx-auto bg-primary border border-black/20 rounded-lg shadow-md p-4">
      <h2 className="text-center text-lg font-semibold mb-2">
        Servicios adicionales
      </h2>
      <p className="text-sm text-gray-700 mb-4">
        Código de reserva: <span className="font-bold">{reservationCode}</span>
      </p>

      <div className="space-y-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white p-3 rounded-lg shadow-md flex flex-col gap-1"
          >
            <h3 className="font-medium">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.description}</p>
            <p className="text-sm font-semibold">
              Precio: {s.price.toLocaleString()} COP/{s.unit}
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

      <div className="mt-4 pt-2 flex justify-between font-semibold">
        <span>TOTAL A PAGAR:</span>
        <span>{total.toLocaleString()} COP</span>
      </div>
      <div className="flex items-center justify-center mt-3 py-4 space-x-2">
        <Button
          style={"exit"}
          iconName={"back"}
          text={"Atras"}
          onClick={() => setNav(0)}
        />
        <Button style={"primary"}>
          Continuar con la reserva
        </Button>
      </div>
    </div>
  );
}
