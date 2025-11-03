import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

export function useUserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
        .order("fecha_reservacion", { ascending: false });

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
          reservedOn: r.fecha_reservacion,
          checkIn: r.fecha_entrada,
          checkOut: r.fecha_salida,
          room: habitacionesStr,
          reservationDate: r.fecha_reservacion,
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

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, refetchBookings: fetchBookings };
}