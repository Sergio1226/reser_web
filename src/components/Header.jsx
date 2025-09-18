import { useNavigate } from "react-router-dom";
export function Header() {
    const navigate = useNavigate();
  return (
    <div className="flex w-full bg-secondary shadow-lg border-b border-black/20">
      <header
        className=" w-full   border-b border-black/20 bg-primary  pb-4 flex flex-col mb-8 shadow-md"
        onClick={() => navigate("/")}
      >
        <div className="flex items-center justify-center space-x-8">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="w-[120px] h-[100px]"
          />
          <div className="flex flex-row items-start justify-center space-y-2 ">
            <h1 className="text-black text-4xl font-bold">
              Hospedaje Los Recuerdos de Florito y Leo
            </h1>
          </div>
        </div>
      </header>
    </div>
  );
}
