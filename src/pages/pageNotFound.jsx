import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";

export default function PageNotFound() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(20); 

  useEffect(() => {
    if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
      navigate("/", { replace: true });
      return;
    }

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/", { replace: true });
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página no encontrada</p>
      <Button
        onClick={() => navigate("/")}
        style={"primary"}
      >
        Volver al inicio ahora
      </Button>
    </div>
  );
}
