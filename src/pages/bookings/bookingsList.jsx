import { Table } from "../../components/Table.jsx";
import { Button } from "../../components/Button.jsx";
import { useState } from "react";
import { useUserBookings } from "../../utils/useUserBookings.js";
import { Loading } from "../../components/Animate.jsx";
import { Icon } from "../../components/Icon.jsx";
import { CancelBookingModal } from "../../components/CancelBooking.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { Hamburger } from "lucide-react";

export  function BookingTable() {
  const { bookings, loading, cancelling, cancelBooking } = useUserBookings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { openPopup } = usePopup();

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(bookings.length / rowsPerPage);

const sortedBookings = [...bookings].sort((a, b) => {
  if (a.status === "Confirmada" && b.status !== "Confirmada") return -1;
  if (a.status !== "Confirmada" && b.status === "Confirmada") return 1;})

  const paginatedBookings = sortedBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );


  const headers = [
    "Fecha de reserva",
    "Check-In",
    "Check-Out",
    "Habitaciones",
    "Estado de reserva",
    "Precio",
  ];

  if (loading)
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <Loading />
        <p className="text-slate-600 font-medium">Cargando tus reservas...</p>
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <p className="text-slate-600 font-medium">
          No tienes reservas registradas
        </p>
      </div>
    );

  const activeBookings = bookings.filter(
    (b) => b.status === "Confirmada"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status !== "Confirmada"
  ).length;

  const info = paginatedBookings.map((b) => [
    b.reservationDate,
    b.checkIn,
    b.checkOut,
    b.room,
    b.status,
    b.price,
  ]);

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <CancelBookingModal onClose={() => setIsModalOpen(false)} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">
                Reservas Activas
              </p>
              <p className="text-3xl font-bold text-green-700">
                {activeBookings}
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
                {cancelledBookings}
              </p>
            </div>
            <div className="text-4xl">
              <Icon name="exit" style="size-[40px]" />
            </div>
          </div>
        </div>
      </div>

      <Table
        headers={headers}
        info={info}
        children={(index) => {
          const booking = paginatedBookings[index];
          return booking.status === "Confirmada" ? (
            <Button
              className="bg-red-300 text-red-700 px-3 py-2 rounded-lg hover:bg-red-500 transition-colors font-medium"
              onClick={() =>{setSelectedBooking({...booking, habitaciones: booking.room}) ; setIsModalOpen(true)}}
              disabled={cancelling === booking.id}
            >
              {cancelling === booking.id ? "Cancelando..." : "CANCELAR"}
            </Button>
          ) : (
            <span className="text-slate-400 font-semibold">—</span>
          );
        }}
      />

      <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
        <Button
          style=""
          className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ← Anterior
        </Button>

        <span className="font-medium text-slate-700">
          Página {page} de {totalPages}
        </span>

        <Button
          style=""
          className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Siguiente →
        </Button>
      </div>
       <CancelBookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={() => cancelBooking(selectedBooking,openPopup)}
        bookingInfo={selectedBooking}
      />
    </div>
  );
}