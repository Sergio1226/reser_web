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

  const toLocalISOString = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, -1);
  };

  const range = JSON.parse(
    localStorage.getItem("rangeSeleccionado") ||
      JSON.stringify({
        startDate: toLocalISOString(new Date()),
        endDate: toLocalISOString(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      })
  );

  const habitacionesSeleccionadas = JSON.parse(
    localStorage.getItem("habitacionesSeleccionadas") || "[]"
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

      const fechaEntrada = toLocalISOString(new Date(range.startDate));
      const fechaSalida = toLocalISOString(new Date(range.endDate));

      const { data: reserva, error: reservaError } = await supabase
        .from("reservas")
        .insert([
          {
            id_cliente: userId,
            fecha_reservacion: toLocalISOString(new Date()),
            fecha_entrada: fechaEntrada,
            fecha_salida: fechaSalida,
            cantidad_adultos: reservaHuespedes.adultos,
            cantidad_ninos: reservaHuespedes.ninos,
            estado_reserva: "Confirmada",
          },
        ])
        .select()
        .single();

      if (reservaError) throw reservaError;
      const id_reserva = reserva.id;

      if (habitacionesSeleccionadas.length > 0) {
        const habitacionesData = habitacionesSeleccionadas.map(
          (id_habitacion) => ({
            id_reserva,
            id_habitacion,
          })
        );
        await supabase.from("reservas_habitaciones").insert(habitacionesData);
      }

      const { serviciosSeleccionados } = resumen;

      for (const [id, sel] of Object.entries(serviciosSeleccionados)) {
        const servicio = serviciosInfo[id];
        if (!servicio) continue;

        let fechas = [];

        if (servicio.tipo_cobro === "por_evento_por_persona" && sel.fecha) {
          fechas.push({
            fecha: sel.fecha,
            cantidad: sel.cantidad || 1,
          });
        } else if (
          (servicio.tipo_cobro === "por_dia_por_persona" ||
            servicio.tipo_cobro === "por_dia_por_vehiculo") &&
          Array.isArray(sel.dias) &&
          sel.dias.length > 0
        ) {
          fechas = sel.dias.map((f) => ({
            fecha: f.fecha || f,
            cantidad: f.cantidad || sel.cantidad || 1,
          }));
        }

        if (fechas.length > 0) {
          await supabase.from("reservas_servicios").insert([
            {
              id_reserva,
              id_servicio: Number(id),
            },
          ]);

          const fechasData = fechas.map((f) => ({
            id_reserva,
            id_servicio: Number(id),
            fecha: f.fecha,
            cantidad: f.cantidad,
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
  const handleConfirmWithEmail = async () => {
    try {
      if (!session) {
        openPopup("Debes iniciar sesión para confirmar la reserva.", "error");
        return;
      }

      const range = JSON.parse(
        localStorage.getItem("rangeSeleccionado") || "{}"
      );
      const huespedes = JSON.parse(
        localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
      );
      const userId = JSON.parse(
        localStorage.getItem("clienteSeleccionado") || "{}"
      ).user_id;

      const today = new Date();
      const fechaReservacion = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const { data: reserva, error: reservaError } = await supabase
        .from("reservas")
        .insert([
          {
            fecha_reservacion: fechaReservacion,
            fecha_entrada: range.startDate,
            fecha_salida: range.endDate,
            cantidad_adultos: huespedes.adultos || 1,
            cantidad_ninos: huespedes.ninos || 0,
            estado_reserva: "Confirmada",
            id_cliente: userId,
          },
        ])
        .select()
        .single();

      if (reservaError) throw reservaError;

      const habitacionesSeleccionadas = JSON.parse(
        localStorage.getItem("habitacionesSeleccionadas") || "[]"
      );
      console.log(habitacionesSeleccionadas, reserva);

      if (habitacionesSeleccionadas.length > 0) {
        const habData = habitacionesSeleccionadas.map((id) => ({
          id_reserva: reserva.id,
          id_habitacion: id,
        }));
        await supabase.from("reservas_habitaciones").insert(habData);
      }

      const serviciosData = Object.entries(resumen.serviciosSeleccionados)
        .filter(([_, count]) => count > 0)
        .map(([id_servicio, count]) => ({
          id_reserva: reserva.id,
          id_servicio: Number(id_servicio),
          cantidad: count,
        }));

      if (serviciosData.length > 0) {
        await supabase.from("reservas_servicios").insert(serviciosData);
      }

      openPopup("✅ Reserva confirmada con éxito.", "success");
    } catch (err) {
      console.error(err);
      openPopup("❌ Error al confirmar la reserva.", "error");
    }
  };

  return { resumen, serviciosInfo, handleConfirm, handleConfirmWithEmail };
}
