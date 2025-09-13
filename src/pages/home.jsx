import { Button } from "../components/Button.jsx";

export default function Home() {
  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-kameron">
      <header className="bg-primary  border-b border-black/20 flex  p- 2 justify-around h-[140px] items-center">
        <img src="/src/assets/logo.png" alt="Logo" className="w-32 h-30" />
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-black text-4xl font-bold">Hotel</h1>
          <h1 className="text-black text-4xl font-bold">
            Los recuerdos de Florito y leo
          </h1>
        </div>
        <div className="flex flex-col  items-center justify-center space-y-2">
          <Button
            text="Iniciar Sesión"
            style=" w-auto bg-button_primary"
            onClick={() => alert("Iniciar Sesión")}
          />
          <Button
            text="Iniciar Sesión"
            style=" w-auto bg-button_primary"
            onClick={() => alert("Iniciar Sesión")}
          />
        </div>
      </header>
      <main className="bg-gradient-to-b from-gradient_1 to-gradient_2 flex-1"></main>
      <footer className="bg-primary p-2 border-t border-black/20 max-h-[20]"></footer>
    </div>
  );
}
