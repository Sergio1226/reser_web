import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/logo.png";

export function Header({ children }) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-r from-header_bg_light via-header_bg_medium to-header_bg_light border-b border-orange-200">
      <header className="relative w-full bg-gradient-to-br from-primary/90 to-primary_dark/80 pt-2 pb-4 flex flex-row items-center shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
        <div
          className="flex items-center ml-4 cursor-pointer group z-10"
          onClick={() => navigate("/")}
        >
          <div className="bg-white rounded-full p-2 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:rotate-3">
            <img
              src={Logo}
              alt="Logo"
              className="w-[100px] h-[80px] object-center object-contain drop-shadow-sm"
            />
          </div>
        </div>
        <div
          className="absolute left-1/2 transform -translate-x-1/2 text-center cursor-pointer group z-10"
          onClick={() => navigate("/")}
        >
          <div className="transition-transform duration-300 ">
            <p className="text-white/90 text-sm font-semibold tracking-widest uppercase mb-1 drop-shadow-sm">
              Hotel
            </p>
            <h1 className="text-white text-4xl font-bold leading-tight drop-shadow-lg tracking-wide">
              Los Recuerdos de <br />
              <span className="text-header_text_accent">Florito y Leo</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-auto mr-8 z-10">
          {children}
        </div>
      </header>
    </div>
  );
}