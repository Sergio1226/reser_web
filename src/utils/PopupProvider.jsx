import { useState } from "react";
import { PopupContext } from "./PopupContext.jsX";
import { Popup } from "../components/Popup.jsx";

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState("");
  const [show, setShow] = useState(false);
  const [color, setColor] = useState("info");

  const openPopup = (message, type = "info") => {
    setPopup(message);
    setColor(type);
    setShow(true);
  };

  const closePopup = () => {
    setShow(false);
    setPopup("");
  };

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      <Popup show={show} color={color} onClose={closePopup}>
        {popup}
      </Popup>
    </PopupContext.Provider>
  );
}