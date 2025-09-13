import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Footer } from "../components/Footer.jsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-kameron">
      <header className="bg-primary  border-b border-black/20 flex  p- 2 justify-around h-[140px] items-center">
        <img src="/src/assets/logo.png" alt="Logo" className="w-32 h-30" />
        <div className="flex flex-col items-center justify-center space-y-2 ">
          <h1 className="text-black text-4xl font-bold">Hotel</h1>
          <h1 className="text-black text-4xl font-bold ">
            Los recuerdos de Florito y leo
          </h1>
        </div>
        <div className="flex flex-col  items-center justify-center space-y-2">
          <Button
            text="Reservar Ahora"
            style=" w-auto bg-secondary"
            onClick={() => navigate("/login")}
            iconName="book"
          />
          <Button
            text="Administrador"
            style=" w-auto bg-button_primary"
            onClick={() => navigate("/loginAdmin")}
            iconName="lock"
          />
        </div>
      </header>
      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex-1">
        <div className="text-center justify-start text-black text-xl font-normal font-['Julius_Sans_One']">
          Tu hogar en Monguí
          <br />
          Tradición, descanso y hospitalidad.
        </div>
        <div className="flex justify-center p-4 space-x-2">
          <p className=" text-xl font-['Julius_Sans_One'] w-1/2 " >
            Bienvenidos a Los Recuerdos de Florito y Leo, un hotel familiar en
            el corazón de Monguí, Boyacá. En nuestro hotel, nos dedicamos a
            ofrecer una experiencia única, llena de calidez y tranquilidad,
            donde cada huésped es tratado como parte de nuestra familia
          </p>
          <div className="items-center ">
              <img className=" rounded-[20px]" src="/src/assets/hotel.png" alt="hotel" />
          </div>
        </div>
        <div className="flex justify-center m-4">
          <img className="rounded-[20px] border border-black/20 shadow-lg" src="/src/assets/location.png" alt="" />
        </div>
      </main>
      <Footer/>
    </div>
  );
}
