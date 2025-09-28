import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { Header } from "../components/Header.jsx";
import { TextField } from "../components/TextField.jsx";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-primary bg-white">
      <Header>
        <Button
          text="Atras"
          style=" w-fit bg-button_secondary"
          onClick={() => navigate(-1)}
          iconName="Back"
        />
      </Header>
      <main className=" flex-1 bg-secondary flex flex-row justify-center w-full">
        <div className=" bg-secondary  border border-black/20  p-8 w-full">
          <form
            action=""
            className="bg-primary p-8 rounded-lg w-full max-w-md mx-auto border border-black/20 shadow-lg mt-8"
          >
            <h2 className="text-black text-4xl font-bold text-center py-4 mb-4">
              Iniciar sesión{" "}
            </h2>
            <div className="flex flex-col space-y-4">
              <label className="text-black">
                {" "}
                <span className="text-red-500">*</span> Identificador de
                administrador
              </label>
              <TextField placeholder="Identificador" required type="email" />
              <label className="text-black">
                {" "}
                <span className="text-red-500">*</span> Contraseña
              </label>
              <TextField placeholder="Contraseña" required type="password">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </TextField>

              <div className="flex justify-center mt-4 space-x-4">
                {/*<Button style="bg-button_primary" onClick={() => navigate("/")}>
                  <IoMdArrowBack />
                  {" Atras"}
                </Button>*/}
                <Button
                  style="bg-button_secondary"
                  onClick={() => navigate("/admin")}
                  text="Ingresar"
                  iconName="Next"
                />
              </div>
              <div className="text-center text-black text-sm mt-4">
                <a href="">¿Olvidaste tu contraseña?</a>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
