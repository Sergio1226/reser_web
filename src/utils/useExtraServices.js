import { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabase";

export function useExtraServices(subtotal) {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  useEffect(() => {
    const stored = localStorage.getItem("rangeSeleccionado");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.startDate && parsed.endDate) setRange(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("servicios_adicionales")
          .select("id, nombre, descripcion, precio, tipo_cobro");

        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error("Error al traer servicios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    if (dateStr.includes("T")) dateStr = dateStr.split("T")[0];
    const [year, month, day] = dateStr.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Fecha inválida detectada en parseLocalDate:", dateStr);
      return new Date();
    }
    return date;
  };

  const getDiasDisponibles = (tipo) => {
    const start = parseLocalDate(range.startDate);
    const end = parseLocalDate(range.endDate);
    const days = [];

    if (tipo === "por_evento_por_persona") {
      let current = new Date(start);
      current.setDate(current.getDate() + 1);
      const lastDay = new Date(end);
      lastDay.setDate(lastDay.getDate() - 1);
      while (current <= lastDay) {
        days.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    } else if (tipo === "por_dia_por_persona") {
      let current = new Date(start);
      current.setDate(current.getDate() + 1);
      while (current <= end) {
        days.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    } else if (tipo === "por_dia_por_vehiculo") {
      let current = new Date(start);
      const lastDay = new Date(end);
      lastDay.setDate(lastDay.getDate() - 1);
      while (current <= lastDay) {
        days.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    } else {
      let current = new Date(start);
      while (current <= end) {
        days.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    }

    return days;
  };

  const setServiceCount = (id, cantidad) => {
    setSelected((prev) => {
      const actual = prev[id] || {};
      if (cantidad <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...actual, cantidad } };
    });
  };

  const toggleServiceDay = (id, dia) => {
    setSelected((prev) => {
      const actual = prev[id] || {};
      const dias = new Set(actual.dias || []);
      if (dias.has(dia)) dias.delete(dia);
      else dias.add(dia);
      return { ...prev, [id]: { ...actual, dias: Array.from(dias) } };
    });
  };

  const selectAllDays = (id) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;

    const diasDisponibles = getDiasDisponibles(service.tipo_cobro);
    setSelected((prev) => {
      const actual = prev[id] || {};
      const diasActuales = actual.dias || [];

      const todasSeleccionadas =
        diasActuales.length === diasDisponibles.length &&
        diasDisponibles.every((d) => diasActuales.includes(d));

      const nuevosDias = todasSeleccionadas ? [] : diasDisponibles;

      return {
        ...prev,
        [id]: {
          ...actual,
          dias: nuevosDias,
          activo: true,
        },
      };
    });
  };

  const setServiceDate = (id, fecha) => {
    setSelected((prev) => {
      const actual = prev[id] || {};
      return { ...prev, [id]: { ...actual, fecha } };
    });
  };

  const toggleActive = (id) => {
    setSelected((prev) => {
      const actual = prev[id] || {};
      return {
        ...prev,
        [id]: {
          activo: !actual.activo,
          cantidad: actual.cantidad ?? 1,
          dias: [],
          fecha: actual.fecha || "",
        },
      };
    });
  };

  const totalServicios = useMemo(() => {
    return services.reduce((acc, s) => {
      const sel = selected[s.id];
      if (!sel || !sel.activo) return acc;
      const cantidad = sel.cantidad || 0;
      const dias = sel.dias?.length || 0;
      let subtotal = 0;

      switch (s.tipo_cobro) {
        case "por_dia_por_persona":
        case "por_dia_por_vehiculo":
          subtotal = cantidad * s.precio * dias;
          break;
        case "por_evento_por_persona":
          subtotal = cantidad * s.precio * (sel.fecha ? 1 : 0);
          break;
        default:
          subtotal = cantidad * s.precio;
      }

      return acc + subtotal;
    }, 0);
  }, [services, selected]);

  const totalGeneral = subtotal + totalServicios;

  return {
    services,
    selected,
    loading,
    setServiceCount,
    toggleServiceDay,
    selectAllDays,
    setServiceDate,
    totalServicios,
    totalGeneral,
    getDiasDisponibles,
    toggleActive,
  };
}