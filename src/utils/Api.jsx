import { supabase } from "./supabase.js";
import { formatBookings, formatBookingsByDates } from "./Format.js";
export async function getFullReservationDetails(id_reserva) {
  const { data: reserva, error: e1 } = await supabase
    .from("reservas")
    .select(`
      id,
      fecha_reservacion,
      fecha_entrada,
      fecha_salida,
      estado_reserva,
      cantidad_adultos,
      cantidad_ninos,
      id_cliente,
      clientes (
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        documento,
        email
      )
    `)
    .eq("id", id_reserva)
    .single();
  if (e1) throw e1;

  const { data: habitaciones, error: e2 } = await supabase
    .from("reservas_habitaciones")
    .select(`
      id_habitacion,
      habitaciones (
        descripcion,
        precio
      )
    `)
    .eq("id_reserva", id_reserva);
  if (e2) throw e2;

  const { data: servicios, error: e3 } = await supabase
    .from("reservas_servicios")
    .select(`
      id_servicio,
      servicios_adicionales (
        nombre,
        descripcion,
        precio,
        tipo_cobro
      )
    `)
    .eq("id_reserva", id_reserva);
  if (e3) throw e3;

  const { data: servicios_fechas, error: e4 } = await supabase
    .from("reservas_servicios_fechas")
    .select("*")
    .eq("id_reserva", id_reserva);
  if (e4) throw e4;

  const serviciosCompletos = servicios.map((s) => {
    const fechas = servicios_fechas.filter(f => f.id_servicio === s.id_servicio);
    const cantidadTotal = fechas.reduce((sum, f) => sum + Number(f.cantidad || 0), 0);
    const total = Number(s.servicios_adicionales.precio || 0) * cantidadTotal;
    return {
      id: s.id_servicio,
      nombre: s.servicios_adicionales.nombre,
      tipo_cobro: s.servicios_adicionales.tipo_cobro,
      precio_unitario: s.servicios_adicionales.precio,
      fechas: fechas.map(f => f.fecha),
      cantidadTotal,
      total
    };
  });

  const habitacionesForm = habitaciones.map(h => ({
    descripcion: h.habitaciones.descripcion,
    precio: h.habitaciones.precio
  }));

  const nights = Math.max(1, Math.ceil((new Date(reserva.fecha_salida) - new Date(reserva.fecha_entrada)) / (1000*60*60*24)));
  const subtotalHabitaciones = habitacionesForm.reduce((sum, h) => sum + Number(h.precio || 0) * nights, 0);
  const subtotalServicios = serviciosCompletos.reduce((s, sv) => s + Number(sv.total || 0), 0);
  const total = subtotalHabitaciones + subtotalServicios;

  return {
    id: reserva.id,
    reservationDate: reserva.fecha_reservacion,
    checkIn: reserva.fecha_entrada,
    checkOut: reserva.fecha_salida,
    room: (habitacionesForm.map(h => h.descripcion).join(", ")) || "—",
    status: reserva.estado_reserva,
    habitaciones: habitacionesForm,
    servicios: serviciosCompletos,
    subtotalHabitaciones,
    subtotalServicios,
    total
  };
}
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
 *
 * @returns {Promise<Array>} Array de reservas
 */

export async function getReservations() {
  try {
    const { data, error } = await supabase.from("reservas").select("*");
    if (error) throw new Error("Error al obtener las reservas");
    return data;
  } catch (error) {
    console.error("Error en getReservations:", error);
    throw error;
  }
}

export async function getClients() {
  try {
    const { data, error } = await supabase.rpc("get_clients");
    if (error) throw new Error("Error al obtener los clientes" + error.message);
    return data.map((obj) => [
      obj.nombre,
      obj.tipo_documento,
      obj.documento,
      obj.pais_de_nacimiento,
      obj.correo,
    ]);
  } catch (error) {
    console.error("Error en getClients:", error);
    throw error;
  }
}
/**
 * Obtiene a un cliente por su documento
 * @param {number} tipo_documento id del tipo de documento
 * @param {number} documento documento del cliente
 * @returns {Promise<Object>} Datos del cliente
 */
export async function getClient(tipo_documento, documento) {
  try {
    const { data, error } = await supabase.rpc("get_client", {
      p_tipo: tipo_documento,
      p_doc: documento,
    });
    if (error || !data || data.length === 0)
      throw new Error("Error al obtener el cliente");
    return data[0];
  } catch (error) {
    console.error("Error en getClients:", error);
    throw error;
  }
}
/**
 * Añadir cliente sin cuenta
 * @param {number} tipo_documento id del tipo de documento
 * @param {number} documento documento del cliente
 * @returns {Promise<Object>} Datos del cliente
 */
export async function addClient(client) {
  try {
    const id = crypto.randomUUID();
    client.es_anonimo = true;
    const { error } = await signUpNewUser({
      user: client,
      email: client.email,
      password: id,
    });
    return { error };
  } catch (error) {
    console.error("Error en addClient:", error);
    throw error;
  }
}

/**
 * Obtiene las reservas por fecha
 * @param {date} date fecha a buscar
 * @param {number} type tipo de fecha a buscar (reserva, check-in, check-out)
 * @returns {Promise<Array>} Array de reservas
 */

export async function getReservationsByDate(date, type) {
  try {
    const pgDate = date.toLocaleDateString("en-CA");

    const { data, error } = await supabase.rpc("get_bookings", {
      p_date: pgDate,
      p_type: type,
    });

    if (error) {
      console.error(error);
      throw new Error("Error consultando las reservas");
    }

    if (!Array.isArray(data)) {
      throw new Error("Error procesando reservas");
    }

    return {
      data: data.length > 0 ? formatBookingsByDates(data) : [],
      ids: data.map((obj) => obj.id),
      error: null,
    };

  } catch (error) {
    console.error("Error en getReservationsByDate:", error);
    throw error;
  }
}
/**
 * Obtiene las habitaciones
 * @returns {Promise<Array>} Array de ids de las habitaciones
 */
export async function getAllRoomsIds(){
  try {
    const { data, error } = await supabase.from('habitaciones').select('id');
    if (error|| data.length === 0) throw new Error("Error al obtener las habitaciones");
    return data.map((obj) => obj.id);
  } catch (error) {
    console.error("Error en getRooms:", error);
    throw error;
  }
}
export async function getAllBookings(){
  try {
    const { data, error } = await supabase.rpc('get_all_bookings');
    if (error|| data.length === 0) throw new Error("Error al obtener las reservas");
    return data;
  } catch (error) {
    console.error("Error en getRooms:", error);
    throw error;
  }
}
/**
 * 
 * @param {*} email 
 * @returns 
 */
export async function getClientByEmail(email) {
  try {
    const { data, error } = (await supabase.from("clientes").select("*").eq("email", email).single());
    if (error) throw new Error("Error al obtener el usuario");
    return data;
  } catch (error) {
    console.error("Error en existClient:", error);
    throw error;
  }
}

const signUpNewUser = async ({ user, email, password }) => {
  user.email = email;
  const { data: documentExists } = await supabase.rpc("document_exist", {
    p_documento: user.documento,
    p_tipo: user.tipo_documento,
  });
  if (documentExists) {
    throw new Error("El documento ya está en uso");
  }
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error.message);
    if (error.message === "User already registered")
      throw new Error("Correo ya registrado");
    throw new Error("Error al crear el usuario");
  }
  user.user_id = data.user.id;
  await addUser({ user });
  return data;
};
const addUser = async ({ user }) => {
  const { data, error } = await supabase.from("clientes").insert(user).select();
  if (error) throw new Error("Error al agregar el usuario");
  await supabase
    .from("roles_users")
    .insert({ id_rol: 1, user_id: user.user_id });
  return data;
};

