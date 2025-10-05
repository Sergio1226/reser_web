import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Header } from "../components/Header.jsx";
import { TextField } from "../components/TextField.jsx";
import { UserAuth } from "../utils/AuthContext.jsx";
import { supabase } from "../utils/supabase.js";
import { User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [nav, setNav] = useState(0);
  
  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
      <Header>
        <Button
          text="Atras"
          style=" w-fit bg-button_secondary"
          onClick={() => navigate(-1)}
          iconName="Back"
        />
      </Header>

      <main className="bg-secondary flex flex-1 items-center justify-center ">
        {nav === 0 && <LoginUser setNav={setNav} />}
        {nav === 1 && <RegistUser setNav={setNav} />}
      </main>
    </div>
  );
}

function LoginUser({ setNav }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    navigate("/bookings");
  };
  
  return (
    <div className="w-fit flex flex-col items-center p-8 h-fit mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-primary p-8 rounded-lg w-full max-w-md mx-auto border border-black/20 shadow-lg mt-8 flex flex-col items-center space-y-4"
      >
        <div className="text-center text-black text-4xl mt-4 font-bold">
          Iniciar Sesión
        </div>

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
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </TextField>
        </div>

        <Button
          text="Ingresar"
          style=" bg-button_secondary"
          type="submit"
          iconName="Next"
        />

        <div className="text-center text-black text-base">
          ¿No está registrado?
        </div>
        <Button
          text="Registrarse"
          style=" bg-button_primary"
          onClick={() => setNav(1)}
          iconName="Contact form"
          type="button"
        />

        <div className="text-center text-black text-sm mt-4">
          <a href="">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
}

function RegistUser({ setNav }) {
  const navigate = useNavigate();
  const { singUpNewUser } = UserAuth();
  
  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        const { data:paises, error } = await supabase.from("paises").select("*");
        if (error) throw error;
        setCountries(paises || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchDocuments=async ()=>{
      try {
        const { data:tipos_documentos, error } = await supabase.from("tipos_documento").select("*");
        if (error) throw error;
        setDocuments(tipos_documentos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
    console.log("Formulario:", form);
    if (password !== passwordConfirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      console.log("Registro:", { email, password, form });
      await singUpNewUser({ email, password,user: form });
      alert("Usuario registrado exitosamente");
      setNav(0);
    } catch (err) {
      alert("Error al registrar: " + err.message);
    }
  };

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
            style=" bg-button_primary"
            iconName="Back"
            type="button"
            onClick={() => setNav(0)}
          />
          <Button
            text="Continuar"
            style=" bg-button_secondary"
            iconName="Next"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}