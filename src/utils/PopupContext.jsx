import { createContext, useContext } from "react";

export const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);
