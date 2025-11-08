import RoomCard from "../../components/RoomCard.jsx";
import { Button } from "../../components/Button.jsx";
import { useState,useEffect, useRef } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Counter } from "../../components/Counter.jsx";
import { Calendar } from "../../components/Calendar.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { Loading } from "../../components/Animate.jsx";
import { searchAvailableRooms } from "../../utils/useSearchRooms.js";
import { format } from "date-fns";

export function BookingSearch({ setNav }) {
  const { openPopup } = usePopup();
  
  const sendRef =  useRef(null);

  const [countAdults, setCountAdults] = useState(1);
  const [countChildrens, setCountChildrens] = useState(0);
  const [countRooms, setCountRooms] = useState(1);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);
  const [showUp, setShowUp] = useState(false);

  const scrollToTop = () => {
    sendRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowUp(true);
      } else {
        setShowUp(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleSelectCombo = (combo) => {
    const isSame = selectedCombo === combo;
    setSelectedCombo(isSame ? null : combo);

    if (isSame) {
      localStorage.removeItem("rangeSeleccionado");
      localStorage.removeItem("habitacionesSeleccionadas");
    } else {
      localStorage.setItem(
        "rangeSeleccionado",
        JSON.stringify({
          startDate: range[0].startDate.toISOString(),
          endDate: range[0].endDate.toISOString(),
        })
      );
      localStorage.setItem(
        "habitacionesSeleccionadas",
        JSON.stringify({
          habitaciones: combo.map((r) => Number(r.id)),
          adultos: Number(countAdults),
          ninos: Number(countChildrens),
        })
      );
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearched(true);
    setSelectedCombo(null);
    localStorage.removeItem("rangeSeleccionado");
    localStorage.removeItem("habitacionesSeleccionadas");

    const validCombos = await searchAvailableRooms({
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      countAdults,
      countChildrens,
      countRooms,
      openPopup,
    });

    setAvailableRooms(validCombos);
    setSearchLoading(false);
  };

  const totalPrice =
    selectedCombo?.reduce((sum, r) => sum + (r.precio || 0), 0) || 0;

  const recommendedCombos = availableRooms
    .filter((combo) => {
      const totalCap = combo.reduce((s, r) => s + r.capacidad_total, 0);
      return (
        totalCap >= countAdults + countChildrens &&
        totalCap <= countAdults + countChildrens + 1
      );
    })
    .sort((a, b) => {
      const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
      const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
      return capA - capB;
    })
    .slice(0, 10);

  const otherCombos = availableRooms
    .filter((combo) => {
      const totalCap = combo.reduce((s, r) => s + r.capacidad_total, 0);
      return totalCap > countAdults + countChildrens + 1;
    })
    .sort((a, b) => {
      const capA = a.reduce((s, r) => s + r.capacidad_total, 0);
      const capB = b.reduce((s, r) => s + r.capacidad_total, 0);
      return capA - capB;
    })
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          Buscar Habitaciones
        </h2>

        <div className="flex flex-col lg:flex-row gap-4 justify-center ">
          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4 h-full">
            <Calendar range={range} setRange={setRange} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700">
                Check In - Check Out
              </span>
              <span className="text-slate-500 text-sm">
                {`${format(range[0].startDate, "dd/MM/yy")} - ${format(
                  range[0].endDate,
                  "dd/MM/yy"
                )}`}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow h-full ">
            <div className="flex items-start gap-3">
              <Icon
                name="guest"
                alt="Huespedes"
                style="size-8 text-blue-600 flex-shrink-0"
              />
              <div className="flex flex-col space-y-2">
                <div className="text-sm font-semibold text-slate-700">
                  Huéspedes
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">Adultos</span>
                  <Counter
                    count={countAdults}
                    setCount={setCountAdults}
                    min={1}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600">Niños</span>
                  <Counter
                    count={countChildrens}
                    setCount={setCountChildrens}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow h-full ">
            <div className="flex items-start gap-3">
              <Icon
                name="bed"
                alt="Habitaciones"
                style="size-8 text-blue-600 flex-shrink-0"
              />
              <div className="flex flex-col space-y-2">
                <div className="text-sm font-semibold text-slate-700">
                  Habitaciones
                </div>
                <Counter count={countRooms} setCount={setCountRooms} min={1} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            text={searchLoading ? "Buscando..." : "Buscar Habitaciones"}
            style="primary"
            iconName="search"
            onClick={handleSearch}
            disabled={searchLoading}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col flex-1 space-y-6">
          {searchLoading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200 ">
              <Loading />
              <p className="text-slate-600 font-medium">
                🔄 Buscando habitaciones disponibles...
              </p>
            </div>
          ) : availableRooms.length > 0 ? (
            <>
              {recommendedCombos.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-md">
                  <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      ✓
                    </span>
                    Opciones Recomendadas
                  </h3>

                  <div className="space-y-4">
                    {recommendedCombos.map((combo, idx) => {
                      const totalCap = combo.reduce(
                        (s, r) => s + r.capacidad_total,
                        0
                      );
                      const comboPrice = combo.reduce(
                        (sum, r) => sum + (r.precio || 0),
                        0
                      );

                      return (
                        <div
                          key={combo.map((r) => r.id).join("-")}
                          className={`border rounded-lg p-4 shadow-sm transition-all ${
                            selectedCombo === combo
                              ? "border-green-500 bg-green-100"
                              : "border-green-300 bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-sm font-semibold text-slate-700">
                              Opción {idx + 1} – Capacidad: {totalCap} personas
                            </div>
                            <div className="text-lg font-bold text-green-700">
                              ${comboPrice.toLocaleString("es-CO")}
                            </div>
                          </div>

                          <button
                            className={`w-full px-4 py-2 rounded-lg font-semibold transition mb-3 ${
                              selectedCombo === combo
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            onClick={() => handleSelectCombo(combo)}
                          >
                            {selectedCombo === combo
                              ? "✕ Quitar selección"
                              : "✓ Seleccionar esta opción"}
                          </button>

                          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combo.map((r) => {
                              const capacity = r.capacidad_total;
                              const bedType = (r.habitaciones_camas || []).map(
                                (hc) => ({
                                  tipo: hc?.camas?.nombre || "Cama sin nombre",
                                  cantidad: hc?.cantidad || 0,
                                })
                              );

                              const services = (
                                r.habitaciones_caracteristicas || []
                              ).map((hc) => ({
                                icon: hc.caracteristicas?.icono || "wifi",
                                label: hc.caracteristicas?.nombre || "Servicio",
                              }));

                              return (
                                <div
                                  key={r.id}
                                  className="bg-white rounded-lg p-2 border border-slate-200"
                                >
                                  <RoomCard
                                    id={r.id}
                                    price={r.precio ?? 0}
                                    imageNames={[
                                      `${r.id}.jpeg`,
                                      `${r.id}_Bano.jpeg`,
                                    ]}
                                    services={services}
                                    description={
                                      r.descripcion ??
                                      "Sin descripción disponible"
                                    }
                                    capacity={capacity}
                                    bedType={bedType}
                                    selected={selectedCombo === combo}
                                    disabled={
                                      !!selectedCombo && selectedCombo !== combo
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {otherCombos.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200 shadow-md">
                  <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      +
                    </span>
                    Opciones Disponibles
                  </h3>

                  <div className="space-y-4">
                    {otherCombos.map((combo, idx) => {
                      const totalCap = combo.reduce(
                        (s, r) => s + r.capacidad_total,
                        0
                      );
                      const comboPrice = combo.reduce(
                        (sum, r) => sum + (r.precio || 0),
                        0
                      );

                      return (
                        <div
                          key={combo.map((r) => r.id).join("-")}
                          className={`border rounded-lg p-4 shadow-sm transition-all ${
                            selectedCombo === combo
                              ? "border-blue-500 bg-blue-100"
                              : "border-blue-300 bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-sm font-semibold text-slate-700">
                              Opción {idx + 1} – Capacidad: {totalCap} personas
                            </div>
                            <div className="text-lg font-bold text-blue-700">
                              ${comboPrice.toLocaleString("es-CO")}
                            </div>
                          </div>

                          <button
                            className={`w-full px-4 py-2 rounded-lg font-semibold transition mb-3 ${
                              selectedCombo === combo
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                            onClick={() => handleSelectCombo(combo)}
                          >
                            {selectedCombo === combo
                              ? "✕ Quitar selección"
                              : "✓ Seleccionar esta opción"}
                          </button>

                          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                            {combo.map((r) => {
                              const capacity = r.capacidad_total;
                              const bedType = (r.habitaciones_camas || []).map(
                                (hc) => ({
                                  tipo: hc?.camas?.nombre || "Cama sin nombre",
                                  cantidad: hc?.cantidad || 0,
                                })
                              );

                              const services = (
                                r.habitaciones_caracteristicas || []
                              ).map((hc) => ({
                                icon: hc.caracteristicas?.icono || "wifi",
                                label: hc.caracteristicas?.nombre || "Servicio",
                              }));

                              return (
                                <div
                                  key={r.id}
                                  className="bg-white rounded-lg p-2 border border-slate-200 "
                                >
                                  <RoomCard
                                    id={r.id}
                                    price={r.precio ?? 0}
                                    imageNames={[
                                      `${r.id}.jpeg`,
                                      `${r.id}_Bano.jpeg`,
                                    ]}
                                    services={services}
                                    description={
                                      r.descripcion ??
                                      "Sin descripción disponible"
                                    }
                                    capacity={capacity}
                                    bedType={bedType}
                                    selected={selectedCombo === combo}
                                    disabled={
                                      !!selectedCombo && selectedCombo !== combo
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : searched ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
              <p className="text-slate-600 font-medium text-xl mb-2">😕</p>
              <p className="text-slate-600 font-medium">
                No hay habitaciones disponibles
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Intenta modificar las fechas o el número de huéspedes
              </p>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
              <p className="text-slate-400 font-medium text-xl mb-2">🔍</p>
              <p className="text-slate-400 font-medium">
                Realiza una búsqueda para ver habitaciones disponibles
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-80" ref={sendRef}>
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
                Resumen de Reserva
              </h3>

              {selectedCombo ? (
                <>
                  <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="font-semibold">Habitaciones:</span>
                    </p>
                    <p className="text-slate-800 font-medium">
                      {selectedCombo.map((r) => `#${r.id}`).join(", ")}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <p className="text-sm text-slate-600 mb-2">
                      Total a pagar:
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      ${totalPrice.toLocaleString("es-CO")}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">COP</p>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg p-6 mb-4 shadow-sm text-center">
                  <p className="text-slate-400">No hay opción seleccionada</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Selecciona una combinación de habitaciones para continuar
                  </p>
                </div>
              )}

              <Button
                text="Continuar"
                style="primary"
                iconName="next"
                onClick={() => {
                  localStorage.setItem(
                    "reservaSubtotal",
                    String(totalPrice || 0)
                  );
                  setNav(2);
                }}
                disabled={!selectedCombo}
                className={`w-full ${
                  !selectedCombo ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <Button
              onClick={scrollToTop}
              className={`fixed bottom-6 right-6 p-3 rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 ${
                showUp
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10 pointer-events-none"
              }`}
              style={"primary"}
              iconName="arrowUp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
