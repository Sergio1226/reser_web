import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { UserAuth } from "../utils/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { session, role, signOut } = UserAuth();

  const handleLogout = async () => await signOut();

  const handleLogin = () => {
    if (!session) return navigate("/login");
    navigate(role === "admin" ? "/admin" : "/bookings");
  };

  return (
    <div className="min-h-screen flex flex-col font-primary bg-gradient-to-b from-white to-gray-50">
      <Header>
        <div className="flex flex-col justify-center items-center space-y-2 mt-4 mr-8">
          {role === "admin" ? (
            <Button
              text="Cerrar sesión"
              style="exit"
              onClick={handleLogout}
              iconName="signOut"
            />
          ) : (
            <Button
              text="Reservar Ahora"
              style="secondary"
              className="w-full"
              onClick={handleLogin}
              iconName="book"
            />
          )}

          {role === "client" ? (
            <Button
              text={"Cerrar sesión"}
              style="exit"
              className="w-full"
              onClick={handleLogout}
              iconName="signOut"
            />
          ) : (
            <Button
              text={"Administrador"}
              style="primary"
              className="w-full"
              onClick={handleLogin}
              iconName="lock"
            />
          )}
        </div>
      </Header>

      <main className="flex-1 flex flex-col lg:flex-row items-stretch justify-center gap-6 px-6 py-10">
        <div className="flex-1 bg-secondary rounded-2xl border border-black/10 shadow-lg p-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-primary_dark mb-2">
            Tu hogar en Monguí
          </h2>
          <p className="text-black/70 mb-6 max-w-md">
            Bienvenidos a{" "}
            <span className="font-semibold text-primary">
              Los Recuerdos de Florito y Leo
            </span>
            , un hotel familiar en el corazón de Monguí, Boyacá. Disfruta una
            experiencia llena de calidez, tradición y hospitalidad, donde cada
            huésped es parte de nuestra familia.
          </p>
          <img
            src="/src/assets/entrada_hospedaje.jpg"
            alt="Hotel Los Recuerdos de Florito y Leo"
            className="rounded-2xl w-[340px] h-[180px] object-cover border border-black/20 shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 bg-secondary rounded-2xl border border-black/10 shadow-lg flex items-center justify-center p-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d567.8421308116622!2d-72.85008154448731!3d5.721665664571183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a492a8ae86e31%3A0x40a06b0a595c1e04!2shospedaje%20Florito%20y%20Leo!5e0!3m2!1ses!2sco!4v1757813254413!5m2!1ses!2sco"
            className="rounded-2xl w-full h-[300px] border border-black/20 shadow-lg"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
}
