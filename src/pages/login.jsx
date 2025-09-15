import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HeaderForm } from "../components/HeaderForm.jsx";
import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-kameron">
      <HeaderForm navigateTo="/" />

      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-1 items-center justify-center p-8">
        <div className="w-[500px] bg-primary rounded-lg flex flex-col items-center space-y-6 p-8">
          <div className="text-center text-black text-4xl font-bold">
            Iniciar Sesión
          </div>

          <input
            type="email"
            placeholder="correo@dominio.com"
            required
            className="w-96 h-12 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 text-lg focus:outline-primary"
          />

          <div className="flex items-center w-96 relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full h-12 px-4 py-2 bg-white rounded-lg outline outline-1 outline-neutral-200 text-zinc-700 text-lg focus:outline-primary"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 text-xl text-gray-600"
            >
              {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <Button
            text="Continuar"
            style="w-40 h-[50px] bg-secondary"
            onClick={() => navigate("/")}
            iconName="Next"
          />

          <div className="text-center text-black text-base">
            ¿No está registrado?
          </div>
          <Button
            text="Registrarse"
            style="w-40 h-[50px] bg-secondary"
            onClick={() => navigate("/registUser")}
            iconName="Contact form"
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
