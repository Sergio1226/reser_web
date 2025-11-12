import { Button } from "./Button.jsx";

export function BookingDetails({ isOpen, onClose, bookingInfo }) {
  if (!isOpen || !bookingInfo) return null;

  const servicios = bookingInfo.servicios || [];
  const habitaciones = bookingInfo.habitaciones || [];

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(bookingInfo.checkOut) - new Date(bookingInfo.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const subtotalHabitaciones = bookingInfo.subtotalHabitaciones || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto border border-slate-200 p-5 sm:p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 text-center">
          Detalles de la reserva
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <p>
            <span className="font-medium">Fecha de reserva:</span>{" "}
            {bookingInfo.reservationDate}
          </p>
          <p>
            <span className="font-medium">Check-in:</span> {bookingInfo.checkIn}
          </p>
          <p>
            <span className="font-medium">Check-out:</span>{" "}
            {bookingInfo.checkOut}
          </p>
          <p>
            <span className="font-medium">Habitaciones:</span>{" "}
            {bookingInfo.room}
          </p>
          <p>
            <span className="font-medium">Estado:</span> {bookingInfo.status}
          </p>

          <hr className="my-3" />

          <p className="font-semibold text-slate-800">
            Detalle de habitaciones:
          </p>
          {habitaciones.length === 0 ? (
            <p className="text-slate-500 text-xs">
              No hay habitaciones asociadas a esta reserva.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 border border-slate-100 rounded-lg">
              {habitaciones.map((h, idx) => (
                <li key={idx} className="py-2 px-2">
                  <p className="font-medium text-slate-800">{h.descripcion}</p>
                  <p>
                    <span className="font-medium">Precio por noche:</span> $
                    {h.precio?.toLocaleString() || 0}
                  </p>
                  <p>
                    <span className="font-medium">Noches:</span> {nights}
                  </p>
                  <p>
                    <span className="font-medium">Subtotal:</span> $
                    {(h.precio * nights).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p className="font-semibold text-slate-800 mt-3">
            Subtotal habitaciones:
          </p>
          <p>${subtotalHabitaciones.toLocaleString()}</p>

          <hr className="my-3" />

          <p className="font-semibold text-slate-800">Servicios adicionales:</p>
          {servicios.length === 0 ? (
            <p className="text-slate-500 text-xs">
              No hay servicios adicionales asociados.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 border border-slate-100 rounded-lg">
              {servicios.map((s, idx) => (
                <li key={idx} className="py-2 px-2">
                  <p className="font-medium text-slate-800">{s.nombre}</p>
                  <p>
                    <span className="font-medium">Tipo cobro:</span>{" "}
                    {s.tipo_cobro}
                  </p>
                  <p>
                    <span className="font-medium">Precio unitario:</span> $
                    {s.precio_unitario?.toLocaleString() || 0}
                  </p>
                  <p>
                    <span className="font-medium">Cantidad total:</span>{" "}
                    {s.cantidadTotal}
                  </p>
                  <p>
                    <span className="font-medium">Total servicio:</span> $
                    {s.total?.toLocaleString() || 0}
                  </p>
                  {s.fechas?.length > 0 && (
                    <p>
                      <span className="font-medium">Fechas:</span>{" "}
                      {s.fechas.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <hr className="my-3" />

          <p className="font-semibold text-slate-800 text-right">
            Total general:{" "}
            <span className="text-blue-600 text-base sm:text-lg font-bold">
              ${bookingInfo.total.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            className="bg-blue-500 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}