import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { UserAuth } from "../utils/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { session, role, signOut } = UserAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const handleLogin = () => {
    if (session) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/bookings");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-primary bg-white">
      <Header>
        <div className="flex flex-col justify-center items-center space-y-2 mt-4 mr-8">
          {role === "admin" ? (
            <Button
              text="Cerrar sesion"
              style="  bg-button_exit w-full"
              onClick={() => handleLogout()}
              iconName="signOut"
            />
          ) : (
            <Button
              text="Reservar Ahora"
              style="bg-button_secondary"
              onClick={handleLogin}
              iconName="book"
            />
          )}

          {role === "client" ? (
            <Button
              text="Cerrar sesion"
              style="  bg-button_exit w-full"
              onClick={() => handleLogout()}
              iconName="signOut"
            />
          ) : (
            <Button
              text="Administrador"
              style="  bg-button_primary w-full"
              onClick={() => handleLogin()}
              iconName="lock"
            />
          )}
        </div>
      </Header>
      <main className=" flex-1 bg-white p-8 flex flex-row items-stretch">
        <div className=" bg-secondary w-1/2 m-4 h-fit rounded-[20px] border border-black/20 shadow-lg">
          <div className="text-center justify-start text-black text-xl font-normal font-primary pt-8">
            Tu hogar en Monguí
            <br />
            Tradición, descanso y hospitalidad.
          </div>
          <div className=" justify-center p-8 space-x-2 flex flex-col items-center">
            <p className=" text-xl font-primary  text-justify p-4">
              Bienvenidos a Los Recuerdos de Florito y Leo, un hotel familiar en
              el corazón de Monguí, Boyacá. En nuestro hotel, nos dedicamos a
              ofrecer una experiencia única, llena de calidez y tranquilidad,
              donde cada huésped es tratado como parte de nuestra familia
            </p>
            <div className="items-center ">
              <img
                className=" rounded-[20px] w-[350px] h-[180px]  border border-black/20 "
                src="/src/assets/entrada_hospedaje.jpg"
                alt="hotel"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-secondary w-1/2 m-4 rounded-[20px] border border-black/20 shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d567.8421308116622!2d-72.85008154448731!3d5.721665664571183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a492a8ae86e31%3A0x40a06b0a595c1e04!2shospedaje%20Florito%20y%20Leo!5e0!3m2!1ses!2sco!4v1757813254413!5m2!1ses!2sco"
            className="rounded-[20px] w-[500px] h-[300px] border border-black/20 shadow-lg"
          ></iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
}
