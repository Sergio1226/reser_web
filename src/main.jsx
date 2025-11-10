import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./utils/AuthContext.jsx";
import { PopupProvider } from "./utils/PopupProvider.jsx";
import { SizeProvider } from "./utils/SizeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <SizeProvider>
        <PopupProvider>
          <App />
        </PopupProvider>
      </SizeProvider>
    </AuthContextProvider>
  </StrictMode>
);
