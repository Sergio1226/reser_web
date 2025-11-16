import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { Button } from "../../../components/Button";
import { Counter } from "../../../components/Counter";

function parseYYYYMMDDToLocalDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr.includes("T")) dateStr = dateStr.split("T")[0];
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function formatDayShort(dateStr) {
  const dt = parseYYYYMMDDToLocalDate(dateStr);
  return dt.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

function formatDayWeekday(dateStr) {
  const dt = parseYYYYMMDDToLocalDate(dateStr);
  return dt.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function ExtraServices({ setNav }) {
  const storedSubtotal = Number(localStorage.getItem("reservaSubtotal") || 0);
  const subtotal = storedSubtotal ?? 0;

  const huespedes = JSON.parse(
    localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
  );
  const totalHuespedes = (huespedes.adultos || 1) + (huespedes.ninos || 0);

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalServicios, setTotalServicios] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(subtotal);

  const getDiasDisponibles = (tipoCobro) => {
    const range = JSON.parse(localStorage.getItem("rangeSeleccionado") || "{}");
    if (!range.startDate || !range.endDate) return [];

    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    const dias = [];

    const endDate =
      tipoCobro === "por_dia_por_persona" ||
      tipoCobro === "por_dia_por_vehiculo"
        ? new Date(end.getTime() - 24 * 60 * 60 * 1000)
        : end;

    for (let d = new Date(start); d <= endDate; d.setDate(d.getDate() + 1)) {
      dias.push(d.toISOString().split("T")[0]);
    }

    return dias;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("servicios_adicionales")
          .select("*");
        if (error) throw error;
        setServices(data || []);

        const initialSelected = {};
        data.forEach((service) => {
          initialSelected[service.id] = {
            activo: false,
            cantidad:
              service.tipo_cobro === "por_dia_por_persona" ? totalHuespedes : 1,
            dias: [],
            fecha: "",
          };
        });
        setSelected(initialSelected);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [totalHuespedes]);

  useEffect(() => {
    let totalServ = 0;

    services.forEach((service) => {
      const data = selected[service.id];
      if (!data?.activo) return;

      const cantidad = data.cantidad || 1;
      const dias = data.dias || [];
      const tipo = service.tipo_cobro;
      const precio = service.precio;

      if (tipo === "por_dia_por_persona" || tipo === "por_dia_por_vehiculo") {
        totalServ += precio * cantidad * dias.length;
      } else if (tipo === "por_evento_por_persona") {
        totalServ += precio * cantidad;
      }
    });

    setTotalServicios(totalServ);
    setTotalGeneral(subtotal + totalServ);
  }, [selected, services, subtotal]);

  const toggleActive = (serviceId) => {
    setSelected((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        activo: !prev[serviceId]?.activo,
        cantidad:
          prev[serviceId]?.cantidad ||
          (services.find((s) => s.id === serviceId)?.tipo_cobro ===
          "por_dia_por_persona"
            ? totalHuespedes
            : 1),
        dias: prev[serviceId]?.dias || [],
        fecha: prev[serviceId]?.fecha || "",
      },
    }));
  };

  const setServiceCount = (serviceId, value) => {
    setSelected((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        cantidad: value,
      },
    }));
  };

  const toggleServiceDay = (serviceId, day) => {
    setSelected((prev) => {
      const current = prev[serviceId] || {};
      const currentDias = current.dias || [];
      const newDias = currentDias.includes(day)
        ? currentDias.filter((d) => d !== day)
        : [...currentDias, day];

      return {
        ...prev,
        [serviceId]: {
          ...current,
          dias: newDias,
        },
      };
    });
  };

  const selectAllDays = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const diasDisponibles = getDiasDisponibles(service.tipo_cobro);
    const current = selected[serviceId] || {};
    const todasSeleccionadas = current.dias?.length === diasDisponibles.length;

    setSelected((prev) => ({
      ...prev,
      [serviceId]: {
        ...current,
        dias: todasSeleccionadas ? [] : diasDisponibles,
      },
    }));
  };

  const setServiceDate = (serviceId, date) => {
    setSelected((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        fecha: date,
      },
    }));
  };

  const assignAllGuests = (serviceId, value) => {
    setServiceCount(serviceId, value);
  };

  const hasMissingRequiredData = () => {
    for (const service of services) {
      const data = selected[service.id];
      if (!data?.activo) continue;

      if (
        (service.tipo_cobro === "por_dia_por_persona" ||
          service.tipo_cobro === "por_dia_por_vehiculo") &&
        (!data.dias || data.dias.length === 0)
      ) {
        return true;
      }

      if (
        service.tipo_cobro === "por_evento_por_persona" &&
        (!data.fecha || data.fecha === "")
      ) {
        return true;
      }
    }
    return false;
  };

  const handleContinue = () => {
    for (const service of services) {
      const data = selected[service.id];
      if (!data?.activo) continue;

      if (
        (service.tipo_cobro === "por_dia_por_persona" ||
          service.tipo_cobro === "por_dia_por_vehiculo") &&
        (!data.dias || data.dias.length === 0)
      ) {
        alert(
          `Debes seleccionar al menos un día para el servicio: ${service.nombre}`
        );
        return;
      }

      if (
        service.tipo_cobro === "por_evento_por_persona" &&
        (!data.fecha || data.fecha === "")
      ) {
        alert(`Debes seleccionar la fecha del servicio: ${service.nombre}`);
        return;
      }
    }

    const resumen = {
      subtotalHabitaciones: subtotal,
      subtotalServicios: totalServicios,
      totalGeneral,
      serviciosSeleccionados: selected,
      serviciosInfo: Object.fromEntries(
        services.map((s) => [
          s.id,
          {
            id: s.id,
            nombre: s.nombre,
            precio: s.precio,
            tipo_cobro: s.tipo_cobro,
            descripcion: s.descripcion,
          },
        ])
      ),
    };

    localStorage.setItem("reservaDatos", JSON.stringify(resumen));
    setNav(2);
  };

  const calcularDetalleServicios = () => {
    const detalles = [];

    services.forEach((service) => {
      const data = selected[service.id];
      if (!data?.activo) return;

      const cantidad = data.cantidad || 1;
      const dias = data.dias || [];
      const tipo = service.tipo_cobro;
      const precio = service.precio;

      let total = 0;
      let descripcion = "";

      if (tipo === "por_dia_por_persona") {
        total = precio * cantidad * dias.length;
        descripcion = `${dias.length} día(s) × ${cantidad} persona(s)`;
      } else if (tipo === "por_dia_por_vehiculo") {
        total = precio * cantidad * dias.length;
        descripcion = `${dias.length} día(s) × ${cantidad} vehículo(s)`;
      } else if (tipo === "por_evento_por_persona") {
        total = precio * cantidad;
        descripcion = `1 evento × ${cantidad} persona(s)`;
      }

      detalles.push({
        id: service.id,
        nombre: service.nombre,
        descripcion,
        total,
      });
    });

    return detalles;
  };

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <p className="text-slate-600 font-medium animate-pulse">
          Cargando servicios adicionales...
        </p>
      </div>
    );
  }

  const detallesServicios = calcularDetalleServicios();

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-12">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 shadow-lg text-white text-center">
        <h2 className="text-3xl font-bold mb-2 flex justify-center items-center gap-3">
          <span className="text-4xl">🛎️</span> Servicios Adicionales
        </h2>
        <p className="text-green-100">
          Personaliza tu estadía agregando servicios opcionales.
        </p>
      </div>

      <div className="space-y-6">
        {services.map((s) => {
          const data = selected[s.id] || {};
          const isActive = !!data.activo;
          const diasDisponibles = getDiasDisponibles(s.tipo_cobro);
          const todasSeleccionadas =
            data.dias?.length === diasDisponibles.length;

          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border transition-all p-6 hover:shadow-lg ${
                isActive
                  ? "border-green-400 shadow-md ring-1 ring-green-100"
                  : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-xl text-slate-800">
                    {s.nombre}
                  </h3>
                  <p className="text-slate-600 text-sm">{s.descripcion}</p>
                  <p className="text-green-700 font-semibold text-lg">
                    ${s.precio.toLocaleString()} COP
                    <span className="text-sm text-slate-500 font-normal">
                      {s.tipo_cobro === "por_dia_por_persona" &&
                        " /persona /día"}
                      {s.tipo_cobro === "por_dia_por_vehiculo" &&
                        " /vehículo /día"}
                      {s.tipo_cobro === "por_evento_por_persona" &&
                        " /persona /evento"}
                    </span>
                  </p>
                </div>

                <label className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-slate-700">
                    Incluir servicio
                  </span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleActive(s.id)}
                  />
                </label>
              </div>

              {isActive && (
                <>
                  {s.tipo_cobro === "por_dia_por_persona" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">
                          Cantidad de huéspedes:
                        </span>

                        <button
                          onClick={() => assignAllGuests(s.id, totalHuespedes)}
                          className="text-green-700 text-sm font-medium hover:underline whitespace-nowrap"
                        >
                          Todos incluirán desayuno
                        </button>
                      </div>

                      <div className="flex items-center">
                        <Counter
                          count={data.cantidad || totalHuespedes}
                          setCount={(val) => setServiceCount(s.id, val)}
                          min={1}
                          max={totalHuespedes}
                        />
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-slate-600">
                            Selecciona los días que incluirán desayuno:
                          </p>
                          <button
                            onClick={() => selectAllDays(s.id)}
                            className="text-green-700 text-sm font-medium hover:underline"
                          >
                            {todasSeleccionadas
                              ? "Deseleccionar todas las fechas"
                              : "Seleccionar todas las fechas"}
                          </button>
                        </div>

                        <div className="w-full flex flex-wrap gap-2">
                          {diasDisponibles.map((d) => (
                            <button
                              key={d}
                              onClick={() => toggleServiceDay(s.id, d)}
                              className={`px-3 py-1 text-sm rounded-full border ${
                                data.dias?.includes(d)
                                  ? "bg-green-600 text-white border-green-600"
                                  : "border-slate-300 text-slate-600"
                              }`}
                            >
                              {formatDayShort(d)}
                            </button>
                          ))}
                        </div>

                        <div className="w-full">
                          {isActive &&
                            (!data.dias || data.dias.length === 0) && (
                              <p className="text-red-600 text-xs mt-1">
                                Selecciona al menos un día para continuar.
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {s.tipo_cobro === "por_dia_por_vehiculo" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600">
                          Número de vehículos:
                        </span>
                        <Counter
                          count={data.cantidad || 1}
                          setCount={(val) => setServiceCount(s.id, val)}
                          min={1}
                          max={5}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-slate-600">
                            Selecciona los días de parqueadero:
                          </p>
                          <button
                            onClick={() => selectAllDays(s.id)}
                            className="text-green-700 text-sm font-medium hover:underline"
                          >
                            {todasSeleccionadas
                              ? "Deseleccionar todas las fechas"
                              : "Seleccionar todas las fechas"}
                          </button>
                        </div>

                        <div className="w-full flex flex-wrap gap-2">
                          {diasDisponibles.map((d) => (
                            <button
                              key={d}
                              onClick={() => toggleServiceDay(s.id, d)}
                              className={`px-3 py-1 text-sm rounded-full border ${
                                data.dias?.includes(d)
                                  ? "bg-green-600 text-white border-green-600"
                                  : "border-slate-300 text-slate-600"
                              }`}
                            >
                              {formatDayShort(d)}
                            </button>
                          ))}
                        </div>

                        <div className="w-full">
                          {isActive &&
                            (!data.dias || data.dias.length === 0) && (
                              <p className="text-red-600 text-xs mt-1">
                                Selecciona al menos un día para continuar.
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {s.tipo_cobro === "por_evento_por_persona" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">
                          Personas que asistirán:
                        </span>

                        <button
                          onClick={() => assignAllGuests(s.id, totalHuespedes)}
                          className="text-green-700 text-sm font-medium hover:underline whitespace-nowrap"
                        >
                          Todos incluirán senderismo
                        </button>
                      </div>

                      <div className="flex items-center">
                        <Counter
                          count={data.cantidad || 1}
                          setCount={(val) => setServiceCount(s.id, val)}
                          min={1}
                          max={totalHuespedes}
                        />
                      </div>

                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          Selecciona la fecha del senderismo:
                        </p>

                        <select
                          value={data.fecha || ""}
                          onChange={(e) => setServiceDate(s.id, e.target.value)}
                          className="border rounded-lg p-2 text-sm text-slate-700"
                        >
                          <option value="">Seleccionar fecha</option>

                          {diasDisponibles.map((d) => (
                            <option key={d} value={d}>
                              {formatDayWeekday(d)}
                            </option>
                          ))}
                        </select>

                        <div className="w-full">
                          {isActive && !data.fecha && (
                            <p className="text-red-600 text-xs mt-1">
                              Debes seleccionar una fecha para continuar.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow-lg rounded-2xl border border-green-200 p-8 space-y-4">
        <h3 className="text-2xl font-bold text-green-800 border-b pb-2">
          Resumen de Costos
        </h3>
        <div className="space-y-4 text-slate-700">
          <div className="flex justify-between border-b pb-2">
            <span>Subtotal habitaciones</span>
            <span className="font-semibold">
              ${subtotal.toLocaleString()} COP
            </span>
          </div>

          {detallesServicios.length > 0 && (
            <div className="border-b pb-2">
              <p className="font-semibold text-green-700 mb-1">
                Servicios seleccionados:
              </p>
              <ul className="text-sm space-y-1">
                {detallesServicios.map((d) => (
                  <li key={d.id} className="flex justify-between">
                    <span>
                      {d.nombre}{" "}
                      <span className="text-slate-500">({d.descripcion})</span>
                    </span>
                    <span className="font-medium">
                      ${d.total.toLocaleString()} COP
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between border-b pb-2">
            <span>Subtotal servicios</span>
            <span className="font-semibold">
              ${totalServicios.toLocaleString()} COP
            </span>
          </div>

          <div className="flex justify-between text-lg font-bold text-green-800 pt-2">
            <span>Total a pagar</span>
            <span className="text-2xl text-green-700">
              ${totalGeneral.toLocaleString()} COP
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <Button
            style="exit"
            iconName="back"
            text="Atrás"
            onClick={() => setNav(0)}
          />
          <Button
            style="primary"
            iconName="next"
            text="Continuar con la reserva"
            onClick={handleContinue}
            disabled={hasMissingRequiredData()}
            className={
              hasMissingRequiredData() ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
