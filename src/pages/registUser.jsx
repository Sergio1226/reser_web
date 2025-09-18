import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HeaderForm } from "../components/HeaderForm.jsx";
import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function RegistUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [paisProcedencia, setPaisProcedencia] = useState("");
  const [paisDestino, setPaisDestino] = useState("");

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
      <HeaderForm navigateTo="/login" />

      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-1 items-center justify-center p-8">
        <div className="w-[500px] bg-primary rounded-lg flex flex-col items-center space-y-6 p-8">
          <div className="text-center text-black text-4xl font-bold">
            Registrarse
          </div>

          <label className="block text-gray-700 font-medium mb-2">
            Datos Personales
          </label>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
              <span className="text-red-500">*</span> Nombres
            </label>
            <input
              type="text"
              placeholder="Nombres"
              required
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            />
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                <span className="text-red-500">*</span> Primer Apellido
            </label>

            <input
              type="text"
              placeholder="Primer Apellido"
              required
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            />
          </div>
          
          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                Segundo Apellido
            </label>

            <input
              type="text"
              placeholder="Segundo Apellido"
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            />
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                <span className="text-red-500">*</span> Tipo de Documento
            </label>

            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              required
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            >
              <option value="">Tipo de documento</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                <span className="text-red-500">*</span> Numero de Documento
            </label>

            <input
              type="text"
              placeholder="Numero de Documento"
              required
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            />
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                <span className="text-red-500">*</span> Nacionalidad
            </label>

            <select
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              required
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            >
              <option value="">Nacionalidad</option>
              <option value="AR">Argelia</option>
              <option value="BR">Brasil</option>
              <option value="CO">Colombia</option>
              <option value="DI">Dinamarca</option>
              //poner demas nacionalidades BD
            </select>
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                Fecha de Nacimiento
            </label>

            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            />
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                Pais Procedencia
            </label>

            <select
              value={paisProcedencia}
              onChange={(e) => setPaisProcedencia(e.target.value)}
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            >
              <option value="">Pais Procedencia</option>
              <option value="AR">Argelia</option>
              <option value="BR">Brasil</option>
              <option value="CO">Colombia</option>
              <option value="DI">Dinamarca</option>
              //poner demas nacionalidades BD
            </select>
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
                Pais Destino
            </label>

            <select
              value={paisDestino}
              onChange={(e) => setPaisDestino(e.target.value)}
              className="w-96  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            >
              <option value="">Pais Destino</option>
              <option value="AR">Argelia</option>
              <option value="BR">Brasil</option>
              <option value="CO">Colombia</option>
              <option value="DI">Dinamarca</option>
              //poner demas nacionalidades BD
            </select>
          </div>

          <label className="block text-gray-700 font-medium mb-2">
            Credenciales de Acceso
          </label>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black">
              <span className="text-red-500">*</span> Correo Electrónico
            </label>

            <input
              type="email"
              placeholder="correo@dominio.com"
              required
              className=" px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
            />
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black items-start justify-start">
                  {" "}
                  <span className="text-red-500">*</span> Contraseña
            </label>

            <div className="flex items-center w-96 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-xl text-gray-600"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1 w-96">
            <label className="text-black items-start justify-start">
                  {" "}
                  <span className="text-red-500">*</span> Confirmar Contraseña
            </label>

            <div className="flex items-center w-96 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                required
                className="w-full  px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700  focus:outline-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-xl text-gray-600"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>
          </div>

          <Button
            text="Continuar"
            style="w-40 h-[50px] bg-secondary"
            onClick={() => navigate("/login")}
            iconName="Next"
          />

          <div className="text-center text-black text-base">
            ¿Ya está registrado?
          </div>
          <Button
            text="Iniciar Sesion"
            style="w-40 h-[50px] bg-secondary"
            onClick={() => navigate("/login")}
            iconName="Enter"
          />

          <div className="text-center text-sm leading-normal px-6">
            <span className="text-zinc-500">
              Haciendo click en continuar, usted acepta nuestros{" "}
            </span>
            <span className="text-black font-medium">
              Términos de servicio{" "}
            </span>
            <span className="text-zinc-500">y </span>
            <span className="text-black font-medium">
              Políticas de Privacidad
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
