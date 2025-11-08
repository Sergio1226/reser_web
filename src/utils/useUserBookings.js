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
        console.warn("⚠️ No hay usuario autenticado.");
        setBookings([]);
        return;
      }

      const { data, error } = await supabase
        .from("reservas")
        .select(`
          id,
          fecha_reservacion,
          fecha_entrada,
          fecha_salida,
          estado_reserva,
          id_cliente,
          reservas_habitaciones (
            id_habitacion,
            habitaciones (
              id,
              precio
            )
          ),
          reservas_servicios (
            id_servicio,
            servicios_adicionales (
              nombre,
              precio
            )
          )
        `)
        .eq("id_cliente", user.id)
        .order("fecha_entrada", { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((r) => {
        const habitaciones = r.reservas_habitaciones?.map(
          (rh) => rh.habitaciones?.id
        ).filter(Boolean) || [];
        const habitacionesStr = habitaciones.length > 0 ? habitaciones.join(", ") : "—";

        const roomsPrice = r.reservas_habitaciones?.reduce(
          (sum, rh) => sum + (rh.habitaciones?.precio || 0),
          0
        );

        const servicesPrice = r.reservas_servicios?.reduce(
          (sum, rs) => sum + (rs.servicios_adicionales?.precio || 0),
          0
        );

        const totalPrice = roomsPrice + servicesPrice;

        return {
          reservationDate: r.fecha_reservacion,
          checkIn: r.fecha_entrada,
          checkOut: r.fecha_salida,
          room: habitacionesStr,
          status: r.estado_reserva,
          price: totalPrice ? `$${Number(totalPrice).toLocaleString()}` : "—",
          id: r.id,
        };
      });

      setBookings(formatted);
    } catch (err) {
      console.error("❌ Error obteniendo reservas:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(
    async (booking, showPopup) => {
      if (!showPopup) return;

      const now = new Date();
      const [year, month, day] = booking.checkIn.split("-").map(Number);
      const checkInDate = new Date(year, month - 1, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isTodayCheckIn = checkInDate.getTime() === today.getTime();
      const canCancel =
        checkInDate.getTime() > today.getTime() ||
        (isTodayCheckIn && now.getHours() < 14);

      if (!canCancel) {
        showPopup(
          "❌ No se puede cancelar después de las 2 PM del día de check-in.",
          "error"
        );
        return;
      }

      try {
        setCancelling(booking.id);

        const { error } = await supabase
          .from("reservas")
          .update({ estado_reserva: "Cancelada" })
          .eq("id", Number(booking.id));

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