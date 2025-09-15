import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { useState } from "react";
import {Icon} from "../components/Icon.jsx"
import { Header } from "../components/Header.jsx";

export default function AdminPage() {
  const [nav, setNav] = useState(0);
  return (
    <div className="min-h-screen flex flex-col font-primary bg-white">
      <Header />
      <main className=" flex-1 bg-white pt-8 flex flex-row justify-center w-full">
        <div className=" bg-secondary mt-4 h-fit  border border-black/20  p-8 w-full">
          <div className="bg-white p-8 rounded-lg w-3/4 mx-auto border border-black/20 shadow-lg">
            <div className="flex flex-row justify-around mb-4 select-none text-lg">
                <div className="font-bold  flex items-center" onClick={() => setNav(0)}>
                    <Icon name={"list"} style={" w-12 h-12"}></Icon>
                    <h3>Administrar  <br /> Reservas</h3> 
                    
                </div>
                <div className="font-bold flex items-center" onClick={() => setNav(1)}>
                    <Icon name={"bed"} style={" w-12 h-12"}></Icon>
                    <h3>Gestion <br /> Habitaciones</h3>
                </div>
                <div className="font-bold  flex items-center" onClick={() => setNav(2)}>
                    <Icon name={"users"} style={" w-12 h-12"}></Icon>
                    <h3>Gestion Clientes</h3>
                </div>
            </div>
            <div className="flex flex-row ">
              <Selection
                setSelection={() => { setNav(0); console.log(0); }}
                value={nav === 0}
              ></Selection>
              <Selection
                setSelection={() => setNav(1)}
                value={nav === 1}
              ></Selection>
              <Selection
                setSelection={() => setNav(2)}
                value={nav === 2}
              ></Selection>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Selection({ setSelection, value }) {
  return (
    <div
      className={`w-full h-6 ${value ? "bg-green-500" : "bg-secondary"}`}
      onClick={setSelection}
    />
  );
}
