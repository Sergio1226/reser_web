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
        .select("id, nombre, precio")
        .in("id", ids);

      if (error) {
        console.error("Error al obtener servicios:", error);
        return;
      }

      const info = {};
      data.forEach((s) => {
        info[s.id] = { nombre: s.nombre, precio: s.precio };
      });
      setServiciosInfo(info);
    };

    fetchServicios();
  }, [resumen.serviciosSeleccionados]);

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
      console.log(habitacionesSeleccionadas,reserva);
      
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

  const handleConfirm = async () => {
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
      const userId = session.user?.id;

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
      setTimeout(() => setNav(1), 2000);
    } catch (err) {
      console.error(err);
      openPopup("❌ Error al confirmar la reserva.", "error");
    }
  };

  return {
    resumen,
    serviciosInfo,
    handleConfirm,
    handleConfirmWithEmail,
  };
}
