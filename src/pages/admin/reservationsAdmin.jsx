import { useState, useEffect } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Picker } from "../../components/Picker.jsx";
import { TableArray } from "../../components/Table.jsx";
import { Button } from "../../components/Button.jsx";
import { CalendarSingle } from "../../components/Calendar.jsx";
import { getReservationsByDate, getFullReservationDetails } from "../../utils/Api.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { Loading } from "../../components/Animate.jsx";
import { BookingDetails } from "../../components/BookingsDetails.jsx";

export function Reservations() {
  const { openPopup } = usePopup();
  const [status, setStatus] = useState(1);
  const [date, setDate] = useState(new Date());
  const statuses = ["Reserva", "Entrada", "Salida"];
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterLabel, setFilterLabel] = useState({ status: status - 1, date: new Date() });

  const headers = [
    "Nombre del cliente",
    "Fecha de entrada",
    "Fecha de salida",
    "Habitación(es)",
    "Fecha de reservación",
    "Estado de reserva",
    "Precio",
  ];

 const transformApiDataToRows = (dataArray = []) => {
  return dataArray.map((item) => {
    if (Array.isArray(item)) {
      const idReserva = item[item.length - 1];
      
      let precio = item[6];
      if (precio != null) {
        const numericPrice = Number(precio.toString().replace(/\D/g, ''));
        precio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(numericPrice);
      } else {
        precio = "—";
      }

      return [
        item[0] ?? "—",
        item[1] ?? "—",
        item[2] ?? "—",
        item[3] ?? "—",
        item[4] ?? "—",
        item[5] ?? "—",
        precio,
        idReserva ?? undefined,
      ];
    }

    const habitacionesStr = Array.isArray(item.habitaciones)
      ? item.habitaciones.join(", ")
      : item.habitaciones ?? "—";

    const precio = item.precio != null 
      ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(item.precio))
      : "—";

    return [
      item.nombre_cliente ?? "—",
      item.fecha_entrada ?? "—",
      item.fecha_salida ?? "—",
      habitacionesStr,
      item.fecha_reservacion ?? "—",
      item.estado_reserva ?? "—",
      precio,
      item.id ?? undefined,
    ];
  });
};

  const handleSearch = async () => {
    setFilterLabel({ status: status - 1, date });
    if (status === 0) {
      openPopup("Por favor seleccione una fecha válida", "warning");
      return;
    }

    try {
      setLoading(true);
      const result = await getReservationsByDate(date, status - 1);
      const data = result?.data ?? [];
      const ids = result?.ids ?? [];
      const rows = transformApiDataToRows(data, ids);
      setBookings(rows);
    } catch (error) {
      openPopup(error?.message || "Error al buscar reservas", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadToday = async () => {
      try {
        setLoading(true);
        const result = await getReservationsByDate(new Date(), 0);
        const data = result?.data ?? [];
        const ids = result?.ids ?? [];
        const rows = transformApiDataToRows(data, ids);
        setBookings(rows);
        console.log("ROWS TRANSFORMADOS:", rows);
        console.log("DATA CRUDA API:", data);
        console.log("IDS DEVUELTOS POR API:", ids);
      } catch (error) {
        openPopup(error?.message || "Error cargando reservas del día", "warning");
      } finally {
        setLoading(false);
      }
    };

    loadToday();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage));

  const handleViewMore = async (row) => {
    const idReserva = row[7];
    if (!idReserva) {
      openPopup("No se encontró el id de la reserva.", "warning");
      return;
    }

    setLoadingDetails(true);
    try {
      const full = await getFullReservationDetails(idReserva);
      setSelectedBooking(full);
      setShowDetails(true);
    } catch (err) {
      console.error("Error cargando detalles:", err);
      openPopup("Error al cargar detalles de la reserva", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mx-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📅</span>
          Reservas de clientes
        </h2>
        <p className="text-blue-100">
          Gestiona y visualiza todas las reservas del hospedaje
        </p>
      </div>

      <div className="flex flex-col space-y-6 p-6 md:p-8 items-center w-full">
        <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-gray-200 shadow-md">
          <p className="text-2xl font-bold text-green-900">Filtrar reservas por fecha</p>

          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
            <Picker text="Fecha de" options={statuses} onChange={setStatus} value={status} />

            <div className="flex items-center relative bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <CalendarSingle date={date} setDate={setDate} />
            </div>

            <Button text="Buscar" style="secondary" iconName="search" onClick={handleSearch} />
          </div>
        </div>

        {loading ? (
          <div className="w-full max-w-6xl mx-auto flex justify-center flex-col items-center py-8">
            <Loading />
            <p className="mt-4 text-gray-600">Buscando reservas...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 flex-1 p-8">
            <p className="text-gray-700 text-xl font-semibold">No hay reservas para mostrar</p>
            <p className="text-gray-500 text-center max-w-md">Selecciona una fecha y tipo de fecha para ver los resultados</p>
          </div>
        ) : (
          <div className="w-full max-w-6xl">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4 border-l-4 border-green-600">
              <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">✓</span>
                Solicitudes de {statuses[filterLabel.status].toLowerCase()} para el{" "}
                {filterLabel.date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Se encontraron {bookings.length} {bookings.length === 1 ? "reserva" : "reservas"}
              </p>
            </div>

            <TableArray headers={headers} info={currentBookings}>
              {(row) => (
                <div className="flex flex-col items-center justify-center space-y-2 flex-1 p-2">
                  <Button text="Ver más" style="primary" onClick={() => handleViewMore(row)} />
                  <Button text="No se presento" style="exit" onClick={() => openPopup("Marcado como no presentado (temporal)", "info")} />
                </div>
              )}
            </TableArray>

            <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm mt-4">
              <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                ← Anterior
              </Button>

              <span className="font-medium text-slate-700">Página {currentPage} de {totalPages}</span>

              <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                Siguiente →
              </Button>
            </div>
          </div>
        )}
      </div>

      <BookingDetails isOpen={showDetails} onClose={() => { setShowDetails(false); setSelectedBooking(null); }} bookingInfo={selectedBooking} />
    </div>
  );
}
