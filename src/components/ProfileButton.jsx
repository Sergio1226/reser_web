import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export default function ProfileButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        text = "Perfil"
        className = "px-4 py-2 bg-primary rounded-lg"
        onClick = {() => setOpen(!open)}
        iconName = "User"
      />

      {open && (
        <div className="absolute top-12 right-0 bg-green-900 text-white rounded-lg shadow-lg w-48 border border-black p-4">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setOpen(false)}
              className="text-black text-lg font-bold"
            >
              x
            </button>
          </div>

          <ul className="flex flex-col items-center space-y-3 mt-2">
            <li
              className="cursor-pointer hover:underline"
              onClick={() => {
                navigate("/modifyUser");
                setOpen(false);
              }}
            >
              MI PERFIL
            </li>
            <li
              className="cursor-pointer hover:underline"
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
            >
              CERRAR SESIÓN
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}