import { useNavigate } from "react-router-dom";
import { Button } from "./Button"
import ProfileButton from "./ProfileButton";

export function HeaderMain() {
    const navigate = useNavigate();

    return (
        <header className="bg-primary  border-b border-black/20 flex  p- 2 justify-around h-[140px] items-center">
        <img src="/src/assets/logo.png" alt="Logo" className="w-32 h-30" />
        <div className="flex flex-col items-center justify-center space-y-2 ">
          <h1 className="text-black text-4xl font-bold">Hospedaje</h1>
          <h1 className="text-black text-4xl font-bold ">
            Los recuerdos de Florito y leo
          </h1>
        </div>
        <div className="flex flex-col  items-center justify-center space-y-2">
          <ProfileButton />
        </div>
      </header>
    )
}