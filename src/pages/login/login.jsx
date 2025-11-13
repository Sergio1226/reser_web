import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button.jsx";
import { SmallFooter } from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import { LoginUser } from "./loginUser.jsx";
import { RegistUser } from "./registUser.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialNav = location.state?.nav || 0;
  const fromHome = location.state?.fromHome || false;

  const [nav, setNav] = useState(initialNav);

  const handleBack = () => {
    if (nav === 0) {
      navigate(-1);
    } else {
      if (fromHome) {
        navigate("/");
      } else {
        setNav(0);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-primary bg-gradient-to-br from-gradient_1 to-secondary">
      <Header>
        <Button
          text="Atrás"
          style="exit"
          onClick={handleBack}
          iconName="back"
        />
      </Header>

      <main className="flex flex-1 w-full justify-center items-center p-8">
        {nav === 0 ? (
          <LoginUser setNav={setNav} />
        ) : (
          <RegistUser setNav={setNav} />
        )}
      </main>

      <SmallFooter />
    </div>
  );
}
