import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

export function useUserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        setBookings([]);
        return;
      }

      const { data: reservas, error } = await supabase
        .from("reservas")
        .select(`
          id,
          fecha_reservacion,
          fecha_entrada,
          fecha_salida,
          estado_reserva,
          reservas_habitaciones (
            habitaciones (
              id,
              descripcion,
              precio
            )
          ),
          reservas_servicios (
            id_servicio,
            servicios_adicionales (
              nombre,
              precio,
              tipo_cobro
            )
          )
        `)
        .eq("id_cliente", user.id)
        .order("fecha_entrada", { ascending: false });

      if (error) throw error;

      const formatted = await Promise.all(
        (reservas || []).map(async (r) => {

          const habitaciones = r.reservas_habitaciones?.map((h) => ({
            id: h.habitaciones?.id,
            descripcion: h.habitaciones?.descripcion || "Sin descripción",
            precio: h.habitaciones?.precio || 0,
          })) || [];

          const habitacionesStr = habitaciones.map(h => `#${h.id}`).join(", ") || "—";

          const checkIn = new Date(r.fecha_entrada);
          const checkOut = new Date(r.fecha_salida);
          const noches = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 1);
          const roomsPrice = habitaciones.reduce((sum, h) => sum + h.precio * noches, 0);

          const servicios = [];
          let servicesPrice = 0;

          if (r.reservas_servicios?.length) {
            for (const rs of r.reservas_servicios) {
              const idServicio = rs.id_servicio;
              const servicio = rs.servicios_adicionales;

              if (!servicio) continue;

              const { data: fechas, error: fechasError } = await supabase
                .from("reservas_servicios_fechas")
                .select("fecha, cantidad")
                .eq("id_reserva", r.id)
                .eq("id_servicio", idServicio);

              if (fechasError) {
                console.error("Error obteniendo fechas de servicio:", fechasError);
                continue;
              }

              if (!fechas || fechas.length === 0) continue;

              const totalServicio = fechas.reduce(
                (sum, f) => sum + servicio.precio * (f.cantidad || 1),
                0
              );

              servicios.push({
                id: idServicio,
                nombre: servicio.nombre,
                tipo_cobro: servicio.tipo_cobro,
                precio_unitario: servicio.precio,
                fechas: fechas.map(f => f.fecha),
                cantidadTotal: fechas.reduce((s, f) => s + (f.cantidad || 1), 0),
                total: totalServicio,
              });

              servicesPrice += totalServicio;
            }
          }

          const totalPrice = roomsPrice + servicesPrice;

          return {
            id: r.id,
            reservationDate: r.fecha_reservacion,
            checkIn: r.fecha_entrada,
            checkOut: r.fecha_salida,
            room: habitacionesStr,
            status: r.estado_reserva,
            price: totalPrice ? `$${Number(totalPrice).toLocaleString()}` : "—",
            habitaciones,
            servicios,
            subtotalHabitaciones: roomsPrice,
            subtotalServicios: servicesPrice,
            total: totalPrice,
          };
        })
      );

      setBookings(formatted);
    } catch (err) {
      console.error("Error obteniendo reservas:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(
    async (booking, showPopup) => {
      if (!showPopup) return;

      const [year, month, day] = booking.checkIn.split("-").map(Number);
      const checkInDate = new Date(year, month - 1, day);
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isTodayCheckIn = checkInDate.getTime() === today.getTime();
      const canCancel =
        checkInDate.getTime() > today.getTime() || (isTodayCheckIn && now.getHours() < 14);

      if (!canCancel) {
        showPopup("❌ No se puede cancelar después de las 2 PM del día de check-in.", "error");
        return;
      }

      try {
        setCancelling(booking.id);
        const { error } = await supabase
          .from("reservas")
          .update({ estado_reserva: "Cancelada" })
          .eq("id", booking.id);

        if (error) throw error;
        showPopup("✅ Reserva cancelada con éxito.", "success");
        fetchBookings();
      } catch (err) {
        console.error(err);
        showPopup("❌ Error al cancelar la reserva.", "error");
      } finally {
        setCancelling(null);
      }
    },
    [fetchBookings]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, cancelling, fetchBookings, cancelBooking };
}