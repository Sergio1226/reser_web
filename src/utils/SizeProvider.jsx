import { useState,useEffect } from "react";
import { SizeContext } from "./SizeContext";

export function SizeProvider({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SizeContext.Provider value={{ isMobile }}>{children}</SizeContext.Provider>
  );
}
