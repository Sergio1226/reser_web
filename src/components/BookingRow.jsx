export function BookingRow({ booking }) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2 text-center">{booking.reservedOn}</td>
      <td className="px-4 py-2 text-center">{booking.checkIn}</td>
      <td className="px-4 py-2 text-center">{booking.checkOut}</td>
      <td className="px-4 py-2 text-center">{booking.room}</td>
      <td className="px-4 py-2 text-center">{booking.reservationDate}</td>
      <td className="px-4 py-2 text-center text-green-700 font-medium">
        {booking.status}
      </td>
      <td className="px-4 py-2 text-center">{booking.price}</td>
      <td className="px-4 py-2 flex items-center justify-center space-x-2">
        <button className="px-3 py-1 rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500">
          CANCELAR
        </button>
      </td>
    </tr>
  );
}