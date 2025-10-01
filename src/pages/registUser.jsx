import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Header } from "../components/Header.jsx";
import { TextField } from "../components/TextField.jsx";

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
      <Header>
        <Button
          text="Atras"
          style=" w-fit bg-button_secondary"
          onClick={() => navigate(-1)}
          iconName="Back"
        />
      </Header>

      <main className="bg-secondary flex flex-1 items-center justify-center ">
        <div className="w-fit flex flex-col items-center p-8 h-fit mx-auto">
          <form
            action=""
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
                type="text"
                required
              />
            </div>

            <div className="flex flex-col space-y-1 w-96">
              <label className="text-black">
                Segundo Nombre
              </label>
              <TextField
                placeholder="Segundo Nombre"
                type="text"
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
              />
            </div>
            
            <div className="flex flex-col space-y-1 w-96">
              <label className="text-black">
                Segundo Apellido
              </label>
              <TextField
                placeholder="Segundo Apellido"
                type="text"
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
                className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
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
              <TextField
                placeholder="Numero de Documento"
                type="text"
                required
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
                className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
              >
                <option value="">Nacionalidad</option>
                <option value="AR">Argentina</option>
                <option value="BR">Brasil</option>
                <option value="CO">Colombia</option>
                <option value="DK">Dinamarca</option>
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
                className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
              />
            </div>

            <div className="flex flex-col space-y-1 w-96">
              <label className="text-black">
                País Procedencia
              </label>
              <select
                value={paisProcedencia}
                onChange={(e) => setPaisProcedencia(e.target.value)}
                className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
              >
                <option value="">País Procedencia</option>
                <option value="AR">Argentina</option>
                <option value="BR">Brasil</option>
                <option value="CO">Colombia</option>
                <option value="DK">Dinamarca</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1 w-96">
              <label className="text-black">
                País Destino
              </label>
              <select
                value={paisDestino}
                onChange={(e) => setPaisDestino(e.target.value)}
                className="w-96 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 focus:outline-primary"
              >
                <option value="">País Destino</option>
                <option value="AR">Argentina</option>
                <option value="BR">Brasil</option>
                <option value="CO">Colombia</option>
                <option value="DK">Dinamarca</option>
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

            <div className="flex flex-col space-y-1 w-96">
              <label className="text-black items-start justify-start">
                <span className="text-red-500">*</span> Confirmar Contraseña
              </label>
              <TextField 
                placeholder="Confirmar Contraseña" 
                type={showConfirmPassword ? "text" : "password"}
                required
              >
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-gray-600"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </TextField>
            </div>

            <Button
              text="Continuar"
              style=" bg-button_secondary"
              iconName="Next"
              type="submit"
            />
          </form>

          {/* <div className="text-center text-sm leading-normal px-6 mt-4">
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
          </div> */}
        </div>
      </main>
    </div>
  );
}