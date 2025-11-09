import { supabase } from "../utils/supabase.js";

function getCombinations(array, size) {
  const results = [];
  function helper(start, combo) {
    if (combo.length === size) {
      results.push([...combo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      helper(i + 1, [...combo, array[i]]);
    }
  }
  helper(0, []);
  return results;
}

export async function searchAvailableRooms({
  startDate,
  endDate,
  countAdults,
  countChildrens,
  countRooms,
  openPopup,
}) {
  try {
    const startISO = new Date(startDate).toISOString().split("T")[0];
    const endISO = new Date(endDate).toISOString().split("T")[0];

    const { data: res, error } = await supabase
      .from("reservas")
      .select("id, reservas_habitaciones(id_habitacion)")
      .eq("estado_reserva", "Confirmada")
      .lt("fecha_entrada", endISO)
      .gt("fecha_salida", startISO);

    if (error) throw error;

    const reservedIds =
      res?.flatMap((r) => r.reservas_habitaciones.map((h) => h.id_habitacion)) || [];

    let { data: roomsData, error: errRooms } = await supabase
      .from("habitaciones")
      .select(`
        id,
        descripcion,
        precio,
        estado_habitacion,
        habitaciones_camas (
          cantidad,
          camas ( id, nombre, capacidad )
        ),
        habitaciones_caracteristicas (
          caracteristicas ( id, nombre )
        )
      `)
      .eq("estado_habitacion", "Disponible");

    if (errRooms) throw errRooms;

    const roomsFree = roomsData.filter((r) => !reservedIds.includes(r.id));

    if (roomsFree.length === 0) {
      openPopup("⚠️ No hay habitaciones disponibles para las fechas seleccionadas.", "info");
      return [];
    }

    const roomsWithCapacity = roomsFree.map((r) => {
      const capacidad_total = r.habitaciones_camas?.reduce(
        (sum, hc) => sum + hc.camas.capacidad * hc.cantidad,
        0
      );

      const caracteristicas =
        r.habitaciones_caracteristicas?.map((hc) => hc.caracteristicas?.nombre) || [];

      return { ...r, capacidad_total, caracteristicas };
    });

    const combos = getCombinations(roomsWithCapacity, countRooms);

    const totalPersonas = (countAdults || 0) + (countChildrens || 0);

    const validCombos = combos.filter((combo) => {
      const capTotal = combo.reduce((sum, r) => sum + r.capacidad_total, 0);
      return capTotal >= totalPersonas;
    });

    if (validCombos.length === 0) {
      openPopup("No se encontraron combinaciones disponibles.", "info");
    }

    return validCombos;
  } catch (error) {
    console.error("❌ Error buscando habitaciones:", error);
    openPopup("Error al buscar habitaciones.", "error");
    return [];
  }
}