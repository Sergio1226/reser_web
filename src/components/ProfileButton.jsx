import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { UserAuth } from "../utils/AuthContext.jsx";
import { Icon } from "./Icon.jsx";

export default function ProfileButton() {
  const { signOut } = UserAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        text="Perfil"
        style="info"
        onClick={() => setOpen(!open)}
        iconName="user"
      />

      {open && (
        <div
          className={`absolute top-12 right-0 w-56 bg-gradient-to-br from-emerald-900  to-emerald-700 text-white rounded-2xl shadow-2xl border border-emerald-600 p-4 transform transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        >

          <ul className="flex flex-col space-y-2 mt-3">
            <li
              onClick={() => {
                navigate("/modifyUser");
                setOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-900 transition cursor-pointer justify-center"
            >
              <Icon name="settings"/>
              <span>Mi Perfil</span>
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition cursor-pointer justify-center"
            >
              <Icon name="logout"/>
              <span>Cerrar Sesión</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
