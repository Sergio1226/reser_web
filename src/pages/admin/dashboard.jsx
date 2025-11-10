import { SmallFooter } from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button.jsx";
import { Card } from "../../components/Card.jsx";
import { UserAuth } from "../../utils/AuthContext.jsx";
import { useSize } from "../../utils/SizeContext.jsx";

const options = [
  {
    title: "Administrar reservas",
    icon: "list",
    color: "green",
    description: "Visualiza y administra tus reservas.",
  },
  {
    title: "Administrar Clientes",
    icon: "users",
    color: "blue",
    description: "Administra las reservas de tus clientes.",
  },
];
export default function DashBoard() {
  const navigate = useNavigate();
  const { signOut } = UserAuth();
  const {isMobile}= useSize();

  return (
    <div className="min-h-screen flex flex-col font-primary bg-gradient-to-br from-gradient_1 to-secondary">
      <Header>
        <div className="flex flex-col justify-center items-center space-y-2 mt-4 mr-8">
          <Button
            text="Cerrar Sesion"
            style="exit"
            onClick={() => {
              signOut();
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
                Modulo de Administración
              </h1>
              <p className="text-green-100 text-center">
                Administra tu hospedaje de manera práctica y eficiente.
              </p>
            </div>
            <div className={`py-4 px-8 mt-6  mb-6 flex justify-center items-center flex-col md:flex-row ${isMobile?"space-y-8":"space-x-8"}`}>
              <Card
                option={options[0]}
                onClick={() => navigate("/bookingAdmin")}
              />
              <Card option={options[1]} onClick={() => navigate("/admin")} />
            </div>
          </div>
        </div>
      </main>

      <SmallFooter />
    </div>
  );
}
