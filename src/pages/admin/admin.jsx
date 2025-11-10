import { useState, useEffect } from "react";
import "react-date-range/dist/styles.css";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/theme/default.css";
import  Header  from "../../components/Header.jsx";
import { NavigationTab } from "../../components/NavigationTab.jsx";
import { Button } from "../../components/Button.jsx";
import { SmallFooter } from "../../components/Footer.jsx";
import { Picker } from "../../components/Picker.jsx";
import { TableArray } from "../../components/Table.jsx";
import { TextField } from "../../components/TextField.jsx";
import { getClients, getClient } from "../../utils/Api.jsx";
import { Loading } from "../../components/Animate.jsx";
import { usePopup } from "../../utils/PopupContext.jsx";
import { RegistUser } from "./registAdmin.jsx";
import { UserAuth } from "../../utils/AuthContext.jsx";
export default function AdminPage() {
  const [nav, setNav] = useState(0);
  const navigate = useNavigate();

  const {signOut} = UserAuth();

  const options = [
    {
      id: "visualizar",
      title: "Visualizar clientes",
      icon: "users",
    },
    {
      id: "Agregar",
      title: "Agregar Cliente",
      icon: "plusUser",
    },
  ];

  const renderContent = () => {
    switch (nav) {
      case 0:
        return <Clients />;
      case 1:
        return <RegistUser />;
      case 2:
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gradient_1 to-secondary min-h-screen flex flex-col font-primary">
      <Header>
        <div className="flex flex-col justify-center items-center space-y-2 mt-4 mr-8">
          <Button
            text="Administracion"
            style="primary"
            className="w-full"
            onClick={() => {
              navigate("/dashboard");
            }}
            iconName="lock"
            />
          <Button
            text="Cerrar Sesion" 
            style="exit"
            className="w-full"
            onClick={() => {
              signOut().then(() => navigate("/"));
            }}
            iconName="signOut"
          />
        </div>
      </Header>
      <main className="flex flex-col flex-1 items-center p-8">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border border-black-200 overflow-hidden ">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 ">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Administracion de clientes
              </h1>
              <p className="text-green-100 text-center">
                Gestiona las cuentas de tus clientes de manera fácil y rápida.
              </p>
            </div>
            <div className="py-4 mt-6 flex justify-center items-center">
              <NavigationTab state={nav} setState={setNav} options={options} />
            </div>

            <div className="px-8 py-2">{renderContent()}</div>
          </div>
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}

function Clients() {
  const { openPopup } = usePopup();

  const [status, setStatus] = useState(0);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [clients, setClients] = useState([]);
  const [searchedClient, setSearchedClient] = useState(null);

  const statuses = [
    "Cédula de ciudadanía",
    "Pasaporte",
    "Nit (Persona juridica)",
    "Cédula de extranjería",
  ];
  const headers = [
    "Nombre del cliente",
    "Tipo de documento",
    "Número de documento",
    "País de nacimiento",
    "Correo electronico",
  ];

  const handleClients = async () => {
    try {
      setLoadingClients(true);
      setClients(await getClients());
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    handleClients();
  }, []);

  const [documento, setDocumento] = useState("");

  const handleSearchClient = async () => {
    if (!documento.trim()) {
      openPopup("Documento no valido", "error");
      return;
    }
    if( status === 0){
      openPopup("Seleccione un tipo de documento", "warning");
      return;
    }

    try {
      setLoadingSearch(true);
      setSearchedClient(null);
      const client = await getClient(status , documento);
      setSearchedClient(client);
    } catch (error) {
      openPopup("Documento no existente", "error");
      console.log(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "No especificado";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mx-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          Consultar cliente
        </h2>
        <p className="text-blue-100">Consulta la informacion de un cliente</p>
      </div>

      <div className="flex flex-col space-y-6 p-6 md:p-8 w-full">
        <div className="w-full max-w-6xl mx-auto p-6 flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-gray-200 shadow-md">

          <p className="text-2xl font-bold text-green-900 ">
            Ingrese el documento del cliente
          </p>

          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col md:flex-row space-x-8">
              <Picker
                text="Tipo de documento"
                options={statuses}
                onChange={(e) => setStatus(e)}
              />
              <TextField
                placeholder="Número de documento"
                required={true}
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                className="w-fit shadow-sm bg-white"
              />
            </div>

            <Button
              text="Buscar"
              style="secondary"
              iconName="search"
              className="w-fit"
              onClick={handleSearchClient}
            />
          </div>
        </div>

        {loadingSearch && (
          <div className="w-full max-w-6xl mx-auto flex justify-center flex-col items-center py-8">
            <Loading />
            <p className="mt-4 text-gray-600">Buscando cliente...</p>
          </div>
        )}

        {searchedClient && !loadingSearch && (
          <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border-2 border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">✅</span>
                Cliente encontrado
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Nombre completo
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {searchedClient.nombre_completo}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Tipo de documento
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {searchedClient.tipo_documento}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Número de documento
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {searchedClient.documento}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Nacionalidad
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {searchedClient.nacionalidad || "No especificado"}
                </p>
              </div>
              {searchedClient.pais_origen && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    País de origen
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {searchedClient.pais_origen || "No especificado"}
                  </p>
                </div>
              )}
              {searchedClient.pais_destino && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    País de destino
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {searchedClient.pais_destino || "No especificado"}
                  </p>
                </div>
              )}
              {searchedClient.fecha_de_nacimiento && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Fecha de nacimiento
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDate(searchedClient.fecha_de_nacimiento)}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {searchedClient.email || "No especificado"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg mx-8 mt-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          Visualizar clientes
        </h2>
        <p className="text-blue-100">Clientes activos del hospedaje</p>
      </div>

      <div className="w-full max-w-6xl mx-auto py-6 md:py-8">
        {loadingClients ? (
          <div className="flex justify-center flex-col items-center">
            <Loading />
            <p>Cargando clientes...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <TableArray headers={headers} info={clients}/>
          </div>
        )}
      </div>
    </div>
  );
}
