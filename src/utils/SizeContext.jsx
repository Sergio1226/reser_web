import { createContext, useContext } from "react";

export const SizeContext = createContext();

export const useSize = () => useContext(SizeContext);