import { Button } from "../components/Button.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { useState } from "react";
import {Icon} from "../components/Icon.jsx"
import { Header } from "../components/Header.jsx";
import ProfileButton from "../components/ProfileButton.jsx";
import { NavigationTab } from "../components/NavigationTab.jsx";
import { Navigation } from "lucide-react";

export default function AdminPage() {
  const [nav, setNav] = useState(0);

  const options = [
    {
    id: "reservas",
    title: "Administrar Reservas",
    icon: "src/assets/icons/List.svg",
    route: "/admin",
    },
    {
    id: "clientes",
    title: "Gestionar Clientes",
    icon: "src/assets/icons/users.svg",
    route: "/adminClients",
    },
  ];

  return (
    <div className="bg-gray-500 min-h-screen flex flex-col font-primary">
      <Header>
        <ProfileButton
          toPag={"/loginAdmin"}
        />
      </Header>
      <main className="bg-gradient-to-b from-secondary to-gradient_1 flex flex-col items-center justify-center p-8 space-y-8">
        <NavigationTab
          state={"reservas"}
          options={options}
        />
      </main>
    </div>
  );
}
