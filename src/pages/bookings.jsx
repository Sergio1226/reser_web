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

const rooms = [
  {
    id: 1,
    name: "Habitación Pericos",
    price: 160000,
    image: "https://picsum.photos/800/600",
    services: [
      { icon: "bath", label: "Baño Privado" },
      { icon: "wifi", label: "Wifi" },
      { icon: "tv", label: "Televisión" },
    ],
    description:
      "Disfruta de una estadía cómoda y tranquila con todas las comodidades que necesitas",
    details: [
      "Baño privado con ducha de agua caliente",
      "WiFi gratuito de alta velocidad",
      "Televisión por cable",
      "Limpieza diaria bajo solicitud",
      "Cama cómoda y ropa de cama limpia",
      "Buena ventilación e iluminación",
      "Artículos de aseo incluidos",
    ],
  },
  {
    id: 2,
    name: "Habitación Duzgua",
    price: 120000,
    image: "https://picsum.photos/800/600",
    services: [
      { icon: "bath", label: "Baño compartido" },
      { icon: "wifi", label: "Wifi" },
      { icon: "tv", label: "Televisión" },
    ],
    description: "Ideal para quienes buscan comodidad a buen precio",
    details: [
      "Vista a la montaña",
      "Camas dobles con sábanas limpias",
      "Espacio ventilado",
    ],
  },
];
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
  const [countAdults, setCountAdults] = useState(1);
  const [countChildrens, setCountChildrens] = useState(0);
  const [countRooms, setCountRooms] = useState(1);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <>
      <div className=" flex flex-col border border-black/20 rounded-lg space-y-5 bg-primary shadow-md  p-8">
        <div className="flex md:flex-row flex-col bg-white border  border-black/20 rounded-lg justify-center shadow-md ">
          <div className="flex p-4 items-center relative">
            <Calendar range={range} setRange={setRange} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Check In - Check Out</span>
              <span className="text-gray-500 text-sm font-normal font-primary">
                {`${format(range[0].startDate, "dd/MM/yy")} - ${format(
                  range[0].endDate,
                  "dd/MM/yy"
                )}`}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4 p-4 border-l border-black/20 ">
            <Icon name={"Guest"} alt="Huespedes" style="size-item " />
            <div className="flex flex-col [&>*]:justify-center [&>*]:text-center space-y-2">
              <div className="text-neutral-700 text-sm font-medium">
                Numero de Huespedes
              </div>
              <div className="text-zinc-500 text-base font-medium">Adultos</div>
              <Counter count={countAdults} setCount={setCountAdults} min={1} />

              <div className="text-zinc-500 text-base font-medium">Niños</div>
              <Counter count={countChildrens} setCount={setCountChildrens} min={0}/>
            </div>
          </div>

          <div className="flex flex-row items-center space-x-4 p-4 border-l border-black/20">
            <Icon name={"Bed"} alt="Habitaciones" style="size-item " />
            <div className="flex flex-col space-y-2">
              <div className="text-neutral-700 text-sm font-medium">
                Numero de Habitaciones
              </div>
              <Counter count={countRooms} setCount={setCountRooms} min={1}/>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 border-l border-black/20">
            <Button
              text="Buscar"
              style="w-40 h-[50px] bg-secondary"
              iconName="Search"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 p-4 gap-4">
          {rooms.map((r) => (
            <RoomCard key={r.id} {...r} />
          ))}
        </div>
      </div>
      <Button
        text="Reservar"
        style=" bg-button_primary"
        onClick={() => setNav(2)}
        iconName="Contact form"
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
    //   <div className="w-fit border border-black/20 shadow-md rounded-md overflow-hidden">
    //     <table className="w-full table-auto text-sm bg-white">
    //       <thead
    //         className=" border-b px-4 py-2 text-left text-xs
    // [&>*]:p-4 text-center text-xs"
    //       >
    //         <tr>
    //           <th>Reservado en</th>
    //           <th>Check-In</th>
    //           <th>Check-Out</th>
    //           <th>Habitación</th>
    //           <th>Fecha de Reserva</th>
    //           <th>Estado Reserva</th>
    //           <th>Precio</th>
    //           <th className="p-4 text-center">Acciones</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {bookings.map((b, idx) => (
    //           <BookingRow key={idx} booking={b} />
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
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
          style={"bg-button_primary h-fit"}
          iconName={"back"}
          text={"Atras"}
          onClick={() => setNav(0)}
        />
        <Button style={" bg-black text-white rounded-lg hover:bg-gray-900"}>
          Continuar con la reserva
        </Button>
      </div>
    </div>
  );
}
