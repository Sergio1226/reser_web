import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Header } from "../components/Header.jsx";
import { TextField } from "../components/TextField.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
              />
            </div>

            <div className="flex flex-col space-y-1 w-96">
              <label className="text-black items-start justify-start">
                {" "}
                <span className="text-red-500">*</span> Contraseña
              </label>

              <TextField placeholder="Contraseña" type="password" required>
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
              onClick={() => navigate("/bookings")}
              iconName="Next"
            />

            <div className="text-center text-black text-base">
              ¿No está registrado?
            </div>
            <Button
              text="Registrarse"
              style=" bg-button_primary"
              onClick={() => navigate("/registUser")}
              iconName="Contact form"
            />

            <div className="text-center text-black text-sm mt-4">
                <a href="">¿Olvidaste tu contraseña?</a>
            </div>

          </form>

          

          {/* 
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
          </div> */}
        </div>
      </main>
    </div>
  );
}
