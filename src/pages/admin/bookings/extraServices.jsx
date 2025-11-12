import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import {Button} from "../../../components/Button";
import {Counter} from "../../../components/Counter";

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from("servicios_adicionales").select("*");
        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const totalServ = services.reduce((sum, s) => {
      const cantidad = selected[s.id] || 0;
      return sum + s.precio * cantidad;
    }, 0);
    setTotalServicios(totalServ);
    setTotalGeneral(subtotal + totalServ);
  }, [selected, services, subtotal]);

  const setServiceCount = (id, value) => {
    setSelected((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
        <p className="text-slate-600 font-medium">
          Cargando servicios adicionales...
        </p>
      </div>
    );
  }

  const desayuno = services.find((s) => s.nombre === "Desayuno");
  const parqueadero = services.find((s) => s.nombre === "Parqueadero");
  const senderismo = services.find((s) => s.nombre === "Senderismo");

  const getLabel = (s) => {
    if (s.id === desayuno?.id) return "por huésped";
    if (s.id === parqueadero?.id) return "por vehículo";
    if (s.id === senderismo?.id) return "por persona";
    return "";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">🛎️</span>Servicios Adicionales
        </h2>
        <p className="text-blue-100">
          Mejora tu experiencia con nuestros servicios extras
        </p>
      </div>

      <div className="space-y-4">
        {desayuno && (
          <div className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{desayuno.nombre}</h3>
              <p className="text-sm text-gray-500">{desayuno.descripcion}</p>
              <p className="text-lg font-semibold text-blue-700 mt-1">
                ${desayuno.precio.toLocaleString()} COP{" "}
                <span className="text-sm text-gray-500">/ por persona</span>
              </p>
            </div>
            <button
              className={`px-4 py-2 rounded ${
                selected[desayuno.id]
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
              onClick={() =>
                setServiceCount(
                  desayuno.id,
                  selected[desayuno.id] ? 0 : totalHuespedes
                )
              }
            >
              {selected[desayuno.id]
                ? "Quitar desayuno"
                : `Agregar desayuno para ${totalHuespedes} huéspedes`}
            </button>
          </div>
        )}

        {services
          .filter((s) => s.id !== desayuno?.id)
          .map((s) => {
            let maxCount = 1000;
            if (s.id === senderismo?.id) maxCount = totalHuespedes;
            if (s.id === parqueadero?.id) maxCount = totalHuespedes;

            return (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">
                      {s.nombre}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {s.descripcion}
                    </p>
                    <p className="text-lg font-semibold text-blue-700 mt-2">
                      ${s.precio.toLocaleString()} COP{" "}
                      {getLabel(s) && (
                        <span className="text-sm text-gray-500">
                          / {getLabel(s)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 font-medium">
                      Cantidad:
                    </span>
                    <Counter
                      count={selected[s.id] || 0}
                      setCount={(val) => setServiceCount(s.id, val)}
                      min={0}
                      max={maxCount}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          Resumen de Costos
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Subtotal habitaciones:
            </span>
            <span className="text-slate-800 font-semibold">
              ${subtotal.toLocaleString()} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Servicios adicionales:
            </span>
            <span className="text-slate-800 font-semibold">
              ${totalServicios.toLocaleString()} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-3 mt-2">
            <span className="text-xl font-bold text-green-800">
              TOTAL A PAGAR:
            </span>
            <span className="text-2xl font-bold text-green-700">
              ${totalGeneral.toLocaleString()} COP
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-center py-4 ">
        <Button style="exit" iconName="back" text="Atrás" onClick={() => setNav(0)} />
        <Button
          style="primary"
          text="Continuar con la reserva"
          iconName="next"
          onClick={() => {
            const resumen = {
              subtotalHabitaciones: subtotal,
              subtotalServicios: totalServicios,
              totalGeneral,
              serviciosSeleccionados: selected,
            };
            localStorage.setItem("reservaDatos", JSON.stringify(resumen));
            setNav(2);
          }}
        />
      </div>
    </div>
  );
}
