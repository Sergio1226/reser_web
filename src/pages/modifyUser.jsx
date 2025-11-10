import Header from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";
import { TextField } from "../components/TextField.jsx";
import { Button } from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../utils/AuthContext.jsx";
import { useModifyUser } from "../utils/useModifyUser.js";
import { Icon } from "../components/Icon.jsx";
import { Loading } from "../components/Animate.jsx";

export default function ModifyUser() {
  const navigate = useNavigate();
  const { signOut } = UserAuth();
  const {
    primerNombre,
    setPrimerNombre,
    segundoNombre,
    setSegundoNombre,
    primerApellido,
    setPrimerApellido,
    segundoApellido,
    setSegundoApellido,
    email,
    setEmail,
    password,
    setPassword,
    tipoDocumento,
    numeroDocumento,
    loading,
    isChanged,
    handleSave,
  } = useModifyUser();

  const main = () => {
    return (
      
      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-start p-8 space-y-8 w-full min-h-[calc(100vh-180px)]">
         <div className="w-full max-w-[1100px] flex flex-col items-center gap-4 mb-4">
          <div className="rounded-full border-8 border-green-900 p-2 ">
            <Icon name="user" style="size-[60px]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
            Perfil de Usuario
          </h1>
          <p className="text-gray-600 text-center max-w-md">
            Administra tu información personal{" "}
          </p>
        </div>

        <div className="border-2 border-primary/10 w-full max-w-[1100px] bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Icon name="user" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Información Personal
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Primer nombre",
                      value: primerNombre,
                      setValue: setPrimerNombre,
                      required: true,
                    },
                    {
                      label: "Segundo nombre",
                      value: segundoNombre,
                      setValue: setSegundoNombre,
                    },
                    {
                      label: "Primer apellido",
                      value: primerApellido,
                      setValue: setPrimerApellido,
                      required: true,
                    },
                    {
                      label: "Segundo apellido",
                      value: segundoApellido,
                      setValue: setSegundoApellido,
                    },
                  ].map((field) => (
                    <div key={field.label} className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <TextField
                        type="text"
                        placeholder={field.label}
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 pt-8 border-t-2 border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Icon name="lock" />
                  <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Correo electrónico",
                      value: email,
                      setValue: setEmail,
                      type: "email",
                      required: true,
                      readOnly: true,
                    },
                    {
                      label: "Contraseña",
                      value: password,
                      setValue: setPassword,
                      type: "password",
                      required: true,
                    },
                  ].map((field) => (
                    <div key={field.label} className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <TextField
                        type={field.type}
                        placeholder={field.label}
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        readOnly={field.readOnly}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t-2 border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Icon name="contactForm" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Documentos de Identidad
                  </h2>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-amber-800 font-medium">
                      Los documentos de identidad no pueden ser modificados por
                      razones de seguridad.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Tipo de documento", value: tipoDocumento },
                    { label: "Número de documento", value: numeroDocumento },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-semibold text-gray-500 mb-2">
                        {field.label}
                      </label>
                      <TextField type="text" value={field.value} readOnly />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t-2 w-full border-gray-100 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  text="Atras"
                  style="exit"
                  onClick={() => navigate(-1)}
                  iconName="back"
                />
                <Button
                  text="Guardar Cambios"
                  style="secondary"
                  onClick={handleSave}
                  iconName="saveAll"
                  disabled={!isChanged}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-primary bg-white overflow-x-hidden">
      <Header>
        <Button
          text="Cerrar sesion"
          style="exit"
          onClick={() => signOut()}
          iconName="signOut"
        />
      </Header>
      {loading ? (
        <div className="bg-gradient-to-b from-secondary to-gradient_1 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl border border-primary/20 flex flex-col items-center justify-center flex-1">
          <div className="flex flex-col items-center gap-3">
            <Loading />
            <span className="text-lg font-semibold text-gray-700">
              Cargando información del usuario...
            </span>
          </div>
        </div>
      ) : (
        main()
      )}
      <Footer />
    </div>
  );
}
