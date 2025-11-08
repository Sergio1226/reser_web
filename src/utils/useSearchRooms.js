import { supabase } from "./supabase";

export async function searchAvailableRooms({
  startDate,
  endDate,
  countAdults,
  countChildrens,
  countRooms,
  openPopup,
}) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const people = countAdults + countChildrens;

    const { data: reservedData, error: errReserved } = await supabase
      .from("reservas_habitaciones")
      .select(`
        id_habitacion,
        reservas (
          id,
          fecha_entrada,
          fecha_salida,
          estado_reserva
        )
      `)
      .not("reservas.id", "is", null);

    if (errReserved) throw errReserved;

    const reservedIds = (reservedData || [])
      .filter((r) => {
        if (r.reservas?.estado_reserva !== "Confirmada") return false;

        const entrada = new Date(r.reservas.fecha_entrada);
        const salida = new Date(r.reservas.fecha_salida);

        entrada.setHours(0, 0, 0, 0);
        salida.setHours(0, 0, 0, 0);
        const inicioBusqueda = new Date(start);
        const finBusqueda = new Date(end);
        inicioBusqueda.setHours(0, 0, 0, 0);
        finBusqueda.setHours(0, 0, 0, 0);

        const seCruzan = entrada < finBusqueda && salida > inicioBusqueda;
        return seCruzan;
      })
      .map((r) => r.id_habitacion);

    let roomsQuery = supabase
      .from("habitaciones")
      .select(`
        id,
        descripcion,
        precio,
        estado_habitacion,
        habitaciones_camas (
          cantidad,
          camas ( id, nombre , capacidad )
        ),
        habitaciones_caracteristicas (
          caracteristicas ( id, nombre )
        )
      `)
      .eq("estado_habitacion", "Libre");

    if (reservedIds.length > 0) {
      roomsQuery = roomsQuery.not("id", "in", `(${reservedIds.join(",")})`);
    }

    const { data: roomsData, error: errRooms } = await roomsQuery;
    if (errRooms) throw errRooms;

    const allRooms = (roomsData || []).map((room) => {
      const capacidad_total = (room.habitaciones_camas || []).reduce((acc, hc) => {
        const camaCap = hc?.camas?.capacidad || 1;
        return acc + (hc.cantidad || 0) * camaCap;
      }, 0);
      return { ...room, capacidad_total };
    });

    function getCombinationsOfSize(arr, k) {
      const results = [];
      function helper(start, combo) {
        if (combo.length === k) {
          results.push(combo);
          return;
        }
        for (let i = start; i < arr.length; i++) {
          helper(i + 1, combo.concat(arr[i]));
        }
      }
      helper(0, []);
      return results;
    }

    const combos = getCombinationsOfSize(allRooms, countRooms);

    const validCombos = combos.filter(
      (combo) => combo.reduce((sum, room) => sum + room.capacidad_total, 0) >= people
    );

    validCombos.sort((a, b) => {
      const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
      const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
      return (capA - people) - (capB - people);
    });

    if (validCombos.length === 0) {
      openPopup("⚠️ No hay habitaciones disponibles con esos criterios.", "info");
    }

    return validCombos;
  } catch (err) {
    console.error("Error buscando habitaciones:", err);
    openPopup(`❌ Error al buscar habitaciones:\n${err.message || err}`, "warning");
    return [];
  }
}
