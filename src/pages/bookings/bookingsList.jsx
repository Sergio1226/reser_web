import { useState, useMemo } from "react";
import { Table } from "../../components/Table.jsx";
import { Button } from "../../components/Button.jsx";
import { Loading } from "../../components/Animate.jsx";
import { Icon } from "../../components/Icon.jsx";
import { CancelBookingModal } from "../../components/CancelBooking.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { useUserBookings } from "../../utils/useUserBookings.js";

export function BookingTable() {
  const { bookings, loading, cancelling, cancelBooking } = useUserBookings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { openPopup } = usePopup();

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterDate, setFilterDate] = useState(""); 

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (filterStatus !== "all") {
      result = result.filter(b => b.status === filterStatus);
    }

    if (filterDate) {
      result = result.filter(b => b.reservationDate === filterDate);
    }

    result.sort((a, b) => {
      if (a.status === "Confirmada" && b.status !== "Confirmada") return -1;
      if (a.status !== "Confirmada" && b.status === "Confirmada") return 1;
      return new Date(b.reservationDate) - new Date(a.reservationDate);
    });

    return result;
  }, [bookings, filterStatus, filterDate]);

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const activeBookings = filteredBookings.filter(b => b.status === "Confirmada").length;
  const cancelledBookings = filteredBookings.filter(b => b.status !== "Confirmada").length;

  const headers = [
    { label: "Fecha de reserva", key: "reservationDate" },
    { label: "Check-In", key: "checkIn" },
    { label: "Check-Out", key: "checkOut" },
    { label: "Habitaciones", key: "room" },
    { label: "Estado de reserva", key: "status" },
    { label: "Precio", key: "price" },
  ];

  if (loading)
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <Loading />
        <p className="text-slate-600 font-medium">Cargando tus reservas...</p>
      </div>
    );

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Reservas Activas</p>
              <p className="text-3xl font-bold text-green-700">{activeBookings}</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium mb-1">Reservas Canceladas</p>
              <p className="text-3xl font-bold text-red-700">{cancelledBookings}</p>
            </div>
            <div className="text-4xl">
              <Icon name="exit" style="size-[40px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="flex flex-col w-full md:w-1/3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Estado de reserva
          </label>
          <select
            className="border border-slate-300 rounded-lg p-2.5 h-11 text-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Todas</option>
            <option value="Confirmada">Confirmadas</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de reserva
          </label>
          <input
            type="date"
            className="border border-slate-300 rounded-lg p-2.5 h-11 text-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="block text-sm font-medium text-transparent mb-1 select-none">
            .
          </label>
          <Button
            className="h-11 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors w-full"
            onClick={() => {
              setFilterDate("");
              setFilterStatus("all");
              setPage(1);
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
          <p className="text-slate-600 font-medium">
            ⚠️ No se encontraron reservas con los filtros aplicados.
          </p>
        </div>
      ) : (
        <Table
          headers={headers}
          info={paginatedBookings}
          renderActions={(item) => {
            if (item.status !== "Confirmada") {
              return <span className="text-slate-400 font-semibold">—</span>;
            }

            const now = new Date();
            const [year, month, day] = item.checkIn.split("-").map(Number);
            const checkInDate = new Date(year, month - 1, day);

            const isToday = checkInDate.toDateString() === now.toDateString();
            const canCancel =
              checkInDate > now ||
              (isToday && now.getHours() < 14);

            return (
              <Button
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  canCancel
                    ? "bg-red-300 text-red-700 hover:bg-red-500"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!canCancel) return;
                  setSelectedBooking({ ...item, habitaciones: item.room });
                  setIsModalOpen(true);
                }}
                disabled={!canCancel || cancelling === item.id}
              >
                {cancelling === item.id
                  ? "Cancelando..."
                  : canCancel
                  ? "CANCELAR"
                  : "No disponible"}
              </Button>
            );
          }}
        />
      )}

      {filteredBookings.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
          <Button
            className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            ← Anterior
          </Button>

          <span className="font-medium text-slate-700">Página {page} de {totalPages}</span>

          <Button
            className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Siguiente →
          </Button>
        </div>
      )}

      <CancelBookingModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedBooking(null); }}
        onConfirm={() => cancelBooking(selectedBooking, openPopup)}
        bookingInfo={selectedBooking}
      />
    </div>
  );
}