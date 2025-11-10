import Logo from "/src/assets/logo.png";
import { useSize } from "../utils/SizeContext";
import { useNavigate } from "react-router-dom";

export default function Header({ children }) {
  const navigate = useNavigate();
  const {isMobile} = useSize();
  
  return (
    <div className="w-full bg-gradient-to-r from-header_bg_light via-header_bg_medium to-header_bg_light border-b border-orange-200">
      <header
        className={`relative w-full bg-gradient-to-br from-primary/90 to-primary_dark/80 flex items-center shadow-lg backdrop-blur-sm ${
          isMobile ? "py-2 px-4 flex-col text-center" : "pt-2 pb-4 flex-row"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

        <div
          className={`flex items-center ${
            isMobile ? "justify-center mb-2" : "ml-4"
          }`}
        >
          <div
            className={`bg-white rounded-full p-2 shadow-lg ${
              isMobile ? "w-[60px] h-[60px]" : ""
            }`}
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Logo"
              className={`object-center object-contain ${
                isMobile ? "w-[50px] h-[40px]" : "w-[100px] h-[80px]"
              }`}
            />
          </div>
        </div>

        <div
          className={`${
            isMobile
              ? "text-center mt-2"
              : "absolute left-1/2 transform -translate-x-1/2 text-center"
          }`}
          onClick={() => navigate("/")}
        >
          <p className="text-white/90 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
            Hotel
          </p>
          <h1
            className={`text-white font-bold leading-tight tracking-wide ${
              isMobile ? "text-2xl" : "text-4xl"
            }`}
          >
            Los Recuerdos de <br />
            <span className="text-header_text_accent">Florito y Leo</span>
          </h1>
        </div>

        <div
          className={`flex items-center space-x-4 justify-center ${
            isMobile ? "mt-3 [&>*]:mr-0 ![&>*]flex-row mb-2" : "ml-auto mr-8"
          }`}
        >
          {children}
        </div>
      </header>
    </div>
  );
}
