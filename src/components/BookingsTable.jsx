import { BookingRow } from "./BookingRow";

export function BookingsTable() {
  const bookings = [
    {
      reservedOn: "19/04/2025",
      checkIn: "21/05/2025",
      checkOut: "25/05/2025",
      room: "Pericos",
      reservationDate: "20/04/2025",
      status: "Confirmada",
      price: "$600.000",
    },
    {
      reservedOn: "23/04/2025",
      checkIn: "17/02/2025",
      checkOut: "27/05/2025",
      room: "Zanoha",
      reservationDate: "27/04/2025",
      status: "Confirmada",
      price: "$650.000",
    },
    {
      reservedOn: "19/03/2025",
      checkIn: "09/05/2025",
      checkOut: "25/05/2025",
      room: "Duzgua",
      reservationDate: "20/04/2025",
      status: "Confirmada",
      price: "$530.000",
    },
  ];

  return (
    <div className="w-full border border-black rounded-md overflow-hidden">
      <table className="w-full table-auto text-sm text-neutral-700">
        <thead className="bg-white border-b">
          <tr>
            <th className="px-4 py-2 text-left text-xs">Reservado en</th>
            <th className="px-4 py-2 text-left text-xs">Check-In</th>
            <th className="px-4 py-2 text-left text-xs">Check-Out</th>
            <th className="px-4 py-2 text-left text-xs">Habitación</th>
            <th className="px-4 py-2 text-left text-xs">Fecha de Reserva</th>
            <th className="px-4 py-2 text-left text-xs">Estado Reserva</th>
            <th className="px-4 py-2 text-left text-xs">Precio</th>
            <th className="px-4 py-2 text-center text-xs">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, idx) => (
            <BookingRow key={idx} booking={b} />
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center p-4 border-t">
        <button className="px-2">&lt;</button>
        <span>Página 1</span>
        <button className="px-2">&gt;</button>
      </div>
    </div>
  );
}