import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { TextField } from "../components/TextField.jsx";
import { Button } from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../utils/AuthContext.jsx";
import { useModifyUser } from "../utils/useModifyUser.js";

export default function ModifyUser() {
  const navigate = useNavigate();
  const { signOut } = UserAuth();
  const {
    primerNombre, setPrimerNombre,
    segundoNombre, setSegundoNombre,
    primerApellido, setPrimerApellido,
    segundoApellido, setSegundoApellido,
    email, setEmail,
    password, setPassword,
    tipoDocumento, numeroDocumento,
    loading, isChanged, handleSave
  } = useModifyUser();

  if (loading)
    return (
      <div className="text-center py-6 font-medium text-gray-600">
        Cargando información del usuario...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col font-primary bg-white">
      <Header>
        <Button text="Atrás" style="exit" onClick={() => navigate(-1)} iconName="Back" />
      </Header>

      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-start p-8 space-y-8 w-full">
        <h1 className="text-3xl font-bold">Perfil de Usuario</h1>

        <div className="border border-black/20 w-full max-w-[1100px] bg-white rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[ 
                  { label: "Primer nombre", value: primerNombre, setValue: setPrimerNombre },
                  { label: "Segundo nombre", value: segundoNombre, setValue: setSegundoNombre },
                  { label: "Primer apellido", value: primerApellido, setValue: setPrimerApellido },
                  { label: "Segundo apellido", value: segundoApellido, setValue: setSegundoApellido },
                  { label: "Correo electrónico", value: email, setValue: setEmail },
                  { label: "Contraseña", value: password, setValue: setPassword, type: "password" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-2">{field.label}</label>
                    <TextField
                      type={field.type || "text"}
                      placeholder={field.label}
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                    />
                  </div>
                ))}

                {[ 
                  { label: "Tipo de documento", value: tipoDocumento },
                  { label: "Número de documento", value: numeroDocumento },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
                    <TextField
                      type="text"
                      value={field.value}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-black/20 mt-6 flex justify-end gap-4">
                <Button
                  text="Cerrar sesión"
                  style="exit"
                  onClick={() => signOut().then(() => navigate("/login"))}
                  iconName="signOut"
                />
                <Button
                  text="Guardar Cambios"
                  style="secondary"
                  onClick={handleSave}
                  iconName="save-all"
                  disabled={!isChanged}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}