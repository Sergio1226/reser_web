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

        {/* <div className="text-center text-black text-sm mt-4">
          <a href="">¿Olvidaste tu contraseña?</a>
        </div> */}
      </form>
    </div>
  );
}
