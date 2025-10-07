import { useState, useEffect } from "react";
import { Button } from "../../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { TextField } from "../../components/TextField.jsx";
import { supabase } from "../../utils/supabase.js";
import { UserAuth } from "../../utils/AuthContext.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";

export function RegistUser({ setNav }) {
  const { openPopup } = usePopup();
  const { signUpNewUser } = UserAuth();

  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data: paises, error } = await supabase
          .from("paises")
          .select("*");
        if (error) throw error;
        setCountries(paises || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchDocuments = async () => {
      try {
        const { data: tipos_documentos, error } = await supabase
          .from("tipos_documento")
          .select("*");
        if (error) throw error;
        setDocuments(tipos_documentos || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCountries();
    fetchDocuments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      openPopup("Las contraseñas no coinciden", "error");
      return;
    }

    if (password.length < 6) {
      openPopup("La contraseñas debe tener al menos 6 caracteres", "warning");
      return;
    }

    try {
      setLoading(true);
      await signUpNewUser({ email, password, user: form });
      openPopup("Registro exitoso", "success");
      setNav(0);
    } catch (err) {
      console.log(err);
      openPopup("Error en el registro", "error");
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
        Cargando datos...
      </div>
    );

  return (
    <div className="w-fit flex flex-col items-center p-8 h-fit mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-primary p-8 rounded-lg w-full max-w-md mx-auto border border-black/20 shadow-lg mt-8 flex flex-col items-center space-y-4"
      >
        <div className="text-center text-black text-4xl mt-4 font-bold">
          Registrarse
        </div>

        <label className="block text-gray-700 font-medium mb-2">
          Datos Personales
        </label>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">
            <span className="text-red-500">*</span> Primer Nombre
          </label>
          <TextField
            placeholder="Primer Nombre"
            name="primer_nombre"
            type="text"
            required
            value={form.primer_nombre}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">Segundo Nombre</label>
          <TextField
            placeholder="Segundo Nombre"
            name="segundo_nombre"
            type="text"
            value={form.segundo_nombre}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">
            <span className="text-red-500">*</span> Primer Apellido
          </label>
          <TextField
            placeholder="Primer Apellido"
            type="text"
            required
            name="primer_apellido"
            value={form.primer_apellido}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">Segundo Apellido</label>
          <TextField
            placeholder="Segundo Apellido"
            type="text"
            name="segundo_apellido"
            value={form.segundo_apellido}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">
            <span className="text-red-500">*</span> Tipo de Documento
          </label>
          <select
            name="tipo_documento"
            value={form.tipo_documento}
            onChange={handleChange}
            required
            className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
          >
            <option value="">Tipo Documento</option>
            {documents.map((document) => (
              <option key={document.id} value={document.id}>
                {document.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">
            <span className="text-red-500">*</span> Numero de Documento
          </label>
          <TextField
            placeholder="Numero de Documento"
            type="text"
            required
            name="documento"
            value={form.documento}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">País Procedencia</label>
          <select
            name="id_pais_origen"
            value={form.id_pais_origen}
            onChange={handleChange}
            className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
          >
            <option value="">País Procedencia</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">País Destino</label>
          <select
            name="id_pais_destino"
            value={form.id_pais_destino}
            onChange={handleChange}
            className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
          >
            <option value="">País Destino</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.nombre}
              </option>
            ))}
          </select>
        </div>

        <label className="block text-gray-900 font-medium mb-2">
          Credenciales de Acceso
        </label>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black">
            <span className="text-red-500">*</span> Correo Electrónico
          </label>
          <TextField
            placeholder="correo@dominio.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black items-start justify-start">
            <span className="text-red-500">*</span> Contraseña
          </label>
          <TextField
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-gray-600"
            >
              {!showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </TextField>
        </div>

        <div className="flex flex-col space-y-1 w-96">
          <label className="text-black items-start justify-start">
            <span className="text-red-500">*</span> Confirmar Contraseña
          </label>
          <TextField
            placeholder="Confirmar Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          >
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-gray-600"
            >
              {!showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </TextField>
        </div>

        {password !== passwordConfirm && passwordConfirm && (
          <div className="text-red-500 text-sm">
            Las contraseñas no coinciden
          </div>
        )}

        <div className="flex flex-row space-x-4">
          <Button
            text="Atras"
            style="exit"
            iconName="Back"
            type="button"
            onClick={() => setNav(0)}
          />
          <Button
            text="Continuar"
            style="primary"
            iconName="Next"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
