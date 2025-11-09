import { useState, useEffect, useContext } from "react";
import { Button } from "../../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { TextField } from "../../components/TextField.jsx";
import { supabase } from "../../utils/supabase.js";
import { UserAuth } from "../../utils/AuthContext.jsx";
import { CardForm } from "../../components/CardForm.jsx";
import { PopupContext } from "../../utils/PopupContext.jsx";

export function RegistUser({ setNav }) {
  const { signUpNewUser } = UserAuth();
  const { openPopup } = useContext(PopupContext);

  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    tipo_documento: "",
    documento: "",
    fecha_nacimiento: null,
    id_pais_origen: "",
    id_pais_destino: "",
    id_nacionalidad: "",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data: paises, error } = await supabase.from("paises").select("*");
        if (error) throw error;
        setCountries(paises || []);
      } catch (err) {
        console.log(err);
        openPopup("Error cargando países", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchDocuments = async () => {
      try {
        const { data: tipos_documentos, error } = await supabase.from("tipos_documento").select("*");
        if (error) throw error;
        setDocuments(tipos_documentos || []);
      } catch (err) {
        console.log(err);
        openPopup("Error cargando tipos de documento", "error");
      }
    };

    fetchCountries();
    fetchDocuments();
  }, []);

  useEffect(() => {
    const colombia = countries.find((c) => c.nombre.toLowerCase() === "colombia");
    if (colombia && parseInt(form.id_nacionalidad) === colombia.id) {
      setForm((prev) => ({
        ...prev,
        id_pais_origen: null,
        id_pais_destino: null,
      }));
    }
  }, [form.id_nacionalidad, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.primer_nombre.trim()) newErrors.primer_nombre = "Campo obligatorio.";
    if (!form.primer_apellido.trim()) newErrors.primer_apellido = "Campo obligatorio.";
    if (!form.id_nacionalidad) newErrors.id_nacionalidad = "Seleccione una nacionalidad.";
    if (!form.tipo_documento) newErrors.tipo_documento = "Seleccione un tipo de documento.";

    const docName =
      documents.find((d) => d.id === parseInt(form.tipo_documento))?.nombre || "";
    const isPasaporte = docName.toLowerCase().includes("pasaporte");

    if (!form.documento) newErrors.documento = "Campo obligatorio.";
    else if (isPasaporte) {
      if (!/^[A-Za-z0-9]{6,15}$/.test(form.documento))
        newErrors.documento = "Debe tener entre 6 y 15 caracteres alfanuméricos.";
    } else if (!/^[0-9]{6,10}$/.test(form.documento))
      newErrors.documento = "Debe contener entre 6 y 10 dígitos numéricos.";

    if (!email.trim()) newErrors.email = "Campo obligatorio.";
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email))
      newErrors.email = "Formato de correo inválido.";

    if (password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres.";
    if (password !== passwordConfirm)
      newErrors.passwordConfirm = "Las contraseñas no coinciden.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      openPopup("Por favor corrija los errores del formulario", "error");
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await signUpNewUser({ email, password, user: form });
      if (error) {
        setErrors({ general: "Error al registrar el usuario." });
        openPopup("Error al registrar el usuario", "error");
      } else {
        setErrors({});
        openPopup("Usuario registrado correctamente", "success");
        setNav(0);
      }
    } catch (err) {
      setErrors({ general: err.message });
      openPopup(err.message, "error");
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

  const colombia = countries.find((c) => c.nombre.toLowerCase() === "colombia");
  const isColombian = parseInt(form.id_nacionalidad) === colombia?.id;
  const docName =
    documents.find((d) => d.id === parseInt(form.tipo_documento))?.nombre || "";

  return (
    <CardForm
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 border-b-2 pb-3">
        Registro de Usuario
      </h2>

      <section className="mb-10 p-6 border rounded-xl bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          Datos Personales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"].map((field, i) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {i % 2 === 0 && <span className="text-red-500">*</span>}{" "}
                {field.replace("_", " ").replace("primer", "Primer").replace("segundo", "Segundo")}
              </label>
              <TextField
                placeholder={field.replace("_", " ").replace("primer", "Primer").replace("segundo", "Segundo")}
                name={field}
                required={i % 2 === 0}
                value={form[field]}
                onChange={(e) =>
                  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(e.target.value) && handleChange(e)
                }
              />
              {errors[field] && (
                <span className="text-red-600 text-sm mt-1 block">{errors[field]}</span>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <span className="text-red-500">*</span> Nacionalidad
            </label>
            <select
              name="id_nacionalidad"
              value={form.id_nacionalidad}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            >
              <option value="">Seleccione Nacionalidad</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.nombre}
                </option>
              ))}
            </select>
            {errors.id_nacionalidad && (
              <span className="text-red-600 text-sm mt-1 block">{errors.id_nacionalidad}</span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <span className="text-red-500">*</span> Tipo de Documento
            </label>
            <select
              name="tipo_documento"
              value={form.tipo_documento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            >
              <option value="">Seleccione Tipo</option>
              {(() => {
                if (isColombian) {
                  return documents
                    .filter((doc) =>
                      ["Cédula de Ciudadanía", "NIT"].includes(doc.nombre)
                    )
                    .map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.nombre}
                      </option>
                    ));
                } else {
                  return documents
                    .filter((doc) =>
                      ["Pasaporte", "Cédula de Extranjería"].includes(doc.nombre)
                    )
                    .map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.nombre}
                      </option>
                    ));
                }
              })()}
            </select>
            {errors.tipo_documento && (
              <span className="text-red-600 text-sm mt-1 block">{errors.tipo_documento}</span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <span className="text-red-500">*</span>{" "}
              {docName.toLowerCase().includes("pasaporte")
                ? "Código del Documento"
                : "Número de Documento"}
            </label>

            <input
              name="documento"
              value={form.documento}
              placeholder={
                docName.toLowerCase().includes("pasaporte")
                  ? "Ej: AB1234567"
                  : isColombian
                  ? "Ej: 1023456789"
                  : "Ej: 102345678"
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              onChange={(e) => {
                const raw = e.target.value;
                let pattern = /^[0-9]*$/;
                let maxLen = 10;

                if (docName.toLowerCase().includes("pasaporte")) {
                  pattern = /^[A-Za-z0-9]*$/;
                  maxLen = 15;
                }

                if (raw === "" || (pattern.test(raw) && raw.length <= maxLen)) {
                  setForm((prev) => ({
                    ...prev,
                    documento: docName.toLowerCase().includes("pasaporte")
                      ? raw.toUpperCase()
                      : raw,
                  }));
                }
              }}
            />

            <small className="text-gray-500 block mt-1">
              {docName.toLowerCase().includes("pasaporte")
                ? "Letras y números (6–15 caracteres)."
                : isColombian
                ? "Solo números (10 dígitos para cédula moderna)."
                : "Solo números (6–10 dígitos)."}
            </small>

            {errors?.documento && (
              <span className="text-red-600 text-sm mt-1 block">
                {errors.documento}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mb-10 p-6 border rounded-xl bg-white">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Credenciales de Acceso
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <span className="text-red-500">*</span> Correo Electrónico
            </label>
            <TextField
              type="email"
              placeholder="ejemplo@dominio.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="text-red-600 text-sm mt-1 block">{errors.email}</span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <span className="text-red-500">*</span> Contraseña
            </label>
            <div className="relative">
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-600 text-sm mt-1 block">{errors.password}</span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <span className="text-red-500">*</span> Confirmar Contraseña
            </label>
            <div className="relative">
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-gray-500 hover:text-indigo-600"
              >
                {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <div className="text-red-600 text-sm mt-2 font-medium">
                {errors.passwordConfirm}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <Button
          text="Continuar"
          style="primary"
          iconName="next"
          type="submit"
          className="w-full sm:w-auto"
          disabled={
            !email ||
            !password ||
            !passwordConfirm ||
            password !== passwordConfirm ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          }
        />
      </div>
    </CardForm>
  );
}
