import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { UserAuth } from "../utils/AuthContext";
import { usePopup } from "../utils/PopupContext";

export function useConfirmReservation(setNav) {
  const { session } = UserAuth();
  const { openPopup } = usePopup();

  const [serviciosInfo, setServiciosInfo] = useState({});
  const [resumen, setResumen] = useState({
    subtotalHabitaciones: 0,
    serviciosSeleccionados: {},
    totalGeneral: 0,
  });

  const habitacionesSeleccionadas = JSON.parse(localStorage.getItem("habitacionesSeleccionadas") || "[]");
  const range = JSON.parse(
    localStorage.getItem("rangeSeleccionado") ||
      JSON.stringify({
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
  );
  const reservaHuespedes = JSON.parse(
    localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
  );

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reservaDatos") || "{}");
    setResumen({
      subtotalHabitaciones: data.subtotalHabitaciones || 0,
      serviciosSeleccionados: data.serviciosSeleccionados || {},
      totalGeneral: data.totalGeneral || 0,
    });
  }, []);

  useEffect(() => {
    const fetchServicios = async () => {
      const ids = Object.keys(resumen.serviciosSeleccionados).map(Number);
      if (ids.length === 0) return;

      const { data, error } = await supabase
        .from("servicios_adicionales")
        .select("id, nombre, precio, tipo_cobro")
        .in("id", ids);

      if (!error && data) {
        const info = {};
        data.forEach((s) => {
          info[s.id] = {
            nombre: s.nombre,
            precio: s.precio,
            tipo_cobro: s.tipo_cobro,
          };
        });
        setServiciosInfo(info);
      }
    };

    fetchServicios();
  }, [resumen.serviciosSeleccionados]);

  const handleConfirm = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) throw new Error("No se encontró el ID del usuario");

      const { data: reserva, error: reservaError } = await supabase
        .from("reservas")
        .insert([{
          id_cliente: userId,
          fecha_reservacion: new Date().toISOString(),
          fecha_entrada: range.startDate,
          fecha_salida: range.endDate,
          cantidad_adultos: reservaHuespedes.adultos,
          cantidad_ninos: reservaHuespedes.ninos,
          estado_reserva: "Confirmada",
        }])
        .select()
        .single();

      if (reservaError) throw reservaError;
      const id_reserva = reserva.id;

      if (habitacionesSeleccionadas.length > 0) {
        const habitacionesData = habitacionesSeleccionadas.map((id_habitacion) => ({
          id_reserva,
          id_habitacion,
        }));
        await supabase.from("reservas_habitaciones").insert(habitacionesData);
      }

      const { serviciosSeleccionados } = resumen;

      for (const [id, sel] of Object.entries(serviciosSeleccionados)) {
        const servicio = serviciosInfo[id];
        if (!servicio) continue;

        await supabase.from("reservas_servicios").insert([{
          id_reserva,
          id_servicio: Number(id),
          cantidad: sel.cantidad,
        }]);

        let fechas = [];
        if (servicio.tipo_cobro === "por_evento_por_persona" && sel.fecha) {
          fechas.push(sel.fecha);
        } else if (
          (servicio.tipo_cobro === "por_dia_por_persona" ||
           servicio.tipo_cobro === "por_dia_por_vehiculo") &&
          sel.dias?.length
        ) {
          fechas = sel.dias.filter(Boolean);
        }

        if (fechas.length) {
          const fechasData = fechas.map((fecha) => ({
            id_reserva,
            id_servicio: Number(id),
            fecha,
          }));
          await supabase.from("reservas_servicios_fechas").insert(fechasData);
        }
      }

      openPopup("✅ Reserva confirmada correctamente!", "success");
      setNav(1);
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      openPopup("Ocurrió un error al confirmar la reserva.", "error");
    }
  };

  return { resumen, serviciosInfo, handleConfirm };
}


