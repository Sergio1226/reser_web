/**
 * Formatea las reservas para mostrar en la tabla
 * @param {Array} bookings - Array de reservas con precio_total
 * @returns {Array} Array formateado [Cliente, Check-in, Check-out, Habitaciones, Fecha reserva, Estado, Precio, ID]
 */
export function formatBookings(bookings) {
  const formatted = [];
  const ids = [];
  for (const reserva of bookings) {
    const nombreCompleto = [
      reserva.clientes?.primer_nombre || "",
      reserva.clientes?.segundo_nombre || "",
      reserva.clientes?.primer_apellido || "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const habitacionesIds = (reserva.reservas_habitaciones || [])
      .map((rh) => rh.id_habitacion)
      .join(", ");

    const precioTotal = reserva.precio_total || 0;

    formatted.push([
      nombreCompleto,
      reserva.fecha_entrada,
      reserva.fecha_salida,
      habitacionesIds,
      reserva.fecha_reservacion,
      reserva.estado_reserva,
      `$${precioTotal}`,
    ]);
    ids.push(reserva.id);
  }
  return { formatted, ids };
}

export function formatBookingsByDates(bookings) {
  return bookings.map((booking) => {
    return [booking.nombre_cliente, booking.fecha_entrada, booking.fecha_salida,!booking.habitaciones?'':booking.habitaciones.join(", "),booking.fecha_reservacion,booking.estado_reserva, `$${booking.precio}`, booking.id_reserva];
  });
}