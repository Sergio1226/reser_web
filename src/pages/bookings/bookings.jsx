import { Footer } from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import ProfileButton from "../../components/ProfileButton.jsx";
import { Button } from "../../components/Button.jsx";
import { NavigationTab } from "../../components/NavigationTab.jsx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Counter } from "../../components/Counter.jsx";
import { useState, useEffect } from "react";
import { useExtraServices } from "../../utils/useExtraServices";
import { useConfirmReservation } from "../../utils/useConfirmReservation";
import { useNavigate } from "react-router-dom";
import { BookingSearch } from "./bookingsSearch.jsx";
import { BookingTable } from "./bookingsList.jsx";
import { useSize } from "../../utils/SizeContext.jsx";

const options = [
  {
    title: "Realizar Reserva",
    icon: "booking",
  },
  {
    title: "Visualizar Reservas",
    icon: "list",
  },
];

export default function Bookings() {
  const navigate = useNavigate();
  const [nav, setNav] = useState(0);
  const {isMobile}=useSize();

  return (
    <div className="min-h-screen max-w-full flex flex-col font-primary bg-gradient-to-br from-gradient_1 to-secondary m-0 overflow-x-hidden">
      <Header>
        <div className={`flex flex-row md:flex-col justify-center items-center ${isMobile ? " space-x-2":"space-y-2"} mt-4 mr-8 w-full`}>
          <ProfileButton toPag={"/login"} />
        </div>
      </Header>

      <main className="flex flex-col flex-1 items-center p-4 sm:p-8 overflow-x-hidden w-full">
        <div className="w-full max-w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-x-hidden">
            {nav < 2 && (
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-8">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">
                  Modulo de Reservas
                </h1>
                <p className="text-green-100 text-center">
                  Realiza y Visualiza tus reservas de manera fácil y rápida
                </p>
              </div>
            )}

            {nav < 2 && (
              <div className="py-6 flex justify-center items-center border-b border-slate-200">
                <NavigationTab
                  state={nav}
                  setState={setNav}
                  options={options}
                />
              </div>
            )}

            <div className="p-8">
              {nav === 0 && <BookingSearch setNav={setNav} />}
              {nav === 1 && <BookingTable />}
              {nav === 2 && <ExtraServices setNav={setNav} />}
              {nav === 3 && <ConfirmReservation setNav={setNav} />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

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

function ExtraServices({ setNav }) {
  const storedSubtotal = Number(localStorage.getItem("reservaSubtotal") || 0);
  const subtotal = storedSubtotal ?? 0;

  const huespedes = JSON.parse(
    localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
  );
  const totalHuespedes = (huespedes.adultos || 1) + (huespedes.ninos || 0);

  const {
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
  } = useExtraServices(subtotal);

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <p className="text-slate-600 font-medium animate-pulse">
          Cargando servicios adicionales...
        </p>
      </div>
    );
  }

  const handleContinue = () => {

    for (const service of services) {
      const data = selected[service.id];
      if (!data?.activo) continue;

      if (
        (service.tipo_cobro === "por_dia_por_persona" ||
          service.tipo_cobro === "por_dia_por_vehiculo") &&
        (!data.dias || data.dias.length === 0)
      ) {
        alert(`Debes seleccionar al menos un día para el servicio: ${service.nombre}`);
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
    setNav(3);
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

  const detallesServicios = calcularDetalleServicios();
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-8 shadow-lg text-white text-center">
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
          const todasSeleccionadas = data.dias?.length === diasDisponibles.length;

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
                  <h3 className="font-bold text-xl text-slate-800">{s.nombre}</h3>
                  <p className="text-slate-600 text-sm">{s.descripcion}</p>
                  <p className="text-green-700 font-semibold text-lg">
                    ${s.precio.toLocaleString()} COP
                    <span className="text-sm text-slate-500 font-normal">
                      {s.tipo_cobro === "por_dia_por_persona" && " /persona /día"}
                      {s.tipo_cobro === "por_dia_por_vehiculo" && " /vehículo /día"}
                      {s.tipo_cobro === "por_evento_por_persona" && " /persona /evento"}
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
                          onClick={() =>
                            assignAllGuests(s.id, totalHuespedes)
                          }
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
                          onChange={(e) =>
                            setServiceDate(s.id, e.target.value)
                          }
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
          <Button style="exit" iconName="back" text="Atrás" onClick={() => setNav(0)} />
          <Button
            style="primary"
            iconName="next"
            text="Continuar con la reserva"
            onClick={handleContinue}
            disabled={hasMissingRequiredData()}
            className={hasMissingRequiredData() ? "opacity-50 cursor-not-allowed" : ""}
          />
        </div>
      </div>
    </div>
  );
}

function ConfirmReservation({ setNav }) {
  const { resumen, serviciosInfo, handleConfirm } = useConfirmReservation(setNav);

  const habitaciones = JSON.parse(localStorage.getItem("habitacionesSeleccionadas") || "[]");
  const range = JSON.parse(
    localStorage.getItem("rangeSeleccionado") ||
      JSON.stringify({
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
  );
  const huespedes = JSON.parse(
    localStorage.getItem("reservaHuespedes") || '{"adultos":1,"ninos":0}'
  );

  const { subtotalHabitaciones, serviciosSeleccionados, totalGeneral } = resumen;

  const serviciosActivos = Object.fromEntries(
    Object.entries(serviciosSeleccionados).filter(
      ([_, sel]) => sel.activo && sel.cantidad > 0
    )
  );

  const calcularTotalServicio = (info, sel) => {
    if (!info || !sel) return 0;
    const precio = info.precio || 0;
    const cantidad = sel.cantidad || 1;
    const dias = sel.dias || [];
    const tipo = info.tipo_cobro;

    let total = 0;
    if (tipo === "por_dia_por_persona" || tipo === "por_dia_por_vehiculo") {
      total = precio * cantidad * dias.length;
    } else if (tipo === "por_evento_por_persona") {
      total = precio * cantidad;
    }
    return total;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">✅</span>
          Confirmar Reserva
        </h2>
        <p className="text-green-100">
          Revisa los detalles finales antes de confirmar
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Resumen Final</h3>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-600">Check-In:</p>
              <p className="text-slate-800 font-medium">
                {new Date(range.startDate).toLocaleDateString("es-CO")}
              </p>
              <p className="text-sm text-slate-600 mt-2">Check-Out:</p>
              <p className="text-slate-800 font-medium">
                {new Date(range.endDate).toLocaleDateString("es-CO")}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 max-w-[200px]">
              <p>
                El check-in se debe realizar hasta las <b>6:00 p.m.</b> y el check-out
                hasta las <b>2:00 p.m.</b>
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-3">Huéspedes:</p>
          <p className="text-slate-800 font-medium">
            {huespedes.adultos} adultos, {huespedes.ninos} niños
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-600 mb-2">Habitaciones seleccionadas:</p>
          {habitaciones.length > 0 ? (
            <ul className="list-disc list-inside text-slate-800 font-medium">
              {habitaciones.map((id) => (
                <li key={id}>Habitación #{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic">No se seleccionaron habitaciones</p>
          )}
          <p className="text-sm text-slate-600 mt-2">Subtotal habitaciones:</p>
          <p className="text-slate-800 font-semibold">
            ${subtotalHabitaciones.toLocaleString()} COP
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-sm font-bold text-slate-700 mb-3">
            Servicios adicionales:
          </p>

          {Object.keys(serviciosActivos).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(serviciosActivos).map(([id, sel]) => {
                const info = serviciosInfo[id];
                const totalServicio = calcularTotalServicio(info, sel);

                let detalle = "";
                if (info?.tipo_cobro === "por_dia_por_persona") {
                  detalle = `${sel.dias?.length || 0} día(s) × ${sel.cantidad} persona(s)`;
                } else if (info?.tipo_cobro === "por_dia_por_vehiculo") {
                  detalle = `${sel.dias?.length || 0} día(s) × ${sel.cantidad} vehículo(s)`;
                } else if (info?.tipo_cobro === "por_evento_por_persona") {
                  detalle = `1 evento × ${sel.cantidad} persona(s)`;
                }

                return (
                  <li
                    key={id}
                    className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0"
                  >
                    <div>
                      <span className="font-medium text-slate-800">
                        {info?.nombre || `Servicio #${id}`}
                      </span>

                      <span className="text-sm text-slate-600 ml-2">
                        ({detalle})
                      </span>

                      {sel.fecha && (
                        <p className="text-xs text-slate-500 ml-2">
                          Fecha: {sel.fecha}
                        </p>
                      )}

                      {Array.isArray(sel.dias) && sel.dias.length > 0 && (
                        <p className="text-xs text-slate-500 ml-2">
                          Días: {sel.dias.join(", ")}
                        </p>
                      )}
                    </div>

                    <span className="font-semibold text-slate-700">
                      ${totalServicio.toLocaleString()} COP
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500 italic">
              No se seleccionaron servicios adicionales
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-800">
              Total Final:
            </span>
            <span className="text-3xl font-bold text-green-700">
              ${totalGeneral.toLocaleString()} COP
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          style="exit"
          text="Atrás"
          iconName="back"
          onClick={() => setNav(2)}
        />
        <Button
          style="primary"
          text="Confirmar Reserva"
          iconName="check"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
}
