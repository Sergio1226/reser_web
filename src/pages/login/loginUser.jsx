import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { TextField } from "../../components/TextField.jsx";
import { UserAuth } from "../../utils/AuthContext.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";

export function LoginUser({ setNav }) {
  const navigate = useNavigate();
  const { signIn } = UserAuth();
  const { openPopup } = usePopup();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      openPopup("La contraseña debe tener al menos 6 caracteres", "warning");
      return;
    }

    try {
      const rol = await signIn({ email, password });

      if (rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/bookings");
      }
    } catch (err) {
      console.error("Error en login:", err);
      openPopup("Datos erróneos o usuario no existe", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-10 rounded-2xl w-[380px] border border-primary_dark/20 shadow-xl space-y-6"
      >
        <h2 className="text-4xl font-bold text-primary_dark text-center mb-2">
          Iniciar Sesión
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Accede a tu cuenta para continuar
        </p>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <TextField
            placeholder="correo@dominio.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <TextField
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-primary_dark"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </TextField>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            text="Ingresar"
            style="secondary"
            type="submit"
            iconName="Next"
          />
        </div>

        <div className="text-center text-gray-700 mt-6 text-sm">
          ¿No tienes una cuenta?
        </div>
        <div className="flex justify-center">
          <Button
            text="Registrarse"
            style="primary"
            onClick={() => setNav(1)}
            iconName="Contact form"
            type="button"
          />
        </div>

        {/* <div className="text-center text-gray-500 text-sm mt-4 hover:underline cursor-pointer">
          ¿Olvidaste tu contraseña?
        </div> */}
      </form>
    </div>
  );
}
