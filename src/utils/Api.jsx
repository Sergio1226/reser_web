import { supabase } from "./supabase.js";

/**
 * Obtiene las habitaciones disponibles en un rango de fechas y para una cantidad de personas
 * @param {string} start - Fecha de entrada (YYYY-MM-DD)
 * @param {string} end - Fecha de salida (YYYY-MM-DD)
 * @param {number} people - Cantidad de huespedes
 */
export async function getRooms(start, end, people) {
  try {
    const { data: reservedData, error: errReserved } = await supabase
      .from("reservas_habitaciones")
      .select(
        `
        id_habitacion,
        reservas (
          id,
          fecha_entrada,
          fecha_salida,
          estado_reserva
        )
      `
      )
      .not("reservas.id", "is", null);

    if (errReserved) throw errReserved;

    const reservedIds = (reservedData || [])
      .filter(
        (r) =>
          r.reservas?.estado_reserva === "Confirmada" &&
          !(r.reservas.fecha_salida <= start || r.reservas.fecha_entrada >= end)
      )
      .map((r) => r.id_habitacion);

    let roomsQuery = supabase
      .from("habitaciones")
      .select(
        `
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
      `
      )
      .eq("estado_habitacion", "Libre");

    if (reservedIds.length > 0) {
      roomsQuery = roomsQuery.not("id", "in", `(${reservedIds.join(",")})`);
    }

    const { data: roomsData, error: errRooms } = await roomsQuery;
    if (errRooms) throw errRooms;

    const available = (roomsData || [])
      .map((room) => {
        const capacidad_total = (room.habitaciones_camas || []).reduce(
          (acc, hc) => acc + (hc.cantidad || 0) * (hc?.camas?.capacidad || 1),
          0
        );
        return { ...room, capacidad_total };
      })
      .filter((r) => r.capacidad_total >= people);
    return available;
  } catch (error) {
    console.error("Error en getRooms:", error);
    throw error;
  }
}

/**
 * Crea una nueva reserva con las habitaciones seleccionadas
 * @param {string} fechaEntrada - Fecha de entrada (YYYY-MM-DD)
 * @param {string} fechaSalida - Fecha de salida (YYYY-MM-DD)
 * @param {number} cantidadAdultos - Cantidad de adultos
 * @param {number} cantidadNinos - Cantidad de niños
 * @param {Array<number>} selectedRooms - Array con los IDs de las habitaciones
 * @returns {Promise<Object>} Datos de la reserva creada
 */
export async function createBooking(
  fechaEntrada,
  fechaSalida,
  cantidadAdultos,
  cantidadNinos,
  selectedRooms
) {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  if (!data.session) {
    throw new Error("No hay sesión activa. El usuario no ha iniciado sesión.");
  }

  const userId = data.session.user.id;
  try {
    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (clienteError) throw new Error("Error al obtener datos del cliente");
    if (!clienteData) throw new Error("Cliente no encontrado");

    const { data: reservaData, error: reservaError } = await supabase
      .from("reservas")
      .insert({
        id_cliente: userId,
        fecha_reservacion: new Date().toISOString().slice(0, 10),
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
        cantidad_adultos: cantidadAdultos,
        cantidad_ninos: cantidadNinos,
        estado_reserva: "Confirmada",
      })
      .select()
      .single();

    if (reservaError) {
      console.error("Error al crear reserva:", reservaError);
      throw new Error("Error al crear la reserva");
    }

    const habitacionesReservas = selectedRooms.map((roomId) => ({
      id_reserva: reservaData.id,
      id_habitacion: roomId,
    }));

    const { error: habitacionesError } = await supabase
      .from("reservas_habitaciones")
      .insert(habitacionesReservas);

    if (habitacionesError) {
      console.error("Error al asociar habitaciones:", habitacionesError);
      throw new Error("Error al asociar habitaciones a la reserva");
    }

    const { data: reservaCompleta, error: reservaCompletaError } =
      await supabase
        .from("reservas")
        .select(
          `
          *,
          clientes (*),
          reservas_habitaciones (
            habitaciones (*)
          )
        `
        )
        .eq("id", reservaData.id)
        .single();

    if (reservaCompletaError) {
      console.error("Error al obtener reserva completa:", reservaCompletaError);
      throw new Error("Error al obtener la reserva completa");
    }

    return {
      success: true,
      data: reservaCompleta,
      message: "Reserva creada exitosamente",
    };
  } catch (error) {
    console.error("Error en createBooking:", error);
    throw error;
  }
}

/**
 * Cancela una reserva existente
 * @param {number} reservaId - ID de la reserva a cancelar
 * @returns {Promise<Object>} Resultado de la cancelación
 */
export async function cancelBooking(reservaId) {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .update({ estado_reserva: "Cancelada" })
      .eq("id", reservaId)
      .select()
      .single();

    if (error) throw new Error("Error al cancelar la reserva");
    return data;
  } catch (error) {
    console.error("Error en cancelBooking:", error);
    throw error;
  }
}

/**
 * Obtiene las reservas de un usuario con precio calculado usando función SQL
 * @returns {Promise<Array>} Lista de reservas del usuario formateadas
 */
export async function getUserBookings() {
  try {
    const { data: current, error: currentError } =
      await supabase.auth.getSession();

    if (currentError) throw currentError;

    if (!current.session) {
      throw new Error(
        "No hay sesión activa. El usuario no ha iniciado sesión."
      );
    }

    const userId = current.session.user.id;

    const { data, error } = await supabase
      .from("reservas")
      .select(
        `
        id,
        fecha_reservacion,
        fecha_entrada,
        fecha_salida,
        cantidad_adultos,
        cantidad_ninos,
        estado_reserva,
        clientes (
          primer_nombre,
          segundo_nombre,
          primer_apellido
        ),
        reservas_habitaciones (
          id_habitacion,
          habitaciones (
            id,
            descripcion,
            precio
          )
        )
      `
      )
      .eq("id_cliente", userId)
      .order("fecha_reservacion", { ascending: false });

    if (error) {
      console.error("Error al obtener reservas:", error);
      throw new Error("Error al obtener las reservas");
    }

    const reservasConPrecio = await Promise.all(
      (data || []).map(async (reserva) => {
        const { data: precio, error: precioError } = await supabase.rpc(
          "price_booking",
          { reserva_id: reserva.id }
        );

        if (precioError) {
          console.error(
            `Error al calcular precio para reserva ${reserva.id}:`,
            precioError
          );
        }

        return {
          ...reserva,
          precio_total: Number(precio) || 0,
        };
      })
    );
    return formatBookings(reservasConPrecio);
  } catch (error) {
    console.error("Error en getUserBookings:", error);
    throw error;
  }
}

/**
 * Obtiene una reserva específica por su ID
 * @param {number} reservaId - ID de la reserva
 * @returns {Promise<Object>} Datos de la reserva
 */
export async function getBookingById(reservaId) {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select(
        `
        *,
        clientes (*),
        reservas_habitaciones (
          habitaciones (*)
        ),
        reservas_servicios (
          servicios_adicionales (*)
        )
      `
      )
      .eq("id", reservaId)
      .single();

    if (error) throw new Error("Error al obtener la reserva");

    return data;
  } catch (error) {
    console.error("Error en getBookingById:", error);
    throw error;
  }
}

/**
 * Formatea las reservas para mostrar en la tabla
 * @param {Array} bookings - Array de reservas con precio_total
 * @returns {Array} Array formateado [Cliente, Check-in, Check-out, Habitaciones, Fecha reserva, Estado, Precio, ID]
 */
function formatBookings(bookings) {
  const formatted = [];
  const ids=[];
  for (const reserva of bookings) {
    const nombreCompleto = [
      reserva.clientes?.primer_nombre || "",
      reserva.clientes?.segundo_nombre || "",
      reserva.clientes?.primer_apellido || "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const habitacionesIds = (reserva.reservas_habitaciones || [])
      .map((rh) => rh.id_habitacion)
      .join(", ");

    const precioTotal = reserva.precio_total || 0;

    formatted.push([
      nombreCompleto,
      reserva.fecha_entrada,
      reserva.fecha_salida,
      habitacionesIds,
      reserva.fecha_reservacion,
      reserva.estado_reserva,
      `$${precioTotal}`,
    ]);
    ids.push(reserva.id);
  }
  return { formatted, ids };
}
