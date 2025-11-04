import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { TextField } from "../components/TextField.jsx";
import { Button } from "../components/Button.jsx";
import { useState } from "react";

export default function ModifyUser() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Cambios guardados");
  };

  return (
    <div className="min-h-screen flex flex-col font-primary bg-white">
      <Header>
        <Button
          text="Atrás"
          style="exit"
          onClick={() => navigate(-1)}
          iconName="back"
        />
      </Header>

      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-start p-8 space-y-8 w-full">
        <h1 className="text-3xl font-bold">Cemelmin Perra traga semen</h1>

        <div className="border border-black/20 w-full max-w-[1100px] bg-white rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Nombre completo
                  </label>
                  <div className="w-full max-w-[420px]">
                    <TextField
                      placeholder="Ej. Juan Pérez"
                      type="text"
                      required={true}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Tipo de documento
                  </label>
                  <div className="w-full max-w-[420px]">
                    <TextField
                      placeholder="CC / Pasaporte"
                      type="text"
                      required={true}
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Número de documento
                  </label>
                  <div className="w-full max-w-[420px]">
                    <TextField
                      placeholder="1234567890"
                      type="text"
                      required={true}
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Correo electrónico
                  </label>
                  <div className="w-full max-w-[420px]">
                    <TextField
                      placeholder="correo@ejemplo.com"
                      type="email"
                      required={true}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Contraseña
                  </label>
                  <div className="w-full max-w-[420px]">
                    <TextField
                      placeholder="••••••••"
                      type="password"
                      required={true}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-black/20 mt-6">
                <div className="max-w-[600px] mx-auto grid grid-cols-2 gap-4">
                  <div className="flex">
                    <Button
                      text="Cambiar de cuenta"
                      style="primary"
                      onClick={() => navigate("/loginAdmin")}
                      iconName="refresh-cw"
                    />
                  </div>

                  <div className="flex">
                    <Button
                      text="Guardar Cambios"
                      style="secondary"
                      onClick={handleSave}
                      iconName="save-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}