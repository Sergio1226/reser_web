function App() {
  return (
    <>
      <div className="bg-gray-500 min-h-screen flex flex-col font-kameron">
        <header className="bg-primary p-8  border-b border-black/20 flex  justify-around">
          <img src="/src/assets/logo.png" alt="Logo" className="w-40 " />
          <div className="flex flex-col items-center justify-center space-y-2">
            <h1 className="text-black text-4xl ">Hotel</h1>
            <h1 className="text-black text-4xl ">Los recuerdos de Florito y leo</h1>
          </div>
          <div className="flex flex-col  p-4 space-y-2">
            <button className="text-black bg-green-300 p-2 rounded-button">
              RESERVAR AHORA
            </button>
            <button className="text-black bg-blue-300 p-2 rounded-button">
              ACCESO ADMINISTRADOR
            </button>
          </div>
        </header>
        <main className="bg-gradient-to-b from-gradient_1 to-gradient_2 flex-1"></main>
      </div>
    </>
  );
}

export default App;
