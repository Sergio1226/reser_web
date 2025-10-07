import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Header } from "../../components/Header.jsx";
import { RegistUser } from "./registUser.jsx";
import { LoginUser } from "./loginUser.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [nav, setNav] = useState(0);

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
      <Header>
        <Button
          text="Atras"
          style=" w-fit bg-button_secondary"
          onClick={() => navigate(-1)}
          iconName="Back"
        />
      </Header>
      <main className="bg-secondary flex flex-1 items-center justify-center ">
        {nav === 0 && <LoginUser setNav={setNav} />}
        {nav === 1 && <RegistUser setNav={setNav} />}
      </main>
    </div>
  );
}

