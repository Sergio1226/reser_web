import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { UserAuth } from "../utils/AuthContext.jsx";
import Carousel from "../components/Carousel.jsx";
import { useSize } from "../utils/SizeContext.jsx";

const url = import.meta.env.VITE_URL_IMAGES;

export default function Home() {
  const navigate = useNavigate();
  const { session, role, signOut } = UserAuth();
  const { isMobile } = useSize();

  const handleLogout = async () => await signOut();

  const handleLogin = () => {
    if (!session) navigate("/login");
    if (role === "") navigate("/login");
    else navigate(role === "admin" ? "/dashboard" : "/bookings");
  };

  const homeImages = [
    `${url}/home/Exterior.jpeg`,
    `${url}/home/Entrada_Principal.jpeg`,
    `${url}/home/Recepcion.jpeg`,
    `${url}/home/Comedor.jpeg`,
    `${url}/home/Pasillo_1.jpeg`,
    `${url}/home/Pasillo_2.jpeg`,
    `${url}/home/Patio.jpeg`,
  ];

  return (
    <div className="min-h-screen flex flex-col font-primary bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      <Header>
        <div className={`flex flex-row md:flex-col h-full items-center justify-center ${isMobile ? " space-x-2":"space-y-2"} mt-4 mr-8`}>
          {role === "admin" ? (
            <Button
              text="Cerrar sesión"
              style="exit"
              onClick={handleLogout}
              iconName="signOut"
              className="w-full "
            />
          ) : role === "client" ? (
            <Button
              text="Reservar ahora"
              style="secondary"
              className="w-full "
              onClick={handleLogin}
              iconName="book"
            />
          ) : (
            <Button
              text="Iniciar sesión"
              style="secondary"
              className="w-full "
              onClick={() => navigate("/login", { state: { nav: 0 } })}
              iconName="login"
            />
          )}

          {role === "client" ? (
            <Button
              text="Cerrar sesión"
              style="exit"
              className="w-full "
              onClick={handleLogout}
              iconName="signOut"
            />
          ) : role === "admin" ? (
            <Button
              text="Administrador"
              style="primary"
              className="w-full "
              onClick={handleLogin}
              iconName="lock"
            />
          ) : (
            <Button
              text="Registrarse"
              style="primary"
              className="w-full "
              onClick={() => navigate("/login", { state: { nav: 1, fromHome: true } })}
              iconName="user"
            />
          )}
        </div>
      </Header>

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 sm:px-6 py-8 sm:py-10 w-full overflow-x-hidden bg-secondary">
        
        <div className="text-center w-full max-w-4xl mx-auto mb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary_dark mb-1">
            ¡Reserva ahora!
          </h1>
          <p className="text-2xl text-primary font-semibold">
            Inicia sesión o crea tu cuenta para asegurar tu estadía con nosotros.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-10 w-full max-w-6xl"> 
          <div className="flex-1 bg-white rounded-2xl border border-black/10 shadow-lg p-6 sm:p-8 flex flex-col items-center text-center w-full max-w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary_dark mb-2">
              Tu hogar en Monguí
            </h2>
            <p className="text-black/70 mb-6 max-w-md text-sm sm:text-base">
              Bienvenidos a{" "}
              <span className="font-semibold text-primary">
                Los Recuerdos de Florito y Leo
              </span>
              , un hotel familiar en el corazón de Monguí, Boyacá. Disfruta una
              experiencia llena de calidez, tradición y hospitalidad, donde cada
              huésped es parte de nuestra familia.
            </p>
            <div className="flex justify-center w-full">
              <Carousel
                images={homeImages}
                className={isMobile ? "h-[200px] w-full" : "h-[300px] w-full"}
                autoPlayInterval={5000}
              />
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-black/10 shadow-lg flex items-center justify-center p-4 sm:p-6 w-full max-w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d567.8421308116622!2d-72.85008154448731!3d5.721665664571183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a492a8ae86e31%3A0x40a06b0a595c1e04!2shospedaje%20Florito%20y%20Leo!5e0!3m2!1ses!2sco!4v1757813254413!5m2!1ses!2sco"
              className="rounded-2xl w-full h-[250px] sm:h-[300px] border border-black/20 shadow-lg"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}