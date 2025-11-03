import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useExtraServices(subtotal) {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("servicios_adicionales")
          .select("id, nombre, descripcion, precio");

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

  const setServiceCount = (id, value) => {
    setSelected((prev) => {
      if (value <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: value };
    });
  };

  const totalServicios = services.reduce((acc, s) => {
    const qty = selected[s.id] || 0;
    return acc + qty * s.precio;
  }, 0);

  const totalGeneral = subtotal + totalServicios;

  return {
    services,
    selected,
    loading,
    setServiceCount,
    totalServicios,
    totalGeneral,
  };
}