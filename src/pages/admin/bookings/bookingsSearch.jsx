import { Button } from "../../../components/Button.jsx";
import { useState } from "react";
import { Counter } from "../../../components/Counter.jsx";
import { usePopup } from "../../../utils/PopupContext.jsx";
import { Loading } from "../../../components/Animate.jsx";
import { format } from "date-fns";
import { getClientByEmail } from "../../../utils/Api.jsx";
import { useConfirmReservation } from "../../../utils/useConfirmReservation.js";
import  SearchBookingsAdmin from "./search.jsx";
import  AdminExtraServices  from "./extraServices.jsx";

export function BookingsAdmin(){
  const [nav,setNav] = useState(0);
  const render=()=>{
    switch (nav) {
      case 0:
        return <SearchBookingsAdmin setNav={setNav} />;
      case 1:
        return <AdminExtraServices setNav={setNav} />;
      case 2:
        return <AdminSelectClient setNav={setNav} />;
      case 3:
        return <AdminConfirmReservation setNav={setNav} />;
      default:
        return <SearchBookingsAdmin setNav={setNav} />;
    }
  }
  return render();
}


export function AdminSelectClient({ setNav }) {
  const { openPopup } = usePopup();
  const [email, setEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [clientFound, setClientFound] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearchClient = async () => {
    if (!email || !email.includes("@")) {
      openPopup("Por favor ingresa un correo válido", "warning");
      setEmail("");
      setClientFound(null);
      setSearched(true);
      return;
    }

    setSearchLoading(true);
    setSearched(true);
    setClientFound(null);

    try {
      const data = await getClientByEmail(email);
      console.log(data)
      setClientFound(data);
    } catch (error) {
      console.error("Error al buscar cliente:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleConfirmClient = () => {
    if (!clientFound) {
      openPopup("Debes buscar y seleccionar un cliente", "warning");
      return;
    }

    localStorage.setItem("clienteSeleccionado", JSON.stringify(clientFound));
    setNav(3);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-4">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">👤</span>
          Seleccionar Cliente
        </h2>
        <p className="text-green-100">
          Busca al cliente por su correo electrónico para asignarle la reserva
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Buscar Cliente
        </h3>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchClient()}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Button
            text={searchLoading ? "Buscando..." : "Buscar"}
            style="primary"
            iconName="search"
            onClick={handleSearchClient}
            disabled={searchLoading}
          />
        </div>

        {searchLoading && (
          <div className="text-center py-8">
            <Loading />
            <p className="text-slate-600 mt-2">Buscando cliente...</p>
          </div>
        )}

        {!searchLoading && searched && !clientFound && (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-xl mb-2">😕</p>
            <p className="text-slate-600 font-medium">
              No se encontró ningún cliente con ese correo
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Verifica el correo e intenta nuevamente
            </p>
          </div>
        )}

        {clientFound && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-green-800 mb-3">
                  Cliente Encontrado
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Nombre:
                    </span>
                    <span className="text-sm text-slate-600">
                      {clientFound.primer_nombre} {clientFound.primer_apellido}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Correo:
                    </span>
                    <span className="text-sm text-slate-600">
                      {clientFound.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Documento:
                    </span>
                    <span className="text-sm text-slate-600">
                      {clientFound.documento || "No registrado"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Resumen de la Reserva
        </h3>

        {(() => {
          const reservaDatos = JSON.parse(
            localStorage.getItem("reservaDatos") || "{}"
          );
          return (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-700">Habitaciones:</span>
                <span className="font-semibold text-slate-800">
                  ${(reservaDatos.subtotalHabitaciones || 0).toLocaleString()}{" "}
                  COP
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-700">Servicios adicionales:</span>
                <span className="font-semibold text-slate-800">
                  ${(reservaDatos.subtotalServicios || 0).toLocaleString()} COP
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3 mt-2">
                <span className="text-lg font-bold text-green-800">TOTAL:</span>
                <span className="text-2xl font-bold text-green-700">
                  ${(reservaDatos.totalGeneral || 0).toLocaleString()} COP
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          style="exit"
          text="Cancelar"
          iconName="back"
          onClick={() => setNav(0)}
        />
        <Button
          style="primary"
          text="Confirmar y Crear Reserva"
          iconName="check"
          onClick={handleConfirmClient}
          disabled={!clientFound}
          className={!clientFound ? "opacity-60 cursor-not-allowed" : ""}
        />
      </div>
    </div>
  );
}

function AdminConfirmReservation({ setNav }) {
  const [loading, setLoading] = useState(false);
  const {handleConfirmWithEmail} = useConfirmReservation(setNav);

  const rangeData = JSON.parse(localStorage.getItem("rangeSeleccionado") || "{}");
  const habitacionesData = JSON.parse(localStorage.getItem("habitacionesSeleccionadas") || "[]");
  const huespedesData = JSON.parse(localStorage.getItem("reservaHuespedes") || "{}");
  const serviciosData = JSON.parse(localStorage.getItem("serviciosAdicionalesAdmin") || "{}");
  const reservaDatos = JSON.parse(localStorage.getItem("reservaDatos") || "{}");
  const clienteData = JSON.parse(localStorage.getItem("clienteSeleccionado") || "{}");

  const startDate = rangeData.startDate ? new Date(rangeData.startDate) : null;
  const endDate = rangeData.endDate ? new Date(rangeData.endDate) : null;

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-3xl">✅</span>
          Confirmar Reserva
        </h2>
        <p className="text-blue-100">
          Revisa todos los detalles antes de confirmar la reserva
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Información del Cliente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Nombre completo</p>
            <p className="font-semibold text-slate-800">
              {clienteData.primer_nombre} {clienteData.segundo_nombre || ""} {clienteData.primer_apellido} {clienteData.segundo_apellido || ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Correo electrónico</p>
            <p className="font-semibold text-slate-800">{clienteData.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Documento</p>
            <p className="font-semibold text-slate-800">
              {clienteData.documento || "No registrado"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Fechas y Huéspedes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">Check-in</p>
            <p className="font-semibold text-slate-800">
              {startDate ? format(startDate, "dd/MM/yyyy") : "No definido"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Check-out</p>
            <p className="font-semibold text-slate-800">
              {endDate ? format(endDate, "dd/MM/yyyy") : "No definido"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Noches</p>
            <p className="font-semibold text-slate-800">
              {calculateNights()} noche{calculateNights() > 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Adultos</p>
            <p className="font-semibold text-slate-800">
              {huespedesData.adultos || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Niños</p>
            <p className="font-semibold text-slate-800">
              {huespedesData.ninos || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🛏️</span>
          Habitaciones Seleccionadas
        </h3>
        <div className="space-y-2">
          { habitacionesData.length > 0 ? (
            habitacionesData.map((room, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="font-medium text-slate-800">
                  Habitación #{room}
                </span>
                <span className="text-sm text-slate-600">
                  {calculateNights()} noche{calculateNights() > 1 ? "s" : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No hay habitaciones seleccionadas</p>
          )}
        </div>
      </div>

      {Object.keys(serviciosData).length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🛎️</span>
            Servicios Adicionales
          </h3>
          <div className="space-y-2">
            {Object.entries(serviciosData).map(([serviceId, cantidad]) => (
              cantidad > 0 && (
                <div
                  key={serviceId}
                  className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="font-medium text-slate-800">
                    Servicio ID: {serviceId}
                  </span>
                  <span className="text-sm text-slate-600">
                    Cantidad: {cantidad}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-300 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          Resumen de Costos
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Subtotal Habitaciones:
            </span>
            <span className="font-semibold text-slate-800">
              ${(reservaDatos.subtotalHabitaciones || 0).toLocaleString("es-CO")} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-200">
            <span className="text-slate-700 font-medium">
              Servicios Adicionales:
            </span>
            <span className="font-semibold text-slate-800">
              ${(reservaDatos.subtotalServicios || 0).toLocaleString("es-CO")} COP
            </span>
          </div>
          <div className="flex justify-between items-center py-4 bg-white rounded-lg px-4 mt-2">
            <span className="text-xl font-bold text-green-800">
              TOTAL A PAGAR:
            </span>
            <span className="text-3xl font-bold text-green-700">
              ${(reservaDatos.totalGeneral || 0).toLocaleString("es-CO")} COP
            </span>
          </div>
        </div>
      </div>

      <div className=" p-6">
        {loading ? (
          <div className="text-center py-8">
            <Loading />
            <p className="text-slate-600 mt-4 font-medium">
              Creando reserva...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Por favor espera un momento
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              style="exit"
              text="Cancelar"
              iconName="back"
              onClick={() => setNav(0)}
            />
            <Button
              style="primary"
              text="Confirmar Reserva"
              iconName="check"
              onClick={()=>handleConfirmWithEmail().then(() => setNav(0))}
              className="sm:px-8"
            />
          </div>
        )}
      </div>
    </div>
  );
}