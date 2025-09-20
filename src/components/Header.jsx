import { useNavigate } from "react-router-dom";

export function Header({ children }) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-secondary  ">
      <header className="relative w-full  bg-primary pb-2 flex flex-row items-center shadow-md border-b border-black/20 ">
        <div
          className="flex items-center ml-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="w-[120px] h-[100px] ml-8"
          />
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 text-center cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-black text-4xl">
            Hotel <br />Los Recuerdos de Florito y Leo
          </h1>
        </div>
        <div className="flex items-center space-x-4 ml-auto mr-8">
          {children}
        </div>
      </header>
    </div>
  );
}
