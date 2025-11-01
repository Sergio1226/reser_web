import { Table } from "../../components/Table.jsx";
import { Button } from "../../components/Button.jsx";
import { useState, useEffect } from "react";
import { getUserBookings, cancelBooking } from "../../utils/Api.jsx";
import { Loading } from "../../components/Animate.jsx";
import { Icon } from "../../components/Icon.jsx";

function CancelBookingModal({ isOpen, onClose, onConfirm, bookingInfo }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-[scale-in_0.2s_ease-out]">
        <Button
          onClick={onClose}
          style="exit"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors "
        >
          <Icon name="exit" style="mr-0 " />
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="Warning" style="size-[30px] mr-0" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Cancelar Reserva
          </h2>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas cancelar esta reserva?
          </p>

          {bookingInfo && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.cliente}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.checkIn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.checkOut}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Habitación(es):</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.habitaciones}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm text-red-600 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No, mantener
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <>Cancelando...</> : "Sí, cancelar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { formatted, ids: bookingIds } = await getUserBookings();
      if (!formatted || !bookingIds) {
        throw new Error("Error al obtener las reservas del usuario");
      }
      setIds(bookingIds);
      setBookings(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const headers = [
    "Cliente",
    "Check-In",
    "Check-Out",
    "Habitaciones",
    "Fecha de reserva",
    "Estado",
    "Precio",
  ];

  const handleCancelClick = (index) => {
    const booking = bookings[index];
    const bookingId = ids[index];

    setSelectedBooking({
      id: bookingId,
      cliente: booking[0],
      checkIn: booking[1],
      checkOut: booking[2],
      habitaciones: booking[3],
    });
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelBooking(selectedBooking.id);
      await fetchBookings();
      setIsModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center">
        <Loading />
        <p>Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div >
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          Mis Reservas
        </h2>
        <p className="text-blue-100">
          Gestiona y visualiza todas tus reservas activas
        </p>
      </div>

      <div className="grid grid-rows-1 md:grid-cols-2 gap-4 mb-6 items-center">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-md h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">
                Reservas Activas
              </p>
              <p className="text-3xl font-bold text-green-700">
                {bookings.filter((b) => b[5] === "Confirmada").length}
              </p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium mb-1">
                Reservas Canceladas
              </p>
              <p className="text-3xl font-bold text-red-700">
                {bookings.filter((b) => b[5] !== "Confirmada").length}
              </p>
            </div>
            <div className="text-4xl">
              <Icon name="exit" style="size-[40px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table headers={headers} info={bookings} ids={ids}>
          {(index) => {
            const booking = bookings[index];
            const estado = booking[5];
            const isCancelada = estado !== "Confirmada";

            return (
              <div className="flex flex-col items-center justify-center flex-1 gap-2">
                {isCancelada ? (
                  <span className="text-gray-400 text-sm font-medium">
                    Cancelada
                  </span>
                ) : (
                  <Button
                    style="exit"
                    className="w-fit"
                    text="CANCELAR"
                    onClick={() => handleCancelClick(index)}
                  />
                )}
              </div>
            );
          }}
        </Table>
      </div>

      <CancelBookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmCancel}
        bookingInfo={selectedBooking}
      />
    </div>
  );
}
