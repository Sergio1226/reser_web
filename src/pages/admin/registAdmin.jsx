import { useState, useEffect } from "react";
import { Button } from "../../components/Button.jsx";
import { TextField } from "../../components/TextField.jsx";
import { supabase } from "../../utils/supabase.js";
import { usePopup } from "../../utils/PopupContext.jsx";
import { addClient } from "../../utils/Api.jsx";

export function RegistUser() {
  const { openPopup } = usePopup();

  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    tipo_documento: "",
    documento: "",
    fecha_nacimiento: "",
    id_pais_origen: "",
    id_pais_destino: "",
    id_nacionalidad: "",
  });

  const [isColombian, setIsColombian] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paisesResult, documentosResult] = await Promise.all([
          supabase.from("paises").select("*"),
          supabase.from("tipos_documento").select("*"),
        ]);

        if (paisesResult.error) throw paisesResult.error;
        if (documentosResult.error) throw documentosResult.error;

        setCountries(paisesResult.data || []);
        setDocuments(documentosResult.data || []);
      } catch (err) {
        console.log(err);
        openPopup("Error al cargar datos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [openPopup]);

  useEffect(() => {
    const colombia = countries.find(
      (country) => country.nombre.toLowerCase() === "colombia"
    );

    if (colombia && form.id_nacionalidad) {
      const isUserColombian = parseInt(form.id_nacionalidad) === colombia.id;
      setIsColombian(isUserColombian);

      if (isUserColombian) {
        setForm((prev) => ({
          ...prev,
          fecha_nacimiento: "",
          id_pais_origen: "",
          id_pais_destino: "",
        }));
      }
    }
  }, [form.id_nacionalidad, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (isColombian&&form.tipo_documento === "Pasaporte") {
      openPopup(
        "No puede registrar un pasaporte si es colombiano",
        "warning"
      );
      return false;
    }
    if(!isColombian&&(form.tipo_documento==="Cedula de Ciudadania"||form.tipo_documento==="NIT (Persona Jurídica)")){
      openPopup(
        "No puede registrar un documento de identidad si no es colombiano",
        "warning"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const clientData = {
        ...form,
        tipo_documento: parseInt(form.tipo_documento),
        id_nacionalidad: parseInt(form.id_nacionalidad),
        id_pais_origen: form.id_pais_origen
          ? parseInt(form.id_pais_origen)
          : null,
        id_pais_destino: form.id_pais_destino
          ? parseInt(form.id_pais_destino)
          : null,
        fecha_nacimiento: form.fecha_nacimiento || null,
        email: form.email.toLowerCase(),
      };

      const {error} =await addClient(clientData);

      if (error) {
        openPopup("Error al registrar el cliente", "error");
      } else {
        openPopup("Cliente registrado exitosamente", "success");

        setForm({
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
          tipo_documento: "",
          documento: "",
          fecha_nacimiento: "",
          id_pais_origen: "",
          id_pais_destino: "",
          id_nacionalidad: "",
          email: "",
        });
      }
    } catch (err) {
      openPopup(err.message, "error");
      console.log("Error inesperado:" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div className=" py-8 px-4">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">👤</span>
          Registrar Nuevo Cliente
        </h2>
        <p className="text-green-100">
          Complete el formulario para agregar un nuevo cliente al sistema
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg border border-black/20  p-8 space-y-6"
      >
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Primer Nombre
              </label>
              <TextField
                placeholder="Primer Nombre"
                name="primer_nombre"
                type="text"
                required
                value={form.primer_nombre}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">
                Segundo Nombre
              </label>
              <TextField
                placeholder="Segundo Nombre (opcional)"
                name="segundo_nombre"
                type="text"
                value={form.segundo_nombre}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Primer Apellido
              </label>
              <TextField
                placeholder="Primer Apellido"
                type="text"
                required
                name="primer_apellido"
                value={form.primer_apellido}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">
                Segundo Apellido
              </label>
              <TextField
                placeholder="Segundo Apellido (opcional)"
                type="text"
                name="segundo_apellido"
                value={form.segundo_apellido}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Documento e Identificación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Tipo de Documento
              </label>
              <select
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white rounded-lg outline outline-1 outline-gray-300 text-gray-700 focus:outline-green-600 focus:outline-2"
              >
                <option value="">Seleccione un tipo</option>
                {documents.map((document) => (
                  <option key={document.id} value={document.id}>
                    {document.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Número de Documento
              </label>
              <TextField
                placeholder="Número de Documento"
                type="number"
                required
                name="documento"
                value={form.documento}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-2 md:col-span-2 w-fit">
              <label className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Nacionalidad
              </label>
              <select
                name="id_nacionalidad"
                value={form.id_nacionalidad}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white rounded-lg outline outline-1 outline-gray-300 text-gray-700 focus:outline-green-600 focus:outline-2"
              >
                <option value="">Seleccione una nacionalidad</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {!isColombian && form.id_nacionalidad && (
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Información Adicional (Extranjeros)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">
                  <span className="text-red-500">*</span> Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white rounded-lg outline outline-1 outline-gray-300 text-gray-700 focus:outline-green-600 focus:outline-2"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-700 font-medium">
                  <span className="text-red-500">*</span> País de Procedencia
                </label>
                <select
                  name="id_pais_origen"
                  value={form.id_pais_origen}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white rounded-lg outline outline-1 outline-gray-300 text-gray-700 focus:outline-green-600 focus:outline-2"
                >
                  <option value="">Seleccione un país</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2 md:col-span-2 w-fit">
                <label className="text-gray-700 font-medium">
                  <span className="text-red-500">*</span> País de Destino
                </label>
                <select
                  name="id_pais_destino"
                  value={form.id_pais_destino}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white rounded-lg outline outline-1 outline-gray-300 text-gray-700 focus:outline-green-600 focus:outline-2"
                >
                  <option value="">Seleccione un país</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="pb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Credenciales de Acceso
          </h3>
          <div className="grid grid-cols-1 gap-6 w-1/3">
            <div className="flex flex-col space-y-2 ">
              <label className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Correo Electrónico
              </label>
              <TextField
                placeholder="correo@ejemplo.com"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full"
                name="email"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            text={loading ? "Registrando..." : "Registrar Cliente"}
            style="primary"
            iconName={loading ? undefined : "next"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
