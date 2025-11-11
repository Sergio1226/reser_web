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
            cantidad,
            servicios_adicionales (
              nombre,
              precio
            )
          )
        `)
        .eq("id_cliente", user.id)
        .order("fecha_entrada", { ascending: false });

      if (error) throw error;

      const formatted = await Promise.all(
        (reservas || []).map(async (r) => {

          const habitaciones = r.reservas_habitaciones?.map(
            rh => rh.habitaciones?.id || `Habitación ${rh.habitaciones?.id}`
          ).filter(Boolean);
          const habitacionesStr = habitaciones.length ? habitaciones.join(", ") : "—";

          const checkIn = new Date(r.fecha_entrada);
          const checkOut = new Date(r.fecha_salida);
          const noches = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 1);

          const roomsPrice = r.reservas_habitaciones?.reduce(
            (sum, rh) => sum + ((rh.habitaciones?.precio || 0) * noches),
            0
          );

          let servicesPrice = 0;
          if (r.reservas_servicios?.length) {
            for (const rs of r.reservas_servicios) {

              const { data: fechas, error: fechasError } = await supabase
                .from("reservas_servicios_fechas")
                .select("fecha")
                .eq("id_reserva", r.id)
                .eq("id_servicio", rs.id_servicio);

              if (fechasError) {
                console.error("Error obteniendo fechas de servicio:", fechasError);
                continue;
              }

              const cantidad = rs.cantidad || 1;
              const veces = (fechas?.length) || 1;
              const precio = rs.servicios_adicionales?.precio || 0;

              servicesPrice += precio * cantidad * veces;
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
      const canCancel = checkInDate.getTime() > today.getTime() || (isTodayCheckIn && now.getHours() < 14);

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