import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Header } from "../../components/Header.jsx";
import { RegistUser } from "./registUser.jsx";
import { LoginUser } from "./loginUser.jsx";
import { SmallFooter } from "../../components/Footer.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [nav, setNav] = useState(0);

  return (
    <div className="min-h-screen flex flex-col font-primary bg-gradient-to-br from-gradient_1 to-secondary">
      <Header>
        <Button
          text="Atrás"
          style="exit"
          onClick={() => {
            if (nav === 0) {
              navigate(-1);
            } else {
              setNav(0);
            }
          }}
          iconName="Back"
        />
      </Header>

      <main className="flex flex-1  w-full justify-center items-center p-8">
          {nav === 0 ? (
            <LoginUser setNav={setNav} />
          ) : (
            <RegistUser setNav={setNav} />
          )}
      </main>
      <SmallFooter/>
    </div>
  );
}